export type PropertyType = "hotel" | "apartment" | "hostel";

export type Amenity =
  | "wifi"
  | "parking"
  | "pool"
  | "breakfast"
  | "airConditioning"
  | "kitchen"
  | "gym"
  | "spa"
  | "petFriendly"
  | "airportShuttle";

export interface Review {
  author: string;
  date: string;
  rating: number;
  comment: string;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  starRating: number;
  guestRating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  neighborhood: string;
  address: string;
  shortDescription: string;
  description: string;
  amenities: Amenity[];
  houseRules: string[];
  images: string[];
  featured?: boolean;
  newest?: boolean;
  reviews: Review[];
  coordinates: { lat: number; lng: number };
}

export interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}
