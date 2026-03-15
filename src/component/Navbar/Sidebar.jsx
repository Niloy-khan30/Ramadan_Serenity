import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, BookOpen, CheckSquare } from "lucide-react";

const Sidebar = () => {
    return (
        <div className="drawer">
            <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />

            {/* Page content */}
            <div className="drawer-content">
                <label
                    htmlFor="my-drawer-1"
                    className="btn bg-green-600 text-white hover:bg-green-700 border-none"
                >
                    Explore
                </label>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-50">
                <label
                    htmlFor="my-drawer-1"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>

                <ul className="menu bg-gradient-to-b from-green-700 to-green-900 text-white min-h-full w-80 p-6 space-y-4">

                    {/* Title */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold">🌙 Ramadan Serenity</h1>
                        <p className="text-sm opacity-80">Spiritual Companion</p>
                    </div>

                    {/* Menu Items */}
                    <li>
                        <Link
                            to="/ramadanCalender"
                            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white hover:text-green-900 transition-all duration-300"
                        >
                            <CalendarDays size={20} />
                            Ramadan Calendar
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/quran"
                            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white hover:text-green-900 transition-all duration-300"
                        >
                            <BookOpen size={20} />
                            Read Quran
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/tracker"
                            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white hover:text-green-900 transition-all duration-300"
                        >
                            <CheckSquare size={20} />
                            Fasting Tracker
                        </Link>
                    </li>

                    {/* Footer */}
                    <div className="mt-auto pt-10 text-center text-sm opacity-70">
                        Made with 🤍 for Ramadan
                    </div>

                </ul>
            </div>
        </div>
    );
};

export default Sidebar;