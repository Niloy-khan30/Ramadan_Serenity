import React, { useEffect, useState } from "react";
import {
    PrayerTimes,
    Coordinates,
    CalculationMethod,
    Madhab,
} from "adhan";

const LocationPrayer = () => {
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState("");
    const [nextPrayer, setNextPrayer] = useState("");

    const calculatePrayerTimes = (lat, lng) => {
        const coordinates = new Coordinates(lat, lng);
        const params = CalculationMethod.Karachi();
        params.madhab = Madhab.Hanafi;
        const times = new PrayerTimes(coordinates, new Date(), params);
        setPrayerTimes(times);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    calculatePrayerTimes(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                },
                () => {
                    setError("Location access denied");
                }
            );
        } else {
            setError("Geolocation not supported");
        }
    }, []);

    useEffect(() => {
        if (!prayerTimes) return;

        const interval = setInterval(() => {
            const now = new Date();
            const next = prayerTimes.nextPrayer();
            setNextPrayer(next);

            const nextPrayerTime = prayerTimes.timeForPrayer(next);

            if (nextPrayerTime) {
                const diff = nextPrayerTime.getTime() - now.getTime();

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                setCountdown(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [prayerTimes]);

    const formatTime = (date) =>
        date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    if (error) {
        return <p className="text-red-400 text-center mt-10">{error}</p>;
    }

    if (!prayerTimes) {
        return <p className="text-center text-gray-300 mt-10">Getting location...</p>;
    }

    return (
        <div className="w-full">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl p-6 min-h-[520px]">
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    📍 Prayer Times
                </h2>

                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-emerald-500/15 border border-emerald-400/20 p-5 rounded-2xl text-white text-2xl">
                        <span>🌅 Fajr</span>
                        <span>{formatTime(prayerTimes.fajr)}</span>
                    </div>

                    <div className="flex justify-between items-center bg-blue-500/15 border border-blue-400/20 p-5 rounded-2xl text-white text-2xl">
                        <span>☀ Dhuhr</span>
                        <span>{formatTime(prayerTimes.dhuhr)}</span>
                    </div>

                    <div className="flex justify-between items-center bg-yellow-500/15 border border-yellow-400/20 p-5 rounded-2xl text-white text-2xl">
                        <span>🌤 Asr</span>
                        <span>{formatTime(prayerTimes.asr)}</span>
                    </div>

                    <div className="flex justify-between items-center bg-orange-500/15 border border-orange-400/20 p-5 rounded-2xl text-white text-2xl">
                        <span>🌇 Maghrib</span>
                        <span>{formatTime(prayerTimes.maghrib)}</span>
                    </div>

                    <div className="flex justify-between items-center bg-purple-500/15 border border-purple-400/20 p-5 rounded-2xl text-white text-2xl">
                        <span>🌙 Isha</span>
                        <span>{formatTime(prayerTimes.isha)}</span>
                    </div>

                    <div className="text-center bg-slate-500/15 border border-white/10 p-5 rounded-2xl mt-4">
                        <p className="text-gray-200 text-2xl font-semibold">
                            Next: {nextPrayer} ⏳ {countdown}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPrayer;