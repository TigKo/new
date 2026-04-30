"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import Icon from "./Icon";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/hotels", label: "Hotels" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${
        scrolled
          ? "border-silver-200 bg-canvas/90 backdrop-blur"
          : "border-transparent bg-canvas"
      }`}
    >
      <div className="container-content flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "text-charcoal-800"
                        : "text-charcoal-600 hover:text-charcoal-800"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-charcoal-800"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden md:flex">
          <Link
            href="/hotels"
            className="btn-primary !px-5 !py-2 !text-sm"
          >
            Reserve now
          </Link>
        </div>
        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-silver-200 text-charcoal-700"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="md:hidden border-t border-silver-200 bg-canvas">
          <ul className="container-content flex flex-col py-3">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-3 text-sm font-medium ${
                      active ? "text-charcoal-800" : "text-charcoal-600"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link href="/hotels" className="btn-primary w-full">
                Reserve now
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
