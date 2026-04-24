import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isHome = location.pathname === "/";

    return (
        <header className="sticky top-0 z-40 h-16 backdrop-blur-xl bg-gradient-to-r from-slate-950/95 via-emerald-950/75 to-slate-950/95 border-b border-white/10 shadow-lg">
            <div className="h-full flex items-center justify-between px-4 lg:px-8 lg:pl-20">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl">🌙</span>
                        <span className="text-lg font-semibold tracking-tight">
                            <span className="text-amber-400">Ramadan</span>{" "}
                            <span className="text-emerald-400">Serenity</span>
                        </span>
                    </Link>

                    <Link to="/" className="hidden sm:block group">
                        <div className="relative">
                            {/* glow */}
                            <div className="absolute inset-0 rounded-full bg-emerald-400 blur-2xl opacity-30 group-hover:opacity-70 transition" />

                            {/* button */}
                            <div
                                className={`relative h-14 w-14 rounded-full border flex flex-col items-center justify-center text-white backdrop-blur-xl transition ${isHome
                                        ? "bg-emerald-600 border-emerald-400/40 shadow-2xl shadow-emerald-500/30"
                                        : "bg-emerald-950/80 border-emerald-400/20 hover:bg-emerald-900"
                                    }`}
                            >
                                <Home size={20} className="text-emerald-200 mb-1" />
                                <span className="text-[10px] font-semibold">Home</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {!user ? (
                    <Link
                        to="/login"
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500"
                    >
                        Login
                    </Link>
                ) : (
                    <div className="relative group">
                        <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white transition hover:bg-white/10">
                            <img
                                src={user?.picture}
                                alt="avatar"
                                className="h-9 w-9 rounded-full object-cover"
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
                                className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/10"
                            >
                                Profile
                            </Link>

                            <button
                                onClick={() => navigate("/profile")}
                                className="block w-full text-left rounded-xl px-4 py-3 text-sm text-white hover:bg-white/10"
                            >
                                Settings
                            </button>

                            <button
                                onClick={handleLogout}
                                className="block w-full text-left rounded-xl px-4 py-3 text-sm text-red-300 hover:bg-red-500/10"
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