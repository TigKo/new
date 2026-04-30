import Link from "next/link";
import Logo from "./Logo";
import Icon from "./Icon";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-silver-200 bg-white">
      <div className="container-content grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2 max-w-sm space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-charcoal-600">
            Hotelisimo is a Yerevan-based reservation platform connecting
            international travellers with carefully selected hotels and
            apartments across Armenia&apos;s capital.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-charcoal-800">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm text-charcoal-600">
            <li>
              <Link href="/" className="hover:text-charcoal-800">
                Home
              </Link>
            </li>
            <li>
              <Link href="/hotels" className="hover:text-charcoal-800">
                Hotels
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-charcoal-800">
                About
              </Link>
            </li>
            <li>
              <Link href="/about#contact" className="hover:text-charcoal-800">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-charcoal-800">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-charcoal-600">
            <li className="flex items-start gap-2">
              <Icon name="email" size={16} className="mt-1 text-charcoal-700" />
              <a
                href="mailto:richhard11@proton.me"
                className="hover:text-charcoal-800"
              >
                richhard11@proton.me
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="phone" size={16} className="mt-1 text-charcoal-700" />
              <a
                href="tel:+37499223140"
                className="hover:text-charcoal-800"
              >
                +374 99 22 31 40
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="mapPin" size={16} className="mt-1 text-charcoal-700" />
              <span>Yerevan, Armenia</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-silver-200">
        <div className="container-content flex flex-col items-start justify-between gap-3 py-6 text-xs text-charcoal-600 md:flex-row md:items-center">
          <p>&copy; {year} Hotelisimo. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/terms" className="hover:text-charcoal-800">
                Terms of service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-charcoal-800">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-charcoal-800">
                Cookie policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
