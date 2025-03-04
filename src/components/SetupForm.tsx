import { useState } from 'react';
import { UserData, COUNTRY_DATA } from '../types';
import ThemeSwitch from './ThemeSwitch';

interface SetupFormProps {
    onSubmit: (data: UserData) => void;
}

export default function SetupForm({ onSubmit }: SetupFormProps) {
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [country, setCountry] = useState(COUNTRY_DATA[0].name);
    const [showCustomLifeExpectancy, setShowCustomLifeExpectancy] = useState(false);
    const [customLifeExpectancy, setCustomLifeExpectancy] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedCountry = COUNTRY_DATA.find(c => c.name === country);
        let lifeExpectancy = selectedCountry ? selectedCountry.lifeExpectancy[gender] : 80;

        if (showCustomLifeExpectancy && customLifeExpectancy) {
            const customValue = parseFloat(customLifeExpectancy);
            if (customValue > 100) {
                setError("Don't be too optimistic!");
                return;
            }
            if (customValue > 0) {
                lifeExpectancy = customValue;
            }
        }

        setError('');
        onSubmit({
            birthDate: new Date(birthDate),
            lifeExpectancy,
            gender,
            country
        });
    };

    const handleCustomLifeExpectancyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomLifeExpectancy(value);
        if (parseFloat(value) > 100) {
            setError("Don't be too optimistic!");
        } else {
            setError('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-gray-900 dark:bg-gray-100 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white dark:text-gray-900">Life Calendar Setup</h2>
                <ThemeSwitch />
            </div>

            <div className="mb-4">
                <label className="block text-gray-300 dark:text-gray-700 mb-2">Birth Date</label>
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className="w-full p-2 rounded bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border border-gray-700 dark:border-gray-300 focus:border-gray-500 focus:outline-none"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-300 dark:text-gray-700 mb-2">Gender</label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="w-full p-2 rounded bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border border-gray-700 dark:border-gray-300 focus:border-gray-500 focus:outline-none"
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-300 dark:text-gray-700 mb-2">Country</label>
                <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border border-gray-700 dark:border-gray-300 focus:border-gray-500 focus:outline-none"
                >
                    {COUNTRY_DATA.map(country => (
                        <option key={country.name} value={country.name}>
                            {country.name} (Life expectancy: M {country.lifeExpectancy.male}, F {country.lifeExpectancy.female})
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="flex items-center text-gray-300 dark:text-gray-700 mb-2">
                    <input
                        type="checkbox"
                        checked={showCustomLifeExpectancy}
                        onChange={(e) => setShowCustomLifeExpectancy(e.target.checked)}
                        className="mr-2 rounded border-gray-700 dark:border-gray-300"
                    />
                    Use Custom Life Expectancy
                </label>
                {showCustomLifeExpectancy && (
                    <input
                        type="number"
                        value={customLifeExpectancy}
                        onChange={handleCustomLifeExpectancyChange}
                        min="1"
                        max="100"
                        step="0.1"
                        placeholder="Enter custom life expectancy"
                        className="w-full p-2 rounded bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border border-gray-700 dark:border-gray-300 focus:border-gray-500 focus:outline-none mt-2"
                    />
                )}
                {error && <p className="text-red-500 dark:text-red-600 text-sm mt-1">{error}</p>}
            </div>

            <div className="text-gray-300 dark:text-gray-700 mb-6">
                {(() => {
                    const selectedCountry = COUNTRY_DATA.find(c => c.name === country);
                    if (selectedCountry) {
                        const baseExpectancy = selectedCountry.lifeExpectancy[gender];
                        const customValue = showCustomLifeExpectancy && customLifeExpectancy ? parseFloat(customLifeExpectancy) : null;
                        return `Expected life: ${customValue && customValue <= 100 ? customValue : baseExpectancy} years`;
                    }
                    return null;
                })()}
            </div>

            <button
                type="submit"
                className="w-full bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 py-2 px-4 rounded hover:bg-gray-600 dark:hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
            >
                Create Life Calendar
            </button>
        </form>
    );
} 