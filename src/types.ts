export interface UserData {
  birthDate: Date;
  lifeExpectancy: number;
  gender: "male" | "female";
  country: string;
}

export interface DayData {
  date: Date;
  isPast: boolean;
  isToday: boolean;
}

export interface CountryData {
  name: string;
  lifeExpectancy: {
    male: number;
    female: number;
  };
}

// World Health Organization 2019 data (example values)
export const COUNTRY_DATA: CountryData[] = [
  { name: "Japan", lifeExpectancy: { male: 81.5, female: 87.7 } },
  { name: "Switzerland", lifeExpectancy: { male: 81.9, female: 85.9 } },
  { name: "Singapore", lifeExpectancy: { male: 81.4, female: 85.9 } },
  { name: "Spain", lifeExpectancy: { male: 80.9, female: 86.2 } },
  { name: "Italy", lifeExpectancy: { male: 81.2, female: 85.7 } },
  { name: "Australia", lifeExpectancy: { male: 81.3, female: 85.4 } },
  { name: "Iceland", lifeExpectancy: { male: 81.3, female: 84.5 } },
  { name: "Israel", lifeExpectancy: { male: 81.0, female: 84.8 } },
  { name: "Sweden", lifeExpectancy: { male: 80.9, female: 84.8 } },
  { name: "France", lifeExpectancy: { male: 79.8, female: 85.9 } },
  { name: "South Korea", lifeExpectancy: { male: 79.7, female: 85.7 } },
  { name: "Canada", lifeExpectancy: { male: 80.4, female: 84.4 } },
  { name: "Norway", lifeExpectancy: { male: 81.1, female: 84.7 } },
  { name: "Ireland", lifeExpectancy: { male: 80.4, female: 84.1 } },
  { name: "Netherlands", lifeExpectancy: { male: 80.4, female: 83.7 } },
  { name: "New Zealand", lifeExpectancy: { male: 80.2, female: 83.8 } },
  { name: "Greece", lifeExpectancy: { male: 79.5, female: 84.4 } },
  { name: "Portugal", lifeExpectancy: { male: 78.6, female: 84.8 } },
  { name: "Finland", lifeExpectancy: { male: 79.2, female: 84.5 } },
  { name: "Belgium", lifeExpectancy: { male: 79.0, female: 83.8 } },
  { name: "United Kingdom", lifeExpectancy: { male: 79.3, female: 83.1 } },
  { name: "Austria", lifeExpectancy: { male: 79.1, female: 84.0 } },
  { name: "Germany", lifeExpectancy: { male: 78.7, female: 83.6 } },
  { name: "Denmark", lifeExpectancy: { male: 79.0, female: 83.0 } },
  { name: "Slovenia", lifeExpectancy: { male: 78.5, female: 84.2 } },
  { name: "Costa Rica", lifeExpectancy: { male: 77.7, female: 82.9 } },
  { name: "Chile", lifeExpectancy: { male: 77.4, female: 82.4 } },
  { name: "Czech Republic", lifeExpectancy: { male: 76.3, female: 82.1 } },
  { name: "United States", lifeExpectancy: { male: 76.3, female: 81.4 } },
  { name: "Poland", lifeExpectancy: { male: 74.0, female: 81.8 } },
  { name: "China", lifeExpectancy: { male: 75.0, female: 79.4 } },
  { name: "Turkey", lifeExpectancy: { male: 74.4, female: 80.3 } },
  { name: "Iran", lifeExpectancy: { male: 75.5, female: 78.2 } },
  { name: "Vietnam", lifeExpectancy: { male: 71.3, female: 79.4 } },
  { name: "Brazil", lifeExpectancy: { male: 72.2, female: 79.4 } },
  { name: "Russia", lifeExpectancy: { male: 68.2, female: 78.0 } },
  { name: "Ukraine", lifeExpectancy: { male: 67.6, female: 77.1 } },
  { name: "India", lifeExpectancy: { male: 69.2, female: 71.8 } },
  { name: "Philippines", lifeExpectancy: { male: 67.3, female: 75.2 } },
  { name: "South Africa", lifeExpectancy: { male: 62.4, female: 68.9 } },
  { name: "Nigeria", lifeExpectancy: { male: 54.7, female: 56.7 } },
  // Countries are sorted by average life expectancy
].sort((a, b) => {
  const avgA = (a.lifeExpectancy.male + a.lifeExpectancy.female) / 2;
  const avgB = (b.lifeExpectancy.male + b.lifeExpectancy.female) / 2;
  return avgB - avgA;
});
