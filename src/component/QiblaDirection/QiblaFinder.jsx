import React from "react";

import { useState, useEffect, useCallback } from "react";


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
    const [permissionState, setPermissionState] = useState("idle"); // idle | loading | granted | denied

    const requestLocation = useCallback(() => {
        setPermissionState("loading");
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation({ lat: latitude, lng: longitude });
                setQiblaAngle(calcQiblaAngle(latitude, longitude));
                setPermissionState("granted");
            },
            () => {
                setError("Location access denied. Please enable it in your browser.");
                setPermissionState("denied");
            }
        );
    }, []);

    useEffect(() => {
        const handleOrientation = (e) => {
            let h = null;
            if (e.webkitCompassHeading != null) {
                h = e.webkitCompassHeading;
            } else if (e.alpha != null) {
                h = (360 - e.alpha) % 360;
            }
            if (h !== null) setHeading(h);
        };

        if (typeof DeviceOrientationEvent !== "undefined") {
            if (typeof DeviceOrientationEvent.requestPermission === "function") {
                DeviceOrientationEvent.requestPermission()
                    .then((res) => {
                        if (res === "granted") {
                            window.addEventListener("deviceorientation", handleOrientation, true);
                        }
                    })
                    .catch(() => { });
            } else {
                window.addEventListener("deviceorientation", handleOrientation, true);
            }
        }
        return () => window.removeEventListener("deviceorientation", handleOrientation, true);
    }, []);

    const needleAngle = qiblaAngle != null && heading != null ? qiblaAngle - heading : qiblaAngle ?? 0;
    const isAligned = qiblaAngle != null && heading != null && Math.abs(((needleAngle + 180) % 360) - 180) < 5;

    return (
        <div style={{ maxWidth: 360, margin: "0 auto", padding: "2rem 1rem", fontFamily: "var(--font-sans)" }}>

            {permissionState === "idle" && (
                <button
                    onClick={requestLocation}
                    style={{
                        width: "100%",
                        padding: "10px 0",
                        fontSize: 15,
                        fontWeight: 500,
                        cursor: "pointer",
                        borderRadius: "var(--border-radius-md)",
                        border: "0.5px solid var(--color-border-secondary)",
                        background: "var(--color-background-secondary)",
                        color: "var(--color-text-primary)",
                    }}
                >
                    Find My Qibla Direction
                </button>
            )}

            {permissionState === "loading" && (
                <p style={{ color: "var(--color-text-secondary)", textAlign: "center", fontSize: 14 }}>
                    Getting your location...
                </p>
            )}

            {error && (
                <div style={{
                    padding: "10px 14px",
                    background: "var(--color-background-danger)",
                    color: "var(--color-text-danger)",
                    borderRadius: "var(--border-radius-md)",
                    fontSize: 13,
                }}>
                    {error}
                </div>
            )}

            {qiblaAngle != null && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                    {/* Compass */}
                    <div style={{ position: "relative", width: 240, height: 240 }}>
                        <svg viewBox="0 0 240 240" width="240" height="240">
                            {/* Outer ring */}
                            <circle cx="120" cy="120" r="115" fill="none" stroke="var(--color-border-secondary)" strokeWidth="1" />
                            <circle cx="120" cy="120" r="108" fill="var(--color-background-secondary)" />

                            {/* Cardinal directions */}
                            {[["N", 0], ["E", 90], ["S", 180], ["W", 270]].map(([label, deg]) => {
                                const r = 90;
                                const a = toRad(deg - 90);
                                const x = 120 + r * Math.cos(a);
                                const y = 120 + r * Math.sin(a);
                                return (
                                    <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                                        fontSize="13" fontWeight="500" fill={label === "N" ? "#D85A30" : "var(--color-text-secondary)"}>
                                        {label}
                                    </text>
                                );
                            })}

                            {/* Tick marks */}
                            {Array.from({ length: 72 }).map((_, i) => {
                                const a = toRad(i * 5 - 90);
                                const inner = i % 9 === 0 ? 96 : 102;
                                return (
                                    <line key={i}
                                        x1={120 + inner * Math.cos(a)} y1={120 + inner * Math.sin(a)}
                                        x2={120 + 108 * Math.cos(a)} y2={120 + 108 * Math.sin(a)}
                                        stroke="var(--color-border-tertiary)" strokeWidth={i % 9 === 0 ? 1.5 : 0.8}
                                    />
                                );
                            })}

                            {/* Qibla needle */}
                            <g transform={`rotate(${needleAngle}, 120, 120)`}>
                                <polygon points="120,28 115,120 120,112 125,120" fill="#1D9E75" opacity="0.9" />
                                <polygon points="120,212 115,120 120,128 125,120" fill="var(--color-text-secondary)" opacity="0.4" />
                                <circle cx="120" cy="120" r="6" fill="var(--color-background-primary)"
                                    stroke="var(--color-border-primary)" strokeWidth="1" />
                            </g>

                            {/* Kaaba icon at tip */}
                            <g transform={`rotate(${needleAngle}, 120, 120) translate(108, 12)`}>
                                <rect x="-8" y="-8" width="16" height="16" rx="3"
                                    fill="#1D9E75" opacity="0.15" />
                                <rect x="-5" y="-5" width="10" height="10" rx="1.5"
                                    fill="none" stroke="#1D9E75" strokeWidth="1.5" />
                            </g>
                        </svg>
                    </div>

                    {/* Angle info */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%" }}>
                        <div style={{
                            background: "var(--color-background-secondary)",
                            borderRadius: "var(--border-radius-md)",
                            padding: "12px 14px",
                        }}>
                            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Qibla angle</p>
                            <p style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
                                {Math.round(qiblaAngle)}°
                            </p>
                        </div>
                        <div style={{
                            background: "var(--color-background-secondary)",
                            borderRadius: "var(--border-radius-md)",
                            padding: "12px 14px",
                        }}>
                            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>
                                {heading != null ? "Compass heading" : "Your coords"}
                            </p>
                            <p style={{ fontSize: heading != null ? 22 : 13, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
                                {heading != null
                                    ? `${Math.round(heading)}°`
                                    : `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                            </p>
                        </div>
                    </div>

                    {isAligned && (
                        <div style={{
                            width: "100%",
                            padding: "10px 14px",
                            background: "var(--color-background-success)",
                            color: "var(--color-text-success)",
                            borderRadius: "var(--border-radius-md)",
                            fontSize: 14,
                            fontWeight: 500,
                            textAlign: "center",
                        }}>
                            Facing Qibla
                        </div>
                    )}

                    {heading == null && (
                        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", textAlign: "center" }}>
                            Compass requires a device with orientation sensor. On iOS, tap once to allow motion access.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}