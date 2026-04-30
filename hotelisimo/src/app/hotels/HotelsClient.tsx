"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar, { type Filters } from "@/components/FilterSidebar";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import PropertyDetailModal from "@/components/PropertyDetailModal";
import SearchModule from "@/components/SearchModule";
import Icon from "@/components/Icon";
import { properties, getPropertyById } from "@/lib/properties";
import type { Property } from "@/lib/types";

type SortKey =
  | "recommended"
  | "priceAsc"
  | "priceDesc"
  | "rating"
  | "newest";

const defaultFilters: Filters = {
  priceMin: 0,
  priceMax: 500,
  amenities: [],
  propertyTypes: [],
  minGuestRating: 0,
};

export default function HotelsClient() {
  const searchParams = useSearchParams();
  const initialDestination = searchParams.get("destination") ?? "Yerevan";
  const initialCheckIn = searchParams.get("checkIn") ?? undefined;
  const initialCheckOut = searchParams.get("checkOut") ?? undefined;
  const initialGuests = Number(searchParams.get("guests") ?? 2);
  const initialPropertyId = searchParams.get("property");

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Property | null>(null);
  const [filtersOpenMobile, setFiltersOpenMobile] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (initialPropertyId) {
      const found = getPropertyById(initialPropertyId);
      if (found) setSelected(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPropertyId]);

  const filtered = useMemo(() => {
    let list = properties.filter((p) => {
      if (p.pricePerNight > filters.priceMax) return false;
      if (p.pricePerNight < filters.priceMin) return false;
      if (
        filters.propertyTypes.length > 0 &&
        !filters.propertyTypes.includes(p.type)
      )
        return false;
      if (
        filters.amenities.length > 0 &&
        !filters.amenities.every((a) => p.amenities.includes(a))
      )
        return false;
      if (p.guestRating < filters.minGuestRating) return false;
      return true;
    });

    switch (sort) {
      case "priceAsc":
        list = [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case "priceDesc":
        list = [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.guestRating - a.guestRating);
        break;
      case "newest":
        list = [...list].sort(
          (a, b) => Number(!!b.newest) - Number(!!a.newest),
        );
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(!!b.featured) - Number(!!a.featured),
        );
    }
    return list;
  }, [filters, sort]);

  const reset = () => setFilters(defaultFilters);

  return (
    <>
      <section className="border-b border-silver-200 bg-white">
        <div className="container-content py-8 md:py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Hotels &amp; apartments
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-charcoal-800 md:text-4xl">
              Stays in {initialDestination}.
            </h1>
            <p className="mt-2 text-sm text-charcoal-600">
              {properties.length} curated properties across the city.
            </p>
          </div>
          <div className="mt-6">
            <SearchModule
              variant="compact"
              initialDestination={initialDestination}
              initialCheckIn={initialCheckIn}
              initialCheckOut={initialCheckOut}
              initialGuests={initialGuests}
            />
          </div>
        </div>
      </section>

      <section className="container-content py-10">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={reset}
              resultsCount={filtered.length}
            />
          </div>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpenMobile(true)}
                className="inline-flex items-center gap-2 rounded-md border border-silver-300 bg-white px-4 py-2 text-sm font-medium text-charcoal-800 lg:hidden"
                aria-haspopup="dialog"
                aria-expanded={filtersOpenMobile}
              >
                <Icon name="filter" size={16} />
                Filters
              </button>

              <p className="text-sm text-charcoal-600 lg:hidden">
                {filtered.length}{" "}
                {filtered.length === 1 ? "property" : "properties"}
              </p>

              <div className="ml-auto flex items-center gap-3">
                <label
                  htmlFor="sort"
                  className="text-xs font-medium uppercase tracking-wider text-charcoal-600"
                >
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-md border border-silver-300 bg-white px-3 py-2 text-sm text-charcoal-800 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="recommended">Recommended</option>
                  <option value="priceAsc">Price (low to high)</option>
                  <option value="priceDesc">Price (high to low)</option>
                  <option value="rating">Guest rating</option>
                  <option value="newest">Newest listings</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-silver-200 bg-white p-10 text-center">
                <h2 className="font-display text-xl font-semibold text-charcoal-800">
                  No properties match your filters.
                </h2>
                <p className="mt-2 text-sm text-charcoal-600">
                  Try adjusting your price range or removing a filter to see
                  more results.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="btn-secondary mt-6"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 fade-in">
                {filtered.map((p, i) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    onSelect={setSelected}
                    priority={i < 3}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {filtersOpenMobile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="fixed inset-0 z-50 flex bg-charcoal-900/60 backdrop-blur-sm lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFiltersOpenMobile(false);
          }}
        >
          <div className="ml-auto flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-cardHover">
            <div className="flex items-center justify-between pb-4">
              <h2 className="font-display text-lg font-semibold text-charcoal-800">
                Filters
              </h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpenMobile(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-silver-200 text-charcoal-700"
              >
                <Icon name="close" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={reset}
              resultsCount={filtered.length}
            />
            <button
              type="button"
              onClick={() => setFiltersOpenMobile(false)}
              className="btn-primary mt-8"
            >
              Show {filtered.length}{" "}
              {filtered.length === 1 ? "property" : "properties"}
            </button>
          </div>
        </div>
      )}

      <PropertyDetailModal
        property={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
