import { Suspense } from "react";
import HotelsClient from "./HotelsClient";

export const metadata = {
  title: "Hotels — Hotelisimo",
  description:
    "Browse curated hotels and apartments in Yerevan. Filter by price, amenities and property type.",
};

export default function HotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-content py-16 text-sm text-charcoal-600">
          Loading properties…
        </div>
      }
    >
      <HotelsClient />
    </Suspense>
  );
}
