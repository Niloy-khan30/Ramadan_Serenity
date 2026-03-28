import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const islamicQuotes = [
    "Indeed, with hardship comes ease. — Surah Ash-Sharh 94:6",
    "And He found you lost and guided [you]. — Surah Ad-Duha 93:7",
    "So remember Me; I will remember you. — Surah Al-Baqarah 2:152",
    "And Allah is the best of planners. — Surah Al-Imran 3:54",
];

const Login = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState("");

    const from = location.state?.from?.pathname || "/profile";

    const handleGoogleSuccess = async (credentialResponse) => {
        setError("");

        const result = await loginWithGoogle(credentialResponse);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message || "Login failed");
        }
    };

    const handleGoogleError = () => {
        setError("Google Sign-In was unsuccessful. Please try again.");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white flex items-center justify-center px-4 py-10">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <p className="text-green-400 font-semibold tracking-wide uppercase">
                        Ramadan Serenity
                    </p>

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Begin your spiritual journey with peace, purpose, and remembrance.
                    </h1>

                    <p className="text-gray-300 text-lg">
                        Sign in with Google to access your profile, explore Ramadan tools,
                        and keep your journey personalized.
                    </p>

                    <div className="space-y-3">
                        {islamicQuotes.map((quote, index) => (
                            <div
                                key={index}
                                className="bg-white/10 border border-white/10 rounded-xl p-4 text-gray-200"
                            >
                                {quote}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
                    <p className="text-gray-300 mb-6">
                        Continue with your Google account to manage your Ramadan Serenity profile.
                    </p>

                    <div className="flex justify-center bg-white p-4 rounded-xl">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="text-green-400 hover:text-green-300 font-medium"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;