import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiGetMe, apiLogout } from '../api/client';

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

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      setUser(data.user);
      setError('');
      return data.user.role;
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
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
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
