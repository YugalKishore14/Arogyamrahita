import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                if (decodedToken.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({
                        id: decodedToken.id,
                        email: decodedToken.email,
                        name: decodedToken.name,
                        role: decodedToken.role,
                        number: decodedToken.number || "",
                    });
                }
            } catch (error) {
                console.error('Invalid token:', error);
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = (token, userData = null) => {
        localStorage.setItem('token', token);
        setToken(token);
        if (userData) {
            setUser(userData);
        } else {
            // If no user data is passed, decode from new token
            const decoded = jwtDecode(token);
            setUser({ id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role, number: decoded.number || "" });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user && !!token;
    };

    const isAdmin = () => {
        return user && user.role === 'admin';
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};