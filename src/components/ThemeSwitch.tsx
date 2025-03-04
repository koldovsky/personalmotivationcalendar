import { useTheme } from '../contexts/ThemeContext';

export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'system')}
                className="bg-gray-700 text-white dark:bg-gray-200 dark:text-black border border-gray-600 dark:border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
            </select>
        </div>
    );
} 