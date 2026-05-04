import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const getTodayDate = () => new Date().toISOString().split("T")[0];

const defaultPrayers = {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
};

const PrayerTracker = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [prayers, setPrayers] = useState(defaultPrayers);
    const [consistency, setConsistency] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const completedCount = useMemo(
        () => Object.values(prayers).filter(Boolean).length,
        [prayers]
    );

    const fetchPrayerLog = async () => {
        if (!user?.email) return;

        try {
            setLoading(true);
            setMessage("");

            const res = await axios.get(
                `${API_URL}/api/prayer-log/${user.email}/${selectedDate}`
            );

            if (res.data?.log?.prayers) {
                setPrayers(res.data.log.prayers);
            } else {
                setPrayers(defaultPrayers);
            }
        } catch {
            setPrayers(defaultPrayers);
        } finally {
            setLoading(false);
        }
    };

    const fetchConsistency = async () => {
        if (!user?.email) return;

        try {
            const res = await axios.get(
                `${API_URL}/api/prayer-log/consistency/${user.email}`
            );
            setConsistency(res.data.consistency);
        } catch {
            setConsistency(null);
        }
    };

    useEffect(() => {
        fetchPrayerLog();
    }, [user, selectedDate]);

    useEffect(() => {
        fetchConsistency();
    }, [user, message]);

    const togglePrayer = (prayerName) => {
        setPrayers((prev) => ({
            ...prev,
            [prayerName]: !prev[prayerName],
        }));
    };

    const handleSave = async () => {
        if (!user?.email) {
            setMessage("Please login first.");
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            await axios.post(`${API_URL}/api/prayer-log`, {
                userEmail: user.email,
                date: selectedDate,
                prayers,
            });

            setMessage("Prayer log saved successfully. Prayer goals synced.");

            await fetchConsistency();

            window.dispatchEvent(new Event("goalUpdated"));
        } catch {
            setMessage("Could not save prayer log right now.");
        } finally {
            setSaving(false);
        }
    };

    const prayerList = [
        { key: "fajr", label: "Fajr" },
        { key: "dhuhr", label: "Dhuhr" },
        { key: "asr", label: "Asr" },
        { key: "maghrib", label: "Maghrib" },
        { key: "isha", label: "Isha" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white px-4 py-10 pb-28">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Prayer Completion Tracker
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Track your daily prayers. Prayer goals update automatically after
                        saving your log.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">Daily Prayer Log</h2>
                                <p className="text-gray-300 text-sm mt-1">
                                    Mark the prayers you completed for the selected day.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-400"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <p className="text-center text-gray-300 py-10">
                                Loading prayer log...
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
                                {prayerList.map((prayer) => (
                                    <button
                                        key={prayer.key}
                                        onClick={() => togglePrayer(prayer.key)}
                                        className={`rounded-2xl p-5 text-center font-semibold transition-all duration-300 border ${prayers[prayer.key]
                                                ? "bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/30"
                                                : "bg-white/10 text-gray-200 border-white/10 hover:bg-white/20"
                                            }`}
                                    >
                                        <div className="text-lg mb-2">{prayer.label}</div>
                                        <div className="text-sm">
                                            {prayers[prayer.key] ? "Completed" : "Not Marked"}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
                                <p className="text-sm text-gray-300">Completed on this day</p>
                                <p className="text-3xl font-bold text-emerald-400">
                                    {completedCount}/5
                                </p>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 transition-all duration-300 px-6 py-3 rounded-xl font-semibold shadow-lg"
                            >
                                {saving ? "Saving..." : "Save Prayer Log"}
                            </button>
                        </div>

                        {message && (
                            <div className="mt-5 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-gray-200">
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-2">Consistency Analysis</h2>
                        <p className="text-gray-300 text-sm mb-6">
                            Your prayer habits and performance summary.
                        </p>

                        {consistency ? (
                            <div className="space-y-4">
                                <div className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-400/20">
                                    <p className="text-sm text-gray-300">Total Days Logged</p>
                                    <p className="text-2xl font-bold">{consistency.totalDays}</p>
                                </div>

                                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/20">
                                    <p className="text-sm text-gray-300">Completed Prayers</p>
                                    <p className="text-2xl font-bold">
                                        {consistency.totalCompletedPrayers}
                                    </p>
                                </div>

                                <div className="bg-yellow-500/20 rounded-xl p-4 border border-yellow-400/20">
                                    <p className="text-sm text-gray-300">Perfect Days</p>
                                    <p className="text-2xl font-bold">
                                        {consistency.perfectDays}
                                    </p>
                                </div>

                                <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-400/20">
                                    <p className="text-sm text-gray-300">Current Streak</p>
                                    <p className="text-2xl font-bold">
                                        {consistency.currentStreak}
                                    </p>
                                </div>

                                <div className="bg-pink-500/20 rounded-xl p-4 border border-pink-400/20">
                                    <p className="text-sm text-gray-300">Best Streak</p>
                                    <p className="text-2xl font-bold">{consistency.maxStreak}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/5 rounded-xl p-4 text-gray-400 text-sm">
                                Consistency data is not available right now.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrayerTracker;