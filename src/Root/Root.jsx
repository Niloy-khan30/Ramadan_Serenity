import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar/Navbar";
import Sidebar from "../component/Navbar/Sidebar";
import AiChatbox from "../component/AiAssistant/AiChatbox";

const Root = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black text-white">
            <Sidebar />
            <Navbar />

            <main className="w-full lg:pl-12">
                <Outlet />
            </main>

            <AiChatbox />
        </div>
    );
};

export default Root;