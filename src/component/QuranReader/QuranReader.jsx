import React, { useEffect, useState } from "react";

const QuranReader = () => {
    const [surahs, setSurahs] = useState([]);
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [ayahs, setAyahs] = useState([]);

    useEffect(() => {
        fetch("https://api.alquran.cloud/v1/surah")
            .then((res) => res.json())
            .then((data) => setSurahs(data.data || []))
            .catch((err) => console.error("Failed to fetch surahs:", err));
    }, []);

    const handleSurahChange = async (e) => {
        const surahNumber = e.target.value;
        const surah = surahs.find((s) => String(s.number) === surahNumber);
        setSelectedSurah(surah);

        try {
            const [arabicRes, englishRes] = await Promise.all([
                fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
                fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
            ]);

            const arabicData = await arabicRes.json();
            const englishData = await englishRes.json();

            const combinedAyahs = arabicData.data.ayahs.map((arabicAyah, index) => ({
                number: arabicAyah.number,
                numberInSurah: arabicAyah.numberInSurah,
                arabic: arabicAyah.text,
                english: englishData.data.ayahs[index]?.text || "",
            }));

            setAyahs(combinedAyahs);
        } catch (error) {
            console.error("Failed to fetch ayahs:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white px-4 py-10 pb-28">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-green-400 font-semibold tracking-widest uppercase mb-2">
                        Quran Reader
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">Al Quran</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Read the Quran in Arabic with English meaning.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                    <label className="block text-sm text-gray-300 mb-2">
                        Select Surah
                    </label>

                    <select
                        onChange={handleSurahChange}
                        defaultValue=""
                        className="w-full bg-slate-950/70 border border-white/20 rounded-2xl px-4 py-4 text-white outline-none focus:border-emerald-400"
                    >
                        <option value="" disabled className="text-black">
                            Choose a Surah
                        </option>

                        {surahs.map((surah) => (
                            <option
                                key={surah.number}
                                value={surah.number}
                                className="text-black"
                            >
                                {surah.number}. {surah.englishName} — {surah.name}
                            </option>
                        ))}
                    </select>

                    {selectedSurah && (
                        <div className="mt-8 bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-5 text-center">
                            <h2 className="text-3xl font-bold text-emerald-300">
                                {selectedSurah.englishName}
                            </h2>

                            <p className="text-4xl mt-3 font-serif text-white">
                                {selectedSurah.name}
                            </p>

                            <p className="text-gray-300 mt-3">
                                {selectedSurah.englishNameTranslation}
                            </p>

                            <p className="text-gray-400 mt-1">
                                Revelation Type: {selectedSurah.revelationType}
                            </p>
                        </div>
                    )}

                    <div className="mt-8 space-y-5 max-h-[650px] overflow-y-auto pr-2">
                        {ayahs.length > 0 ? (
                            ayahs.map((ayah) => (
                                <div
                                    key={ayah.number}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold">
                                            {ayah.numberInSurah}
                                        </div>

                                        <div className="flex-1">
                                            <p
                                                dir="rtl"
                                                className="text-3xl leading-loose text-right text-white font-serif mb-4"
                                            >
                                                {ayah.arabic}
                                            </p>

                                            <p className="text-gray-300 leading-relaxed border-t border-white/10 pt-4">
                                                {ayah.english}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-16">
                                Select a Surah to begin reading.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuranReader;