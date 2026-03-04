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

    // Get User Location
    const calculatePrayerTimes = (lat, lng) => {
        const coordinates = new Coordinates(lat, lng);

        const params = CalculationMethod.Karachi();
        params.madhab = Madhab.Hanafi;

        const times = new PrayerTimes(coordinates, new Date(), params);

        setPrayerTimes({
            Fajr: times.fajr,
            Dhuhr: times.dhuhr,
            Asr: times.asr,
            Maghrib: times.maghrib,
            Isha: times.isha,
        });
    };
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
        <div className=" mt-10 bg-white shadow-2xl rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-center mb-4">
                📍 Location Based Prayer Times
            </h2>

            <div className="space-y-3">
                <div className="flex justify-between bg-green-100 p-3 rounded-xl">
                    <span>🌅 Fajr</span>
                    <span>{formatTime(prayerTimes.Fajr)}</span>
                </div>

                <div className="flex justify-between bg-blue-100 p-3 rounded-xl">
                    <span>☀ Dhuhr</span>
                    <span>{formatTime(prayerTimes.Dhuhr)}</span>
                </div>

                <div className="flex justify-between bg-yellow-100 p-3 rounded-xl">
                    <span>🌤 Asr</span>
                    <span>{formatTime(prayerTimes.Asr)}</span>
                </div>

                <div className="flex justify-between bg-orange-100 p-3 rounded-xl">
                    <span>🌇 Maghrib</span>
                    <span>{formatTime(prayerTimes.Maghrib)}</span>
                </div>

                <div className="flex justify-between bg-purple-100 p-3 rounded-xl">
                    <span>🌙 Isha</span>
                    <span>{formatTime(prayerTimes.Isha)}</span>
                </div>
            </div>
        </div>
    );
};

export default LocationPrayer;