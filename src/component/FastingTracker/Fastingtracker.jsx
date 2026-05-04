import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const getTodayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getCurrentMonthKey = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const getDaysInCurrentMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getDateForDay = (day) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const targetDate = new Date(year, month, day);

    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, "0");
    const d = String(targetDate.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
};

const getInitialDays = () =>
    Array.from({ length: getDaysInCurrentMonth() }, (_, index) => {
        const day = index + 1;

        return {
            day,
            date: getDateForDay(day),
            status: "",
        };
    });

const Fastingtracker = () => {
    const { user } = useAuth();

    const [days, setDays] = useState(getInitialDays);
    const [monthKey, setMonthKey] = useState(getCurrentMonthKey());
    const [message, setMessage] = useState("");

    const fetchFastingLogs = async () => {
        if (!user?.email) return;

        const currentMonthKey = getCurrentMonthKey();
        setMonthKey(currentMonthKey);

        try {
            const res = await axios.get(
                `${API_URL}/api/fasting-log/${user.email}?monthKey=${currentMonthKey}`
            );

            const logs = res.data.logs || [];

            const mergedDays = getInitialDays().map((dayItem) => {
                const foundLog = logs.find((log) => log.day === dayItem.day);

                return foundLog
                    ? {
                        day: foundLog.day,
                        date: foundLog.date,
                        status: foundLog.status,
                    }
                    : dayItem;
            });

            setDays(mergedDays);
        } catch {
            setMessage("Failed to load fasting logs.");
        }
    };

    useEffect(() => {
        fetchFastingLogs();

        const interval = setInterval(() => {
            const currentMonthKey = getCurrentMonthKey();

            if (currentMonthKey !== monthKey) {
                setDays(getInitialDays());
                setMonthKey(currentMonthKey);
                fetchFastingLogs();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [user, monthKey]);

    const updateStatus = async (dayNumber, status) => {
        if (!user?.email) {
            setMessage("Please login first.");
            return;
        }

        const date = getDateForDay(dayNumber);

        try {
            setMessage("");

            await axios.post(`${API_URL}/api/fasting-log`, {
                userEmail: user.email,
                day: dayNumber,
                date,
                status,
            });

            setDays((prevDays) =>
                prevDays.map((item) =>
                    item.day === dayNumber ? { ...item, date, status } : item
                )
            );

            setMessage("Fasting status updated and fasting goals synced.");

            window.dispatchEvent(new Event("goalUpdated"));
        } catch {
            setMessage("Failed to update fasting status.");
        }
    };

    const stats = useMemo(() => {
        const completed = days.filter((d) => d.status === "completed").length;
        const missed = days.filter((d) => d.status === "missed").length;
        const excused = days.filter((d) => d.status === "excused").length;

        return { completed, missed, excused };
    }, [days]);

    const getCardStyle = (status) => {
        if (status === "completed") return "bg-emerald-500/15 border-emerald-400/20";
        if (status === "missed") return "bg-red-500/15 border-red-400/20";
        if (status === "excused") return "bg-amber-500/15 border-amber-400/20";
        return "bg-white/5 border-white/10";
    };

    const getStatusLabel = (status) => {
        if (status === "completed") return "Completed";
        if (status === "missed") return "Missed";
        if (status === "excused") return "Excused";
        return "Not marked";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white px-4 py-10 pb-28">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Fasting Tracker
                    </h1>

                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Track fasting for each real calendar day of the current month.
                        Weekly and monthly fasting goals update automatically from this
                        tracker.
                    </p>

                    <p className="text-emerald-300 text-sm mt-2">
                        Current Month: {monthKey}
                    </p>
                </div>

                {message && (
                    <div className="mb-6 rounded-2xl bg-white/10 border border-white/10 px-5 py-3 text-center text-sm text-gray-200">
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-emerald-500/15 border border-emerald-400/20 rounded-2xl p-5 text-center shadow-xl">
                        <p className="text-sm text-gray-300 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-emerald-400">
                            {stats.completed}
                        </p>
                    </div>

                    <div className="bg-red-500/15 border border-red-400/20 rounded-2xl p-5 text-center shadow-xl">
                        <p className="text-sm text-gray-300 mb-1">Missed</p>
                        <p className="text-3xl font-bold text-red-400">{stats.missed}</p>
                    </div>

                    <div className="bg-amber-500/15 border border-amber-400/20 rounded-2xl p-5 text-center shadow-xl">
                        <p className="text-sm text-gray-300 mb-1">Excused</p>
                        <p className="text-3xl font-bold text-amber-400">
                            {stats.excused}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {days.map((item) => {
                        const isToday = item.date === getTodayDate();

                        return (
                            <div
                                key={item.day}
                                className={`border rounded-2xl p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${getCardStyle(
                                    item.status
                                )}`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Day {item.day}
                                            {isToday && (
                                                <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
                                                    Today
                                                </span>
                                            )}
                                        </h2>

                                        <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                                    </div>

                                    <span className="text-sm text-gray-300">
                                        {getStatusLabel(item.status)}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => updateStatus(item.day, "completed")}
                                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                                    >
                                        Done
                                    </button>

                                    <button
                                        onClick={() => updateStatus(item.day, "missed")}
                                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                                    >
                                        Missed
                                    </button>

                                    <button
                                        onClick={() => updateStatus(item.day, "excused")}
                                        className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-400"
                                    >
                                        Sick/Travel
                                    </button>

                                    <button
                                        onClick={() => updateStatus(item.day, "")}
                                        className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Fastingtracker;