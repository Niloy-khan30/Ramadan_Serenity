import React, { useEffect, useMemo, useState } from "react";

const DAYS_IN_RAMADAN = 30;

const getInitialDays = () => {
    const saved = localStorage.getItem("fastingHistory");
    if (saved) {
        return JSON.parse(saved);
    }

    return Array.from({ length: DAYS_IN_RAMADAN }, (_, index) => ({
        day: index + 1,
        status: "",
    }));
};

const Fastingtracker = () => {
    const [days, setDays] = useState(getInitialDays);

    useEffect(() => {
        localStorage.setItem("fastingHistory", JSON.stringify(days));
    }, [days]);

    const updateStatus = (dayNumber, status) => {
        setDays((prevDays) =>
            prevDays.map((item) =>
                item.day === dayNumber ? { ...item, status } : item
            )
        );
    };

    const stats = useMemo(() => {
        const completed = days.filter((d) => d.status === "completed").length;
        const missed = days.filter((d) => d.status === "missed").length;
        const excused = days.filter((d) => d.status === "excused").length;

        return { completed, missed, excused };
    }, [days]);

    const getCardStyle = (status) => {
        if (status === "completed") {
            return "bg-emerald-500/15 border-emerald-400/20";
        }
        if (status === "missed") {
            return "bg-red-500/15 border-red-400/20";
        }
        if (status === "excused") {
            return "bg-amber-500/15 border-amber-400/20";
        }
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
                        Track your daily fasting progress throughout Ramadan and keep a clear
                        record of completed, missed, and excused days.
                    </p>
                </div>

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
                        <p className="text-3xl font-bold text-amber-400">{stats.excused}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {days.map((item) => (
                        <div
                            key={item.day}
                            className={`border rounded-2xl p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${getCardStyle(
                                item.status
                            )}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Day {item.day}</h2>
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Fastingtracker;