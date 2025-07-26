"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { PlayIcon, PauseIcon, RefreshCwIcon, Laptop2Icon } from "lucide-react";

interface TimerProps {
  hours?: number;
  minutes?: number;
  seconds?: number;
  autoStartTime?: string;
}

const CountdownTimer = ({
  hours = 30,
  minutes = 0,
  seconds = 0,
  autoStartTime = "10:00", // 8:02 PM in 24-hour format
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours,
    minutes,
    seconds,
  });
  const [isRunning, setIsRunning] = useState(false);

  // Check current time and auto-start
  useEffect(() => {
    const checkTimeAndStart = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (currentTime === autoStartTime && !isRunning) {
        setIsRunning(true);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    const timeCheckInterval = setInterval(checkTimeAndStart, 1000);
    return () => clearInterval(timeCheckInterval);
  }, [autoStartTime, hours, minutes, seconds, isRunning]);

  const getTotalSeconds = (h: number, m: number, s: number) =>
    h * 3600 + m * 60 + s;
  const totalSeconds = getTotalSeconds(hours, minutes, seconds);
  const currentSeconds = getTotalSeconds(
    timeLeft.hours,
    timeLeft.minutes,
    timeLeft.seconds
  );

  const getCheckpoint = () => {
    const hoursLeft =
      timeLeft.hours + timeLeft.minutes / 60 + timeLeft.seconds / 3600;
    if (hoursLeft > 25) return "Checkpoint 1 : Ends at 03:00 PM";
    if (hoursLeft > 20) return "Checkpoint 2 : Ends at 08:00 PM";
    if (hoursLeft > 15) return "Checkpoint 3 : Ends at 01:00 AM";
    if (hoursLeft > 10) return "Checkpoint 4 : Ends at 6:00 AM";
    if (hoursLeft > 5) return "Checkpoint 5 : Ends at 11:00 AM";
    if (hoursLeft > 0) return "Final Checkpoint : Ends at 04:00 PM";
    return "Completed";
  };

  const getProgress = () => {
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
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

          if (newMinutes < 0) {
            newMinutes = 59;
            newHours -= 1;
          }

          return {
            hours: newHours,
            minutes: newMinutes,
            seconds: newSeconds,
          };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  // const handleReset = () => {
  //   setIsRunning(false);
  //   setTimeLeft({ hours, minutes, seconds });
  // };

  // const handleTest = () => {
  //   setTimeLeft((prev) => {
  //     const newHours = Math.max(0, prev.hours - 1);
  //     return {
  //       hours: newHours,
  //       minutes: prev.minutes,
  //       seconds: prev.seconds,
  //     };
  //   });
  // };

  return (
    <div className="w-full flex items-center justify-center flex-col gap-6">
      <Card className="mx-auto p-6 bg-gradient-to-br from-blue-500 to-purple-600 max-w-3xl w-full felx items-center justify-center">
        <div className="flex justify-center items-center gap-6 mb-6">
          <TimeUnit value={timeLeft.hours} label="HOURS" />
          <span className="text-4xl font-bold text-white">:</span>
          <TimeUnit value={timeLeft.minutes} label="MINUTES" />
          <span className="text-4xl font-bold text-white">:</span>
          <TimeUnit value={timeLeft.seconds} label="SECONDS" />
        </div>
        {/* <div className="flex justify-center gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <PauseIcon className="mr-2" />
            ) : (
              <PlayIcon className="mr-2" />
            )}
            {isRunning ? "Stop" : "Start"}
          </Button>
          <Button variant="outline" size="lg" onClick={handleReset}>
            <RefreshCwIcon className="mr-2" />
            Reset
          </Button>
        </div> */}
      </Card>

      <Card className="max-w-3xl w-full mx-auto p-4">
        <h3 className="text-lg font-semibold mb-4">
          {getCheckpoint()}
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <TimelineItem
            time="Ends at 03:00 PM"
            label="Checkpoint 1"
            active={getCheckpoint() === "Checkpoint 1 : Ends at 03:00 PM"}
          />
          <TimelineItem
            time="Ends at 08:00 PM"
            label="Checkpoint 2"
            active={getCheckpoint() === "Checkpoint 2 : Ends at 08:00 PM"}
          />
          <TimelineItem
            time="Ends at 01:00 AM"
            label="Checkpoint 3"
            active={getCheckpoint() === "Checkpoint 3 : Ends at 01:00 AM"}
          />
          <TimelineItem
            time="Ends at 6:00 AM"
            label="Checkpoint 4"
            active={getCheckpoint() === "Checkpoint 4 : Ends at 6:00 AM"}
          />
          <TimelineItem
            time="Ends at 11:00 AM"
            label="Checkpoint 5"
            active={getCheckpoint() === "Checkpoint 5 : Ends at 11:00 AM"}
          />
          <TimelineItem
            time="Ends at 04:00 PM"
            label="Checkpoint 6"
            active={getCheckpoint() === "Final Checkpoint : Ends at 04:00 PM"}
          />
        </div>
      </Card>
    </div>
  );
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="text-center">
    <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
      <span className="text-7xl font-bold text-white">
        {value.toString().padStart(2, "0")}
      </span>
    </div>
    <span className="text-lg font-semibold text-white mt-2 block">{label}</span>
  </div>
);

const TimelineItem = ({
  time,
  label,
  active,
}: {
  time: string;
  label: string;
  active: boolean;
}) => (
  <div
    className={`col-span-1 flex items-center px-2 py-4 rounded-xl ${
      active ? "bg-blue-100" : ""
    }`}
  >
    <div
      className={`w-3 h-3 rounded-full mr-3 ${
        active ? "bg-blue-600" : "bg-gray-300"
      }`}
    />
    <div>
      <p className="text-xl font-medium">{label}</p>
      <p className="text-md text-gray-500">{time}</p>
    </div>
  </div>
);

export default CountdownTimer;