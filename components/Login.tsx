
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Loader2, CheckCircle, ArrowRight, UserPlus, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [view, setView] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (view === 'signin') {
        await signIn(email, password);
      } else if (view === 'signup') {
        await signUp(email, password);
      } else if (view === 'forgot') {
        await resetPassword(email);
        setMessage('Password reset link sent to your email.');
        setIsLoading(false);
        return; // Stay on view to show message
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
        await signInWithGoogle();
    } catch (err: any) {
        setError('Google Sign-In failed. Please try again.');
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="bg-slate-50 p-8 border-b border-slate-100 text-center relative">
          {view !== 'signin' && (
             <button onClick={() => { setView('signin'); setError(''); setMessage(''); }} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600">
                <ArrowLeft size={20} />
             </button>
          )}
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {view === 'signin' ? 'Welcome Back' : view === 'signup' ? 'Create Account' : 'Reset Password'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
             {view === 'signin' ? 'Sign in to AI Compliance Copilot' : view === 'signup' ? 'Get started with automated auditing' : 'Enter your email to receive a link'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {view !== 'forgot' && (
                <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    {view === 'signin' && (
                        <button type="button" onClick={() => setView('forgot')} className="text-xs text-blue-600 hover:text-blue-800">
                            Forgot password?
                        </button>
                    )}
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                </div>
            )}

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                {error}
              </div>
            )}
            
            {message && (
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg flex items-center">
                 <CheckCircle className="w-4 h-4 mr-2" />
                 {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : view === 'signin' ? (
                <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : view === 'signup' ? (
                <>Create Account <UserPlus className="w-4 h-4 ml-2" /></>
              ) : (
                <>Send Reset Link <KeyRound className="w-4 h-4 ml-2" /></>
              )}
            </button>
          </form>

          {view === 'signin' && (
            <>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                        <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {isLoading && view === 'signin' && !email ? 'Signing in...' : 'Sign in with Google'}
                </button>
            </>
          )}
          
          <div className="text-center text-sm">
             {view === 'signin' ? (
                 <p className="text-slate-600">Don't have an account? <button onClick={() => setView('signup')} className="text-blue-600 font-semibold hover:underline">Sign up</button></p>
             ) : (
                 <p className="text-slate-600">Already have an account? <button onClick={() => setView('signin')} className="text-blue-600 font-semibold hover:underline">Sign in</button></p>
             )}
          </div>

          <div className="bg-slate-50 p-4 border-t border-slate-100 text-center rounded-b-xl -mx-8 -mb-8 mt-6">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Secured by Firebase Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
