import { useState } from 'react';
import { UserData, COUNTRY_DATA } from '../types';

interface SetupFormProps {
    onSubmit: (data: UserData) => void;
}

export default function SetupForm({ onSubmit }: SetupFormProps) {
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [country, setCountry] = useState(COUNTRY_DATA[0].name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedCountry = COUNTRY_DATA.find(c => c.name === country);
        const lifeExpectancy = selectedCountry ? selectedCountry.lifeExpectancy[gender] : 80;

        onSubmit({
            birthDate: new Date(birthDate),
            lifeExpectancy,
            gender,
            country
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Life Calendar Setup</h2>

            <div className="mb-4">
                <label className="block text-gray-300 mb-2">Birth Date</label>
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-300 mb-2">Gender</label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-gray-300 mb-2">Country</label>
                <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                    {COUNTRY_DATA.map(country => (
                        <option key={country.name} value={country.name}>
                            {country.name} (Life expectancy: M {country.lifeExpectancy.male}, F {country.lifeExpectancy.female})
                        </option>
                    ))}
                </select>
            </div>

            <div className="text-gray-300 mb-6">
                {(() => {
                    const selectedCountry = COUNTRY_DATA.find(c => c.name === country);
                    if (selectedCountry) {
                        return `Expected life: ${selectedCountry.lifeExpectancy[gender]} years`;
                    }
                    return null;
                })()}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
                Create Life Calendar
            </button>
        </form>
    );
} 