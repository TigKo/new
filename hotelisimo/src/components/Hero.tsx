import Image from "next/image";
import SearchModule from "./SearchModule";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal-900 pb-20 pt-24 lg:pb-28 lg:pt-32">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=2400&q=80"
          alt="Hotel terrace overlooking a mountain landscape at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-75"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-charcoal-900/70 via-charcoal-900/50 to-charcoal-900/85"
        />
      </div>

      <div className="container-content">
        <div className="max-w-2xl space-y-6 text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-silver-200 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-light" aria-hidden="true" />
            Local expertise · Yerevan, Armenia
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Reserve a stay in Yerevan with confidence.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-silver-200 md:text-lg">
            Hotelisimo connects international travellers with carefully selected
            hotels and apartments across the capital. Transparent pricing,
            verified properties, and assistance at every step.
          </p>
        </div>

        <div className="mt-10 lg:mt-14">
          <SearchModule variant="hero" />
        </div>
      </div>
    </section>
  );
}
