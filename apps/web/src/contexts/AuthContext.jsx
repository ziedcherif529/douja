import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isNetworkError = (error) => {
    return error.status === 0 ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('Network request failed') ||
      error?.originalError?.message?.includes('Failed to fetch');
  };

  useEffect(() => {
    const initAuth = async () => {
      if (pb.authStore.isValid) {
        try {
          const authData = await pb.collection('users').authRefresh({ $autoCancel: false });
          setCurrentUser(authData.record);
        } catch (error) {
          if (isNetworkError(error)) {
            setCurrentUser(pb.authStore.record);
          } else {
            pb.authStore.clear();
          }
        }
      }
      setInitialLoading(false);
    };

    initAuth();

    const unsubscribe = pb.authStore.onChange(() => {
      setCurrentUser(pb.authStore.record);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const getValidationError = (error) => {
    if (error.data?.data) {
      const fields = error.data.data;
      for (const key of Object.keys(fields)) {
        if (fields[key]?.message) return fields[key].message;
      }
    }
    return null;
  };

  const handleAuthError = (error) => {
    console.error('Auth error:', error);
    if (isNetworkError(error)) {
      return 'Cannot connect to the server. Make sure PocketBase is running and VITE_POCKETBASE_URL is set correctly in your environment variables.';
    }
    if (error.status === 400) {
      if (error.data?.data?.email?.message?.includes('already in use')) {
        return 'This email is already registered. Please log in instead.';
      }
      const validationMsg = getValidationError(error);
      if (validationMsg) return validationMsg;
      return 'Invalid data. Please check your inputs and try again.';
    }
    return error.message || 'An unexpected error occurred. Please try again later.';
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      
      if (authData.record.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
      
      return authData.record;
    } catch (error) {
      const message = handleAuthError(error);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setIsLoading(true);
    try {
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      const userData = {
        email,
        password,
        passwordConfirm: password,
        name,
        role: 'client',
        emailVisibility: true
      };
      
      const user = await pb.collection('users').create(userData, { $autoCancel: false });
      
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      
      let client;
      try {
        client = await pb.collection('clients').create({
          userId: user.id,
          name: name,
          email: email
        }, { $autoCancel: false });
      } catch (clientError) {
        console.error('Failed to create client record:', clientError);
        pb.authStore.clear();
        setCurrentUser(null);
        await pb.collection('users').delete(user.id, { $autoCancel: false }).catch(console.error);
        throw new Error('Failed to setup client profile. Please try again.');
      }
      
      navigate('/client/dashboard');
      return { user: authData.record, client };
    } catch (error) {
      const message = handleAuthError(error);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const createAdminAccount = async (email, password, name, secretCode) => {
    setIsLoading(true);
    try {
      const adminSecret = import.meta.env.VITE_ADMIN_SECRET;
      if (!adminSecret) {
        throw new Error('Admin registration is not configured. Contact the system administrator.');
      }
      if (secretCode !== adminSecret) {
        throw new Error('Invalid admin registration code.');
      }
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      const userData = {
        email,
        password,
        passwordConfirm: password,
        name,
        role: 'admin',
        emailVisibility: true
      };
      
      await pb.collection('users').create(userData, { $autoCancel: false });
      
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      
      navigate('/admin/dashboard');
      toast.success('Admin account created successfully!');
      return authData.record;
    } catch (error) {
      console.error('Admin account creation failed:', error);
      const message = handleAuthError(error);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    navigate('/');
    toast.success('Logged out successfully');
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';
  const isClient = currentUser?.role === 'client';

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      signup,
      createAdminAccount,
      logout,
      isAuthenticated,
      isAdmin,
      isClient,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};