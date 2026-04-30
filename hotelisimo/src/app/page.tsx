import Link from "next/link";
import Hero from "@/components/Hero";
import Icon from "@/components/Icon";
import PropertyCard from "@/components/PropertyCard";
import { getFeaturedProperties } from "@/lib/properties";

const valueProps = [
  {
    icon: "mapPin",
    title: "Local expertise in Yerevan",
    description:
      "Our team lives and works in Yerevan, so every property is selected with first-hand knowledge of the city, its neighbourhoods and its rhythms.",
  },
  {
    icon: "sparkles",
    title: "Carefully curated properties",
    description:
      "Each hotel and apartment is personally vetted for quality, comfort and value before it joins our inventory — no surprises on arrival.",
  },
  {
    icon: "pricetag",
    title: "Transparent pricing",
    description:
      "The price you see is the price you pay. No hidden fees, no last-minute surcharges, and clear cancellation policies on every listing.",
  },
  {
    icon: "headset",
    title: "24/7 traveller support",
    description:
      "From booking questions to on-the-ground assistance, our concierge team is available around the clock by phone and email.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProperties();
  return (
    <>
      <Hero />

      <section
        aria-labelledby="why-heading"
        className="container-content mt-24 lg:mt-28"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Why Hotelisimo
          </p>
          <h2
            id="why-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-charcoal-800 md:text-4xl"
          >
            A better way to plan your stay in Yerevan.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal-600">
            We believe travellers deserve clarity, confidence, and a personal
            point of contact. Hotelisimo combines a curated local inventory with
            the convenience of a modern booking platform.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((v) => (
            <li
              key={v.title}
              className="flex flex-col gap-3 rounded-xl border border-silver-200 bg-white p-6 shadow-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-charcoal-800 text-white">
                <Icon name={v.icon} size={18} />
              </span>
              <h3 className="font-display text-base font-semibold text-charcoal-800">
                {v.title}
              </h3>
              <p className="text-sm leading-relaxed text-charcoal-600">
                {v.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="featured-heading"
        className="container-content mt-24 lg:mt-28"
      >
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Featured stays
            </p>
            <h2
              id="featured-heading"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-charcoal-800 md:text-4xl"
            >
              Standout accommodations across Yerevan.
            </h2>
          </div>
          <Link
            href="/hotels"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-charcoal-700 hover:text-charcoal-800 md:inline-flex"
          >
            View all properties
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Link
              key={p.id}
              href={`/hotels?property=${p.id}`}
              className="block focus-visible:outline-none"
              aria-label={`View details for ${p.name}`}
            >
              <PropertyCard property={p} priority={i < 2} />
            </Link>
          ))}
        </div>

        <div className="mt-10 md:hidden">
          <Link href="/hotels" className="btn-secondary w-full">
            View all properties
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="cta-heading"
        className="mt-24 bg-charcoal-800 lg:mt-28"
      >
        <div className="container-content py-16 text-white md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-5">
              <h2
                id="cta-heading"
                className="font-display text-3xl font-semibold tracking-tight md:text-4xl"
              >
                Need help planning your trip?
              </h2>
              <p className="text-base leading-relaxed text-silver-200">
                Tell us your dates, group size and what you would like to
                experience in Yerevan. We will recommend properties and
                neighbourhoods personally suited to your trip.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link href="/about#contact" className="btn-primary !bg-white !text-charcoal-800 hover:!bg-silver-200">
                Contact our concierge
              </Link>
              <Link
                href="/hotels"
                className="text-sm font-medium text-silver-200 underline-offset-4 hover:underline"
              >
                Or browse all properties →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
