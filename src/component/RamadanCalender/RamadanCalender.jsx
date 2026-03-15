import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

// ── Constants ──────────────────────────────────────────────
const HIJRI_MONTHS = [
    { num: 1, en: "Muharram", ar: "مُحَرَّم", icon: "🌑" },
    { num: 2, en: "Safar", ar: "صَفَر", icon: "🌒" },
    { num: 3, en: "Rabi' al-Awwal", ar: "رَبِيع الأوَّل", icon: "🌿" },
    { num: 4, en: "Rabi' al-Thani", ar: "رَبِيع الثَّانِي", icon: "🌱" },
    { num: 5, en: "Jumada al-Ula", ar: "جُمَادَى الأُولَى", icon: "☀️" },
    { num: 6, en: "Jumada al-Akhira", ar: "جُمَادَى الآخِرَة", icon: "🌤️" },
    { num: 7, en: "Rajab", ar: "رَجَب", icon: "⭐" },
    { num: 8, en: "Sha'ban", ar: "شَعْبَان", icon: "🌙" },
    { num: 9, en: "Ramadan", ar: "رَمَضَان", icon: "🌙" },
    { num: 10, en: "Shawwal", ar: "شَوَّال", icon: "🎉" },
    { num: 11, en: "Dhul Qa'dah", ar: "ذُو القَعْدَة", icon: "🕌" },
    { num: 12, en: "Dhul Hijjah", ar: "ذُو الحِجَّة", icon: "🕋" },
];

const PRAYERS = [
    { key: "Fajr", label: "Fajr (Sehri)", highlight: true },
    { key: "Sunrise", label: "Sunrise", highlight: false },
    { key: "Dhuhr", label: "Dhuhr", highlight: false },
    { key: "Asr", label: "Asr", highlight: false },
    { key: "Maghrib", label: "Maghrib (Iftar)", highlight: true },
    { key: "Isha", label: "Isha", highlight: false },
];

// ── Helpers ────────────────────────────────────────────────
const getHijriYear = (gYear) => gYear - 579;

const isEidDay = (day) => {
    const m = day.date.hijri.month.number;
    const d = day.date.hijri.day;
    if (m === 10 && d === "1") return { type: "fitr", label: "Eid ul-Fitr" };
    if (m === 12 && ["10", "11", "12"].includes(d)) return { type: "adha", label: "Eid ul-Adha" };
    if (m === 1 && d === "1") return { type: "newyear", label: "Islamic New Year" };
    if (m === 1 && d === "10") return { type: "ashura", label: "Day of Ashura" };
    if (m === 3 && d === "12") return { type: "mawlid", label: "Mawlid al-Nabi" };
    if (m === 7 && d === "27") return { type: "isra", label: "Isra & Mi'raj" };
    if (m === 8 && d === "15") return { type: "shaban", label: "Shab-e-Barat" };
    return null;
};

