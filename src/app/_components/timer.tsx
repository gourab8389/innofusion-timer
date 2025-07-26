"use client";
import React, { useState, useEffect } from "react";

interface TimerProps {
  // Props are now optional since we'll calculate from IST
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}

const CountdownTimer = ({
}: TimerProps) => {
  
  // Function to get current IST time - FIXED
  const getISTTime = () => {
    const now = new Date();
    // Use toLocaleString to get proper IST time
    const istString = now.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata'
    });
    return new Date(istString);
  };

  // Function to get target time: July 27, 2025, 4:00 PM IST - FIXED
  const getTargetTime = () => {
    
    // Alternative method: create the exact target time
    const targetIST = new Date(2025, 6, 27, 16, 0, 0); // Month is 0-indexed, so 6 = July
    return targetIST;
  };

  // Calculate initial time remaining - FIXED
  const calculateTimeRemaining = () => {
    const istNow = getISTTime();
    const target = getTargetTime();
    const timeDiff = target.getTime() - istNow.getTime();
    
    if (timeDiff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining);
  const [isRunning, setIsRunning] = useState(true); // Auto-start
  const [isHovered, setIsHovered] = useState(false);
  const [currentISTTime, setCurrentISTTime] = useState(getISTTime());

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

  // Timer countdown effect - updates every second based on real IST time
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        const newTimeRemaining = calculateTimeRemaining();
        const newISTTime = getISTTime();
        
        setTimeLeft(newTimeRemaining);
        setCurrentISTTime(newISTTime);

        // Check if timer has reached zero
        if (newTimeRemaining.hours === 0 && newTimeRemaining.minutes === 0 && newTimeRemaining.seconds === 0) {
          setIsRunning(false);
        }
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
    setIsRunning(true); // Auto-restart
    const resetTime = calculateTimeRemaining();
    setTimeLeft(resetTime);
    setCurrentISTTime(getISTTime());
  };

  const currentCheckpoint = getCheckpoint();

  // Format IST time for display - FIXED
  const formatISTTime = (date: Date) => {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      year: 'numeric',
      month: 'short', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };


  return (
    <div className="w-full bg-hero max-w-4xl mx-auto flex flex-col items-center bg-hero min-h-screen py-8">
      {/* Title */}
      <div className="text-center my-8 ml-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          INNOFUSION <span className="text-red-500">2.0</span>
        </h1>
      </div>

      {/* IST Time Display */}
      <div className="mb-6 text-center">
        <div className="bg-red-900/80 text-white px-6 py-3 rounded-full border-2 border-red-500/30">
          <div className="text-red-200 text-sm mb-1">Current IST Time</div>
          <div className="text-white font-mono text-lg">
            {formatISTTime(currentISTTime)}
          </div>
        </div>
        <div className="text-red-400 text-sm mt-3">
          Target: Sun, 27 Jul, 2025, 04:00:00 pm
        </div>
      </div>

      {/* Main Timer Display */}
      <div
        className="w-full mt-10 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-center items-center gap-4 mb-4">
          <TimeUnit value={timeLeft.hours} label="HOURS" />
          <span className="text-3xl md:text-4xl font-bold text-red-400 opacity-70">
            :
          </span>
          <TimeUnit value={timeLeft.minutes} label="MINUTES" />
          <span className="text-3xl md:text-4xl font-bold text-red-400 opacity-70">
            :
          </span>
          <TimeUnit value={timeLeft.seconds} label="SECONDS" />
        </div>
        {/* Control Buttons */}
        <div className="flex justify-center gap-3">
          {/* Start button - visible when timer is not running */}
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
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-4 w-full z-20">
        <h3 className="text-3xl font-semibold mb-3 text-white text-center font-mono tracking-wide">
          {currentCheckpoint.name}
        </h3>

        {/* Checkpoint Progress Bar */}
        <div className="w-full bg-gray-800/60 rounded-full h-4 overflow-hidden border border-red-500/30">
          <div
            className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-500 ease-out relative shadow-lg"
            style={{ width: `${getProgress()}%` }}
          >
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
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
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 md:p-4 border-2 border-red-500/30 shadow-lg">
      <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-mono">
        {value.toString().padStart(2, "0")}
      </span>
    </div>
    <span className="text-xs md:text-sm font-medium text-gray-300 mt-2 block tracking-wider">
      {label}
    </span>
  </div>
);

export default CountdownTimer;