import Link from "next/link";

export default function Logo({ inverted = false }: { inverted?: boolean }) {
  const color = inverted ? "text-white" : "text-charcoal-800";
  const accent = inverted ? "text-silver-200" : "text-accent";
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 ${color}`}
      aria-label="Hotelisimo home"
    >
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 items-center justify-center rounded-md border ${
          inverted ? "border-white/30" : "border-charcoal-800"
        } font-display text-lg font-semibold`}
      >
        H
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        Hotel<span className={accent}>isimo</span>
      </span>
    </Link>
  );
}
