const paths = {
  foot: "M9 10c-3 0-4 3-3 6l1 4c1 3 6 2 6-1l-1-5c0-2-1-4-3-4 M12 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4 M7 4v2 M4 7l1 1",
  close: "M6 6l12 12 M18 6 6 18",
  lighting: "M9 18h6 M10 21h4 M8 13a6 6 0 1 1 8 0l-1 3H9z",
  seating: "M5 4v10h14V4 M3 14h18 M5 14v7 M19 14v7 M5 9h14",
  charging: "m13 2-8 12h6l-1 8 9-13h-6z",
  accessible: "M10 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2 M10 7v7h7l3 6 M10 9h7 M7 12a5 5 0 1 0 7 7",
  toilets: "M7 3v7 M4 5v5h6V5 M7 10v11 M17 3v18 M14 10h6l-3-6z",
  transport: "M5 17V5c0-3 14-3 14 0v12H5 M5 11h14 M8 14h1 M15 14h1 M7 17v3 M17 17v3",

  home: "m3 10 9-7 9 7v10H3z M9 20v-7h6v7",
  journey: "M5 5h9a5 5 0 0 1 0 10H9 M12 12l-3 3 3 3 M5 3v4 M19 18v4",
  hub: "M3 21V9l9-6 9 6v12 M3 10h18 M8 21v-7h8v7 M10 7h4",
  report: "M6 21V3 M6 4h13l-3 5 3 5H6",
  community:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M17 4a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-4 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z m-4 9 3 3 5-6",
  arrow: "M4 12h16 m-6-6 6 6-6 6",
  pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0 M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  locate:
    "M12 2v4 M12 18v4 M2 12h4 M18 12h4 M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  clock: "M12 8v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  sun: "M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0",
  footprint:
    "M8 11c-3-1-5 2-4 5l2 4c1 2 4 1 4-1v-4c0-2-1-3-2-4 M16 4c3-1 5 2 4 5l-2 4c-1 2-4 1-4-1V8c0-2 1-3 2-4",
};

export default function Icon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name] || paths.shield} />
    </svg>
  );
}
