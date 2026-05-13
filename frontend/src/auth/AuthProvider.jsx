import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");
        return token ? { token, email, role } : null;
    });

    // Keep state in sync if other tabs change localStorage
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "token" || e.key === "email" || e.key === "role") {
                const token = localStorage.getItem("token");
                setUser(
                    token
                        ? { token, email: localStorage.getItem("email"), role: localStorage.getItem("role") }
                        : null
                );
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const login = ({ token, email, role }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        setUser({ token, email, role });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}