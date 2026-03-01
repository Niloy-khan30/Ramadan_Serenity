// src/components/RamadanCalendar.jsx
import React, { useEffect, useState } from "react";
import RamadanDay from "../RamadanDay/RamadanDay";

const RamadanCalendar = () => {
    const [ramadanDays, setRamadanDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [Time, setTime] = useState(null)

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        console.log(currentYear)

        fetch(
            `https://api.aladhan.com/v1/calendarByCity/${currentYear}/3?city=Dhaka&country=Bangladesh`
        )
            .then(res => res.json())
            .then(data => {
                setRamadanDays(data.data)
                setLoading(false)

            })
    }, []);

    // console.log(ramadanDays)
    const prayertime = (time) => {
        console.log(time)
        setTime(time)

    }






    if (loading) {
        return <p className="text-center mt-10 text-lg">Loading Ramadan Data...</p>;
    }

    return (
        <div className="min-h-screen">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl md:text-4xl font-bold text-center text-yellow-400 m-10">
                    🌙 Ramadan Calendar
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ramadanDays.map((day, index) => (
                        <div
                            key={index}
                            className="transform transition duration-300 hover:scale-105"
                        >
                            <RamadanDay xkey={index} day={day} prayertime={prayertime} />
                        </div>
                    ))}
                </div>

            </div>

            {
                Time && <>
                    {/* The button to open modal */}


                    {/* Put this part before </body> tag */}
                    <div
                        className="modal fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                        role="dialog"
                        id="my_modal_8"
                    >
                        <div className="modal-box bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">

                            <h2 className="text-2xl font-bold text-yellow-400 text-center mb-4">
                                Prayer Times
                            </h2>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between border-b border-white/20 pb-1">
                                    <span className="font-semibold">Fajr</span>
                                    <span>{Time.Fajr}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-1">
                                    <span className="font-semibold">Dhuhr</span>
                                    <span>{Time.Dhuhr}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-1">
                                    <span className="font-semibold">Asr</span>
                                    <span>{Time.Asr}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-1">
                                    <span className="font-semibold">Maghrib</span>
                                    <span>{Time.Maghrib}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-1">
                                    <span className="font-semibold">Isha</span>
                                    <span>{Time.Isha}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-1">
                                    <span className="font-semibold">Sunrise</span>
                                    <span>{Time.Sunrise}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Sunset</span>
                                    <span>{Time.Sunset}</span>
                                </div>
                            </div>

                            <div className="modal-action mt-4">
                                <a
                                    href="#"
                                    className="btn btn-warning w-full"
                                    onClick={() => document.getElementById("my_modal_8").close()}
                                >
                                    Close
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default RamadanCalendar;