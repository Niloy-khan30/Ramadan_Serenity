import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Root from './Root/Root.jsx'
import Home from './component/Home/Home.jsx'
import RamadanCalender from './component/RamadanCalender/RamadanCalender.jsx'
import QuranReader from './component/QuranReader/QuranReader.jsx'
import FastingTracker from './component/FastingTracker/Fastingtracker.jsx'
import Login from './pages/Login/Login.jsx';
import Profile from './pages/Profile/Profile.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/ramadanCalender",
        element: <RamadanCalender></RamadanCalender>
      },
      {
        path: "/quran",
        element: <QuranReader></QuranReader>
      },
      {
        path: "/tracker",
        element: <FastingTracker></FastingTracker>
      },
      {
        path: "/login",
        element: <Login></Login>
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        )
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)