import React, { useEffect, useState } from "react";
import {
    PrayerTimes,
    Coordinates,
    CalculationMethod,
    Madhab,
} from "adhan";

const Ramadan = () => {
    const [sehri, setSehri] = useState("");
    const [iftar, setIftar] = useState("");
    const [countdown, setCountdown] = useState("");
    const [coordinates, setCoordinates] = useState(null);

    const params = CalculationMethod.Karachi();
    params.madhab = Madhab.Hanafi;

    const formatTime = (date) =>
        date.toLocaleTimeString("en-BD", {
            hour: "2-digit",
            minute: "2-digit",
        });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates(
                        new Coordinates(
                            position.coords.latitude,
                            position.coords.longitude
                        )
                    );
                },
                () => {
                    setCoordinates(new Coordinates(23.8103, 90.4125));
                }
            );
        } else {
            setCoordinates(new Coordinates(23.8103, 90.4125));
        }
    }, []);

    useEffect(() => {
        if (!coordinates) return;

        const today = new Date();
        const prayerTimes = new PrayerTimes(coordinates, today, params);

        setSehri(formatTime(prayerTimes.fajr));
        setIftar(formatTime(prayerTimes.maghrib));

        const interval = setInterval(() => {
            const now = new Date();
            const maghrib = prayerTimes.maghrib;
            const diff = maghrib.getTime() - now.getTime();

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                setCountdown(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setCountdown("Iftar time passed");
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [coordinates]);

    return (
        <div className="w-full">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl p-6 min-h-[520px]">
                <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                    🌙 Ramadan
                    <br />
                    Dashboard
                </h2>

                <div className="space-y-5">
                    <div className="bg-emerald-500/15 border border-emerald-400/20 rounded-2xl p-5 text-center">
                        <p className="text-gray-300 text-lg">Sehri Ends</p>
                        <p className="text-5xl font-bold text-emerald-400 mt-2">{sehri}</p>
                    </div>

                    <div className="bg-orange-500/15 border border-orange-400/20 rounded-2xl p-5 text-center">
                        <p className="text-gray-300 text-lg">Iftar Time</p>
                        <p className="text-5xl font-bold text-orange-400 mt-2">{iftar}</p>
                    </div>

                    <div className="bg-slate-500/15 border border-white/10 rounded-2xl p-5 text-center">
                        <p className="text-gray-300 text-lg">⏳ Time Left for Iftar</p>
                        <p className="text-3xl font-bold text-red-400 mt-2 break-words">
                            {countdown}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ramadan;