const EID_STYLES = {
    fitr: { card: "from-amber-950/90 to-slate-900 border-amber-500/60 shadow-amber-500/15", ribbon: "bg-amber-500 text-slate-900", dayColor: "text-amber-400", labelColor: "text-amber-300", badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    adha: { card: "from-violet-950/90 to-slate-900 border-violet-500/60 shadow-violet-500/15", ribbon: "bg-violet-600 text-white", dayColor: "text-violet-400", labelColor: "text-violet-300", badgeBg: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
    newyear: { card: "from-emerald-950/90 to-slate-900 border-emerald-500/50 shadow-emerald-500/10", ribbon: "bg-emerald-600 text-white", dayColor: "text-emerald-400", labelColor: "text-emerald-300", badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    ashura: { card: "from-sky-950/90 to-slate-900 border-sky-500/50 shadow-sky-500/10", ribbon: "bg-sky-600 text-white", dayColor: "text-sky-400", labelColor: "text-sky-300", badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
    mawlid: { card: "from-rose-950/90 to-slate-900 border-rose-500/50 shadow-rose-500/10", ribbon: "bg-rose-600 text-white", dayColor: "text-rose-400", labelColor: "text-rose-300", badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
    isra: { card: "from-indigo-950/90 to-slate-900 border-indigo-500/50 shadow-indigo-500/10", ribbon: "bg-indigo-600 text-white", dayColor: "text-indigo-400", labelColor: "text-indigo-300", badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" },
    shaban: { card: "from-fuchsia-950/90 to-slate-900 border-fuchsia-500/50 shadow-fuchsia-500/10", ribbon: "bg-fuchsia-600 text-white", dayColor: "text-fuchsia-400", labelColor: "text-fuchsia-300", badgeBg: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30" },
};

// ── Main Component ─────────────────────────────────────────
export default function HijriCalendar() {
    const now = new Date();
    const hijriYear = getHijriYear(now.getFullYear());

    const [city, setCity] = useState("Dhaka");
    const [inputCity, setInputCity] = useState("Dhaka");
    const [coordinates, setCoordinates] = useState({ lat: 23.8103, lon: 90.4125 });
    const [currentMonth, setCurrentMonth] = useState(9); // start at Ramadan
    const [monthCache, setMonthCache] = useState({});    // { "9": [...days] }
    const [selectedDay, setSelectedDay] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [direction, setDirection] = useState(null);  // "left" | "right" for animation
    const [animating, setAnimating] = useState(false);
    const gridRef = useRef(null);

    // ── Fetch one Hijri month ──
    const fetchMonth = useCallback(async (month) => {
        const res = await axios.get(
            `https://api.aladhan.com/v1/hijriCalendar/${hijriYear}/${month}?latitude=${coordinates.lat}&longitude=${coordinates.lon}&method=1`
        );
        return res.data.data;
    }, [coordinates, hijriYear]);

    // ── Load month (from cache or API) ──
    const loadMonth = useCallback(async (month) => {
        const key = `${month}_${coordinates.lat}_${coordinates.lon}`;
        if (monthCache[key]) return;
        setLoading(true);
        setError("");
        try {
            const data = await fetchMonth(month);
            setMonthCache(prev => ({ ...prev, [key]: data }));
        } catch {
            setError("Failed to load prayer times. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [coordinates, fetchMonth, monthCache]);

    // Load current month on mount / coord change
    useEffect(() => {
        setMonthCache({});
    }, [coordinates]);

    useEffect(() => {
        loadMonth(currentMonth);
    }, [currentMonth, coordinates]); // eslint-disable-line

    // Prefetch adjacent months silently
    useEffect(() => {
        const prev = currentMonth === 1 ? 12 : currentMonth - 1;
        const next = currentMonth === 12 ? 1 : currentMonth + 1;
        const keyPrev = `${prev}_${coordinates.lat}_${coordinates.lon}`;
        const keyNext = `${next}_${coordinates.lat}_${coordinates.lon}`;
        if (!monthCache[keyPrev]) fetchMonth(prev).then(data => setMonthCache(p => ({ ...p, [keyPrev]: data }))).catch(() => { });
        if (!monthCache[keyNext]) fetchMonth(next).then(data => setMonthCache(p => ({ ...p, [keyNext]: data }))).catch(() => { });
    }, [currentMonth, coordinates]); // eslint-disable-line

    // ── City search ──
    const getCoordinates = async () => {
        if (!inputCity.trim()) return;
        try {
            setLoading(true);
            setError("");
            const res = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputCity)}`
            );
            if (res.data.length > 0) {
                setCoordinates({ lat: res.data[0].lat, lon: res.data[0].lon });
                setCity(inputCity);
            } else {
                setError("Location not found. Try another city.");
                setLoading(false);
            }
        } catch {
            setError("Failed to fetch location.");
            setLoading(false);
        }
    };

    // ── Month navigation ──
    const navigate = (dir) => {
        if (animating || loading) return;
        setDirection(dir);
        setAnimating(true);
        setTimeout(() => {
            setCurrentMonth(m => dir === "next" ? (m === 12 ? 1 : m + 1) : (m === 1 ? 12 : m - 1));
            setAnimating(false);
            setDirection(null);
        }, 220);
    };

    const cacheKey = `${currentMonth}_${coordinates.lat}_${coordinates.lon}`;
    const activeDays = monthCache[cacheKey] || [];
    const monthInfo = HIJRI_MONTHS[currentMonth - 1];
    const eidDays = activeDays.filter(d => isEidDay(d));

    const isRamadan = currentMonth === 9;
    const isShawwal = currentMonth === 10;
    const isDhulHijja = currentMonth === 12;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-10 pb-20">

            {/* ── Header ── */}
            <div className="text-center mb-8 w-full max-w-4xl">
                <p className="text-amber-400 text-xs tracking-widest uppercase mb-1.5 font-semibold">
                    Full Hijri Calendar · {hijriYear} AH
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-1">
                    🕌 Islamic Calendar
                </h1>
                <p className="text-slate-400 text-sm font-light">
                    Prayer times for <span className="text-amber-300">{city}</span>
                </p>
            </div>

            {/* ── Search ── */}
            <div className="flex gap-2 w-full max-w-sm mb-1">
                <input
                    type="text"
                    value={inputCity}
                    onChange={e => setInputCity(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && getCoordinates()}
                    placeholder="Enter city name..."
                    className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
                />
                <button
                    onClick={getCoordinates}
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
                >
                    {loading ? "..." : "Search"}
                </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-1 mb-1">{error}</p>}

            {/* ── Month Pill Tabs (all 12) ── */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-6 mb-6 w-full max-w-4xl px-2">
                {HIJRI_MONTHS.map((m) => (
                    <button
                        key={m.num}
                        onClick={() => { setDirection(m.num > currentMonth ? "next" : "prev"); setAnimating(true); setTimeout(() => { setCurrentMonth(m.num); setAnimating(false); setDirection(null); }, 180); }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${currentMonth === m.num
                                ? "bg-amber-500 text-slate-900 font-bold shadow-md shadow-amber-500/25"
                                : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-500/40 hover:text-slate-200"
                            }`}
                    >
                        <span>{m.icon}</span> {m.en}
                    </button>
                ))}
            </div>

            {/* ── Month Header with Prev / Next ── */}
            <div className="flex items-center justify-between w-full max-w-4xl mb-4 px-1">
                <button
                    onClick={() => navigate("prev")}
                    disabled={loading || animating}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm transition-all"
                >
                    ← {HIJRI_MONTHS[currentMonth === 1 ? 11 : currentMonth - 2].en}
                </button>

                <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
                        <span className="text-2xl">{monthInfo.icon}</span>
                        {monthInfo.en}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">{monthInfo.ar} · {hijriYear} AH</div>
                    {isRamadan && <div className="text-amber-400 text-xs mt-1 font-medium">The Holy Month of Fasting 🌙</div>}
                    {isShawwal && <div className="text-amber-400 text-xs mt-1 font-medium">Month of Eid ul-Fitr 🎉</div>}
                    {isDhulHijja && <div className="text-violet-400 text-xs mt-1 font-medium">Month of Hajj & Eid ul-Adha 🕋</div>}
                </div>

                <button
                    onClick={() => navigate("next")}
                    disabled={loading || animating}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm transition-all"
                >
                    {HIJRI_MONTHS[currentMonth === 12 ? 0 : currentMonth].en} →
                </button>
            </div>

            {/* ── Special Days Banner ── */}
            {!loading && eidDays.length > 0 && (
                <div className="w-full max-w-4xl mb-4 space-y-2">
                    {eidDays.map((d, i) => {
                        const eid = isEidDay(d);
                        const st = EID_STYLES[eid.type];
                        return (
                            <div key={i} className={`flex items-center gap-3 border rounded-2xl px-5 py-3 ${st.badgeBg}`}>
                                <span className="text-xl">✨</span>
                                <div>
                                    <p className="font-semibold text-sm">{eid.label}</p>
                                    <p className="text-xs opacity-70">{d.date.readable}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Loader ── */}
            {loading && (
                <div className="flex justify-center items-center py-24">
                    <div className="w-10 h-10 border-2 border-slate-700 border-t-amber-400 rounded-full animate-spin" />
                </div>
            )}

            {/* ── Calendar Grid ── */}
            {!loading && (
                <div
                    ref={gridRef}
                    style={{
                        opacity: animating ? 0 : 1,
                        transform: animating
                            ? `translateX(${direction === "next" ? "-30px" : "30px"})`
                            : "translateX(0px)",
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                    }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full max-w-4xl"
                >
                    {activeDays.map((day, index) => {
                        const eid = isEidDay(day);
                        const st = eid ? EID_STYLES[eid.type] : null;

                        return (
                            <div
                                key={index}
                                onClick={() => setSelectedDay(day)}
                                className={`relative rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 overflow-hidden border shadow-lg ${eid
                                        ? `bg-gradient-to-br ${st.card}`
                                        : "bg-slate-800/70 border-slate-700/60 hover:border-amber-500/30 hover:bg-slate-800 shadow-black/10"
                                    }`}
                            >
                                {/* Special day ribbon */}
                                {eid && (
                                    <span className={`absolute top-0 right-0 text-[8px] font-bold uppercase tracking-wide px-2 py-1 rounded-bl-xl rounded-tr-2xl leading-tight text-center max-w-[70px] ${st.ribbon}`}>
                                        {eid.label}
                                    </span>
                                )}

                                {/* Day number */}
                                <div className={`text-2xl font-bold leading-none mb-0.5 ${eid ? st.dayColor : "text-amber-400"}`}>
                                    {day.date.hijri.day}
                                </div>
                                <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">
                                    {day.date.hijri.month.en}
                                </div>

                                {eid && (
                                    <div className={`text-[10px] font-semibold mb-1.5 leading-tight ${st.labelColor}`}>
                                        {eid.label}
                                    </div>
                                )}

                                <div className="text-slate-500 text-[10px] mb-3 leading-tight">
                                    {day.date.readable}
                                </div>

                                {/* Sehri / Iftar badges — Ramadan only */}
                                {isRamadan && (
                                    <div className="space-y-1.5">
                                        {[
                                            { label: "Sehri", time: day.timings.Fajr },
                                            { label: "Iftar", time: day.timings.Maghrib },
                                        ].map(({ label, time }) => (
                                            <div key={label} className="flex justify-between items-center bg-black/20 rounded-lg px-2.5 py-1.5">
                                                <span className="text-slate-400 text-[10px]">{label}</span>
                                                <span className="text-slate-200 text-[10px] font-semibold tabular-nums">
                                                    {time?.split(" ")[0]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Prayer Detail Modal ── */}
            {selectedDay && (() => {
                const eid = isEidDay(selectedDay);
                const st = eid ? EID_STYLES[eid.type] : null;
                return (
                    <div
                        className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 px-4"
                        onClick={() => setSelectedDay(null)}
                    >
                        <div
                            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm"
                            >
                                ✕
                            </button>

                            {eid && (
                                <span className={`inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border ${st.badgeBg}`}>
                                    ✨ {eid.label}
                                </span>
                            )}

                            <h2 className="text-2xl font-bold text-amber-400 mb-0.5">
                                {selectedDay.date.hijri.day} {selectedDay.date.hijri.month.en} {selectedDay.date.hijri.year} AH
                            </h2>
                            <p className="text-slate-400 text-sm mb-1">{selectedDay.date.readable}</p>
                            <p className="text-sky-400 text-xs uppercase tracking-widest mb-5">📍 {city}</p>

                            <div className="space-y-2">
                                {PRAYERS.map(({ key, label, highlight }) => {
                                    const showHighlight = highlight && isRamadan;
                                    const displayLabel = isRamadan ? label : label.replace(" (Sehri)", "").replace(" (Iftar)", "");
                                    return (
                                        <div
                                            key={key}
                                            className={`flex justify-between items-center rounded-xl px-4 py-2.5 ${showHighlight
                                                    ? "bg-amber-500/10 border border-amber-500/20"
                                                    : "bg-slate-800/60"
                                                }`}
                                        >
                                            <span className={`text-sm ${showHighlight ? "text-amber-300" : "text-slate-400"}`}>
                                                {displayLabel}
                                            </span>
                                            <span className={`text-sm font-semibold tabular-nums ${showHighlight ? "text-amber-400" : "text-slate-200"}`}>
                                                {selectedDay.timings[key]?.split(" ")[0] ?? "—"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Navigate days inside modal */}
                            <div className="flex gap-2 mt-4">
                                {(() => {
                                    const idx = activeDays.findIndex(d => d.date.readable === selectedDay.date.readable);
                                    return (
                                        <>
                                            <button
                                                disabled={idx <= 0}
                                                onClick={() => setSelectedDay(activeDays[idx - 1])}
                                                className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs py-2 rounded-xl transition-colors"
                                            >
                                                ← Prev Day
                                            </button>
                                            <button
                                                disabled={idx >= activeDays.length - 1}
                                                onClick={() => setSelectedDay(activeDays[idx + 1])}
                                                className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs py-2 rounded-xl transition-colors"
                                            >
                                                Next Day →
                                            </button>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}