"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { amenityIcons, amenityLabels } from "@/lib/amenities";
import type { Property } from "@/lib/types";

interface Props {
  property: Property | null;
  onClose: () => void;
}

function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function PropertyDetailModal({ property, onClose }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [checkIn, setCheckIn] = useState(() => dateOffset(1));
  const [checkOut, setCheckOut] = useState(() => dateOffset(3));
  const [guests, setGuests] = useState(2);
  const [reservationStatus, setReservationStatus] = useState<
    "idle" | "submitted"
  >("idle");

  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!property) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    setTimeout(() => closeRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [property, onClose]);

  useEffect(() => {
    setActiveImage(0);
    setReservationStatus("idle");
  }, [property?.id]);

  const nights = useMemo(() => {
    const a = new Date(checkIn).getTime();
    const b = new Date(checkOut).getTime();
    const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [checkIn, checkOut]);

  if (!property) return null;

  const subtotal = property.pricePerNight * nights;
  const fees = Math.round(subtotal * 0.08);
  const total = subtotal + fees;

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationStatus("submitted");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`detail-${property.id}-title`}
      className="fixed inset-0 z-50 flex items-stretch justify-center overflow-y-auto bg-charcoal-900/60 p-0 backdrop-blur-sm md:p-6 fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative my-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-none bg-white shadow-cardHover md:rounded-2xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close property details"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-charcoal-800 shadow-sm transition-colors hover:bg-silver-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Icon name="close" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="relative lg:col-span-3">
            <div className="relative aspect-[4/3] w-full bg-silver-100 lg:aspect-auto lg:h-full lg:min-h-[480px]">
              <Image
                src={property.images[activeImage]}
                alt={`${property.name} — image ${activeImage + 1}`}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-x-4 bottom-4 flex gap-2 overflow-x-auto no-scrollbar">
              {property.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  aria-pressed={activeImage === i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                    activeImage === i ? "border-white" : "border-white/40"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 p-6 lg:col-span-2 lg:p-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-accent">
                {property.neighborhood} · {property.type}
              </p>
              <h2
                id={`detail-${property.id}-title`}
                className="mt-1 font-display text-2xl font-semibold text-charcoal-800 md:text-3xl"
              >
                {property.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-charcoal-600">
                <span
                  className="flex items-center gap-0.5 text-amber-500"
                  aria-label={`${property.starRating} star rating`}
                >
                  {Array.from({ length: property.starRating }).map((_, i) => (
                    <Icon key={i} name="star" size={14} />
                  ))}
                </span>
                <span>{property.guestRating.toFixed(1)} guest rating</span>
                <span>·</span>
                <span>{property.reviewCount} reviews</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-charcoal-700">
              {property.description}
            </p>

            <div>
              <h3 className="text-sm font-semibold text-charcoal-800">
                Amenities
              </h3>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-charcoal-700">
                {property.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <Icon
                      name={amenityIcons[a]}
                      size={16}
                      className="text-charcoal-700"
                    />
                    <span>{amenityLabels[a]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-charcoal-800">
                House rules
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-charcoal-700">
                {property.houseRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2">
                    <Icon
                      name="check"
                      size={16}
                      className="mt-0.5 text-accent"
                    />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form
              onSubmit={handleReserve}
              className="rounded-xl border border-silver-200 bg-silver-50 p-5"
              aria-label="Reservation details"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`ci-${property.id}`}
                    className="label-base"
                  >
                    Check-in
                  </label>
                  <input
                    id={`ci-${property.id}`}
                    type="date"
                    value={checkIn}
                    min={dateOffset(0)}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="input-base mt-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`co-${property.id}`}
                    className="label-base"
                  >
                    Check-out
                  </label>
                  <input
                    id={`co-${property.id}`}
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="input-base mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor={`gst-${property.id}`}
                    className="label-base"
                  >
                    Guests
                  </label>
                  <input
                    id={`gst-${property.id}`}
                    type="number"
                    min={1}
                    max={16}
                    value={guests}
                    onChange={(e) =>
                      setGuests(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="input-base mt-2"
                  />
                </div>
              </div>

              <dl className="mt-4 space-y-2 border-t border-silver-200 pt-4 text-sm">
                <div className="flex justify-between text-charcoal-700">
                  <dt>
                    ${property.pricePerNight} × {nights}{" "}
                    {nights === 1 ? "night" : "nights"}
                  </dt>
                  <dd>${subtotal}</dd>
                </div>
                <div className="flex justify-between text-charcoal-700">
                  <dt>Service fee</dt>
                  <dd>${fees}</dd>
                </div>
                <div className="flex justify-between border-t border-silver-200 pt-2 font-semibold text-charcoal-800">
                  <dt>Total</dt>
                  <dd>${total}</dd>
                </div>
              </dl>

              {reservationStatus === "submitted" ? (
                <div
                  role="status"
                  className="mt-4 rounded-md border border-accent/30 bg-white px-4 py-3 text-sm text-charcoal-800"
                >
                  Thank you. A reservation request has been submitted. Our team
                  will confirm your booking by email shortly.
                </div>
              ) : (
                <button type="submit" className="btn-primary mt-4 w-full">
                  Reserve now
                </button>
              )}
              <p className="mt-3 text-xs text-charcoal-600">
                You will not be charged at this step.
              </p>
            </form>

            {property.reviews.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-charcoal-800">
                  Recent reviews
                </h3>
                <ul className="mt-3 space-y-4">
                  {property.reviews.map((r) => (
                    <li
                      key={r.author + r.date}
                      className="rounded-lg border border-silver-200 bg-white p-4"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-charcoal-800">
                          {r.author}
                        </span>
                        <span className="text-charcoal-600">{r.date}</span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-accent">
                        {r.rating.toFixed(1)} / 10
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-charcoal-700">
                        {r.comment}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
