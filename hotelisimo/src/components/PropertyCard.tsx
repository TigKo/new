"use client";

import Image from "next/image";
import Icon from "./Icon";
import type { Property } from "@/lib/types";

interface Props {
  property: Property;
  onSelect?: (property: Property) => void;
  priority?: boolean;
}

const typeLabel: Record<Property["type"], string> = {
  hotel: "Hotel",
  apartment: "Apartment",
  hostel: "Hostel",
};

export default function PropertyCard({ property, onSelect, priority }: Props) {
  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-silver-200 bg-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:border-silver-300 hover:shadow-cardHover focus-within:-translate-y-0.5 focus-within:shadow-cardHover"
      aria-labelledby={`property-${property.id}-title`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-silver-100">
        <Image
          src={property.images[0]}
          alt={`${property.name} — ${property.shortDescription}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-charcoal-800 shadow-sm">
            {typeLabel[property.type]}
          </span>
          {property.newest && (
            <span className="rounded-full bg-charcoal-800 px-3 py-1 text-xs font-medium text-white shadow-sm">
              New
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-charcoal-800 shadow-sm">
          <span className="text-accent">{property.guestRating.toFixed(1)}</span>
          <span className="text-silver-400">·</span>
          <span className="text-charcoal-600">{property.reviewCount} reviews</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              id={`property-${property.id}-title`}
              className="truncate font-display text-lg font-semibold text-charcoal-800"
            >
              {property.name}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-charcoal-600">
              <Icon name="mapPin" size={14} className="text-silver-400" />
              <span className="truncate">{property.neighborhood}, Yerevan</span>
            </p>
          </div>
          <div
            className="flex shrink-0 items-center gap-0.5 text-amber-500"
            aria-label={`${property.starRating} star rating`}
          >
            {Array.from({ length: property.starRating }).map((_, i) => (
              <Icon key={i} name="star" size={14} />
            ))}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-charcoal-600 line-clamp-2">
          {property.shortDescription}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-silver-400">
              From
            </p>
            <p className="font-display text-2xl font-semibold text-charcoal-800">
              ${property.pricePerNight}
              <span className="text-sm font-normal text-charcoal-600">
                {" "}
                / night
              </span>
            </p>
          </div>
          {onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(property)}
              className="inline-flex items-center gap-1.5 rounded-md border border-silver-300 px-4 py-2 text-sm font-medium text-charcoal-800 transition-colors duration-200 hover:border-charcoal-700 hover:bg-silver-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label={`View details for ${property.name}`}
            >
              View details
              <Icon name="arrowRight" size={14} />
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-silver-300 px-4 py-2 text-sm font-medium text-charcoal-800 transition-colors duration-200 group-hover:border-charcoal-700 group-hover:bg-silver-50">
              View details
              <Icon name="arrowRight" size={14} />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
