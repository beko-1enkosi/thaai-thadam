// Fictional planning examples using real place names. No live or verified data.
// Each supported pair has fixed estimates; reverse trips reuse these demo values.
export const locations = [
  { id: "thillai", name: "Thillai Nagar" },
  { id: "chathiram", name: "Chathiram Bus Stand" },
  { id: "junction", name: "Trichy Junction" },
];

const corridors = {
  "chathiram-thillai": {
    times: [28, 18, 48],
    distances: [4.1, 3.8, 3.4],
    hub: "Chathiram waiting hub",
  },
  "junction-thillai": {
    times: [36, 23, 65],
    distances: [5.6, 5.1, 4.7],
    hub: "Junction waiting hub",
  },
  "chathiram-junction": {
    times: [40, 26, 74],
    distances: [6.4, 5.9, 5.3],
    hub: "Chathiram waiting hub",
  },
};

const routeTypes = [
  {
    id: "supported",
    name: "Via active main streets",
    mode: "Walk + bus",
    score: 9.2,
    highlight: "Highest sample score",
    summary: "More lighting and a supported waiting point in this example.",
    reasons: [
      ["Lighting", "Most walking sections are marked well-lit in the sample."],
      ["Street activity", "Sample stops sit near shops and active frontages."],
      ["Hub access", "A fictional waiting hub is included at the transfer."],
      [
        "Community reports",
        "The sample includes a clear-walkway report; it has not been checked in the real world.",
      ],
    ],
    steps: [
      "Walk along the sample main-street approach.",
      "Take the illustrative bus connection.",
      "Complete the last stretch on foot.",
    ],
    transport:
      "Bus and walking segments are illustrative. No bus number, timetable, or service availability is confirmed.",
  },
  {
    id: "direct",
    name: "Direct auto connection",
    mode: "Auto-rickshaw",
    score: 8.5,
    highlight: "Less walking",
    summary:
      "A direct connection reduces transfers, with fewer support points.",
    reasons: [
      [
        "Transport availability",
        "Assumes a verified driver in the scenario; no driver is actually verified or available through this app.",
      ],
      [
        "Lighting",
        "The sample pickup point has lighting; side streets have incomplete coverage.",
      ],
      [
        "Hub access",
        "Fewer waiting points are included than on the bus option.",
      ],
      [
        "Community reports",
        "No recent report is included in this example. Missing reports do not mean a route is safe.",
      ],
    ],
    steps: [
      "Meet at the sample pickup point.",
      "Travel directly by auto.",
      "Alight at the destination in the scenario.",
    ],
    transport:
      "Illustrative auto connection only. No booking, driver verification, or fare service is connected.",
  },
  {
    id: "walking",
    name: "Neighbourhood walking route",
    mode: "Walk only",
    score: 7.4,
    highlight: "No transfers",
    summary: "An all-walking example with gaps in lighting and hub coverage.",
    reasons: [
      ["Lighting", "Some sample sections have limited lighting."],
      [
        "Street activity",
        "The example includes quieter residential stretches.",
      ],
      [
        "Hub access",
        "No supported waiting hub is included along this sample route.",
      ],
      [
        "Community reports",
        "An illustrative uneven-pavement report lowers the assigned score.",
      ],
    ],
    steps: [
      "Follow the illustrative neighbourhood approach.",
      "Continue on foot to the destination.",
    ],
    transport:
      "Walking only in this example. Pavement condition and accessibility have not been surveyed.",
  },
];

export function getDemoRoutes(start, destination) {
  if (start === destination) return [];
  const corridor = corridors[[start, destination].sort().join("-")];
  if (!corridor) return [];
  return routeTypes.map((route, index) => ({
    ...route,
    minutes: corridor.times[index],
    distance: corridor.distances[index],
    hub:
      index === 0
        ? {
            name: corridor.hub,
            amenities:
              "Sample amenities: lighting, seating, shade, and clear sightlines.",
          }
        : null,
  }));
}

export const homeUpdates = [
  {
    icon: "hub",
    title: "A place to pause",
    text: "Chathiram waiting hub: an example of a stop with seating, shade, and lighting. This hub is fictional, not a verified nearby service.",
  },
  {
    icon: "community",
    title: "From the community",
    text: "Sample report: a clearer walking approach near a bus stop. This illustrates community input, not a real incident or update.",
  },
];
