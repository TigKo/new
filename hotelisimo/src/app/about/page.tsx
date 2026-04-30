import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";

export const metadata = {
  title: "About — Hotelisimo",
  description:
    "Hotelisimo is a Yerevan-based reservation platform connecting international travellers with carefully selected hotels and apartments.",
};

const team = [
  {
    name: "Richard Sargsyan",
    role: "Founder & Head of Hospitality",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    bio: "Born and raised in Yerevan, Richard has spent fifteen years working with independent hoteliers across Armenia.",
  },
  {
    name: "Anna Petrosyan",
    role: "Head of Guest Experience",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80",
    bio: "Anna leads our concierge team and ensures every guest receives a thoughtful, personal welcome to the city.",
  },
  {
    name: "Davit Hakobyan",
    role: "Property Partnerships",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    bio: "Davit personally inspects each property before it joins Hotelisimo, with a particular focus on accessibility.",
  },
];

const faqs = [
  {
    q: "How does booking with Hotelisimo work?",
    a: "Search by destination and dates, choose a property that suits your needs, and submit your reservation request. A member of our team will confirm availability and send you a written confirmation by email, usually within a few hours.",
  },
  {
    q: "Are the prices on Hotelisimo final?",
    a: "Yes. The price you see on a property page reflects the full nightly rate, with all applicable service fees displayed before you confirm. There are no hidden charges added at check-in.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellation terms vary by property and are clearly displayed on each listing before you book. Most of our partners offer free cancellation up to 48 hours before check-in. Our team is happy to advise on flexible options.",
  },
  {
    q: "Do you offer support during my stay?",
    a: "Yes. Our concierge team is available 24 hours a day by phone (+374 99 22 31 40) and by email. We can help with directions, restaurant recommendations, day trips, and any issues that arise during your stay.",
  },
  {
    q: "Can you help arrange airport transfers or day trips?",
    a: "We can. Many of our partner properties include airport shuttle service, and we can arrange private transfers, guided day trips to Garni, Geghard and Lake Sevan, and other excursions on request.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-silver-200 bg-white">
        <div className="container-content grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              About Hotelisimo
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-charcoal-800 md:text-5xl">
              Yerevan, by people who know it best.
            </h1>
            <p className="text-base leading-relaxed text-charcoal-600">
              Hotelisimo was founded with a simple idea: international
              travellers deserve a reservation experience built around the city
              they are visiting, not a one-size-fits-all global marketplace. We
              focus exclusively on Yerevan so that every recommendation we
              make, and every property we list, is grounded in genuine local
              knowledge.
            </p>
            <p className="text-base leading-relaxed text-charcoal-600">
              Our team has worked with the city&apos;s independent hotels and
              apartment owners for over a decade. We believe travellers benefit
              from that direct relationship — clearer information, faster
              answers, and accommodations that match the description on the
              page.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-silver-100">
            <Image
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
              alt="Quiet city street at dusk with warm lamp light and stone facades"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="values-heading"
        className="container-content mt-20"
      >
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              What we stand for
            </p>
            <h2
              id="values-heading"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-charcoal-800"
            >
              Our values
            </h2>
          </div>
          <ul className="space-y-8 md:col-span-2">
            <li className="border-b border-silver-200 pb-8">
              <h3 className="font-display text-lg font-semibold text-charcoal-800">
                Clarity over cleverness
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
                Booking accommodation in an unfamiliar city is stressful enough.
                We write listings that say what they mean and avoid the
                marketing language that obscures the practical details.
              </p>
            </li>
            <li className="border-b border-silver-200 pb-8">
              <h3 className="font-display text-lg font-semibold text-charcoal-800">
                Direct relationships with our partners
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
                Every property on Hotelisimo is operated by someone we know
                personally. That means faster confirmations, better answers
                during your stay, and a real point of contact when something
                does not go to plan.
              </p>
            </li>
            <li>
              <h3 className="font-display text-lg font-semibold text-charcoal-800">
                Accessibility for international travellers
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
                Our platform is designed for visitors who may be planning their
                first trip to Armenia. Every listing includes the practical
                information you need — neighbourhood context, transport notes,
                and amenities you can rely on.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="team-heading"
        className="container-content mt-24"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Our team
          </p>
          <h2
            id="team-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-charcoal-800"
          >
            The people behind Hotelisimo.
          </h2>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <li
              key={m.name}
              className="overflow-hidden rounded-xl border border-silver-200 bg-white shadow-card"
            >
              <div className="relative aspect-[4/3] w-full bg-silver-100">
                <Image
                  src={m.image}
                  alt={`Portrait of ${m.name}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-charcoal-800">
                  {m.name}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-accent">
                  {m.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
                  {m.bio}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="faq-heading"
        className="container-content mt-24"
      >
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Frequently asked
            </p>
            <h2
              id="faq-heading"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-charcoal-800"
            >
              Booking, support and the practical details.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal-600">
              If you do not see your question here, please write to us — we
              respond personally to every enquiry.
            </p>
          </div>
          <ul className="md:col-span-2">
            {faqs.map((f, i) => (
              <li
                key={f.q}
                className={`group ${
                  i !== faqs.length - 1 ? "border-b border-silver-200" : ""
                }`}
              >
                <details className="py-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-display text-base font-medium text-charcoal-800 outline-none focus-visible:ring-2 focus-visible:ring-accent">
                    <span>{f.q}</span>
                    <Icon
                      name="chevronDown"
                      className="shrink-0 text-charcoal-600 transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
                    {f.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="container-content mt-24 scroll-mt-24"
      >
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Get in touch
            </p>
            <h2
              id="contact-heading"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-charcoal-800"
            >
              Speak with our team.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal-600">
              Whether you have a question about a specific property or would
              like a tailored recommendation, we are happy to help. We respond
              to every message personally.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-charcoal-700">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-charcoal-800 text-white">
                  <Icon name="email" size={16} />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-charcoal-600">
                    Email
                  </p>
                  <a
                    href="mailto:richhard11@proton.me"
                    className="font-medium text-charcoal-800 hover:underline"
                  >
                    richhard11@proton.me
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-charcoal-800 text-white">
                  <Icon name="phone" size={16} />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-charcoal-600">
                    Phone
                  </p>
                  <a
                    href="tel:+37499223140"
                    className="font-medium text-charcoal-800 hover:underline"
                  >
                    +374 99 22 31 40
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-charcoal-800 text-white">
                  <Icon name="mapPin" size={16} />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-charcoal-600">
                    Office
                  </p>
                  <p className="font-medium text-charcoal-800">
                    Kentron, Yerevan, Armenia
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <ContactForm />
            <p className="mt-4 text-xs text-charcoal-600">
              Prefer to browse first?{" "}
              <Link
                href="/hotels"
                className="font-medium text-charcoal-800 underline-offset-4 hover:underline"
              >
                Explore our properties
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
