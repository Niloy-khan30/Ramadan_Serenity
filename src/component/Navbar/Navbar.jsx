import React from 'react';
import Sidebar from './Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">
                    Ramadan Serenity
                </Link>
            </div>

            <div className="flex gap-3 items-center">
                <Sidebar></Sidebar>

                {!user ? (
                    <Link to="/login" className="btn bg-green-600 text-white hover:bg-green-700 border-none">
                        Login
                    </Link>
                ) : (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt={user?.name || "User Avatar"}
                                    src={user?.picture}
                                />
                            </div>
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <Link to="/profile" className="justify-between">
                                    Profile
                                    <span className="badge badge-success text-white">New</span>
                                </Link>
                            </li>
                            <li>
                                <button onClick={() => navigate('/profile')}>
                                    Settings
                                </button>
                            </li>
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;