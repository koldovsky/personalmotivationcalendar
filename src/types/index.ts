export interface UserData {
  birthDate: string;
  gender: "male" | "female";
  country: string;
  lifeExpectancy: number;
}

export interface DayData {
  date: Date;
  isPast: boolean;
  isToday: boolean;
}

export interface CountryData {
  name: string;
  maleLifeExpectancy: number;
  femaleLifeExpectancy: number;
}
