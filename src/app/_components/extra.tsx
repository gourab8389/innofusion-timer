"use client"
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon, RefreshCwIcon } from 'lucide-react';

interface TimerProps {
    hours?: number;
    minutes?: number;
    seconds?: number;
}

const CountdownTimer = ({ hours = 8, minutes = 0, seconds = 0 }: TimerProps) => {
    const [timeLeft, setTimeLeft] = useState({
        hours,
        minutes,
        seconds
    });
    const [isRunning, setIsRunning] = useState(false);

    const getTotalSeconds = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;
    const totalSeconds = getTotalSeconds(hours, minutes, seconds);
    const currentSeconds = getTotalSeconds(timeLeft.hours, timeLeft.minutes, timeLeft.seconds);

    const getCheckpoint = () => {
        const hoursLeft = timeLeft.hours + timeLeft.minutes / 60 + timeLeft.seconds / 3600;
        if (hoursLeft > 5) return "Checkpoint 1";
        if (hoursLeft > 2) return "Checkpoint 2";
        if (hoursLeft > 0) return "Checkpoint 3";
        return "Completed";
    };

    const getProgress = () => {
        return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
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
                        seconds: newSeconds
                    };
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft({ hours, minutes, seconds });
    };

    return (
        <div className="w-full flex items-center justify-center flex-col gap-3">
            <Card className="mx-auto p-6 bg-gradient-to-br from-blue-500 to-purple-600 max-w-3xl w-full felx items-center justify-center">
                <div className="flex justify-center items-center gap-6 mb-6">
                    <TimeUnit value={timeLeft.hours} label="HOURS" />
                    <span className="text-4xl font-bold text-white">:</span>
                    <TimeUnit value={timeLeft.minutes} label="MINUTES" />
                    <span className="text-4xl font-bold text-white">:</span>
                    <TimeUnit value={timeLeft.seconds} label="SECONDS" />
                </div>
                <div className="flex justify-center gap-4">
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => setIsRunning(!isRunning)}
                    >
                        {isRunning ? <PauseIcon className="mr-2" /> : <PlayIcon className="mr-2" />}
                        {isRunning ? 'Stop' : 'Start'}
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleReset}
                    >
                        <RefreshCwIcon className="mr-2" />
                        Reset
                    </Button>
                </div>
            </Card>


            <Card className="p-4 mx-auto w-full max-w-3xl">
{/*                 <h3 className="text-lg font-semibold mb-4">Current Progress: {getCheckpoint()}</h3> */}
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${getProgress()}%` }}
                    />
                </div>
                <div className="mt-4">
                    <CurrentTimelineItem checkpoint={getCheckpoint()} />
                </div>
            </Card>
        </div>
    );
};

const CurrentTimelineItem = ({ checkpoint }: { checkpoint: string }) => {
    let time = "";
    const label = checkpoint;

    switch (checkpoint) {
        case "Checkpoint 1":
            time = "First 3 hours";
            break;
        case "Checkpoint 2":
            time = "Next 3 hours";
            break;
        case "Checkpoint 3":
            time = "Last 2 hours";
            break;
        default:
            time = "Completed";
    }

    return (
        <div className="flex items-center p-4 bg-blue-100 rounded-lg">
            <div className="w-4 h-4 rounded-full mr-4 bg-blue-600" />
            <div>
                <p className="text-2xl font-medium">{label}</p>
                <p className="text-lg text-gray-600">{time}</p>
            </div>
        </div>
    );
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <span className="text-7xl font-bold text-white">
                {value.toString().padStart(2, '0')}
            </span>
        </div>
        <span className="text-lg font-semibold text-white mt-2 block">
            {label}
        </span>
    </div>
);


export default CountdownTimer;
