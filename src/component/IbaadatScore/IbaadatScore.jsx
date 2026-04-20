import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const getTodayDate = () => new Date().toISOString().split("T")[0];

const IbaadatScore = () => {
    const { user } = useAuth();

    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [fastingStatus, setFastingStatus] = useState("completed");
    const [scoreData, setScoreData] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchScore = async (date) => {
        if (!user?.email) return;

        try {
            setLoading(true);
            const res = await axios.get(
                `${API_URL}/api/ibaadat-score/${user.email}/${date}`
            );
            setScoreData(res.data.score || null);
        } catch (error) {
            setScoreData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScore(selectedDate);
    }, [user, selectedDate]);

    const handleGenerateScore = async () => {
        if (!user?.email) return;

        try {
            setMessage("");

            await axios.post(`${API_URL}/api/ibaadat-score`, {
                userEmail: user.email,
                date: selectedDate,
                fastingStatus,
            });

            setMessage("Ibaadat score generated successfully.");
            fetchScore(selectedDate);
        } catch (error) {
            setMessage("Failed to generate Ibaadat score.");
        }
    };

    const scoreColor =
        scoreData?.totalScore >= 80
            ? "text-green-400"
            : scoreData?.totalScore >= 50
                ? "text-yellow-400"
                : "text-red-400";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white px-4 py-10">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Daily Ibaadat Score
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Generate your daily worship score based on prayer, fasting, and goal
                        completion.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Generate Score</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Fasting Status
                                </label>
                                <select
                                    value={fastingStatus}
                                    onChange={(e) => setFastingStatus(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
                                >
                                    <option value="completed" className="text-black">
                                        Completed
                                    </option>
                                    <option value="missed" className="text-black">
                                        Missed
                                    </option>
                                    <option value="excused" className="text-black">
                                        Excused
                                    </option>
                                </select>
                            </div>

                            <button
                                onClick={handleGenerateScore}
                                className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 px-6 py-3 rounded-xl font-semibold shadow-lg"
                            >
                                Generate Daily Score
                            </button>
                        </div>

                        {message && (
                            <div className="mt-4 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-gray-200">
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Score Breakdown</h2>

                        {loading ? (
                            <p className="text-gray-300">Loading score...</p>
                        ) : scoreData ? (
                            <div className="space-y-4">
                                <div className="bg-white/10 rounded-2xl p-5 text-center">
                                    <p className="text-sm text-gray-300 mb-2">Total Score</p>
                                    <h2 className={`text-5xl font-bold ${scoreColor}`}>
                                        {scoreData.totalScore}
                                    </h2>
                                    <p className="text-gray-400 mt-2">out of 100</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-green-500/20 rounded-xl p-4 text-center">
                                        <p className="text-sm text-gray-300">Prayer Score</p>
                                        <p className="text-2xl font-bold">
                                            {scoreData.prayerScore}
                                        </p>
                                    </div>

                                    <div className="bg-orange-500/20 rounded-xl p-4 text-center">
                                        <p className="text-sm text-gray-300">Fasting Score</p>
                                        <p className="text-2xl font-bold">
                                            {scoreData.fastingScore}
                                        </p>
                                    </div>

                                    <div className="bg-blue-500/20 rounded-xl p-4 text-center">
                                        <p className="text-sm text-gray-300">Goal Score</p>
                                        <p className="text-2xl font-bold">{scoreData.goalScore}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">
                                No score generated yet for this date.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IbaadatScore;