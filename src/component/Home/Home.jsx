import React from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Navbar/sidebar';
import Banner from './Banner';
import Calendar from 'react-calendar';
import HomeCalender from './HomeCalender';
import PrayerTime from './PrayerTime';
import Ramadan from './Ramadan';
import Team from '../Team/Team';
// import Calendar from 'react-calendar';

const Home = () => {
    return (
        <div className='mb-20 relative'>
            <Banner></Banner>
            <div className='flex justify-between '>
                <Ramadan className='border'></Ramadan>
                <HomeCalender></HomeCalender>
                <PrayerTime></PrayerTime>
            </div>

            <Team></Team>
            
            

        </div>
    );
};

export default Home;