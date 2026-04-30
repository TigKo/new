import type { Amenity } from "./types";

export const amenityLabels: Record<Amenity, string> = {
  wifi: "Wi-Fi",
  parking: "Parking",
  pool: "Swimming pool",
  breakfast: "Breakfast included",
  airConditioning: "Air conditioning",
  kitchen: "Kitchen",
  gym: "Fitness centre",
  spa: "Spa",
  petFriendly: "Pet friendly",
  airportShuttle: "Airport shuttle",
};

export const amenityIcons: Record<Amenity, string> = {
  wifi: "wifi",
  parking: "parking",
  pool: "pool",
  breakfast: "breakfast",
  airConditioning: "ac",
  kitchen: "kitchen",
  gym: "gym",
  spa: "spa",
  petFriendly: "pet",
  airportShuttle: "shuttle",
};

export const allAmenities: Amenity[] = [
  "wifi",
  "parking",
  "pool",
  "breakfast",
  "airConditioning",
  "kitchen",
  "gym",
  "spa",
  "petFriendly",
  "airportShuttle",
];
