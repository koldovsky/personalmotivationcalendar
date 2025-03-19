import { useEffect, useState, useRef, useCallback } from 'react';
import { format, isBefore, isToday, addDays, startOfDay, differenceInMonths } from 'date-fns';
import { UserData, DayData } from '../types';
import ThemeSwitch from './ThemeSwitch';

interface CalendarGridProps {
    userData: UserData;
    onReset: () => void;
}

export default function CalendarGrid({ userData, onReset }: CalendarGridProps) {
    const [days, setDays] = useState<DayData[]>([]);
    const [currentDate] = useState(startOfDay(new Date()));
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const birthDate = new Date(userData.birthDate);
        const lifeExpectancyInDays = userData.lifeExpectancy * 365;

        const allDays: DayData[] = [];
        for (let i = 0; i < lifeExpectancyInDays; i++) {
            const date = addDays(birthDate, i);
            allDays.push({
                date,
                isPast: isBefore(date, currentDate),
                isToday: isToday(date),
            });
        }

        setDays(allDays);
    }, [userData, currentDate]);

    const drawCalendar = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const container = canvas.parentElement;
        if (!container) return;

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        const padding = 40;
        const availableWidth = canvas.width - (padding * 2);
        const availableHeight = canvas.height - (padding * 2);

        const totalDays = days.length;
        const cols = Math.ceil(Math.sqrt(totalDays * (availableWidth / availableHeight)));
        const rows = Math.ceil(totalDays / cols);

        const cellSize = Math.min(
            availableWidth / cols,
            availableHeight / rows
        );

        // Clear canvas with theme-aware background
        const isDarkMode = document.documentElement.classList.contains('dark');
        ctx.fillStyle = isDarkMode ? '#000000' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw cells with theme-aware colors
        days.forEach((day, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = padding + (col * cellSize);
            const y = padding + (row * cellSize);

            if (day.isToday) {
                ctx.fillStyle = isDarkMode ? '#e5e7eb' : '#1f2937'; // gray-200 : gray-800
            } else if (day.isPast) {
                ctx.fillStyle = isDarkMode ? '#9ca3af' : '#4b5563'; // gray-400 : gray-600
            } else {
                ctx.fillStyle = isDarkMode ? '#374151' : '#d1d5db'; // gray-700 : gray-300
            }

            const gap = 1;
            ctx.fillRect(x + gap, y + gap, cellSize - (gap * 2), cellSize - (gap * 2));
        });
    }, [days]);

    useEffect(() => {
        drawCalendar();
        window.addEventListener('resize', drawCalendar);

        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    drawCalendar();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => {
            window.removeEventListener('resize', drawCalendar);
            observer.disconnect();
        };
    }, [drawCalendar]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const padding = 40;
        const availableWidth = canvas.width - (padding * 2);
        const availableHeight = canvas.height - (padding * 2);
        const cols = Math.ceil(Math.sqrt(days.length * (availableWidth / availableHeight)));

        const cellSize = Math.min(
            availableWidth / cols,
            availableHeight / Math.ceil(days.length / cols)
        );

        const col = Math.floor((x - padding) / cellSize);
        const row = Math.floor((y - padding) / cellSize);
        const index = row * cols + col;

        if (index >= 0 && index < days.length) {
            setHoveredDay(days[index]);
            setTooltipPosition({ x: e.clientX, y: e.clientY });
        } else {
            setHoveredDay(null);
        }
    }, [days]);

    const handleMouseLeave = () => {
        setHoveredDay(null);
    };

    const calculateProgress = () => {
        const pastDays = days.filter(day => day.isPast).length;
        return (pastDays / days.length) * 100;
    };

    const calculateAge = (birthDate: Date, targetDate: Date) => {
        const totalMonths = differenceInMonths(targetDate, birthDate);
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        return { years, months };
    };

    const calculateDayPercentage = (dayIndex: number) => {
        return ((dayIndex + 1) / days.length * 100).toFixed(1);
    };

    return (
        <div className="w-full h-screen p-4 flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold">Your Life Calendar</h2>
                    <div className="flex items-center gap-4">
                        <ThemeSwitch />
                        <button
                            onClick={onReset}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Change Settings
                        </button>
                    </div>
                </div>
                <p>
                    Expected life: {userData.lifeExpectancy} years ({userData.gender} in {userData.country})
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                    <div
                        className="bg-gray-400 dark:bg-gray-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Progress: {calculateProgress().toFixed(1)}% of your expected life
                </p>
            </div>

            <div className="flex-1 relative">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                />
                {hoveredDay && (
                    <div
                        className="fixed z-10 bg-gray-800 dark:bg-gray-200 text-white dark:text-black px-2 py-1 rounded text-xs pointer-events-none"
                        style={{
                            left: tooltipPosition.x + 10,
                            top: tooltipPosition.y + 10
                        }}
                    >
                        {format(hoveredDay.date, 'MMM d, yyyy')}
                        <div>
                            {(() => {
                                const age = calculateAge(new Date(userData.birthDate), hoveredDay.date);
                                const dayIndex = days.findIndex(d => d.date.getTime() === hoveredDay.date.getTime());
                                const percentage = calculateDayPercentage(dayIndex);
                                const ageText = `Age: ${age.years} years, ${age.months} months (${percentage}%)`;
                                if (hoveredDay.isPast) {
                                    return ageText + " (past)";
                                } else if (hoveredDay.isToday) {
                                    return ageText + " (today)";
                                } else {
                                    return ageText + " (future)";
                                }
                            })()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 