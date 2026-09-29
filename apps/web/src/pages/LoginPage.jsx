import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const LoginPage = () => {
  const [mode, setMode] = useState('login');
  const { login, signup, createAdminAccount, isLoading } = useAuth();

  const { 
    register: registerLogin, 
    handleSubmit: handleLoginSubmit, 
    formState: { errors: loginErrors } 
  } = useForm();

  const { 
    register: registerSignup, 
    handleSubmit: handleSignupSubmit, 
    watch: watchSignup,
    formState: { errors: signupErrors } 
  } = useForm();

  const { 
    register: registerAdmin, 
    handleSubmit: handleAdminSubmit, 
    watch: watchAdmin,
    formState: { errors: adminErrors } 
  } = useForm();

  const signupPassword = watchSignup('password', '');
  const adminPassword = watchAdmin('password', '');

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const signupStrength = getPasswordStrength(signupPassword);
  const adminStrength = getPasswordStrength(adminPassword);

  const onLogin = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.message || 'Invalid login credentials. Please try again.');
    }
  };

  const onSignup = async (data) => {
    try {
      await signup(data.email, data.password, data.name);
      toast.success('Account created successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to create account. Please try again.');
    }
  };

  const onAdminSignup = async (data) => {
    try {
      await createAdminAccount(data.email, data.password, data.name, data.secretCode);
      toast.success('Admin account created successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to create admin account. Check VITE_POCKETBASE_URL and VITE_ADMIN_SECRET in Vercel env vars.');
    }
  };

  const StrengthBar = ({ password }) => {
    const strength = getPasswordStrength(password);
    if (!password) return null;
    return (
      <div className="flex gap-1 mt-2">
        {[1, 2, 3, 4].map((level) => (
          <div 
            key={level} 
            className={`h-1.5 w-full rounded-full transition-colors ${
              strength >= level 
                ? strength < 3 ? 'bg-yellow-500' : 'bg-green-500'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Admin Setup'} | BAVET</title>
        <meta name="description" content="Access your account or create a new one to manage your horse's medical records." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-24 bg-muted px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <Card className="border-border shadow-lg overflow-hidden">
              <AnimatePresence mode="wait">
                {mode === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-3xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Welcome back
                      </CardTitle>
                      <CardDescription>
                        Sign in to access your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input
                            id="login-email"
                            type="email"
                            {...registerLogin('email', { 
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                            placeholder="your@email.com"
                            className="text-foreground"
                          />
                          {loginErrors.email && <p className="text-sm text-destructive">{loginErrors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="login-password">Password</Label>
                            <a href="#" className="text-sm text-primary hover:underline" onClick={(e) => { e.preventDefault(); toast.info('Password reset functionality coming soon.'); }}>
                              Forgot Password?
                            </a>
                          </div>
                          <Input
                            id="login-password"
                            type="password"
                            {...registerLogin('password', { 
                              required: 'Password is required',
                              minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            })}
                            placeholder="Enter your password"
                            className="text-foreground"
                          />
                          {loginErrors.password && <p className="text-sm text-destructive">{loginErrors.password.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                      </form>

                      <div className="mt-6 space-y-3">
                        <p className="text-sm text-center text-muted-foreground">
                          Don't have an account?{' '}
                          <button onClick={() => setMode('signup')} className="text-primary hover:underline font-medium">
                            Sign up
                          </button>
                        </p>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Staff</span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full gap-2" onClick={() => setMode('adminSignup')}>
                          <Shield className="w-4 h-4" />
                          Admin Registration
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                )}

                {mode === 'signup' && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-3xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Create Account
                      </CardTitle>
                      <CardDescription>
                        Join us to manage your horse's care
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name</Label>
                          <Input
                            id="signup-name"
                            {...registerSignup('name', { required: 'Name is required' })}
                            placeholder="John Doe"
                            className="text-foreground"
                          />
                          {signupErrors.name && <p className="text-sm text-destructive">{signupErrors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            {...registerSignup('email', { 
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                            placeholder="your@email.com"
                            className="text-foreground"
                          />
                          {signupErrors.email && <p className="text-sm text-destructive">{signupErrors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            {...registerSignup('password', { 
                              required: 'Password is required',
                              minLength: { value: 8, message: 'Password must be at least 8 characters' },
                              validate: {
                                hasUpper: v => /[A-Z]/.test(v) || 'Must contain uppercase letter',
                                hasNumber: v => /[0-9]/.test(v) || 'Must contain number',
                                hasSpecial: v => /[^A-Za-z0-9]/.test(v) || 'Must contain special character'
                              }
                            })}
                            placeholder="Create a strong password"
                            className="text-foreground"
                          />
                          <StrengthBar password={signupPassword} />
                          {signupErrors.password && <p className="text-sm text-destructive">{signupErrors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-confirm">Confirm Password</Label>
                          <Input
                            id="signup-confirm"
                            type="password"
                            {...registerSignup('confirmPassword', { 
                              required: 'Please confirm your password',
                              validate: value => value === signupPassword || 'Passwords do not match'
                            })}
                            placeholder="Confirm your password"
                            className="text-foreground"
                          />
                          {signupErrors.confirmPassword && <p className="text-sm text-destructive">{signupErrors.confirmPassword.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                      </form>

                      <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Already have an account?{' '}
                          <button onClick={() => setMode('login')} className="text-primary hover:underline font-medium">
                            Sign in
                          </button>
                        </p>
                      </div>
                    </CardContent>
                  </motion.div>
                )}

                {mode === 'adminSignup' && (
                  <motion.div
                    key="adminSignup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                        <Shield className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-3xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Admin Registration
                      </CardTitle>
                      <CardDescription>
                        Create an administrator account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAdminSubmit(onAdminSignup)} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="admin-name">Full Name</Label>
                          <Input
                            id="admin-name"
                            {...registerAdmin('name', { required: 'Name is required' })}
                            placeholder="Dr. John Doe"
                            className="text-foreground"
                          />
                          {adminErrors.name && <p className="text-sm text-destructive">{adminErrors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="admin-email">Email</Label>
                          <Input
                            id="admin-email"
                            type="email"
                            {...registerAdmin('email', { 
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                            placeholder="admin@clinic.com"
                            className="text-foreground"
                          />
                          {adminErrors.email && <p className="text-sm text-destructive">{adminErrors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="admin-password">Password</Label>
                          <Input
                            id="admin-password"
                            type="password"
                            {...registerAdmin('password', { 
                              required: 'Password is required',
                              minLength: { value: 8, message: 'Password must be at least 8 characters' },
                              validate: {
                                hasUpper: v => /[A-Z]/.test(v) || 'Must contain uppercase letter',
                                hasNumber: v => /[0-9]/.test(v) || 'Must contain number',
                                hasSpecial: v => /[^A-Za-z0-9]/.test(v) || 'Must contain special character'
                              }
                            })}
                            placeholder="Create a strong password"
                            className="text-foreground"
                          />
                          <StrengthBar password={adminPassword} />
                          {adminErrors.password && <p className="text-sm text-destructive">{adminErrors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="admin-secret">Admin Registration Code</Label>
                          <Input
                            id="admin-secret"
                            type="password"
                            {...registerAdmin('secretCode', { required: 'Registration code is required' })}
                            placeholder="Enter the admin registration code"
                            className="text-foreground"
                          />
                          {adminErrors.secretCode && <p className="text-sm text-destructive">{adminErrors.secretCode.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
                        </Button>
                      </form>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          Already have an account?{' '}
                          <button onClick={() => setMode('login')} className="text-primary hover:underline font-medium">
                            Sign in
                          </button>
                        </p>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LoginPage;