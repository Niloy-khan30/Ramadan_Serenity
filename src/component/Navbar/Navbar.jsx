import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 lg:px-8 py-4 lg:pl-20">
                <Link to="/" className="text-2xl font-bold tracking-tight text-white">
                    <span className="text-amber-400">Ramadan</span>{" "}
                    <span className="text-emerald-400">Serenity</span>
                </Link>

                {!user ? (
                    <Link
                        to="/login"
                        className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-lg transition hover:bg-emerald-500"
                    >
                        Login
                    </Link>
                ) : (
                    <div className="relative group">
                        <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10">
                            <img
                                src={user?.picture}
                                alt={user?.name || "User Avatar"}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold leading-none">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-gray-300 mt-1">{user?.email}</p>
                            </div>
                        </button>

                        <div className="invisible absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-slate-950/95 p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                            <Link
                                to="/profile"
                                className="block rounded-xl px-4 py-3 text-sm text-white transition hover:bg-white/10"
                            >
                                Profile
                            </Link>

                            <button
                                onClick={() => navigate("/profile")}
                                className="block w-full rounded-xl px-4 py-3 text-left text-sm text-white transition hover:bg-white/10"
                            >
                                Settings
                            </button>

                            <button
                                onClick={handleLogout}
                                className="block w-full rounded-xl px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;