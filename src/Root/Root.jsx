import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../component/Navbar/Navbar';

const Root = () => {
    return (
        <div className='max-w-7xl m-auto'>
            <Navbar></Navbar>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;