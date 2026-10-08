import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getStore, saveDatabase } from '../config/db.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'romantic_super_secret_jwt_key_chukku_and_hyphae_forever_2026';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required.' });
    return;
  }

  const store = getStore();
  const admin = store.admins.find(a => a.email.toLowerCase() === email.toLowerCase());

  if (!admin) {
    res.status(401).json({ success: false, error: 'Invalid credentials.' });
    return;
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    res.status(401).json({ success: false, error: 'Invalid credentials.' });
    return;
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  });
}

export function verify(req: AuthenticatedRequest, res: Response): void {
  if (!req.admin) {
    res.status(401).json({ success: false, error: 'Not authenticated.' });
    return;
  }

  const store = getStore();
  const admin = store.admins.find(a => a._id === req.admin?.id);

  res.json({
    success: true,
    admin: {
      id: admin?._id || req.admin.id,
      email: admin?.email || req.admin.email,
      name: admin?.name || 'Hyphae',
      role: admin?.role || 'admin'
    }
  });
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully.' });
}

export async function changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ success: false, error: 'Current and new password are required.' });
    return;
  }

  const store = getStore();
  const admin = store.admins.find(a => a._id === req.admin?.id);
  if (!admin) {
    res.status(404).json({ success: false, error: 'Admin account not found.' });
    return;
  }

  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) {
    res.status(400).json({ success: false, error: 'Current password is incorrect.' });
    return;
  }

  admin.password = await bcrypt.hash(newPassword, 10);
  admin.updatedAt = new Date().toISOString();
  saveDatabase();

  res.json({ success: true, message: 'Password updated successfully.' });
}
