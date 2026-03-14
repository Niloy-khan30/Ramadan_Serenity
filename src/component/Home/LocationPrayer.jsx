import React, { useEffect, useState } from "react";
import {
    PrayerTimes,
    Coordinates,
    CalculationMethod,
    Madhab,
} from "adhan";

const LocationPrayer = () => {
    const [location, setLocation] = useState(null);
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayer, setNextPrayer] = useState("");

    // Calculate Prayer Times
    const calculatePrayerTimes = (lat, lng) => {
        const coordinates = new Coordinates(lat, lng);

        const params = CalculationMethod.Karachi();
        params.madhab = Madhab.Hanafi;

        const times = new PrayerTimes(coordinates, new Date(), params);

        // ✅ store the whole instance
        setPrayerTimes(times);
    };

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    setLocation({ lat, lng });
                    calculatePrayerTimes(lat, lng);
                },
                () => {
                    setError("Location access denied");
                }
            );
        } else {
            setError("Geolocation not supported");
        }
    }, []);

    // Countdown Logic
    useEffect(() => {
        if (!prayerTimes) return;

        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

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
    }, [prayerTimes]); // ✅ dependency added

    const formatTime = (date) =>
        date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    if (!prayerTimes) {
        return <p className="text-center mt-10">Getting location...</p>;
    }

    return (
        <div className="mt-10 w-[30%] bg-white shadow-2xl rounded-2xl p-3">
            <h2 className="text-1xl font-bold text-center mb-4">
                📍 Location Based Prayer Times
            </h2>

            <div className="space-y-3">
                <div className="flex justify-between bg-green-100 p-2 rounded-xl">
                    <span>🌅 Fajr</span>
                    <span>{formatTime(prayerTimes.fajr)}</span>
                </div>

                <div className="flex justify-between bg-blue-100 p-2 rounded-xl">
                    <span>☀ Dhuhr</span>
                    <span>{formatTime(prayerTimes.dhuhr)}</span>
                </div>

                <div className="flex justify-between bg-yellow-100 p-2 rounded-xl">
                    <span>🌤 Asr</span>
                    <span>{formatTime(prayerTimes.asr)}</span>
                </div>

                <div className="flex justify-between bg-orange-100 p-2 rounded-xl">
                    <span>🌇 Maghrib</span>
                    <span>{formatTime(prayerTimes.maghrib)}</span>
                </div>

                <div className="flex justify-between bg-purple-100 p-2 rounded-xl">
                    <span>🌙 Isha</span>
                    <span>{formatTime(prayerTimes.isha)}</span>
                </div>

                <div className="mt-2 text-center bg-indigo-50 p-1 rounded-xl">
                    <p className="text-gray-700 font-semibold">
                        Next: {nextPrayer} in ⏳ {countdown}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LocationPrayer;