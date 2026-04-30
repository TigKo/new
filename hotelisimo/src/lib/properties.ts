import type { Property } from "./types";

// Property images sourced from Unsplash (royalty-free).
// In production these will be replaced with the client's photography.
export const properties: Property[] = [
  {
    id: "republic-square-suites",
    name: "Republic Square Suites",
    type: "hotel",
    starRating: 5,
    guestRating: 9.4,
    reviewCount: 412,
    pricePerNight: 185,
    currency: "USD",
    neighborhood: "Kentron",
    address: "12 Tigran Mets Avenue, Yerevan 0010",
    shortDescription: "Boutique hotel steps from Republic Square.",
    description:
      "A refined five-star residence in the heart of central Yerevan, Republic Square Suites combines classical Armenian architecture with thoughtful modern interiors. Floor-to-ceiling windows look directly onto the singing fountains, and the rooftop terrace offers panoramic views of Mount Ararat on clear mornings.",
    amenities: ["wifi", "parking", "breakfast", "airConditioning", "gym", "spa", "airportShuttle"],
    houseRules: [
      "Check-in from 14:00",
      "Check-out by 12:00",
      "No smoking inside the property",
      "Quiet hours from 22:00 to 08:00",
    ],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
    reviews: [
      {
        author: "Marie L.",
        date: "March 2026",
        rating: 9.6,
        comment:
          "Exceptional location and very attentive staff. The view of Republic Square at night is unforgettable.",
      },
      {
        author: "David R.",
        date: "February 2026",
        rating: 9.2,
        comment:
          "Beautifully designed rooms and an outstanding breakfast. We will return on our next trip to Armenia.",
      },
    ],
    coordinates: { lat: 40.1776, lng: 44.5126 },
  },
  {
    id: "cascade-loft-residence",
    name: "Cascade Loft Residence",
    type: "apartment",
    starRating: 4,
    guestRating: 9.1,
    reviewCount: 287,
    pricePerNight: 110,
    currency: "USD",
    neighborhood: "Cascade",
    address: "5 Tamanyan Street, Yerevan 0009",
    shortDescription: "Modern loft beside the Cafesjian Cascade.",
    description:
      "A bright, contemporary apartment within walking distance of the Cafesjian Center for the Arts. The open-plan loft features a fully equipped kitchen, a quiet bedroom suite, and a private balcony overlooking the sculpture park.",
    amenities: ["wifi", "kitchen", "airConditioning", "parking", "petFriendly"],
    houseRules: [
      "Self check-in with smart lock",
      "Maximum 4 guests",
      "No parties or events",
      "Pets welcome with prior notice",
    ],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
    reviews: [
      {
        author: "Alex P.",
        date: "April 2026",
        rating: 9.3,
        comment:
          "Spacious, spotless and ideally positioned for exploring the Cascade and Northern Avenue.",
      },
    ],
    coordinates: { lat: 40.1922, lng: 44.5151 },
  },
  {
    id: "opera-garden-hotel",
    name: "Opera Garden Hotel",
    type: "hotel",
    starRating: 4,
    guestRating: 8.9,
    reviewCount: 521,
    pricePerNight: 145,
    currency: "USD",
    neighborhood: "Opera District",
    address: "27 Sayat-Nova Avenue, Yerevan 0001",
    shortDescription: "Classic comfort opposite the Opera House.",
    description:
      "A welcoming four-star hotel facing the National Academic Opera and Ballet Theatre. Rooms are spacious and quiet, the on-site restaurant serves traditional Armenian cuisine, and the central location makes everything in Kentron walkable.",
    amenities: ["wifi", "breakfast", "airConditioning", "gym", "airportShuttle"],
    houseRules: [
      "Check-in from 15:00",
      "Check-out by 11:00",
      "Children of all ages welcome",
      "No smoking",
    ],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
    reviews: [
      {
        author: "Sophia K.",
        date: "January 2026",
        rating: 9.0,
        comment:
          "A true classic. Friendly reception, comfortable beds, and the Opera House right outside the door.",
      },
    ],
    coordinates: { lat: 40.1894, lng: 44.5141 },
  },
  {
    id: "northern-avenue-apartment",
    name: "Northern Avenue Apartment",
    type: "apartment",
    starRating: 4,
    guestRating: 9.0,
    reviewCount: 198,
    pricePerNight: 95,
    currency: "USD",
    neighborhood: "Northern Avenue",
    address: "8 Northern Avenue, Yerevan 0001",
    shortDescription: "Stylish apartment on the pedestrian promenade.",
    description:
      "A meticulously furnished apartment directly on Northern Avenue, the city's pedestrian promenade. Boutiques, cafés and Republic Square are all minutes away. The unit includes a workspace, espresso machine and laundry facilities.",
    amenities: ["wifi", "kitchen", "airConditioning", "gym"],
    houseRules: [
      "Self check-in",
      "Maximum 3 guests",
      "Quiet building — please respect neighbours",
    ],
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
    newest: true,
    reviews: [
      {
        author: "Hiroshi T.",
        date: "March 2026",
        rating: 9.1,
        comment:
          "Perfect base for a city break. Quiet at night despite the central location.",
      },
    ],
    coordinates: { lat: 40.1828, lng: 44.5152 },
  },
  {
    id: "ararat-view-hostel",
    name: "Ararat View Hostel",
    type: "hostel",
    starRating: 3,
    guestRating: 8.6,
    reviewCount: 643,
    pricePerNight: 28,
    currency: "USD",
    neighborhood: "Kond",
    address: "44 Saryan Street, Yerevan 0002",
    shortDescription: "Welcoming hostel with views of Mount Ararat.",
    description:
      "A friendly, well-run hostel popular with independent travellers. Choose between mixed dormitories and private rooms, all with shared lounges, a communal kitchen and a rooftop terrace facing Mount Ararat.",
    amenities: ["wifi", "kitchen", "breakfast", "airConditioning"],
    houseRules: [
      "Check-in 14:00 to 23:00",
      "Lockers available for all guests",
      "Quiet hours from 23:00",
    ],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1576675784201-0e142b423952?auto=format&fit=crop&w=1600&q=80",
    ],
    reviews: [
      {
        author: "Lena W.",
        date: "February 2026",
        rating: 8.8,
        comment:
          "Spotlessly clean and the staff helped us plan day trips to Geghard and Garni.",
      },
    ],
    coordinates: { lat: 40.1850, lng: 44.5063 },
  },
  {
    id: "mashtots-park-hotel",
    name: "Mashtots Park Hotel",
    type: "hotel",
    starRating: 5,
    guestRating: 9.3,
    reviewCount: 359,
    pricePerNight: 220,
    currency: "USD",
    neighborhood: "Mashtots",
    address: "60 Mashtots Avenue, Yerevan 0009",
    shortDescription: "Refined five-star hotel with garden views.",
    description:
      "Set along the leafy Mashtots Avenue, this five-star hotel offers generously sized rooms, a heated indoor pool, and a wellness spa. The on-site restaurant is led by an Armenian chef whose tasting menu has been recognised internationally.",
    amenities: [
      "wifi",
      "parking",
      "pool",
      "breakfast",
      "airConditioning",
      "gym",
      "spa",
      "airportShuttle",
    ],
    houseRules: [
      "Check-in from 14:00",
      "Check-out by 12:00",
      "Spa requires advance reservation",
    ],
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1551776235-dde6d4829808?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
    reviews: [
      {
        author: "Farah N.",
        date: "April 2026",
        rating: 9.5,
        comment:
          "An impeccable stay. The spa and the restaurant are both worth a visit even if you are not a guest.",
      },
    ],
    coordinates: { lat: 40.1891, lng: 44.5067 },
  },
  {
    id: "old-yerevan-apartment",
    name: "Old Yerevan Apartment",
    type: "apartment",
    starRating: 3,
    guestRating: 8.8,
    reviewCount: 142,
    pricePerNight: 72,
    currency: "USD",
    neighborhood: "Kond",
    address: "21 Paronyan Street, Yerevan 0015",
    shortDescription: "Characterful apartment in a historic district.",
    description:
      "A warm, traditionally styled apartment in the Kond historic district. Exposed stone walls, vintage furnishings and a small private courtyard make this a quiet retreat just minutes from the city centre by foot.",
    amenities: ["wifi", "kitchen", "airConditioning"],
    houseRules: [
      "Self check-in",
      "Maximum 2 guests",
      "No smoking",
    ],
    images: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80",
    ],
    newest: true,
    reviews: [
      {
        author: "Tomás A.",
        date: "April 2026",
        rating: 8.9,
        comment:
          "Loved the character of the apartment. Felt like staying in someone's beautifully kept home.",
      },
    ],
    coordinates: { lat: 40.1845, lng: 44.5068 },
  },
  {
    id: "victory-park-residence",
    name: "Victory Park Residence",
    type: "apartment",
    starRating: 4,
    guestRating: 9.0,
    reviewCount: 96,
    pricePerNight: 130,
    currency: "USD",
    neighborhood: "Nor Nork",
    address: "3 Azatutyan Avenue, Yerevan 0027",
    shortDescription: "Family-friendly residence with park access.",
    description:
      "A two-bedroom residence overlooking Victory Park and the Mother Armenia monument. Ideal for families, with two bathrooms, a large dining area, and direct access to the park's walking paths and playgrounds.",
    amenities: ["wifi", "parking", "kitchen", "airConditioning", "petFriendly"],
    houseRules: [
      "Check-in from 14:00",
      "Maximum 6 guests",
      "Children welcome",
      "Pets welcome with prior notice",
    ],
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1600&q=80",
    ],
    reviews: [
      {
        author: "Anna G.",
        date: "March 2026",
        rating: 9.1,
        comment:
          "Plenty of space for our family of five. The park right outside was a highlight for the children.",
      },
    ],
    coordinates: { lat: 40.1969, lng: 44.5331 },
  },
  {
    id: "saryan-boutique-hotel",
    name: "Saryan Boutique Hotel",
    type: "hotel",
    starRating: 4,
    guestRating: 9.2,
    reviewCount: 274,
    pricePerNight: 165,
    currency: "USD",
    neighborhood: "Saryan",
    address: "16 Saryan Street, Yerevan 0002",
    shortDescription: "Boutique hotel on Yerevan's wine street.",
    description:
      "A warm, contemporary boutique hotel on Saryan Street, known for its wine bars and small art galleries. The hotel's lounge serves an excellent selection of Armenian wines, and rooms feature locally crafted ceramics and textiles.",
    amenities: ["wifi", "breakfast", "airConditioning", "gym"],
    houseRules: [
      "Check-in from 15:00",
      "Check-out by 12:00",
      "No smoking inside the property",
    ],
    images: [
      "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80",
    ],
    newest: true,
    reviews: [
      {
        author: "James O.",
        date: "April 2026",
        rating: 9.3,
        comment:
          "A genuine sense of place. The wine pairing dinner was a wonderful introduction to Armenia.",
      },
    ],
    coordinates: { lat: 40.1885, lng: 44.5077 },
  },
];

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured).slice(0, 6);
}
