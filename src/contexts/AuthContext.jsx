import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem('veltta_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('veltta_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulação - em produção, conectar com backend real
        // Admin credentials para demo: admin@veltta.com.br / admin123
        if (email === 'admin@veltta.com.br' && password === 'admin123') {
            const userData = {
                id: '1',
                email,
                name: 'Administrador',
                role: 'admin',
                avatar: null
            };
            setUser(userData);
            localStorage.setItem('veltta_user', JSON.stringify(userData));
            return { success: true };
        }
        return { success: false, error: 'Credenciais inválidas' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('veltta_user');
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
