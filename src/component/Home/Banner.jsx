import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Navbar/sidebar';
import banner from '../../assets/Banner/banner.jpg'

const Banner = () => {
    return (
        <div className="hero min-h-screen">
            <img src={banner} alt="" className='w-full'/>
            <div className="hero-overlay"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="">
                    <h1 className="mb-5 text-5xl font-bold">Welcome to <br /><span className='text-6xl'>Ramadan Cenerity</span></h1>
                    <p className="mb-5">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>
                    <Sidebar></Sidebar>
                </div>
            </div>
        </div>
    );
};

export default Banner;