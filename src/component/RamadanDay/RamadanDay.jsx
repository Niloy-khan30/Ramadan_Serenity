import React, { useState } from 'react';

const RamadanDay = ({ day, xkey, prayertime }) => {
    // console.log(day)
    const [praytime, setPraytime] = useState(null)
    
    const { timings, date, meta } = day

    




    return (
        <div className="card w-full max-w-md mx-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white shadow-2xl rounded-2xl border border-purple-500/30">
            <div className="card-body space-y-5">
                <h2 className="text-2xl font-bold text-center text-yellow-400">
                    🌙 {date.hijri.month.en} Day {date.hijri.day}
                </h2>

                <div className="divider divider-warning my-1"></div>

                <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                        <span className="font-semibold text-gray-300">Gregorian Date:</span>
                        <span>{date.readable}</span>
                    </p>

                    <p className="flex justify-between">
                        <span className="font-semibold text-gray-300">Gregorian Day:</span>
                        <span>{date.gregorian.weekday.en}</span>
                    </p>

                    <p className="flex justify-between">
                        <span className="font-semibold text-gray-300">Hijri Date:</span>
                        <span>{date.hijri.date}</span>
                    </p>

                    <p className="flex justify-between">
                        <span className="font-semibold text-gray-300">Hijri Month:</span>
                        <span className="text-yellow-400 font-semibold">{date.hijri.month.en}</span>
                    </p>

                    <button onClick={() => prayertime(timings)}><a href="#my_modal_8" className="btn">Prayer Time</a></button>






                </div>
            </div>
        </div>
    );
};

export default RamadanDay;