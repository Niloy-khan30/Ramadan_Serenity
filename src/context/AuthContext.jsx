import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("ramadanSerenityUser");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        setLoading(false);
    }, []);

    const loginWithGoogle = async (credentialResponse) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/google`, {
                credential: credentialResponse.credential,
            });

            const loggedInUser = response.data.user;

            setUser(loggedInUser);
            localStorage.setItem(
                "ramadanSerenityUser",
                JSON.stringify(loggedInUser)
            );

            return { success: true, user: loggedInUser };
        } catch (error) {
            console.error("Google login failed:", error);
            return {
                success: false,
                message:
                    error?.response?.data?.message || "Google login failed",
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("ramadanSerenityUser");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loginWithGoogle,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);