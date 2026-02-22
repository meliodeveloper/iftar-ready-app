// Mock data for the app - will be replaced with real APIs later

export interface Mosque {
  id: string;
  name: string;
  address: string;
  distance: string;
  lat: number;
  lng: number;
}

export interface PrayerTime {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface HalalVenue {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  cuisine: string;
  priceLevel: string;
  isOpen: boolean;
  verified: boolean;
  phone?: string;
}

export interface RamadanDay {
  day: number;
  date: string;
  fajr: string;
  maghrib: string;
  note?: string;
}

export const mockMosques: Mosque[] = [
  { id: "1", name: "East London Mosque", address: "82-92 Whitechapel Rd, London E1 1JQ", distance: "0.3 mi", lat: 51.5177, lng: -0.0654 },
  { id: "2", name: "London Central Mosque", address: "146 Park Rd, London NW8 7RG", distance: "1.2 mi", lat: 51.5274, lng: -0.1536 },
  { id: "3", name: "Finsbury Park Mosque", address: "7-11 St Thomas's Rd, London N4 2QH", distance: "2.1 mi", lat: 51.5641, lng: -0.1062 },
  { id: "4", name: "Brixton Mosque", address: "1 Gresham Rd, London SW9 7PH", distance: "3.5 mi", lat: 51.4613, lng: -0.1145 },
];

export const mockPrayerTimes: PrayerTime = {
  fajr: "05:12",
  sunrise: "06:45",
  dhuhr: "12:18",
  asr: "15:22",
  maghrib: "17:58",
  isha: "19:28",
};

export const mockHalalVenues: HalalVenue[] = [
  { id: "1", name: "Tayyabs", address: "83-89 Fieldgate St, London E1 1JU", distance: "0.2 mi", rating: 4.5, cuisine: "Pakistani", priceLevel: "££", isOpen: true, verified: true, phone: "+44 20 7247 9543" },
  { id: "2", name: "Lahore Kebab House", address: "2-10 Umberston St, London E1 1PY", distance: "0.4 mi", rating: 4.3, cuisine: "Pakistani", priceLevel: "£", isOpen: true, verified: true, phone: "+44 20 7488 2551" },
  { id: "3", name: "Dishoom", address: "7 Boundary St, London E2 7JE", distance: "0.6 mi", rating: 4.6, cuisine: "Indian", priceLevel: "£££", isOpen: true, verified: false },
  { id: "4", name: "Maroush", address: "21 Edgware Rd, London W2 2JE", distance: "1.1 mi", rating: 4.2, cuisine: "Lebanese", priceLevel: "££", isOpen: false, verified: true, phone: "+44 20 7723 0773" },
  { id: "5", name: "The Gate", address: "51 Queen Caroline St, London W6 9QL", distance: "2.3 mi", rating: 4.4, cuisine: "Middle Eastern", priceLevel: "££", isOpen: true, verified: false },
];

export const mockRamadanCalendar: RamadanDay[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const date = new Date(2026, 1, 18 + i); // Ramadan 2026 approx starts Feb 18
  const fajrMinutes = 312 - Math.floor(i * 0.5); // gradually earlier
  const maghribMinutes = 1078 + Math.floor(i * 1.2); // gradually later
  const fajrH = Math.floor(fajrMinutes / 60);
  const fajrM = fajrMinutes % 60;
  const maghribH = Math.floor(maghribMinutes / 60);
  const maghribM = maghribMinutes % 60;
  return {
    day,
    date: date.toISOString().split("T")[0],
    fajr: `${String(fajrH).padStart(2, "0")}:${String(fajrM).padStart(2, "0")}`,
    maghrib: `${String(maghribH).padStart(2, "0")}:${String(maghribM).padStart(2, "0")}`,
    note: day === 27 ? "Laylat al-Qadr (likely)" : day === 1 ? "First day of Ramadan" : day === 30 ? "Last day of Ramadan" : undefined,
  };
});

export function getCountdownTarget(): { label: string; targetTime: Date; sublabel: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const [fajrH, fajrM] = mockPrayerTimes.fajr.split(":").map(Number);
  const [maghribH, maghribM] = mockPrayerTimes.maghrib.split(":").map(Number);
  
  const fajrToday = new Date(today); fajrToday.setHours(fajrH, fajrM, 0);
  const maghribToday = new Date(today); maghribToday.setHours(maghribH, maghribM, 0);
  
  if (now < fajrToday) {
    return { label: "Suhoor ends", sublabel: "Fast begins at Fajr", targetTime: fajrToday };
  } else if (now < maghribToday) {
    return { label: "Iftar", sublabel: "Fast ends at Maghrib", targetTime: maghribToday };
  } else {
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(fajrH, fajrM, 0);
    return { label: "Suhoor ends", sublabel: "Tomorrow's Fajr", targetTime: tomorrow };
  }
}
