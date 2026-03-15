import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './Root/Root.jsx'
import Home from './component/Home/Home.jsx'
import RamadanCalender from './component/RamadanCalender/RamadanCalender.jsx'
import QuranReader from './component/QuranReader/QuranReader.jsx'
import FastingTracker from './component/FastingTracker/Fastingtracker.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children:[
      {
        path:"/",
        element:<Home></Home>
      },
      {
        path:"/ramadanCalender",
        element:<RamadanCalender></RamadanCalender>
      },
      {
        path:"/quran",
        element:<QuranReader></QuranReader>
      },
      {
        path: "/tracker",
        element:<FastingTracker></FastingTracker>
      }

    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
