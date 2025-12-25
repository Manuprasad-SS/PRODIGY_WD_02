
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simple mock authentication simulation
    setTimeout(() => {
      onLogin(username || 'Admin');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-emerald-600 rounded-full blur-3xl opacity-10"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-2xl mb-6 shadow-indigo-500/20 rotate-3">
            <span className="text-3xl font-bold italic">S</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Staff Manager</h1>
          <p className="text-slate-400">Secure Workforce Intelligence Portal</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-indigo-500/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block uppercase tracking-wide">Username</label>
              <input
                type="text"
                required
                className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="admin_staff"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block uppercase tracking-wide">Secure Access Key</label>
              <input
                type="password"
                required
                className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                'Log In to Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>© 2024 Staff Manager Systems</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Secure Connection
            </span>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-500 text-sm italic">
          Authorized personnel only. All access is strictly monitored.
        </p>
      </div>
    </div>
  );
};

export default Login;
