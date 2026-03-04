import React, { useEffect, useState } from "react";
import axios from "axios";

const Ramadan = () => {
    const [city, setCity] = useState("Dhaka");
    const [coordinates, setCoordinates] = useState({
        lat: 23.8103,
        lon: 90.4125,
    });
    const [ramadanDays, setRamadanDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null); // ✅ store clicked day
    const [loading, setLoading] = useState(false);

    const getCoordinates = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
            );

            if (res.data.length > 0) {
                setCoordinates({
                    lat: res.data[0].lat,
                    lon: res.data[0].lon,
                });
            } else {
                alert("Location not found");
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCalendar = async () => {
            const currentYear = new Date().getFullYear();

            try {
                const res = await axios.get(
                    `https://api.aladhan.com/v1/calendar/${currentYear}/3?latitude=${coordinates.lat}&longitude=${coordinates.lon}&method=1`
                );

                const filtered = res.data.data.filter(
                    (day) =>
                        day.date.hijri.month.number === 9 ||
                        day.date.hijri.month.number === 10
                );

                setRamadanDays(filtered);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendar();
    }, [coordinates]);

    return (
        <div className="min-h-screen bg-gray-100 p-6 mb-20">
            <h1 className="text-3xl font-bold text-center mb-6">
                🌙 Ramadan & Eid Calendar
            </h1>

            {/* Location Input */}
            <div className="flex justify-center gap-3 mb-8">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-400"
                />
                <button
                    onClick={getCoordinates}
                    disabled={loading}
                    className={`px-5 py-2 rounded-xl text-white ${loading
                        ? "bg-gray-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                >
                    {loading ? "Loading..." : "Search"}
                </button>
            </div>

            {/* Loader */}
            {loading && (
                <div className="flex justify-center mt-10">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Ramadan Cards */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ramadanDays.map((day, index) => {
                        const isEid =
                            day.date.hijri.month.number === 10 &&
                            day.date.hijri.day === "1";

                        return (
                            <div
                                key={index}
                                onClick={() => setSelectedDay(day)} // ✅ open modal
                                className={`p-5 rounded-2xl shadow-lg cursor-pointer transition transform hover:scale-105
                  ${isEid
                                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-4 border-yellow-300 scale-105"
                                        : "bg-white hover:bg-indigo-50"
                                    }
`}
                            >
                                <h2 className="text-xl font-bold">
                                    {isEid
                                        ? "🌙 Eid-ul-Fitr"
                                        : `${day.date.hijri.month.en} ${day.date.hijri.day}`}
                                </h2>

                                <p className="text-sm mb-2">{day.date.readable}</p>

                                <p className="text-sm">
                                    Sehri: {day.timings.Fajr}
                                </p>
                                <p className="text-sm">
                                    Iftar: {day.timings.Maghrib}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ✅ Modal Popup */}
            {selectedDay && (
                <div className="fixed inset-0 shadow-2xl bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-2xl relative animate-fadeIn">
                        <button
                            onClick={() => setSelectedDay(null)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-center">
                            Prayer Times ({city})
                        </h2>

                        <p><strong>Date:</strong> {selectedDay.date.readable}</p>
                        <p>Fajr: {selectedDay.timings.Fajr}</p>
                        <p>Dhuhr: {selectedDay.timings.Dhuhr}</p>
                        <p>Asr: {selectedDay.timings.Asr}</p>
                        <p>Maghrib: {selectedDay.timings.Maghrib}</p>
                        <p>Isha: {selectedDay.timings.Isha}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ramadan;