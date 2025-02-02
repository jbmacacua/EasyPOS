import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Auth Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const loadRole = async () => {
            const storedRole = await AsyncStorage.getItem('role');
            if (storedRole) {
                setUserRole(storedRole);
            }
        };
        loadRole();
    }, []);

    return (
        <AuthContext.Provider value={{ userRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
