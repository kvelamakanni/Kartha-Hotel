// Hotel + room-type catalog, matching the Universal Commerce Protocol
// shopping schema (see /.well-known/ucp and /api/mcp's search_hotels /
// get_hotel_details tools).
export const HOTELS = [
  {
    "id": "aurel_paris_centre",
    "brand": "Aurel Collection",
    "name": "Aurel Paris Le Marais",
    "location": {
      "city": "Paris",
      "state": null,
      "country": "FR",
      "region": "Le Marais"
    },
    "description": "Nestled in the historic Le Marais district, this 19th-century hôtel particulier blends Haussmann grandeur with contemporary French design. Steps from the Pompidou Centre.",
    "star_rating": 5,
    "amenities": [
      "Michelin Restaurant",
      "Champagne Bar",
      "Spa",
      "Concierge",
      "Bicycle Rental",
      "Library",
      "Garden Courtyard"
    ],
    "address": "12 Rue de Bretagne, 75003 Paris, France",
    "phone": "+33 1 55 00 0300",
    "images": [
      "/images/hotels/aurel_paris_1.jpg",
      "/images/hotels/aurel_paris_2.jpg"
    ],
    "coordinates": {
      "lat": 48.8623,
      "lng": 2.3607
    },
    "room_types": [
      {
        "id": "aurel_paris_classique",
        "name": "Classique Room",
        "description": "450 sq ft Parisian elegance with hand-painted ceilings and courtyard views.",
        "price_per_night": 520,
        "max_guests": 2,
        "image": "/images/rooms/classique.jpg",
        "beds": "1 King",
        "size_sqft": 450,
        "total_inventory": 5
      },
      {
        "id": "aurel_paris_prestige",
        "name": "Prestige Suite",
        "description": "800 sq ft apartment-style suite with a private salon and rooftop views of Paris.",
        "price_per_night": 980,
        "max_guests": 3,
        "image": "/images/rooms/prestige_suite.jpg",
        "beds": "1 King + Salon",
        "size_sqft": 800,
        "total_inventory": 5
      }
    ]
  },
  {
    "id": "aurel_london_mayfair",
    "brand": "Aurel Collection",
    "name": "Aurel Mayfair London",
    "location": {
      "city": "London",
      "state": null,
      "country": "GB",
      "region": "Mayfair"
    },
    "description": "A timeless Georgian townhouse in prestigious Mayfair, moments from Hyde Park. Impeccably restored with bespoke British craftsmanship and a world-class afternoon tea.",
    "star_rating": 5,
    "amenities": [
      "Afternoon Tea",
      "Whisky Bar",
      "Spa",
      "Concierge",
      "Chauffeur Service",
      "Fitness Center"
    ],
    "address": "44 Grosvenor Square, London W1K 2HP, UK",
    "phone": "+44 20 7555 0400",
    "images": [
      "/images/hotels/aurel_london_1.jpg",
      "/images/hotels/aurel_london_2.jpg"
    ],
    "coordinates": {
      "lat": 51.5095,
      "lng": -0.1521
    },
    "room_types": [
      {
        "id": "aurel_london_superior",
        "name": "Superior Room",
        "description": "400 sq ft haven of British elegance with bespoke furniture and Molton Brown amenities.",
        "price_per_night": 460,
        "max_guests": 2,
        "image": "/images/rooms/superior_room.jpg",
        "beds": "1 King",
        "size_sqft": 400,
        "total_inventory": 5
      },
      {
        "id": "aurel_london_junior",
        "name": "Junior Suite",
        "description": "620 sq ft suite with a separate sitting room and views over Grosvenor Square gardens.",
        "price_per_night": 820,
        "max_guests": 3,
        "image": "/images/rooms/junior_suite.jpg",
        "beds": "1 King + Sitting Room",
        "size_sqft": 620,
        "total_inventory": 5
      }
    ]
  },
  {
    "id": "meridian_nyc_midtown",
    "brand": "Meridian Hotels",
    "name": "Meridian Midtown Manhattan",
    "location": {
      "city": "New York",
      "state": "NY",
      "country": "US",
      "region": "Midtown"
    },
    "description": "A skyscraper icon in the heart of Midtown Manhattan. Floor-to-ceiling windows reveal dramatic skyline views, while our rooftop infinity pool offers an unforgettable experience.",
    "star_rating": 5,
    "amenities": [
      "Rooftop Pool",
      "Spa & Wellness",
      "Fine Dining",
      "Concierge",
      "Fitness Center",
      "Valet Parking",
      "Business Center",
      "Pet Friendly"
    ],
    "address": "845 7th Avenue, New York, NY 10019",
    "phone": "+1 212-555-0100",
    "images": [
      "/images/hotels/meridian_nyc_1.jpg",
      "/images/hotels/meridian_nyc_2.jpg",
      "/images/hotels/meridian_nyc_3.jpg"
    ],
    "coordinates": {
      "lat": 40.7614,
      "lng": -73.9776
    },
    "room_types": [
      {
        "id": "meridian_nyc_classic",
        "name": "Classic King Room",
        "description": "Elegant 350 sq ft sanctuary with premium bedding and city views.",
        "price_per_night": 389,
        "max_guests": 2,
        "image": "/images/rooms/classic_king.jpg",
        "beds": "1 King",
        "size_sqft": 350,
        "total_inventory": 5
      },
      {
        "id": "meridian_nyc_deluxe",
        "name": "Deluxe Skyline Suite",
        "description": "Stunning 650 sq ft suite with panoramic Manhattan skyline views and a separate living area.",
        "price_per_night": 649,
        "max_guests": 3,
        "image": "/images/rooms/deluxe_suite.jpg",
        "beds": "1 King + Sofa",
        "size_sqft": 650,
        "total_inventory": 5
      },
      {
        "id": "meridian_nyc_penthouse",
        "name": "Penthouse Collection",
        "description": "Exclusive 1,200 sq ft penthouse with private terrace, butler service, and 360° city views.",
        "price_per_night": 1299,
        "max_guests": 4,
        "image": "/images/rooms/penthouse.jpg",
        "beds": "2 King",
        "size_sqft": 1200,
        "total_inventory": 5
      }
    ]
  },
  {
    "id": "meridian_miami_beach",
    "brand": "Meridian Hotels",
    "name": "Meridian South Beach",
    "location": {
      "city": "Miami",
      "state": "FL",
      "country": "US",
      "region": "South Beach"
    },
    "description": "Art Deco glamour meets modern luxury on the iconic South Beach. Steps from the white sands and turquoise waters of the Atlantic Ocean.",
    "star_rating": 5,
    "amenities": [
      "Beach Access",
      "Oceanfront Pool",
      "Rooftop Bar",
      "Spa",
      "Water Sports",
      "Fine Dining",
      "Concierge",
      "Valet"
    ],
    "address": "1601 Collins Avenue, Miami Beach, FL 33139",
    "phone": "+1 305-555-0200",
    "images": [
      "/images/hotels/meridian_miami_1.jpg",
      "/images/hotels/meridian_miami_2.jpg"
    ],
    "coordinates": {
      "lat": 25.7825,
      "lng": -80.13
    },
    "room_types": [
      {
        "id": "meridian_miami_garden",
        "name": "Garden View Room",
        "description": "Bright 380 sq ft room overlooking our lush tropical gardens.",
        "price_per_night": 299,
        "max_guests": 2,
        "image": "/images/rooms/garden_view.jpg",
        "beds": "1 King",
        "size_sqft": 380,
        "total_inventory": 1
      },
      {
        "id": "meridian_miami_ocean",
        "name": "Oceanfront Suite",
        "description": "Breathtaking 700 sq ft suite with direct Atlantic Ocean views and a private balcony.",
        "price_per_night": 589,
        "max_guests": 3,
        "image": "/images/rooms/ocean_suite.jpg",
        "beds": "1 King + Sofa",
        "size_sqft": 700,
        "total_inventory": 5
      }
    ]
  },
  {
    "id": "solaris_dubai_marina",
    "brand": "Solaris Resorts",
    "name": "Solaris Dubai Marina",
    "location": {
      "city": "Dubai",
      "state": null,
      "country": "AE",
      "region": "Dubai Marina"
    },
    "description": "Soaring 63 floors above the Arabian Gulf, Solaris Dubai Marina redefines ultra-luxury. Al fresco dining, a sky-high infinity pool, and private beach access await.",
    "star_rating": 5,
    "amenities": [
      "Private Beach",
      "Sky Infinity Pool",
      "Multiple Restaurants",
      "Luxury Spa",
      "Yacht Charters",
      "Golf Course",
      "Helipad",
      "Butler Service"
    ],
    "address": "1 Marina Walk, Dubai Marina, UAE",
    "phone": "+971 4 555 0500",
    "images": [
      "/images/hotels/solaris_dubai_1.jpg",
      "/images/hotels/solaris_dubai_2.jpg"
    ],
    "coordinates": {
      "lat": 25.0773,
      "lng": 55.1372
    },
    "room_types": [
      {
        "id": "solaris_dubai_premier",
        "name": "Premier Gulf View",
        "description": "550 sq ft room with floor-to-ceiling windows overlooking the glittering Arabian Gulf.",
        "price_per_night": 699,
        "max_guests": 2,
        "image": "/images/rooms/gulf_view.jpg",
        "beds": "1 King",
        "size_sqft": 550,
        "total_inventory": 5
      },
      {
        "id": "solaris_dubai_sky",
        "name": "Sky Suite",
        "description": "Sprawling 1,100 sq ft sky suite with private infinity plunge pool and panoramic Dubai skyline views.",
        "price_per_night": 1699,
        "max_guests": 4,
        "image": "/images/rooms/sky_suite.jpg",
        "beds": "1 King + 1 Queen",
        "size_sqft": 1100,
        "total_inventory": 5
      }
    ]
  },
  {
    "id": "solaris_maldives",
    "brand": "Solaris Resorts",
    "name": "Solaris Maldives Overwater",
    "location": {
      "city": "North Malé Atoll",
      "state": null,
      "country": "MV",
      "region": "Maldives"
    },
    "description": "Exclusive overwater bungalows and beachfront villas set on a private island in the crystal-clear Indian Ocean. A once-in-a-lifetime escape.",
    "star_rating": 5,
    "amenities": [
      "Overwater Bungalows",
      "House Reef Snorkeling",
      "Dive Center",
      "Spa Island",
      "Sunset Cruises",
      "Water Villa Butler",
      "Seaplane Transfer"
    ],
    "address": "Private Island, North Malé Atoll, Maldives",
    "phone": "+960 660 0600",
    "images": [
      "/images/hotels/solaris_maldives_1.jpg",
      "/images/hotels/solaris_maldives_2.jpg"
    ],
    "coordinates": {
      "lat": 4.1755,
      "lng": 73.5093
    },
    "room_types": [
      {
        "id": "solaris_maldives_beach",
        "name": "Beach Pool Villa",
        "description": "Stunning 800 sq ft beach villa with private plunge pool and direct lagoon access.",
        "price_per_night": 1299,
        "max_guests": 2,
        "image": "/images/rooms/beach_villa.jpg",
        "beds": "1 King",
        "size_sqft": 800,
        "total_inventory": 5
      },
      {
        "id": "solaris_maldives_water",
        "name": "Overwater Bungalow",
        "description": "Iconic 950 sq ft overwater bungalow with glass floor panels, private sundeck and direct ocean access.",
        "price_per_night": 1899,
        "max_guests": 2,
        "image": "/images/rooms/overwater.jpg",
        "beds": "1 King",
        "size_sqft": 950,
        "total_inventory": 5
      }
    ]
  },
  {
    "id": "crest_chicago_loop",
    "brand": "Crest Urban Hotels",
    "name": "Crest Chicago The Loop",
    "location": {
      "city": "Chicago",
      "state": "IL",
      "country": "US",
      "region": "The Loop"
    },
    "description": "A sleek urban retreat in the heart of Chicago's historic Loop. Steps from Millennium Park, the Art Institute, and the lakefront. Modern American design with a bold Chicago soul.",
    "star_rating": 4,
    "amenities": [
      "Rooftop Terrace",
      "Farm-to-Table Restaurant",
      "Fitness Center",
      "Bike Share",
      "Dog Friendly",
      "Business Center"
    ],
    "address": "225 N. Michigan Avenue, Chicago, IL 60601",
    "phone": "+1 312-555-0700",
    "images": [
      "/images/hotels/crest_chicago_1.jpg",
      "/images/hotels/crest_chicago_2.jpg"
    ],
    "coordinates": {
      "lat": 41.8858,
      "lng": -87.6245
    },
    "room_types": [
      {
        "id": "crest_chicago_urban",
        "name": "Urban Queen Room",
        "description": "320 sq ft chic room with city views and locally sourced decor accents.",
        "price_per_night": 229,
        "max_guests": 2,
        "image": "/images/rooms/urban_queen.jpg",
        "beds": "1 Queen",
        "size_sqft": 320,
        "total_inventory": 5
      },
      {
        "id": "crest_chicago_lakeview",
        "name": "Lake View Suite",
        "description": "600 sq ft suite with sweeping Lake Michigan views and a full sitting area.",
        "price_per_night": 419,
        "max_guests": 3,
        "image": "/images/rooms/lake_suite.jpg",
        "beds": "1 King + Sofa",
        "size_sqft": 600,
        "total_inventory": 5
      }
    ]
  },
  {
    "id": "crest_la_westside",
    "brand": "Crest Urban Hotels",
    "name": "Crest Los Angeles West Hollywood",
    "location": {
      "city": "Los Angeles",
      "state": "CA",
      "country": "US",
      "region": "West Hollywood"
    },
    "description": "The ultimate LA scene hotel in the heart of West Hollywood. A glamorous mix of entertainment industry regulars, pool parties, and sunset cocktails on the Strip.",
    "star_rating": 4,
    "amenities": [
      "Resort Pool",
      "Celeb Chef Restaurant",
      "Rooftop Bar",
      "Spin Classes",
      "Valet",
      "Recording Studio"
    ],
    "address": "9200 Sunset Boulevard, West Hollywood, CA 90069",
    "phone": "+1 310-555-0800",
    "images": [
      "/images/hotels/crest_la_1.jpg",
      "/images/hotels/crest_la_2.jpg"
    ],
    "coordinates": {
      "lat": 34.0904,
      "lng": -118.3846
    },
    "room_types": [
      {
        "id": "crest_la_bungalow",
        "name": "Poolside Bungalow",
        "description": "350 sq ft private bungalow with direct pool access and outdoor patio.",
        "price_per_night": 359,
        "max_guests": 2,
        "image": "/images/rooms/bungalow.jpg",
        "beds": "1 King",
        "size_sqft": 350,
        "total_inventory": 5
      },
      {
        "id": "crest_la_penthouse",
        "name": "Rooftop Penthouse",
        "description": "900 sq ft rooftop retreat with private hot tub and 180° views of the Hollywood Hills.",
        "price_per_night": 899,
        "max_guests": 4,
        "image": "/images/rooms/rooftop_pent.jpg",
        "beds": "2 Queen",
        "size_sqft": 900,
        "total_inventory": 5
      }
    ]
  },
  {
    "id": "terra_bali_ubud",
    "brand": "Terra Retreat Hotels",
    "name": "Terra Bali Ubud Jungle",
    "location": {
      "city": "Ubud",
      "state": "Bali",
      "country": "ID",
      "region": "Central Bali"
    },
    "description": "Perched above the Ayung River gorge in the cultural heart of Bali. Infinity pools merge with the jungle canopy, while morning yoga and traditional Balinese healing complete your escape.",
    "star_rating": 5,
    "amenities": [
      "Jungle Infinity Pool",
      "Balinese Spa",
      "Daily Yoga",
      "Cooking Classes",
      "Rice Terrace Trekking",
      "Temple Tours"
    ],
    "address": "Jalan Kedewatan, Ubud, Bali 80571, Indonesia",
    "phone": "+62 361 555 1000",
    "images": [
      "/images/hotels/terra_bali_1.jpg",
      "/images/hotels/terra_bali_2.jpg"
    ],
    "coordinates": {
      "lat": -8.4965,
      "lng": 115.2564
    },
    "room_types": [
      {
        "id": "terra_bali_villa",
        "name": "Jungle Pool Villa",
        "description": "900 sq ft open-plan villa with private plunge pool and breathtaking jungle gorge views.",
        "price_per_night": 599,
        "max_guests": 2,
        "image": "/images/rooms/jungle_villa.jpg",
        "beds": "1 King",
        "size_sqft": 900,
        "total_inventory": 5
      },
      {
        "id": "terra_bali_family",
        "name": "Family River Suite",
        "description": "1,200 sq ft two-bedroom suite ideal for families, with river-facing deck and children's pool.",
        "price_per_night": 1099,
        "max_guests": 5,
        "image": "/images/rooms/river_suite.jpg",
        "beds": "1 King + 2 Twin",
        "size_sqft": 1200,
        "total_inventory": 5
      }
    ]
  },
  {
    "id": "terra_kyoto_higashiyama",
    "brand": "Terra Retreat Hotels",
    "name": "Terra Kyoto Higashiyama",
    "location": {
      "city": "Kyoto",
      "state": null,
      "country": "JP",
      "region": "Higashiyama"
    },
    "description": "A lovingly restored Meiji-era machiya townhouse in Kyoto's most traditional neighborhood. Tatami-floored rooms, an omakase kaiseki restaurant, and a private bamboo garden.",
    "star_rating": 5,
    "amenities": [
      "Kaiseki Restaurant",
      "Japanese Garden",
      "Tea Ceremony",
      "Onsen Bath",
      "Bicycle Rental",
      "Kimono Rental"
    ],
    "address": "47 Kodaiji-machi, Higashiyama-ku, Kyoto 605-0825",
    "phone": "+81 75 555 0900",
    "images": [
      "/images/hotels/terra_kyoto_1.jpg",
      "/images/hotels/terra_kyoto_2.jpg"
    ],
    "coordinates": {
      "lat": 35.0036,
      "lng": 135.7789
    },
    "room_types": [
      {
        "id": "terra_kyoto_tatami",
        "name": "Tatami Garden Room",
        "description": "280 sq ft authentic tatami room with shoji screens and garden views — a retreat for the soul.",
        "price_per_night": 440,
        "max_guests": 2,
        "image": "/images/rooms/tatami_room.jpg",
        "beds": "Japanese Futon",
        "size_sqft": 280,
        "total_inventory": 5
      },
      {
        "id": "terra_kyoto_suite",
        "name": "Machiya Suite",
        "description": "550 sq ft two-room suite spanning two floors of the historic townhouse with private rotenburo (outdoor bath).",
        "price_per_night": 890,
        "max_guests": 3,
        "image": "/images/rooms/machiya_suite.jpg",
        "beds": "1 King + Futon",
        "size_sqft": 550,
        "total_inventory": 5
      }
    ]
  }
];

export function findHotel(hotelId) {
  return HOTELS.find((h) => h.id === hotelId);
}

export function findRoom(hotel, roomId) {
  return hotel?.room_types.find((r) => r.id === roomId);
}

export function searchHotels(destination) {
  const q = (destination || '').toLowerCase().trim();
  if (!q) return HOTELS;
  return HOTELS.filter((h) =>
    h.location.city.toLowerCase().includes(q) ||
    h.location.country.toLowerCase().includes(q) ||
    (h.location.region || '').toLowerCase().includes(q) ||
    (h.location.state || '').toLowerCase().includes(q) ||
    h.brand.toLowerCase().includes(q) ||
    h.name.toLowerCase().includes(q)
  );
}

export function nightsBetween(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.round(ms / 86400000));
}
