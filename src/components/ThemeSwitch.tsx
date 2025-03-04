import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();

    const handleThemeChange = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }
    };

    return (
        <button
            onClick={handleThemeChange}
            className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
            title={`Current theme: ${theme}. Click to switch.`}
        >
            {theme === 'light' ? (
                <SunIcon className="w-5 h-5 text-gray-300 dark:text-gray-700" />
            ) : theme === 'dark' ? (
                <MoonIcon className="w-5 h-5 text-gray-300 dark:text-gray-700" />
            ) : (
                <ComputerDesktopIcon className="w-5 h-5 text-gray-300 dark:text-gray-700" />
            )}
        </button>
    );
} 