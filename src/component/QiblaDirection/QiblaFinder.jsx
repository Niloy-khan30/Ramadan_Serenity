import React, { useState, useEffect, useCallback } from "react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRad(deg) {
    return (deg * Math.PI) / 180;
}

function toDeg(rad) {
    return (rad * 180) / Math.PI;
}

function calcQiblaAngle(lat, lng) {
    const φ1 = toRad(lat);
    const φ2 = toRad(KAABA_LAT);
    const Δλ = toRad(KAABA_LNG - lng);
    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export default function QiblaFinder() {

    const [location, setLocation] = useState(null);
    const [heading, setHeading] = useState(null);
    const [qiblaAngle, setQiblaAngle] = useState(null);
    const [error, setError] = useState(null);

    const requestLocation = useCallback(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;

                setLocation({ lat: latitude, lng: longitude });
                setQiblaAngle(calcQiblaAngle(latitude, longitude));
            },
            () => {
                setError("Location access denied. Please enable location.");
            }
        );
    }, []);

    // Automatically request location on page load
    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    useEffect(() => {
        const handleOrientation = (e) => {
            let h = null;

            if (e.webkitCompassHeading !== undefined) {
                // iOS Safari
                h = e.webkitCompassHeading;
            } else if (e.alpha !== null) {
                // Android / other browsers
                h = 360 - e.alpha;
            }

            if (h !== null) {
                h = (h + 360) % 360; // normalize between 0 - 360
                setHeading(h);
            }
        };

        window.addEventListener("deviceorientation", handleOrientation, true);

        return () =>
            window.removeEventListener("deviceorientation", handleOrientation, true);
    }, []);

    const needleAngle =
        qiblaAngle != null && heading != null
            ? qiblaAngle - heading
            : qiblaAngle ?? 0;

    const isAligned =
        qiblaAngle != null &&
        heading != null &&
        Math.abs(((needleAngle + 180) % 360) - 180) < 5;

    return (
        <div className="flex flex-col items-center gap-6">

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {qiblaAngle != null && (
                <>
                    {/* Compass */}
                    <div className="relative w-60 h-60">

                        <svg viewBox="0 0 240 240">

                            <circle cx="120" cy="120" r="115"
                                fill="none"
                                stroke="#ccc"
                                strokeWidth="1"
                            />

                            <circle cx="120" cy="120" r="108"
                                fill="#f5f5f5"
                            />

                            {["N", "E", "S", "W"].map((label, i) => {
                                const deg = i * 90;
                                const r = 90;
                                const a = toRad(deg - 90);

                                const x = 120 + r * Math.cos(a);
                                const y = 120 + r * Math.sin(a);

                                return (
                                    <text
                                        key={label}
                                        x={x}
                                        y={y}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="text-sm font-semibold"
                                    >
                                        {label}
                                    </text>
                                );
                            })}

                            {/* Qibla needle */}
                            <g transform={`rotate(${needleAngle},120,120)`}>
                                <polygon
                                    points="120,28 115,120 120,112 125,120"
                                    fill="#16a34a"
                                />

                                <polygon
                                    points="120,212 115,120 120,128 125,120"
                                    fill="#9ca3af"
                                />

                                <circle cx="120" cy="120" r="6" fill="white" />
                            </g>

                        </svg>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs">

                        <div className="bg-white/20 p-3 rounded-lg text-center">
                            <p className="text-xs">Qibla Angle</p>
                            <p className="text-xl font-bold">
                                {Math.round(qiblaAngle)}°
                            </p>
                        </div>

                        <div className="bg-white/20 p-3 rounded-lg text-center">
                            <p className="text-xs">Heading</p>
                            <p className="text-xl font-bold">
                                {heading ? Math.round(heading) + "°" : "--"}
                            </p>
                        </div>

                    </div>

                    {isAligned && (
                        <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                            Facing Qibla
                        </div>
                    )}
                </>
            )}
        </div>
    );
}