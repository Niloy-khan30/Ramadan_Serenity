import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../component/Navbar/Navbar';
import Footbar from '../component/Navbar/Footbar';

const Root = () => {
    return (
        <div className='max-w-7xl m-auto'>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footbar></Footbar>
        </div>
    );
};

export default Root;