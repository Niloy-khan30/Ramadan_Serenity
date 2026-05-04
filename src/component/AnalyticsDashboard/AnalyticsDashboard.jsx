import React, { useEffect, useMemo, useState } from "react";
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
    PieChart,
    Pie,
    Cell,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const getMonthKey = (date) => date.slice(0, 7);

const getCurrentWeekDays = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToSaturday = day === 6 ? 0 : day + 1;

    const saturday = new Date(today);
    saturday.setDate(today.getDate() - diffToSaturday);

    const labels = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

    return labels.map((label, index) => {
        const date = new Date(saturday);
        date.setDate(saturday.getDate() + index);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const dayNum = String(date.getDate()).padStart(2, "0");

        return {
            day: label,
            date: `${year}-${month}-${dayNum}`,
            completedPrayers: 0,
            perfect: false,
        };
    });
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 shadow-2xl">
            <p className="font-bold text-white mb-1">{label}</p>
            {payload.map((item) => (
                <p key={item.dataKey} className="text-sm text-gray-200">
                    {item.name}:{" "}
                    <span className="font-bold text-emerald-300">{item.value}</span>
                </p>
            ))}
        </div>
    );
};

const AnalyticsDashboard = () => {
    const { user } = useAuth();

    const [prayerConsistency, setPrayerConsistency] = useState(null);
    const [prayerLogs, setPrayerLogs] = useState([]);
    const [goals, setGoals] = useState([]);
    const [fastingLogs, setFastingLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        if (!user?.email) return;

        try {
            setLoading(true);

            const [consistencyRes, prayerLogsRes, goalRes, fastingRes] =
                await Promise.all([
                    axios.get(`${API_URL}/api/prayer-log/consistency/${user.email}`),
                    axios.get(`${API_URL}/api/prayer-log/all/${user.email}`),
                    axios.get(`${API_URL}/api/goals/${user.email}`),
                    axios.get(`${API_URL}/api/fasting-log/${user.email}`),
                ]);

            setPrayerConsistency(consistencyRes.data.consistency || null);
            setPrayerLogs(prayerLogsRes.data.logs || []);
            setGoals(goalRes.data.goals || []);
            setFastingLogs(fastingRes.data.logs || []);
        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const refresh = () => fetchDashboardData();
        window.addEventListener("goalUpdated", refresh);

        return () => window.removeEventListener("goalUpdated", refresh);
    }, [user]);

    const weeklyPrayerData = useMemo(() => {
        const weekDays = getCurrentWeekDays();

        prayerLogs.forEach((log) => {
            const foundDay = weekDays.find((day) => day.date === log.date);

            if (foundDay) {
                const completed = Object.values(log.prayers || {}).filter(Boolean).length;
                foundDay.completedPrayers = completed;
                foundDay.perfect = completed === 5;
            }
        });

        return weekDays;
    }, [prayerLogs]);

    const monthlyFastingData = useMemo(() => {
        const currentMonth = new Date().toISOString().slice(0, 7);

        const currentMonthLogs = fastingLogs.filter(
            (log) => getMonthKey(log.date) === currentMonth
        );

        return [
            {
                name: "Completed",
                count: currentMonthLogs.filter((log) => log.status === "completed")
                    .length,
            },
            {
                name: "Missed",
                count: currentMonthLogs.filter((log) => log.status === "missed").length,
            },
            {
                name: "Excused",
                count: currentMonthLogs.filter((log) => log.status === "excused")
                    .length,
            },
        ];
    }, [fastingLogs]);

    const goalStatusData = useMemo(() => {
        const completed = goals.filter((goal) => goal.status === "completed").length;
        const active = goals.filter((goal) => goal.status === "active").length;

        return [
            { name: "Completed", value: completed },
            { name: "Active", value: active },
        ];
    }, [goals]);

    const categoryGoalData = useMemo(() => {
        const categories = {};

        goals.forEach((goal) => {
            if (!categories[goal.category]) {
                categories[goal.category] = {
                    category: goal.category,
                    goals: 0,
                };
            }

            categories[goal.category].goals += 1;
        });

        return Object.values(categories);
    }, [goals]);

    const completedGoals = goals.filter((goal) => goal.status === "completed").length;
    const activeGoals = goals.filter((goal) => goal.status === "active").length;

    const completedFasts = fastingLogs.filter(
        (log) => log.status === "completed"
    ).length;

    const missedFasts = fastingLogs.filter((log) => log.status === "missed").length;

    const excusedFasts = fastingLogs.filter(
        (log) => log.status === "excused"
    ).length;

    const axisStyle = {
        fill: "#cbd5e1",
        fontSize: 14,
        fontWeight: 600,
    };

    const goalColors = ["#10b981", "#f59e0b"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white px-4 py-10 pb-28">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">

                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Ramadan Analytics Dashboard
                    </h1>

                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Track weekly prayer progress, monthly fasting performance, and goal
                        completion in one place.
                    </p>
                </div>

                {loading && (
                    <div className="mb-8 rounded-2xl bg-white/10 border border-white/10 px-5 py-3 text-center text-gray-300">
                        Loading analytics...
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-emerald-500/15 border border-emerald-400/20 rounded-3xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Prayer Days Logged</p>
                        <h2 className="text-4xl font-bold mt-2">
                            {prayerConsistency?.totalDays || 0}
                        </h2>
                    </div>

                    <div className="bg-blue-500/15 border border-blue-400/20 rounded-3xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Completed Prayers</p>
                        <h2 className="text-4xl font-bold mt-2">
                            {prayerConsistency?.totalCompletedPrayers || 0}
                        </h2>
                    </div>

                    <div className="bg-amber-500/15 border border-amber-400/20 rounded-3xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Completed Fasts</p>
                        <h2 className="text-4xl font-bold mt-2">{completedFasts}</h2>
                    </div>

                    <div className="bg-purple-500/15 border border-purple-400/20 rounded-3xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Completed Goals</p>
                        <h2 className="text-4xl font-bold mt-2">{completedGoals}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-7 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-1">
                            This Week's Prayer Progress
                        </h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Saturday to Friday. Emerald means a perfect prayer day.
                        </p>

                        <ResponsiveContainer width="100%" height={330}>
                            <BarChart
                                data={weeklyPrayerData}
                                margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
                                barCategoryGap="28%"
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    stroke="#334155"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="day"
                                    tick={axisStyle}
                                    axisLine={{ stroke: "#64748b" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    domain={[0, 5]}
                                    ticks={[0, 1, 2, 3, 4, 5]}
                                    allowDecimals={false}
                                    tick={axisStyle}
                                    axisLine={{ stroke: "#64748b" }}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="completedPrayers"
                                    name="Completed Prayers"
                                    radius={[14, 14, 0, 0]}
                                    maxBarSize={70}
                                >
                                    {weeklyPrayerData.map((entry) => (
                                        <Cell
                                            key={entry.day}
                                            fill={entry.perfect ? "#10b981" : "#f59e0b"}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="flex gap-4 mt-3 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                                Perfect day
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-amber-500" />
                                Incomplete day
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-7 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-1">
                            This Month's Fasting Summary
                        </h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Current month breakdown of your fasting status.
                        </p>

                        <ResponsiveContainer width="100%" height={330}>
                            <BarChart
                                data={monthlyFastingData}
                                margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
                                barCategoryGap="35%"
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    stroke="#334155"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={axisStyle}
                                    axisLine={{ stroke: "#64748b" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={axisStyle}
                                    axisLine={{ stroke: "#64748b" }}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Count" radius={[14, 14, 0, 0]}>
                                    <Cell fill="#10b981" />
                                    <Cell fill="#ef4444" />
                                    <Cell fill="#f59e0b" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">
                    <div className="xl:col-span-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-1">Goal Status</h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Active vs completed goals.
                        </p>

                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={goalStatusData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={70}
                                    outerRadius={105}
                                    paddingAngle={5}
                                >
                                    {goalStatusData.map((entry, index) => (
                                        <Cell
                                            key={entry.name}
                                            fill={goalColors[index % goalColors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="bg-emerald-500/15 border border-emerald-400/20 rounded-2xl p-3 text-center">
                                <p className="text-xs text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-emerald-300">
                                    {completedGoals}
                                </p>
                            </div>

                            <div className="bg-amber-500/15 border border-amber-400/20 rounded-2xl p-3 text-center">
                                <p className="text-xs text-gray-400">Active</p>
                                <p className="text-2xl font-bold text-amber-300">
                                    {activeGoals}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-7 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-1">Goals by Category</h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Number of goals created in each category.
                        </p>

                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart
                                data={categoryGoalData}
                                margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
                                barCategoryGap="35%"
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    stroke="#334155"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="category"
                                    tick={axisStyle}
                                    axisLine={{ stroke: "#64748b" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={axisStyle}
                                    axisLine={{ stroke: "#64748b" }}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="goals"
                                    fill="#8b5cf6"
                                    radius={[14, 14, 0, 0]}
                                    name="Goals"
                                    maxBarSize={90}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Perfect Prayer Days</p>
                        <h2 className="text-4xl font-bold mt-2 text-emerald-300">
                            {prayerConsistency?.perfectDays || 0}
                        </h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Current Prayer Streak</p>
                        <h2 className="text-4xl font-bold mt-2 text-amber-300">
                            {prayerConsistency?.currentStreak || 0}
                        </h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Best Prayer Streak</p>
                        <h2 className="text-4xl font-bold mt-2 text-purple-300">
                            {prayerConsistency?.maxStreak || 0}
                        </h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Missed Fasts</p>
                        <h2 className="text-4xl font-bold mt-2 text-red-300">
                            {missedFasts}
                        </h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Excused Fasts</p>
                        <h2 className="text-4xl font-bold mt-2 text-yellow-300">
                            {excusedFasts}
                        </h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <p className="text-sm text-gray-300">Active Goals</p>
                        <h2 className="text-4xl font-bold mt-2 text-blue-300">
                            {activeGoals}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;