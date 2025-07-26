"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "./logo";
import CountdownTimer from "./timer";

const HeroSection = () => {
  return (
    <section className="w-full bg-grid-white/[0.04] relative flex flex-col items-center justify-center h-screen">
      {/* <div className="absolute pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]" /> */}
      
      <div className="w-full h-full flex flex-col max-w-screen-2xl mx-auto items-start justify-center px-5 md:px-10 relative">
        {/* Logo Section */}
        <div className="flex-shrink-0 mb-8">
          <Logo />
        </div>

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col items-center justify-center w-full space-y-6 hero">
          {/* Title and Description */}
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="font-game-of-squids text-white lg:text-6xl md:text-5xl text-4xl select-none cursor-default">
              InnoFusion <span className="text-red">2.0</span>
            </h1>
          </div>

          {/* Timer Component */}
          <div className="w-full flex items-center justify-center">
            <CountdownTimer
              initialHours={30} 
              initialMinutes={0} 
              initialSeconds={0} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
