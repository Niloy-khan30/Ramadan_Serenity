import React, { useEffect, useState } from "react";

const days = 30;

const FastingTracker = () => {
    const [fastingData, setFastingData] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("fastingHistory");

        if (saved) {
            setFastingData(JSON.parse(saved));
        } else {
            const initial = Array.from({ length: days }, (_, i) => ({
                day: i + 1,
                status: "pending",
            }));
            setFastingData(initial);
        }
    }, []);

    useEffect(() => {
        if (fastingData.length > 0) {
            localStorage.setItem("fastingHistory", JSON.stringify(fastingData));
        }
    }, [fastingData]);

    const updateStatus = (index, status) => {
        const updated = [...fastingData];
        updated[index].status = status;
        setFastingData(updated);
    };

    const completed = fastingData.filter(d => d.status === "completed").length;
    const missed = fastingData.filter(d => d.status === "missed").length;
    const excused = fastingData.filter(d => d.status === "excused").length;

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg mb-20">

            <h2 className="text-2xl font-bold mb-4 text-center">
                Fasting Status Tracker
            </h2>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-green-100 p-3 rounded-lg">
                    <p className="font-bold text-green-700">{completed}</p>
                    <p className="text-sm">Completed</p>
                </div>

                <div className="bg-red-100 p-3 rounded-lg">
                    <p className="font-bold text-red-700">{missed}</p>
                    <p className="text-sm">Missed</p>
                </div>

                <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="font-bold text-yellow-700">{excused}</p>
                    <p className="text-sm">Excused</p>
                </div>
            </div>

            {/* Days */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {fastingData.map((day, index) => (
                    <div
                        key={day.day}
                        className="border p-4 rounded-lg shadow-sm"
                    >
                        <p className="font-semibold mb-2">
                            Ramadan Day {day.day}
                        </p>

                        <p className="text-sm mb-3 capitalize">
                            Status: {day.status}
                        </p>

                        <div className="flex flex-wrap gap-2">

                            <button
                                onClick={() => updateStatus(index, "completed")}
                                className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                            >
                                Done
                            </button>

                            <button
                                onClick={() => updateStatus(index, "missed")}
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                            >
                                Missed
                            </button>

                            <button
                                onClick={() => updateStatus(index, "excused")}
                                className="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
                            >
                                Sick/Travel
                            </button>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default FastingTracker;