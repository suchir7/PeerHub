import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Mock credentials
const USERS = [
  { email: 'alex@university.edu',     password: 'student123', role: 'student',    name: 'Alex Martinez',  initials: 'AM' },
  { email: 'priya@university.edu',    password: 'student123', role: 'student',    name: 'Priya Sharma',   initials: 'PS' },
  { email: 'prof.rivera@university.edu', password: 'teach123', role: 'instructor', name: 'Prof. Rivera',   initials: 'PR' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      setError('');
      return found.role;
    } else {
      setError('Invalid email or password. Please try again.');
      return null;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
