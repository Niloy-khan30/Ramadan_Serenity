import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const AnalyticsDashboard = () => {
    const { user } = useAuth();

    const [prayerConsistency, setPrayerConsistency] = useState(null);
    const [goals, setGoals] = useState([]);
    const [fastingData, setFastingData] = useState([]);

    useEffect(() => {
        if (!user?.email) return;

        const fetchDashboardData = async () => {
            try {
                const prayerRes = await axios.get(
                    `${API_URL}/api/prayer-log/consistency/${user.email}`
                );
                setPrayerConsistency(prayerRes.data.consistency || null);

                const goalRes = await axios.get(`${API_URL}/api/goals/${user.email}`);
                setGoals(goalRes.data.goals || []);

                const fastingRes = await axios.get(
                    `${API_URL}/api/fasting-log/${user.email}`
                );
                setFastingData(fastingRes.data.logs || []);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, [user]);

    const completedGoals = goals.filter(
        (goal) => goal.status === "completed"
    ).length;

    const activeGoals = goals.filter((goal) => goal.status === "active").length;

    const completedFasts = fastingData.filter(
        (day) => day.status === "completed"
    ).length;

    const missedFasts = fastingData.filter(
        (day) => day.status === "missed"
    ).length;

    const excusedFasts = fastingData.filter(
        (day) => day.status === "excused"
    ).length;

    const prayerChartData = [
        {
            name: "Prayer",
            completed: prayerConsistency?.totalCompletedPrayers || 0,
            perfectDays: prayerConsistency?.perfectDays || 0,
        },
    ];

    const fastingChartData = [
        { name: "Completed Fasts", value: completedFasts },
        { name: "Missed Fasts", value: missedFasts },
        { name: "Excused Fasts", value: excusedFasts },
    ];

    const goalChartData = [
        { name: "Completed Goals", value: completedGoals },
        { name: "Active Goals", value: activeGoals },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white px-4 py-10 pb-28">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-green-400 font-semibold tracking-widest uppercase mb-2">
                        Analytics
                    </p>

                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Ramadan Analytics Dashboard
                    </h1>

                    <p className="text-gray-300 max-w-2xl mx-auto">
                        View your Ramadan progress across prayers, fasting, and goals in one
                        place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Prayer Days Logged</p>
                        <h2 className="text-3xl font-bold mt-2">
                            {prayerConsistency?.totalDays || 0}
                        </h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Completed Prayers</p>
                        <h2 className="text-3xl font-bold mt-2">
                            {prayerConsistency?.totalCompletedPrayers || 0}
                        </h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Completed Goals</p>
                        <h2 className="text-3xl font-bold mt-2">{completedGoals}</h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Completed Fasts</p>
                        <h2 className="text-3xl font-bold mt-2">{completedFasts}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Prayer Summary</h2>

                        <div className="space-y-4">
                            <div className="bg-green-500/20 rounded-xl p-4">
                                <p className="text-sm text-gray-300">Perfect Prayer Days</p>
                                <p className="text-2xl font-bold">
                                    {prayerConsistency?.perfectDays || 0}
                                </p>
                            </div>

                            <div className="bg-purple-500/20 rounded-xl p-4">
                                <p className="text-sm text-gray-300">Current Streak</p>
                                <p className="text-2xl font-bold">
                                    {prayerConsistency?.currentStreak || 0}
                                </p>
                            </div>

                            <div className="bg-orange-500/20 rounded-xl p-4">
                                <p className="text-sm text-gray-300">Best Streak</p>
                                <p className="text-2xl font-bold">
                                    {prayerConsistency?.maxStreak || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Fasting + Goal Summary</h2>

                        <div className="space-y-4">
                            <div className="bg-yellow-500/20 rounded-xl p-4">
                                <p className="text-sm text-gray-300">Active Goals</p>
                                <p className="text-2xl font-bold">{activeGoals}</p>
                            </div>

                            <div className="bg-green-500/20 rounded-xl p-4">
                                <p className="text-sm text-gray-300">Completed Goals</p>
                                <p className="text-2xl font-bold">{completedGoals}</p>
                            </div>

                            <div className="bg-red-500/20 rounded-xl p-4">
                                <p className="text-sm text-gray-300">Missed Fasts</p>
                                <p className="text-2xl font-bold">{missedFasts}</p>
                            </div>

                            <div className="bg-slate-500/20 rounded-xl p-4">
                                <p className="text-sm text-gray-300">Excused Fasts</p>
                                <p className="text-2xl font-bold">{excusedFasts}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Prayer Analytics</h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={prayerChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis dataKey="name" stroke="#e5e7eb" />
                                <YAxis allowDecimals={false} stroke="#e5e7eb" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        border: "1px solid #334155",
                                        borderRadius: "12px",
                                        color: "#fff",
                                    }}
                                />
                                <Bar dataKey="completed" fill="#22c55e" radius={[8, 8, 0, 0]} />
                                <Bar
                                    dataKey="perfectDays"
                                    fill="#3b82f6"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Goal Analytics</h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={goalChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis dataKey="name" stroke="#e5e7eb" />
                                <YAxis allowDecimals={false} stroke="#e5e7eb" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        border: "1px solid #334155",
                                        borderRadius: "12px",
                                        color: "#fff",
                                    }}
                                />
                                <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 mt-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Fasting Analytics</h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={fastingChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis dataKey="name" stroke="#e5e7eb" />
                                <YAxis allowDecimals={false} stroke="#e5e7eb" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        border: "1px solid #334155",
                                        borderRadius: "12px",
                                        color: "#fff",
                                    }}
                                />
                                <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;