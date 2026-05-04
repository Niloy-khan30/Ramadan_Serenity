import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

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
        } catch {
            setMessage("Failed to load goals.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [user]);

    useEffect(() => {
        const refreshGoals = () => {
            fetchGoals();
        };

        window.addEventListener("goalUpdated", refreshGoals);

        return () => {
            window.removeEventListener("goalUpdated", refreshGoals);
        };
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

        if (!user?.email) {
            setMessage("Please login first.");
            return;
        }

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
        } catch {
            setMessage("Failed to create goal.");
        }
    };

    const handleProgressUpdate = async (goalId, newValue) => {
        try {
            await axios.patch(`${API_URL}/api/goals/${goalId}`, {
                currentValue: Number(newValue),
            });

            fetchGoals();
        } catch {
            setMessage(
                "Prayer and fasting goals update automatically from their trackers."
            );
        }
    };

    const handleDeleteGoal = async (goalId) => {
        try {
            await axios.delete(`${API_URL}/api/goals/${goalId}`);
            fetchGoals();
        } catch {
            setMessage("Failed to delete goal.");
        }
    };

    const getProgressPercent = (goal) => {
        if (!goal.targetValue) return 0;

        return Math.min(
            100,
            Math.round((Number(goal.currentValue) / Number(goal.targetValue)) * 100)
        );
    };

    const isSyncedGoal = (goal) =>
        goal.category === "prayer" || goal.category === "fasting";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white px-4 py-10 pb-28">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Ramadan Goal Planner
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Create Ramadan goals. Prayer and fasting goals update automatically
                        from their trackers.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl h-fit">
                        <h2 className="text-2xl font-bold mb-5">Create New Goal</h2>

                        <form onSubmit={handleCreateGoal} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Goal title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-emerald-400"
                                required
                            />

                            <textarea
                                name="description"
                                placeholder="Goal description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-emerald-400"
                                rows="4"
                            />

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-400"
                            >
                                <option value="general" className="text-black">
                                    General
                                </option>
                                <option value="prayer" className="text-black">
                                    Prayer
                                </option>
                                <option value="fasting" className="text-black">
                                    Fasting
                                </option>
                                <option value="quran" className="text-black">
                                    Quran
                                </option>
                                <option value="charity" className="text-black">
                                    Charity
                                </option>
                            </select>

                            <select
                                name="targetType"
                                value={formData.targetType}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-400"
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
                                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-emerald-400"
                                required
                            />

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-emerald-500/20"
                            >
                                Create Goal
                            </button>
                        </form>

                        {message && (
                            <div className="mt-4 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-sm text-center text-gray-200">
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-5">My Goals</h2>

                        {loading ? (
                            <p className="text-gray-300">Loading goals...</p>
                        ) : goals.length === 0 ? (
                            <p className="text-gray-400">No goals created yet.</p>
                        ) : (
                            <div className="space-y-5">
                                {goals.map((goal) => {
                                    const progressPercent = getProgressPercent(goal);
                                    const synced = isSyncedGoal(goal);

                                    return (
                                        <div
                                            key={goal._id}
                                            className="bg-white/10 border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold capitalize">
                                                        {goal.title}
                                                    </h3>

                                                    <p className="text-gray-300 mt-1">
                                                        {goal.description || "No description"}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mt-4 text-xs">
                                                        <span className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full">
                                                            {goal.category}
                                                        </span>

                                                        <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full">
                                                            {goal.targetType}
                                                        </span>

                                                        <span
                                                            className={`px-3 py-1 rounded-full ${goal.status === "completed"
                                                                ? "bg-emerald-500/20 text-emerald-300"
                                                                : "bg-yellow-500/20 text-yellow-200"
                                                                }`}
                                                        >
                                                            {goal.status}
                                                        </span>

                                                        {synced && (
                                                            <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full">
                                                                auto synced
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteGoal(goal._id)}
                                                    className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-2xl text-sm font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                            <div className="mt-6">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span>
                                                        Progress: {Math.min(goal.currentValue, goal.targetValue)}/{goal.targetValue}
                                                    </span>
                                                    <span>{progressPercent}%</span>
                                                </div>

                                                <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
                                                    <div
                                                        className={`h-3 rounded-full ${goal.status === "completed"
                                                            ? "bg-emerald-400"
                                                            : "bg-emerald-600"
                                                            }`}
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>

                                                {synced ? (
                                                    <p className="text-xs text-gray-400">
                                                        This goal updates automatically from the{" "}
                                                        {goal.category === "prayer"
                                                            ? "Prayer Tracker"
                                                            : "Fasting Tracker"}
                                                        .
                                                    </p>
                                                ) : (
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
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalPlanner;