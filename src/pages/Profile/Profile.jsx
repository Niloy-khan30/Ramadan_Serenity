import React from "react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 border border-white/10 rounded-2xl p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <img
                            src={user?.picture}
                            alt={user?.name}
                            className="w-28 h-28 rounded-full border-4 border-green-400 object-cover"
                        />

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold">{user?.name}</h1>
                            <p className="text-gray-300 mt-2">{user?.email}</p>
                            <p className="text-green-400 mt-2 capitalize">
                                Signed in with {user?.provider}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-white/10 rounded-xl p-5">
                            <h3 className="text-lg font-semibold mb-2">Fasting Tracker</h3>
                            <p className="text-gray-300 text-sm">
                                Track your fasting consistency during Ramadan.
                            </p>
                        </div>

                        <div className="bg-white/10 rounded-xl p-5">
                            <h3 className="text-lg font-semibold mb-2">Prayer Tools</h3>
                            <p className="text-gray-300 text-sm">
                                Stay updated with prayer-related features and Qibla support.
                            </p>
                        </div>

                        <div className="bg-white/10 rounded-xl p-5">
                            <h3 className="text-lg font-semibold mb-2">Quran Reading</h3>
                            <p className="text-gray-300 text-sm">
                                Continue your spiritual reading journey with ease.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;