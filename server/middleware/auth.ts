import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'romantic_super_secret_jwt_key_chukku_and_hyphae_forever_2026';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Authentication required to access private resources.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    if (decoded.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient privileges for private vault.'
      });
      return;
    }

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Token is expired or invalid.'
    });
  }
}
