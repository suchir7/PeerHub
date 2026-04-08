import { createContext, useContext, useState, useEffect } from 'react';
import { apiGoogleAuth, apiLogin, apiGetMe, apiLogout, apiSignup } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // On mount, check if there's a saved token
  useEffect(() => {
    const token = localStorage.getItem('peerhub_token');
    if (token) {
      apiGetMe()
        .then(data => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('peerhub_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const onExpired = () => {
      localStorage.removeItem('peerhub_token');
      setUser(null);
      setError('Session expired. Please sign in again.');
    };
    window.addEventListener('peerhub:auth-expired', onExpired);
    return () => window.removeEventListener('peerhub:auth-expired', onExpired);
  }, []);

  const login = async (email, password, captchaToken) => {
    try {
      const data = await apiLogin(email, password, captchaToken);
      setUser(data.user);
      setError('');
      return data.user.role;
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
      return null;
    }
  };

  const signup = async ({ name, email, password, role, captchaToken }) => {
    try {
      const data = await apiSignup({ name, email, password, role, captchaToken });
      setUser(data.user);
      setError('');
      return data.user.role;
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      return null;
    }
  };

  const loginWithGoogle = async ({ idToken, mode, role, captchaToken }) => {
    try {
      const data = await apiGoogleAuth(idToken, mode, role, captchaToken);
      setUser(data.user);
      setError('');
      return data.user.role;
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      return null;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
