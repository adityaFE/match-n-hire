import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuthStore } from '@/store/authStore';
import { signUpWithEmail, loginWithEmail, loginWithGoogle, resetPassword } from '@/services/authService';
import { createInitialProfile, getUserProfile, initializeUserProfile } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type AuthView = 'login' | 'signup';

const HomePage = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetOpen, setIsResetOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    // Handle redirecting here instead of during render
    if (user && shouldRedirect) {
      navigate('/profile');
    }
  }, [user, shouldRedirect, navigate]);
  
  useEffect(() => {
    // Check if user is already logged in on component mount
    if (user) {
      setShouldRedirect(true);
    }
  }, [user]);

  const handleViewToggle = () => {
    setView(view === 'login' ? 'signup' : 'login');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === 'signup') {
        if (password !== confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please make sure your passwords match.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const { user, error } = await signUpWithEmail(email, password);
        
        if (error) {
          toast({
            title: "Sign up failed",
            description: error,
            variant: "destructive"
          });
        } else if (user) {
          try {
            // Create initial profile
            await initializeUserProfile(user.uid, user.email || '');
            
            toast({
              title: "Sign up successful",
              description: "Your account has been created successfully."
            });
            
            setShouldRedirect(true);
          } catch (createError) {
            console.error('Error creating profile:', createError);
            toast({
              title: "Profile creation failed",
              description: "Failed to create your profile. Please try again.",
              variant: "destructive"
            });
          }
        }
      } else {
        const { user, error } = await loginWithEmail(email, password);
        
        if (error) {
          toast({
            title: "Login failed",
            description: error,
            variant: "destructive"
          });
        } else if (user) {
          toast({
            title: "Login successful",
            description: "Welcome back!"
          });
          setShouldRedirect(true);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const { user, error } = await loginWithGoogle();
      
      if (error) {
        toast({
          title: "Google login failed",
          description: error,
          variant: "destructive"
        });
      } else if (user) {
        try {
          // Try to create profile for Google login users
          await initializeUserProfile(user.uid, user.email || '');
          
          toast({
            title: "Login successful",
            description: "Welcome!"
          });
          setShouldRedirect(true);
        } catch (createError) {
          console.error('Error creating profile:', createError);
          // Don't show error to user since login was successful
          // Profile creation will be retried on profile page
          setShouldRedirect(true);
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      if (!resetEmail.trim()) {
        toast({
          title: "Email is required",
          description: "Please enter your email address.",
          variant: "destructive"
        });
        setResetLoading(false);
        return;
      }

      const { success, error } = await resetPassword(resetEmail);
      
      if (error) {
        toast({
          title: "Password reset failed",
          description: error,
          variant: "destructive"
        });
      } else if (success) {
        toast({
          title: "Password reset email sent",
          description: "Check your email for instructions to reset your password."
        });
        setIsResetOpen(false);
        setResetEmail('');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setResetLoading(false);
    }
  };

  // Early return if we need to redirect
  if (shouldRedirect && user) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="auth-card">
        <div className="p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {view === 'login' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="mt-1 text-gray-600">
              {view === 'login'
                ? 'Sign in to your account to continue'
                : 'Sign up to get started with our service'}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="•••••••••"
                required
              />
            </div>

            {view === 'signup' && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  placeholder="•••••••••"
                  required
                />
              </div>
            )}

            {view === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(true)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : view === 'login' ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="social-button"
                disabled={loading}
              >
                <FcGoogle className="h-5 w-5" />
                <span>Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              {view === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={handleViewToggle}
                className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
              >
                {view === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4 pt-4">
            <div className="form-group">
              <label htmlFor="resetEmail" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="auth-input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResetOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="auth-button"
                disabled={resetLoading}
              >
                {resetLoading ? <LoadingSpinner /> : 'Send Reset Link'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
