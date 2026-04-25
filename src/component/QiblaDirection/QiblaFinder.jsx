import React, { useEffect, useState } from "react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

const calculateQiblaDirection = (lat, lng) => {
  const userLat = toRad(lat);
  const kaabaLat = toRad(KAABA_LAT);
  const longitudeDiff = toRad(KAABA_LNG - lng);

  const y = Math.sin(longitudeDiff);
  const x =
    Math.cos(userLat) * Math.tan(kaabaLat) -
    Math.sin(userLat) * Math.cos(longitudeDiff);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

const QiblaFinder = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [heading, setHeading] = useState(null);
  const [error, setError] = useState("");
  const [compassEnabled, setCompassEnabled] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Location is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setQiblaDirection(calculateQiblaDirection(latitude, longitude));
      },
      () => setError("Please allow location access."),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleOrientation = (event) => {
    let currentHeading = null;

    if (event.webkitCompassHeading !== undefined) {
      currentHeading = event.webkitCompassHeading;
    } else if (event.alpha !== null) {
      currentHeading = 360 - event.alpha;
    }

    if (currentHeading !== null) {
      setHeading((currentHeading + 360) % 360);
    }
  };

  const enableCompass = async () => {
    try {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        const permission = await DeviceOrientationEvent.requestPermission();

        if (permission !== "granted") {
          setError("Compass permission was denied.");
          return;
        }
      }

      window.addEventListener("deviceorientation", handleOrientation, true);
      setCompassEnabled(true);
      setError("");
    } catch {
      setError("Compass could not be enabled.");
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const rotation =
    qiblaDirection !== null && heading !== null
      ? qiblaDirection - heading
      : qiblaDirection || 0;

  const isAligned =
    qiblaDirection !== null &&
    heading !== null &&
    Math.abs(((rotation + 180) % 360) - 180) < 6;

  return (
    <div className="w-full max-w-sm mx-auto text-white">
      <div className="rounded-[2rem] bg-black/70 border border-yellow-900/40 backdrop-blur-xl p-6 shadow-2xl">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-yellow-300">
            Qibla Direction
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Qibla angle:{" "}
            <span className="text-emerald-300 font-semibold">
              {qiblaDirection !== null ? `${Math.round(qiblaDirection)}°` : "--"}
            </span>
          </p>
        </div>

        <div className="relative mx-auto h-72 w-72 rounded-full overflow-hidden bg-black">
          {/* outer antique rim */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_25%,#f6d27a_0%,#9a5d16_20%,#2a1707_38%,#070403_72%,#000_100%)]" />
          <div className="absolute inset-[10px] rounded-full bg-[radial-gradient(circle,#1a0f05_0%,#0b0704_48%,#000_100%)] border border-yellow-700/60" />

          {/* fine engraved rings */}
          <div className="absolute inset-[24px] rounded-full border border-yellow-600/50" />
          <div className="absolute inset-[36px] rounded-full border border-yellow-800/60" />
          <div className="absolute inset-[52px] rounded-full border border-yellow-700/40" />
          <div className="absolute inset-[72px] rounded-full border border-yellow-900/60" />

          {/* tick marks */}
          {[...Array(72)].map((_, i) => {
            const major = i % 6 === 0;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 origin-bottom"
                style={{
                  height: "132px",
                  transform: `translate(-50%, -100%) rotate(${i * 5}deg)`,
                }}
              >
                <div
                  className={`mx-auto ${
                    major
                      ? "h-5 w-[2px] bg-yellow-300/90"
                      : "h-2 w-[1px] bg-yellow-600/70"
                  }`}
                />
              </div>
            );
          })}

          {/* degree labels */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
            (deg) => (
              <div
                key={deg}
                className="absolute left-1/2 top-1/2 text-[10px] text-yellow-700 font-semibold"
                style={{
                  transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-112px) rotate(-${deg}deg)`,
                }}
              >
                {deg}
              </div>
            )
          )}

          {/* cardinal labels */}
          <span className="absolute top-[42px] left-1/2 -translate-x-1/2 text-2xl font-black text-yellow-200">
            N
          </span>
          <span className="absolute bottom-[42px] left-1/2 -translate-x-1/2 text-2xl font-black text-yellow-200">
            S
          </span>
          <span className="absolute left-[42px] top-1/2 -translate-y-1/2 text-2xl font-black text-yellow-200">
            W
          </span>
          <span className="absolute right-[42px] top-1/2 -translate-y-1/2 text-2xl font-black text-yellow-200">
            E
          </span>

          {/* ornate center rose */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-40 w-40">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute left-1/2 top-1/2 origin-bottom ${
                    i % 2 === 0
                      ? "h-20 w-[2px] bg-yellow-600/70"
                      : "h-14 w-[1px] bg-yellow-800/70"
                  }`}
                  style={{
                    transform: `translate(-50%, -100%) rotate(${i * 22.5}deg)`,
                  }}
                />
              ))}
              <div className="absolute inset-8 rounded-full border border-yellow-700/40" />
              <div className="absolute inset-14 rounded-full border border-yellow-900/60" />
            </div>
          </div>

          {/* slim antique needle */}
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div
              className="absolute left-1/2 top-1/2 h-[128px] w-[8px] -translate-x-1/2 -translate-y-full"
              style={{
                clipPath: "polygon(50% 0%, 100% 100%, 50% 86%, 0% 100%)",
                background:
                  "linear-gradient(to bottom, #f8d98a, #a56818 55%, #3a1f08)",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[112px] w-[7px] -translate-x-1/2"
              style={{
                clipPath: "polygon(50% 100%, 100% 0%, 50% 14%, 0% 0%)",
                background:
                  "linear-gradient(to bottom, #3a1f08, #9a5d16 50%, #e0b45b)",
              }}
            />

            <div className="absolute left-1/2 top-[18px] -translate-x-1/2 text-xl drop-shadow-lg">
              🕋
            </div>
          </div>

          {/* center pin */}
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f9e3a2,#a56818_55%,#2d1706)] border border-yellow-200/70 shadow-xl" />

          {/* glass lighting */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.20),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%,rgba(0,0,0,0.55))] pointer-events-none" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="rounded-2xl bg-yellow-900/20 border border-yellow-700/30 p-3 text-center">
            <p className="text-xs text-gray-400">Qibla Angle</p>
            <p className="text-2xl font-bold text-yellow-300">
              {qiblaDirection !== null ? `${Math.round(qiblaDirection)}°` : "--"}
            </p>
          </div>

          <div className="rounded-2xl bg-yellow-900/20 border border-yellow-700/30 p-3 text-center">
            <p className="text-xs text-gray-400">Phone Heading</p>
            <p className="text-2xl font-bold text-emerald-300">
              {heading !== null ? `${Math.round(heading)}°` : "--"}
            </p>
          </div>
        </div>

        {!compassEnabled && (
          <button
            onClick={enableCompass}
            className="mt-4 w-full rounded-2xl bg-yellow-700 hover:bg-yellow-600 px-5 py-3 font-semibold transition text-white shadow-lg shadow-yellow-900/30"
          >
            Enable Live Compass
          </button>
        )}

        {isAligned && (
          <div className="mt-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 px-4 py-3 text-center text-emerald-300 font-semibold">
            You are facing Qibla ✅
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-400 text-center leading-relaxed">
            {error}
          </p>
        )}

        <p className="mt-4 text-[11px] text-gray-500 text-center leading-relaxed">
          Test on mobile for live compass. Compare the Qibla angle with a trusted
          Qibla app to verify.
        </p>
      </div>
    </div>
  );
};

export default QiblaFinder;