import React, { useEffect, useState } from "react";
import axios from "axios";

const QuranReader = () => {
    const [surahs, setSurahs] = useState([]);
    const [selectedSurah, setSelectedSurah] = useState(1);
    const [ayahs, setAyahs] = useState([]);
    const [loading, setLoading] = useState(false);

    // fetch all surahs
    useEffect(() => {
        axios
            .get("https://api.alquran.cloud/v1/surah")
            .then((res) => setSurahs(res.data.data));
    }, []);

    // fetch ayahs of selected surah
    useEffect(() => {
        setLoading(true);
        axios
            .get(`https://api.alquran.cloud/v1/surah/${selectedSurah}`)
            .then((res) => {
                setAyahs(res.data.data.ayahs);
                setLoading(false);
            });
    }, [selectedSurah]);

    console.log(selectedSurah)

    return (
        <div className="max-w-4xl mx-auto p-6 mb-20">

            <h1 className="text-3xl font-bold text-center mb-6">
                **AL QURAN**
            </h1>

            {/* Surah Selector */}
            <select
                className="w-full p-3 border rounded mb-6"
                value={selectedSurah}
                onChange={(e) => setSelectedSurah(e.target.value)}
            >
                {surahs.map((surah) => (
                    <option key={surah.number} value={surah.number}>
                        {surah.number}. {surah.englishName}
                    </option>
                ))}
            </select>

            {/* Ayahs */}
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="space-y-4 text-right text-2xl leading-loose">
                    {ayahs.map((ayah) => (
                        <p key={ayah.number} className="border-b pb-3">
                            {ayah.text} ۝{ayah.numberInSurah}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuranReader;