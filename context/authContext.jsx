import React, { createContext, useContext } from 'react';

// Create Auth Context with default value
const AuthContext = createContext({
  userRole: 'admin',
  setUserRole: () => {}, // no-op to prevent errors if called
});

// Provider Component
export const AuthProvider = ({ children }) => {
  const userRole = 'admin';

  return (
    <AuthContext.Provider value={{ userRole, setUserRole: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
