import { useEffect, useState } from 'react';
import { format, isBefore, isToday, addDays, startOfDay } from 'date-fns';
import { UserData, DayData } from '../types';

interface CalendarGridProps {
    userData: UserData;
}

export default function CalendarGrid({ userData }: CalendarGridProps) {
    const [days, setDays] = useState<DayData[]>([]);
    const [currentDate] = useState(startOfDay(new Date()));

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

    const calculateProgress = () => {
        const pastDays = days.filter(day => day.isPast).length;
        return (pastDays / days.length) * 100;
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Life Calendar</h2>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Progress: {calculateProgress().toFixed(1)}% of your expected life
                </p>
            </div>

            <div className="grid grid-cols-50 gap-1">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`
              aspect-square w-2 h-2 rounded-sm
              ${day.isPast ? 'bg-gray-300' : 'bg-blue-100'}
              ${day.isToday ? 'bg-red-500' : ''}
              transition-colors duration-200
              hover:scale-150
              cursor-pointer
              group relative
            `}
                    >
                        <div className="absolute hidden group-hover:block bg-white p-2 rounded shadow-lg text-xs whitespace-nowrap z-10">
                            {format(day.date, 'MMM d, yyyy')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 