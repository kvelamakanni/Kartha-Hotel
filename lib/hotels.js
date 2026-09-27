export const HOTELS = [
  { id: 1, brand: "Aravalli House", city: "Udaipur, Rajasthan", desc: "A 1920s lakeside haveli, seven rooms.", price: 210 },
  { id: 2, brand: "Kumbal Fort Lodge", city: "Kumbalgarh, Rajasthan", desc: "Stone ramparts, wood fires, no wifi in the courtyard.", price: 265 },
  { id: 3, brand: "Backwater Nilaya", city: "Alleppey, Kerala", desc: "A converted rice-boat, moored for the season.", price: 180 },
  { id: 4, brand: "Nandi Hill Retreat", city: "Chikkaballapur, Karnataka", desc: "Coffee-estate bungalow, sunrise treks included.", price: 145 },
  { id: 5, brand: "Kotagiri Bungalow", city: "Nilgiris, Tamil Nadu", desc: "Colonial-era tea planter's house at 6,000 ft.", price: 160 },
  { id: 6, brand: "Diu Courtyard", city: "Diu", desc: "Portuguese-era courtyard house, three suites, sea view.", price: 120 },
];

export function findHotel(idOrName) {
  return HOTELS.find(
    (h) => h.id == idOrName || h.brand.toLowerCase() === String(idOrName).toLowerCase()
  );
}

export function nightsBetween(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.round(ms / 86400000));
}
