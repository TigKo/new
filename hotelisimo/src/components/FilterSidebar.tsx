"use client";

import { allAmenities, amenityLabels } from "@/lib/amenities";
import type { Amenity, PropertyType } from "@/lib/types";
import Icon from "./Icon";

export interface Filters {
  priceMin: number;
  priceMax: number;
  amenities: Amenity[];
  propertyTypes: PropertyType[];
  minGuestRating: number;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  resultsCount: number;
}

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "hotel", label: "Hotels" },
  { value: "apartment", label: "Apartments" },
  { value: "hostel", label: "Hostels" },
];

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  resultsCount,
}: Props) {
  const toggleAmenity = (a: Amenity) => {
    const exists = filters.amenities.includes(a);
    onChange({
      ...filters,
      amenities: exists
        ? filters.amenities.filter((x) => x !== a)
        : [...filters.amenities, a],
    });
  };

  const togglePropertyType = (t: PropertyType) => {
    const exists = filters.propertyTypes.includes(t);
    onChange({
      ...filters,
      propertyTypes: exists
        ? filters.propertyTypes.filter((x) => x !== t)
        : [...filters.propertyTypes, t],
    });
  };

  return (
    <aside aria-label="Filters" className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="filter" size={16} className="text-charcoal-700" />
          <h2 className="font-display text-base font-semibold text-charcoal-800">
            Filters
          </h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-charcoal-600 underline-offset-2 hover:text-charcoal-800 hover:underline"
        >
          Reset
        </button>
      </div>

      <p className="text-xs text-charcoal-600">
        Showing <span className="font-semibold text-charcoal-800">{resultsCount}</span>{" "}
        {resultsCount === 1 ? "property" : "properties"}.
      </p>

      <fieldset className="space-y-3">
        <legend className="label-base">Price range (per night)</legend>
        <div className="flex items-center justify-between text-sm text-charcoal-700">
          <span>${filters.priceMin}</span>
          <span>${filters.priceMax}+</span>
        </div>
        <input
          type="range"
          min={0}
          max={500}
          step={5}
          value={filters.priceMax}
          onChange={(e) =>
            onChange({ ...filters, priceMax: Number(e.target.value) })
          }
          aria-label="Maximum price per night"
          className="w-full accent-charcoal-800"
        />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="label-base">Property type</legend>
        <div className="space-y-2">
          {propertyTypes.map((p) => {
            const checked = filters.propertyTypes.includes(p.value);
            return (
              <label
                key={p.value}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-transparent px-2 py-1.5 text-sm text-charcoal-700 hover:bg-silver-50"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePropertyType(p.value)}
                  className="h-4 w-4 rounded border-silver-300 accent-charcoal-800"
                />
                {p.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="label-base">Amenities</legend>
        <div className="space-y-2">
          {allAmenities.map((a) => {
            const checked = filters.amenities.includes(a);
            return (
              <label
                key={a}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-transparent px-2 py-1.5 text-sm text-charcoal-700 hover:bg-silver-50"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(a)}
                  className="h-4 w-4 rounded border-silver-300 accent-charcoal-800"
                />
                {amenityLabels[a]}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="label-base">Minimum guest rating</legend>
        <div className="flex flex-wrap gap-2">
          {[0, 7, 8, 9].map((v) => {
            const active = filters.minGuestRating === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onChange({ ...filters, minGuestRating: v })}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                  active
                    ? "border-charcoal-800 bg-charcoal-800 text-white"
                    : "border-silver-300 bg-white text-charcoal-700 hover:border-charcoal-700"
                }`}
              >
                {v === 0 ? "Any" : `${v}+`}
              </button>
            );
          })}
        </div>
      </fieldset>
    </aside>
  );
}
