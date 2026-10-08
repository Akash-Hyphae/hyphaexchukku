import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToPublic: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBackToPublic }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('hyphae@chukku.world');
  const [password, setPassword] = useState('forever_and_always');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Access restricted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A0A] text-[#F3EBE6] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#E11D48]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#BE123C]/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Return to Public Website */}
      <button
        onClick={onBackToPublic}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-sans tracking-widest text-[#A89387] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO STORY</span>
      </button>

      {/* Card Container */}
      <div className="max-w-md w-full bg-[#181111]/90 backdrop-blur-xl border border-[#3A2424] rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 vault-glow">
        
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-full bg-[#2A1618] border border-[#52252B] flex items-center justify-center mx-auto mb-6 text-[#E11D48] shadow-inner">
          <Lock className="w-6 h-6" />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-medium tracking-wider text-white">
            PRIVATE VAULT
          </h1>
          <p className="mt-2 text-xs font-serif italic text-[#C9A49E]">
            “Some things are meant to stay between us.”
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-[#421419]/80 border border-[#881337] text-xs text-[#FCA5A5] text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-sans tracking-widest uppercase text-[#A89387] mb-1.5">
              Admin Identity
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hyphae@chukku.world"
              className="w-full px-4 py-3 rounded-lg bg-[#120B0B] border border-[#3A2424] text-sm text-white placeholder-[#5A4343] focus:outline-hidden focus:border-[#E11D48] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-sans tracking-widest uppercase text-[#A89387] mb-1.5">
              Passphrase
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-lg bg-[#120B0B] border border-[#3A2424] text-sm text-white placeholder-[#5A4343] focus:outline-hidden focus:border-[#E11D48] transition-colors pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A615D] hover:text-white p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#9F1239] to-[#E11D48] hover:from-[#881337] hover:to-[#BE123C] text-white rounded-lg font-sans text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-rose-950/50 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Decrypting Vault...' : 'Open The Vault'}
            </button>
          </div>
        </form>

        {/* Security watermark */}
        <div className="mt-8 pt-6 border-t border-[#2A1818] flex items-center justify-center gap-2 text-[10px] text-[#7A615D] tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E11D48]" />
          <span>Protected by JWT & Bcrypt Authorization</span>
        </div>

      </div>
    </div>
  );
};
