import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./HomeCalender.css";

const HomeCalender = () => {
    const [value, onChange] = useState(new Date());

    return (
        <div className="w-full">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-2xl min-h-[520px] flex items-center justify-center">
                <div className="w-full max-w-md">
                    <Calendar
                        onChange={onChange}
                        value={value}
                        className="dark-calendar w-full border-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default HomeCalender;