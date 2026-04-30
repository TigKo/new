import * as React from "react";

type IconProps = {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
};

const paths: Record<string, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  mapPin: (
    <>
      <path d="M20 10c0 7-8 13-8 13S4 17 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  star: (
    <path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  close: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  menu: (
    <>
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </>
  ),
  wifi: (
    <>
      <path d="M5 12.55a11 11 0 0 1 14 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" x2="12.01" y1="20" y2="20" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </>
  ),
  pool: (
    <>
      <path d="M2 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M6 10V5a2 2 0 0 1 2-2h2" />
      <path d="M14 10V5a2 2 0 0 1 2-2h2" />
    </>
  ),
  breakfast: (
    <>
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </>
  ),
  ac: (
    <>
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="m4.93 4.93 14.14 14.14" />
      <path d="m19.07 4.93-14.14 14.14" />
    </>
  ),
  kitchen: (
    <>
      <path d="M3 3h18v18H3z" />
      <path d="M8 7v10" />
      <circle cx="14" cy="9" r="1" />
    </>
  ),
  gym: (
    <>
      <path d="m6 5 12 14" />
      <path d="M3 8h3v8H3z" />
      <path d="M18 8h3v8h-3z" />
      <path d="M6 12h12" />
    </>
  ),
  spa: (
    <>
      <path d="M12 22c0-7 5-12 5-12 0 7-5 12-5 12Z" />
      <path d="M12 22c0-7-5-12-5-12 0 7 5 12 5 12Z" />
      <path d="M12 14V2" />
    </>
  ),
  pet: (
    <>
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="4" cy="8" r="2" />
      <circle cx="6" cy="14" r="2" />
      <path d="M8 22a4 4 0 0 1-4-4 4 4 0 0 1 .77-2.36 5 5 0 0 1 6.46-2.61A5 5 0 0 1 14.43 13a5 5 0 0 1 5 5 4 4 0 0 1-4 4Z" />
    </>
  ),
  shuttle: (
    <>
      <path d="M5 17h14M5 17a2 2 0 0 1-2-2v-4l3-6h12l3 6v4a2 2 0 0 1-2 2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  shield: (
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  ),
  sparkles: (
    <>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      <path d="M5 3v4M19 17v4M3 5h4M17 19h4" />
    </>
  ),
  pricetag: (
    <>
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0l-7.17-7.17A2 2 0 0 1 3 12V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.41.59l7.17 7.17a2 2 0 0 1 0 2.83Z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </>
  ),
  headset: (
    <>
      <path d="M3 14a9 9 0 0 1 18 0" />
      <path d="M21 14v3a2 2 0 0 1-2 2h-1v-5h3Z" />
      <path d="M3 14v3a2 2 0 0 0 2 2h1v-5H3Z" />
    </>
  ),
  email: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  filter: (
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  ),
};

export default function Icon({
  name,
  className = "",
  size = 20,
  strokeWidth = 1.6,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  const path = paths[name];
  const isFilled = name === "star";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden}
      className={className}
    >
      {path}
    </svg>
  );
}
