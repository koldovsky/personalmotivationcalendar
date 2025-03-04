import { useState, useEffect } from 'react';
import { UserData } from '../types';

interface SetupFormProps {
    onSubmit: (data: UserData) => void;
}

const countries = [
    { name: 'United States', maleLifeExpectancy: 76, femaleLifeExpectancy: 81 },
    { name: 'United Kingdom', maleLifeExpectancy: 79, femaleLifeExpectancy: 83 },
    { name: 'Canada', maleLifeExpectancy: 80, femaleLifeExpectancy: 84 },
    { name: 'Australia', maleLifeExpectancy: 81, femaleLifeExpectancy: 85 },
    { name: 'Germany', maleLifeExpectancy: 78, femaleLifeExpectancy: 83 },
    { name: 'France', maleLifeExpectancy: 79, femaleLifeExpectancy: 85 },
    { name: 'Japan', maleLifeExpectancy: 81, femaleLifeExpectancy: 87 },
    { name: 'China', maleLifeExpectancy: 75, femaleLifeExpectancy: 79 },
];

export default function SetupForm({ onSubmit }: SetupFormProps) {
    const [formData, setFormData] = useState<UserData>({
        birthDate: '',
        gender: 'male',
        country: countries[0].name,
        lifeExpectancy: countries[0].maleLifeExpectancy,
    });

    useEffect(() => {
        const savedData = localStorage.getItem('userData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedCountry = countries.find(c => c.name === formData.country);
        if (selectedCountry) {
            const lifeExpectancy = formData.gender === 'male'
                ? selectedCountry.maleLifeExpectancy
                : selectedCountry.femaleLifeExpectancy;

            const data = { ...formData, lifeExpectancy };
            localStorage.setItem('userData', JSON.stringify(data));
            onSubmit(data);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Personal Motivational Calendar</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        {countries.map(country => (
                            <option key={country.name} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Generate Calendar
                </button>
            </form>
        </div>
    );
} 