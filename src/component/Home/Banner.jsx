import React from 'react';
import { Link } from 'react-router-dom';
import banner from '../../assets/Banner/banner2.jpg'
import QiblaFinder from '../QiblaDirection/QiblaFinder';

const quotes = [
    "Indeed, with hardship comes ease.",
    "So remember Me; I will remember you.",
    "And Allah is the best of planners.",
    "He found you lost and guided you.",
];

const Banner = () => {
    return (
        <div className="hero min-h-screen relative overflow-hidden">

            <img
                src={banner}
                alt="Ramadan Banner"
                className="w-full h-full object-cover absolute"
            />

            <div className="hero-overlay bg-black/75"></div>

            <div className="hero-content text-white relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-10 max-w-6xl">
                    <div className="p-6 md:p-10 rounded-2xl text-center lg:text-left">
                        <h1 className="mb-6 text-4xl md:text-5xl font-bold leading-tight">
                            Welcome to <br />
                            <span className="text-green-400 text-6xl md:text-7xl drop-shadow-lg">
                                Ramadan Serenity 🌙
                            </span>
                        </h1>

                        <p className="mb-6 text-lg text-gray-200 max-w-2xl">
                            Your spiritual companion for Ramadan. Track your fasting,
                            read Quran, explore prayer times, and stay spiritually
                            connected during the blessed month.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-2xl">
                            {quotes.map((quote, index) => (
                                <div
                                    key={index}
                                    className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base text-gray-100"
                                >
                                    {quote}
                                </div>
                            ))}
                        </div>

                        <Link to="/login">
                            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 transition-all duration-300 rounded-lg font-semibold shadow-lg">
                                Start Your Journey
                            </button>
                        </Link>
                    </div>

                    <div>
                        <QiblaFinder />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;