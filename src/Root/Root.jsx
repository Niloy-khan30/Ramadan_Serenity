import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../component/Navbar/Navbar';
import Footbar from '../component/Navbar/Footbar';
import Sidebar from '../component/Navbar/Sidebar';

const Root = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white">
            <Sidebar />
            <Navbar />
            <main className="w-full lg:pl-12">
                <Outlet />
            </main>
            <Footbar />
        </div>
    );
};

export default Root;