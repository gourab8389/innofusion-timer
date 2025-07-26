"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface TimerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}

const CountdownTimer = ({
  initialHours = 30,
  initialMinutes = 0,
  initialSeconds = 0,
}: TimerProps) => {
  
  const searchParams = useSearchParams();

  // Initialize time from URL params or use default values
  const getInitialTime = () => {
    const urlHours = searchParams.get("h");
    const urlMinutes = searchParams.get("m");
    const urlSeconds = searchParams.get("s");

    return {
      hours: urlHours ? parseInt(urlHours) : initialHours,
      minutes: urlMinutes ? parseInt(urlMinutes) : initialMinutes,
      seconds: urlSeconds ? parseInt(urlSeconds) : initialSeconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Update URL params when time changes
  const updateUrlParams = (hours: number, minutes: number, seconds: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("h", hours.toString());
    params.set("m", minutes.toString());
    params.set("s", seconds.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  const getTotalSeconds = (h: number, m: number, s: number) =>
    h * 3600 + m * 60 + s;



  const getCheckpoint = () => {
    const hoursLeft =
      timeLeft.hours + timeLeft.minutes / 60 + timeLeft.seconds / 3600;

    if (hoursLeft > 25)
      return { name: "Checkpoint 1: Ends at 03:00 PM", stage: 1 };
    if (hoursLeft > 20)
      return { name: "Checkpoint 2: Ends at 08:00 PM", stage: 2 };
    if (hoursLeft > 15)
      return { name: "Checkpoint 3: Ends at 01:00 AM", stage: 3 };
    if (hoursLeft > 10)
      return { name: "Checkpoint 4: Ends at 6:00 AM", stage: 4 };
    if (hoursLeft > 5)
      return { name: "Checkpoint 5: Ends at 11:00 AM", stage: 5 };
    if (hoursLeft > 0)
      return { name: "Final Checkpoint: Ends at 04:00 PM", stage: 6 };
    return { name: "Hackathon Completed!", stage: 7 };
  };

  const getProgress = () => {
    const currentCheckpoint = getCheckpoint();
    const hoursLeft =
      timeLeft.hours + timeLeft.minutes / 60 + timeLeft.seconds / 3600;

    // Calculate progress within current checkpoint
    let progressWithinCheckpoint = 0;

    switch (currentCheckpoint.stage) {
      case 1: // 30-25 hours (5-hour window)
        progressWithinCheckpoint = ((30 - hoursLeft) / 5) * 100;
        break;
      case 2: // 25-20 hours (5-hour window)
        progressWithinCheckpoint = ((25 - hoursLeft) / 5) * 100;
        break;
      case 3: // 20-15 hours (5-hour window)
        progressWithinCheckpoint = ((20 - hoursLeft) / 5) * 100;
        break;
      case 4: // 15-10 hours (5-hour window)
        progressWithinCheckpoint = ((15 - hoursLeft) / 5) * 100;
        break;
      case 5: // 10-5 hours (5-hour window)
        progressWithinCheckpoint = ((10 - hoursLeft) / 5) * 100;
        break;
      case 6: // 5-0 hours (5-hour window)
        progressWithinCheckpoint = ((5 - hoursLeft) / 5) * 100;
        break;
      case 7: // Completed
        progressWithinCheckpoint = 100;
        break;
      default:
        progressWithinCheckpoint = 0;
    }

    return Math.max(0, Math.min(100, progressWithinCheckpoint));
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          // Check if timer has reached zero
          if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
            setIsRunning(false);
            return prev;
          }

          let newSeconds = prev.seconds - 1;
          let newMinutes = prev.minutes;
          let newHours = prev.hours;

          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes -= 1;
          }

          if (newMinutes < 0 && newHours > 0) {
            newMinutes = 59;
            newHours -= 1;
          }

          // Ensure we don't go below zero
          if (newHours < 0) {
            newHours = 0;
            newMinutes = 0;
            newSeconds = 0;
            setIsRunning(false);
          }

          const newTime = {
            hours: Math.max(0, newHours),
            minutes: Math.max(0, newMinutes),
            seconds: Math.max(0, newSeconds),
          };

          // Update URL params with new time
          updateUrlParams(newTime.hours, newTime.minutes, newTime.seconds);

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const resetTime = {
      hours: initialHours,
      minutes: initialMinutes,
      seconds: initialSeconds,
    };
    setTimeLeft(resetTime);
    updateUrlParams(resetTime.hours, resetTime.minutes, resetTime.seconds);
  };

  const currentCheckpoint = getCheckpoint();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Main Timer Display */}
      <div
        className="w-full mt-10 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-center items-center gap-4 mb-4">
          <TimeUnit value={timeLeft.hours} label="HOURS" />
          <span className="text-3xl md:text-4xl font-bold text-white opacity-70">
            :
          </span>
          <TimeUnit value={timeLeft.minutes} label="MINUTES" />
          <span className="text-3xl md:text-4xl font-bold text-white opacity-70">
            :
          </span>
          <TimeUnit value={timeLeft.seconds} label="SECONDS" />
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-3">
          {/* Start button - always visible when timer is not running */}
          {!isRunning && (
            <button
              onClick={handleToggle}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white"
            >
              ▶ Start
            </button>
          )}

          {/* Pause button - only visible when running and hovered */}
          {isRunning && (
            <button
              onClick={handleToggle}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 bg-red-600 hover:bg-red-700 text-white ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              ⏸ Pause
            </button>
          )}

          {/* Reset button - always visible when hovered */}
          <button
            onClick={handleReset}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 bg-gray-600 hover:bg-gray-700 text-white ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-4 w-full z-20">
        <h3 className="text-3xl font-semibold mb-3 text-white text-center font-mono tracking-wide">
          {currentCheckpoint.name}
        </h3>

        {/* Checkpoint Progress Bar - Fixed with white color */}
        <div className="w-full bg-gray-800/60 rounded-full h-3 overflow-hidden border border-gray-600/50">
          <div
            className="bg-white h-full rounded-full transition-all duration-500 ease-out relative shadow-lg"
            style={{ width: `${getProgress()}%` }}
          >
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red to-transparent animate-pulse"></div>
          </div>
        </div>

        <div className="mt-3 flex justify-between text-sm">
          <span className="text-white/70">
            Checkpoint {currentCheckpoint.stage}
          </span>
          <span className="text-white font-medium">
            {Math.round(getProgress())}% Complete
          </span>
          <span className="text-white/70">
            {currentCheckpoint.stage < 7
              ? `Stage ${currentCheckpoint.stage}/6`
              : "Finished"}
          </span>
        </div>
      </div>
    </div>
  );
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="text-center">
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 shadow-lg">
      <span className="text-3xl md:text-5xl lg:text-7xl font-bold text-white font-mono">
        {value.toString().padStart(2, "0")}
      </span>
    </div>
    <span className="text-xs md:text-sm font-medium text-white/80 mt-2 block tracking-wider">
      {label}
    </span>
  </div>
);

export default CountdownTimer;
