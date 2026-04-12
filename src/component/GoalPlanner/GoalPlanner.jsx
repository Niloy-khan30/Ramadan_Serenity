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

const GoalPlanner = () => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "general",
        targetType: "daily",
        targetValue: 1,
    });

    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchGoals = async () => {
        if (!user?.email) return;

        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/goals/${user.email}`);
            setGoals(res.data.goals || []);
        } catch (error) {
            setMessage("Failed to load goals.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "targetValue" ? Number(value) : value,
        }));
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();

        if (!user?.email) return;

        try {
            setMessage("");

            await axios.post(`${API_URL}/api/goals`, {
                userEmail: user.email,
                ...formData,
            });

            setFormData({
                title: "",
                description: "",
                category: "general",
                targetType: "daily",
                targetValue: 1,
            });

            setMessage("Goal created successfully.");
            fetchGoals();
        } catch (error) {
            setMessage("Failed to create goal.");
        }
    };

    const handleProgressUpdate = async (goalId, newValue) => {
        try {
            await axios.patch(`${API_URL}/api/goals/${goalId}`, {
                currentValue: Number(newValue),
            });
            fetchGoals();
        } catch (error) {
            setMessage("Failed to update progress.");
        }
    };

    const handleDeleteGoal = async (goalId) => {
        try {
            await axios.delete(`${API_URL}/api/goals/${goalId}`);
            fetchGoals();
        } catch (error) {
            setMessage("Failed to delete goal.");
        }
    };

    const completed = goals.filter((g) => g.status === "completed").length;
    const active = goals.filter((g) => g.status === "active").length;

    const goalStats =
        completed + active > 0
            ? [
                { name: "Completed", value: completed },
                { name: "Active", value: active },
            ]
            : [];

    const COLORS = ["#22c55e", "#eab308"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white px-4 py-10 mb-10">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Ramadan Goal Planner
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Create meaningful Ramadan goals, track your progress, and stay
                        consistent throughout the month.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Create New Goal</h2>

                        <form onSubmit={handleCreateGoal} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Goal title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                                required
                            />

                            <textarea
                                name="description"
                                placeholder="Goal description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                                rows="3"
                            />

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                            >
                                <option value="general" className="text-black">
                                    General
                                </option>
                                <option value="prayer" className="text-black">
                                    Prayer
                                </option>
                                <option value="quran" className="text-black">
                                    Quran
                                </option>
                                <option value="fasting" className="text-black">
                                    Fasting
                                </option>
                                <option value="charity" className="text-black">
                                    Charity
                                </option>
                            </select>

                            <select
                                name="targetType"
                                value={formData.targetType}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                            >
                                <option value="daily" className="text-black">
                                    Daily
                                </option>
                                <option value="weekly" className="text-black">
                                    Weekly
                                </option>
                                <option value="monthly" className="text-black">
                                    Monthly
                                </option>
                            </select>

                            <input
                                type="number"
                                name="targetValue"
                                min="1"
                                value={formData.targetValue}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                                required
                            />

                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 px-6 py-3 rounded-xl font-semibold shadow-lg"
                            >
                                Create Goal
                            </button>
                        </form>

                        {message && (
                            <div className="mt-4 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-gray-200">
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">My Goals</h2>

                        {loading ? (
                            <p className="text-gray-300">Loading goals...</p>
                        ) : goals.length === 0 ? (
                            <p className="text-gray-400">No goals created yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {goals.map((goal) => (
                                    <div
                                        key={goal._id}
                                        className="bg-white/10 border border-white/10 rounded-2xl p-5"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-bold">{goal.title}</h3>
                                                <p className="text-gray-300 text-sm mt-1">
                                                    {goal.description || "No description"}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                                                    <span className="bg-blue-500/20 px-3 py-1 rounded-full">
                                                        {goal.category}
                                                    </span>
                                                    <span className="bg-purple-500/20 px-3 py-1 rounded-full">
                                                        {goal.targetType}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full ${goal.status === "completed"
                                                            ? "bg-green-500/20"
                                                            : "bg-yellow-500/20"
                                                            }`}
                                                    >
                                                        {goal.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteGoal(goal._id)}
                                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        <div className="mt-5">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>
                                                    Progress: {goal.currentValue}/{goal.targetValue}
                                                </span>
                                                <span>
                                                    {Math.min(
                                                        100,
                                                        Math.round(
                                                            (goal.currentValue / goal.targetValue) * 100
                                                        )
                                                    )}
                                                    %
                                                </span>
                                            </div>

                                            <div className="w-full bg-white/10 rounded-full h-3 mb-4">
                                                <div
                                                    className="bg-green-500 h-3 rounded-full"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            (goal.currentValue / goal.targetValue) * 100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>

                                            <input
                                                type="range"
                                                min="0"
                                                max={goal.targetValue}
                                                value={goal.currentValue}
                                                onChange={(e) =>
                                                    handleProgressUpdate(goal._id, e.target.value)
                                                }
                                                className="range range-success"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-4">Goal Analytics</h2>

                            {goalStats.length > 0 ? (
                                <div className="bg-white/10 p-4 rounded-2xl">
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={goalStats}>
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
                                            <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#22c55e" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-gray-400">No data for analytics yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalPlanner;