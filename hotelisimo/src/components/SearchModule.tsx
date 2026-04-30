"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Icon from "./Icon";

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

interface SearchModuleProps {
  variant?: "hero" | "compact";
  initialDestination?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export default function SearchModule({
  variant = "hero",
  initialDestination = "Yerevan",
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
}: SearchModuleProps) {
  const router = useRouter();
  const todayValue = useMemo(() => todayISO(0), []);
  const tomorrowValue = useMemo(() => todayISO(1), []);
  const dayAfterTomorrow = useMemo(() => todayISO(3), []);

  const [destination, setDestination] = useState(initialDestination);
  const [checkIn, setCheckIn] = useState(initialCheckIn ?? tomorrowValue);
  const [checkOut, setCheckOut] = useState(initialCheckOut ?? dayAfterTomorrow);
  const [guests, setGuests] = useState(initialGuests);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out must be after check-in.");
      return;
    }
    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/hotels?${params.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Search accommodations"
      className={`relative w-full rounded-2xl border border-silver-200 bg-white p-4 shadow-card md:p-6 ${
        isHero ? "lg:-mb-12" : ""
      }`}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
        <div className="md:col-span-4">
          <label htmlFor="destination" className="label-base">
            Destination
          </label>
          <div className="relative mt-2">
            <Icon
              name="mapPin"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-silver-400"
              size={18}
            />
            <input
              id="destination"
              name="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you looking to stay?"
              className="input-base pl-10"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label htmlFor="checkIn" className="label-base">
            Check-in
          </label>
          <div className="relative mt-2">
            <Icon
              name="calendar"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-silver-400"
              size={18}
            />
            <input
              id="checkIn"
              name="checkIn"
              type="date"
              value={checkIn}
              min={todayValue}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (new Date(checkOut) <= new Date(e.target.value)) {
                  const next = new Date(e.target.value);
                  next.setDate(next.getDate() + 1);
                  setCheckOut(next.toISOString().split("T")[0]);
                }
              }}
              className="input-base pl-10"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label htmlFor="checkOut" className="label-base">
            Check-out
          </label>
          <div className="relative mt-2">
            <Icon
              name="calendar"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-silver-400"
              size={18}
            />
            <input
              id="checkOut"
              name="checkOut"
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="input-base pl-10"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="guests" className="label-base">
            Guests
          </label>
          <div className="relative mt-2">
            <Icon
              name="users"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-silver-400"
              size={18}
            />
            <input
              id="guests"
              name="guests"
              type="number"
              min={1}
              max={16}
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
              className="input-base pl-10"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-charcoal-600" role={error ? "alert" : undefined}>
          {error ?? "Search availability across our curated Yerevan inventory."}
        </p>
        <button type="submit" className="btn-primary md:min-w-[200px]">
          <Icon name="search" size={18} />
          View availability
        </button>
      </div>
    </form>
  );
}
