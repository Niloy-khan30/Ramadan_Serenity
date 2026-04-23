import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Footbar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        {
            to: '/',
            label: 'Home',
            icon: Home,
        },
        {
            to: user ? '/profile' : '/login',
            label: 'Profile',
            icon: User,
        },
        {
            to: '/profile',
            label: 'Settings',
            icon: Settings,
        },
    ];

    return (
        <div className="fixed bottom-4 left-1/2 z-40 w-[92%] max-w-4xl -translate-x-1/2">
            <div className="bg-slate-950/85 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl px-3 py-2">
                <div className="grid grid-cols-3 gap-2">
                    {navItems.map(({ to, label, icon: Icon }) => {
                        const isActive =
                            location.pathname === to ||
                            (label === 'Settings' && location.pathname === '/profile');

                        return (
                            <Link
                                key={label}
                                to={to}
                                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-3 transition-all duration-200 ${isActive
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="text-xs font-medium">{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Footbar;