import React, { useEffect, useState } from "react";

const QiblaDirection = () => {
    const [qibla, setQibla] = useState(null);
    const [heading, setHeading] = useState(0);

    const KAABA = {
        lat: 21.4225,
        lon: 39.8262,
    };

    const calculateQibla = (lat, lon) => {
        const toRad = (deg) => (deg * Math.PI) / 180;
        const toDeg = (rad) => (rad * 180) / Math.PI;

        const φ1 = toRad(lat);
        const φ2 = toRad(KAABA.lat);
        const Δλ = toRad(KAABA.lon - lon);

        const y = Math.sin(Δλ) * Math.cos(φ2);
        const x =
            Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

        let θ = Math.atan2(y, x);
        θ = toDeg(θ);

        return (θ + 360) % 360;
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const qiblaDir = calculateQibla(lat, lon);
            setQibla(qiblaDir);
        });

        const handleOrientation = (event) => {
            let compassHeading;

            if (event.webkitCompassHeading) {
                compassHeading = event.webkitCompassHeading;
            } else {
                compassHeading = 360 - event.alpha;
            }

            setHeading(compassHeading);
        };

        window.addEventListener("deviceorientation", handleOrientation, true);

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    const rotation = qibla !== null ? qibla - heading : 0;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

            <h1 className="text-3xl font-bold mb-8">Qibla Direction</h1>

            <div className="relative w-72 h-72 rounded-full border-4 border-gray-400 bg-white flex items-center justify-center shadow-xl">

                {/* N */}
                <span className="absolute top-2 text-red-500 font-bold text-lg">N</span>

                {/* E */}
                <span className="absolute right-2 font-bold text-lg">E</span>

                {/* S */}
                <span className="absolute bottom-2 font-bold text-lg">S</span>

                {/* W */}
                <span className="absolute left-2 font-bold text-lg">W</span>

                {/* Arrow */}
                <div
                    className="text-6xl transition-transform duration-200"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    ▲
                </div>
            </div>

            {qibla && (
                <p className="mt-6 text-lg text-gray-600">
                    Qibla Angle: {qibla.toFixed(2)}°
                </p>
            )}
        </div>
    );
};

export default QiblaDirection;