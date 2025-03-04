import { useEffect, useState, useRef, useCallback } from 'react';
import { format, isBefore, isToday, addDays, startOfDay } from 'date-fns';
import { UserData, DayData } from '../types';

interface CalendarGridProps {
    userData: UserData;
}

export default function CalendarGrid({ userData }: CalendarGridProps) {
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

        // Get container dimensions
        const container = canvas.parentElement;
        if (!container) return;

        // Set canvas size to match container
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        // Calculate optimal cell size
        const padding = 40; // Padding around the grid
        const availableWidth = canvas.width - (padding * 2);
        const availableHeight = canvas.height - (padding * 2);

        // Calculate grid dimensions
        const totalDays = days.length;
        const cols = Math.ceil(Math.sqrt(totalDays * (availableWidth / availableHeight)));
        const rows = Math.ceil(totalDays / cols);

        // Calculate cell size to fit the grid
        const cellSize = Math.min(
            availableWidth / cols,
            availableHeight / rows
        );

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw cells
        days.forEach((day, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = padding + (col * cellSize);
            const y = padding + (row * cellSize);

            // Set color based on day status
            if (day.isToday) {
                ctx.fillStyle = '#ef4444'; // red-500
            } else if (day.isPast) {
                ctx.fillStyle = '#9ca3af'; // gray-400
            } else {
                ctx.fillStyle = '#dbeafe'; // blue-100
            }

            // Draw cell with small gap
            const gap = 1;
            ctx.fillRect(x + gap, y + gap, cellSize - (gap * 2), cellSize - (gap * 2));
        });
    }, [days]);

    useEffect(() => {
        drawCalendar();
        window.addEventListener('resize', drawCalendar);
        return () => window.removeEventListener('resize', drawCalendar);
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

    return (
        <div className="w-full h-screen p-4 flex flex-col bg-black text-white">
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Your Life Calendar</h2>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
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
                        className="fixed z-10 bg-white text-black px-2 py-1 rounded text-xs pointer-events-none"
                        style={{
                            left: tooltipPosition.x + 10,
                            top: tooltipPosition.y + 10
                        }}
                    >
                        {format(hoveredDay.date, 'MMM d, yyyy')}
                    </div>
                )}
            </div>
        </div>
    );
} 