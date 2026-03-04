import React, { useEffect, useState } from "react";
import {
    PrayerTimes,
    Coordinates,
    CalculationMethod,
    Madhab,
} from "adhan";
import moment from "moment";
import "moment-hijri";

const Ramadan = () => {
    const [sehri, setSehri] = useState("");
    const [iftar, setIftar] = useState("");
    const [ramadanDay, setRamadanDay] = useState("");
    const [countdown, setCountdown] = useState("");

    // Dhaka Coordinates
    const coordinates = new Coordinates(23.8103, 90.4125);
    const params = CalculationMethod.Karachi();
    params.madhab = Madhab.Hanafi;

    useEffect(() => {
        const today = new Date();
        const prayerTimes = new PrayerTimes(coordinates, today, params);

        setSehri(formatTime(prayerTimes.fajr));
        setIftar(formatTime(prayerTimes.maghrib));


        // Countdown to Iftar
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
    }, []);

    const formatTime = (date) =>
        date.toLocaleTimeString("en-BD", {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div className="w-1/3 mt-10">
            <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md text-center h-[300px]">
                <h2 className="text-1xl font-bold text-gray-700 mb-2">
                    🌙 Ramadan Dashboard
                </h2>

                <div className="space-y-3">
                    <div className="bg-green-100 p-1 rounded-xl">
                        <p className="font-semibold text-gray-700">Sehri Ends</p>
                        <p className="text-xl font-bold text-green-700">{sehri}</p>
                    </div>

                    <div className="bg-orange-100 p-1 rounded-xl">
                        <p className="font-semibold text-gray-700">Iftar Time</p>
                        <p className="text-xl font-bold text-orange-600">{iftar}</p>
                    </div>

                    <div className="bg-gray-100 p-1 rounded-xl">
                        <p className="font-semibold text-gray-700">
                            ⏳ Time Left for Iftar
                        </p>
                        <p className="text-lg font-bold text-red-500">
                            {countdown}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ramadan;