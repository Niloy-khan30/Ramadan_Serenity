import React, { useEffect, useState } from "react";
import {
    PrayerTimes,
    Coordinates,
    CalculationMethod,
    Madhab,
} from "adhan";

const PrayerTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayer, setNextPrayer] = useState("");
    const [countdown, setCountdown] = useState("");

    // Dhaka Coordinates (Change if needed)
    const coordinates = new Coordinates(23.8103, 90.4125);

    const params = CalculationMethod.Karachi();
    params.madhab = Madhab.Hanafi;

    const prayerTimes = new PrayerTimes(coordinates, new Date(), params);

    const prayers = {
        Fajr: prayerTimes.fajr,
        Dhuhr: prayerTimes.dhuhr,
        Asr: prayerTimes.asr,
        Maghrib: prayerTimes.maghrib,
        Isha: prayerTimes.isha,
    };

    useEffect(() => {
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
    }, []);

    const formatTime = (date) =>
        date.toLocaleTimeString("en-BD", {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div className="border w-1/3 mt-10">
            <div className="bg-white shadow-2xl rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">
                    🕌 Prayer Times
                </h2>

                <p className="text-center text-gray-600 mb-4">
                    {currentTime.toLocaleTimeString()}
                </p>

                <div className="space-y-4">
                    {Object.entries(prayers).map(([name, time]) => (
                        <div
                            key={name}
                            className={`flex justify-between p-3 rounded-xl ${nextPrayer === name.toLowerCase()
                                    ? "bg-indigo-100 border border-indigo-400"
                                    : "bg-gray-100"
                                }`}
                        >
                            <span className="font-normal text-gray-700">{name}</span>
                            <span className="font-semibold text-gray-800">
                                {formatTime(time)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-5 text-center bg-indigo-50 p-3 rounded-xl">
                    <p className="text-gray-700 font-semibold">
                        Next: {nextPrayer}
                    </p>
                    <p className="text-indigo-600 font-bold">
                        ⏳ {countdown}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrayerTime;