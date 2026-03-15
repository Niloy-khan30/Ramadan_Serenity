import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Navbar/sidebar';
import banner from '../../assets/Banner/banner.jpg'
import QiblaFinder from '../QiblaDirection/QiblaFinder';

const Banner = () => {
    return (
        <div className="hero min-h-screen relative">

            {/* Background Image */}
            <img
                src={banner}
                alt="Ramadan Banner"
                className="w-full h-full object-cover absolute"
            />

            {/* Overlay */}
            <div className="hero-overlay bg-black/70"></div>

            {/* Content */}
            <div className="hero-content text-white relative z-10">

                <div className="flex flex-col lg:flex-row items-center gap-10 max-w-6xl">

                    {/* Left Content */}
                    <div className=" p-10 rounded-2xl  text-center lg:text-left">

                        <h1 className="mb-6 text-4xl md:text-5xl font-bold leading-tight">
                            Welcome to <br />
                            <span className="text-green-400 text-6xl md:text-7xl drop-shadow-lg">
                                Ramadan Serenity 🌙
                            </span>
                        </h1>

                        <p className="mb-6 text-lg text-gray-200">
                            Your spiritual companion for Ramadan. Track your fasting,
                            read Quran, explore prayer times, and stay spiritually
                            connected during the blessed month.
                        </p>

                        <button className="px-6 py-3 bg-green-500 hover:bg-green-600 transition-all duration-300 rounded-lg font-semibold shadow-lg">
                            Start Your Journey
                        </button>

                    </div>

                    {/* Right Side Qibla */}
                    <div className="">
                        <QiblaFinder />
                    </div>

                </div>

            </div>
        </div>
    );
}
export default Banner;