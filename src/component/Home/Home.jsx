import React from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Navbar/sidebar';
import Banner from './Banner';
import Calendar from 'react-calendar';
import HomeCalender from './HomeCalender';
import PrayerTime from './PrayerTime';
import Ramadan from './Ramadan';
import Team from '../Team/Team';
import LocationPrayer from './LocationPrayer';
// import Calendar from 'react-calendar';

const Home = () => {
    return (
        <div className='mb-20 relative'>
            <Banner></Banner>
            <div className='text-center text-3xl font-bold mt-10'>
                <h3><span className='text-amber-500'>Ramadan</span><br />Prayer Time & Date </h3>
            </div>
            <div className='flex justify-between'>
                <Ramadan className='border'></Ramadan>
                <HomeCalender></HomeCalender>
                <LocationPrayer></LocationPrayer>
            </div>

            <Team></Team>
            
            

        </div>
    );
};

export default Home;