import React from "react";
import Banner from "./Banner";
import Ramadan from "./Ramadan";
import HomeCalender from "./HomeCalender";
import LocationPrayer from "./LocationPrayer";
import Team from "../Team/Team";

const Home = () => {
  return (
    <div className="w-full px-4 lg:px-8 py-8 pb-28 space-y-14">
      <Banner />

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          <span className="text-amber-400">Ramadan</span>
          <br />
          Prayer Time & Date
        </h2>
        <p className="text-gray-300 mt-3">
          Stay aligned with your daily worship schedule.
        </p>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-3">
          <Ramadan />
        </div>

        <div className="xl:col-span-4">
          <HomeCalender />
        </div>

        <div className="xl:col-span-5">
          <LocationPrayer />
        </div>
      </section>

      <Team />
    </div>
  );
};

export default Home;