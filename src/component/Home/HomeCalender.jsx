import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // keep default base styles



const HomeCalender = () => {

    const [value, onChange] = useState(new Date());

    return (

            <div className="mt-10  h-[350px]">

                <div className="h-full">
                    <Calendar
                        onChange={onChange}
                        value={value}
                        className="w-full border-none"
                    />

                </div>



            </div>

        
    );
};

export default HomeCalender;