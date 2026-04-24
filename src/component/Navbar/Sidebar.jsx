import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    CalendarDays,
    BookOpen,
    CheckSquare,
    ClipboardCheck,
    Target,
    BarChart3,
    Star,
    Calculator,
    ChevronRight,
} from "lucide-react";

const navItems = [
    { to: "/ramadanCalender", label: "Ramadan Calendar", icon: CalendarDays },
    { to: "/quran", label: "Read Quran", icon: BookOpen },
    { to: "/tracker", label: "Fasting Tracker", icon: CheckSquare },
    { to: "/prayer-tracker", label: "Prayer Tracker", icon: ClipboardCheck },
    { to: "/goal-planner", label: "Goal Planner", icon: Target },
    { to: "/analytics-dashboard", label: "Analytics Dashboard", icon: BarChart3 },
    { to: "/ibaadat-score", label: "Ibaadat Score", icon: Star },
    { to: "/zakat-calculator", label: "Zakat Calculator", icon: Calculator },
];

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    return (
        <div
            className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)]"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div className="relative h-full">
                <div
                    className={`h-full bg-slate-950/95 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-all duration-300 overflow-hidden ${open ? "w-72" : "w-16"
                        }`}
                >
                    <div className="h-full flex flex-col">
                        <div className="h-20 border-b border-white/10 flex items-center px-4">
                            {open ? (
                                <div>
                                    <h1 className="text-xl font-bold text-white whitespace-nowrap">
                                        🌙 Ramadan Serenity
                                    </h1>
                                    <p className="text-xs text-gray-400 whitespace-nowrap">
                                        Spiritual Companion
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full flex justify-center">
                                    <span className="text-2xl">🌙</span>
                                </div>
                            )}
                        </div>

                        <ul className="flex-1 py-4 space-y-2">
                            {navItems.map(({ to, label, icon: Icon }) => {
                                const active = location.pathname === to;

                                return (
                                    <li key={to} className="px-2">
                                        <Link
                                            to={to}
                                            className={`flex items-center rounded-xl transition-all duration-300 ${open
                                                ? "gap-3 px-4 py-3 justify-start"
                                                : "justify-center py-3 px-0"
                                                } ${active
                                                    ? "bg-emerald-500/20 text-emerald-300"
                                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                                                }`}
                                            title={!open ? label : ""}
                                        >
                                            <Icon size={20} className="shrink-0" />
                                            {open && <span className="whitespace-nowrap">{label}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="border-t border-white/10 p-4">
                            {open ? (
                                <p className="text-xs text-center text-gray-400">
                                    Made with care for Ramadan
                                </p>
                            ) : (
                                <div className="h-4" />
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="absolute top-6 -right-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-2 shadow-lg border border-white/10"
                >
                    <ChevronRight
                        size={16}
                        className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"
                            }`}
                    />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;