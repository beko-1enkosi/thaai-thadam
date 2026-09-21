import { demoHubs, hubAmenities } from "./demoHubs.js";

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
    hubId: "chathiram-waiting",
  },
  "junction-thillai": {
    times: [36, 23, 65],
    distances: [5.6, 5.1, 4.7],
    hubId: "junction-waiting",
  },
  "chathiram-junction": {
    times: [40, 26, 74],
    distances: [6.4, 5.9, 5.3],
    hubId: "chathiram-waiting",
  },
};

const routeTypes = [
  {
    id: "supported",
    name: "Via active main streets",
    mode: "Walk + bus",
    score: 9.2,
    highlight: "Highest safety score",
    summary: "More lighting and a supported waiting point.",
    reasons: [
      ["Lighting", "Most walking sections include lighting."],
      [
        "Street activity",
        "Waiting points sit near shops and active frontages.",
      ],
      ["Hub access", "A waiting hub is included at the transfer."],
      [
        "Community reports",
        "A report about a clear walking approach contributes to this illustrative rating.",
      ],
    ],
    steps: [
      "Walk along the main street approach.",
      "Take the bus connection.",
      "Complete the last stretch on foot.",
    ],
    transport:
      "Bus times and service availability are not connected. Check locally before travelling.",
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
        "The rating assumes a driver check. No driver has been checked or connected through this app.",
      ],
      [
        "Lighting",
        "The pickup point includes lighting. Side streets have incomplete coverage.",
      ],
      [
        "Hub access",
        "Fewer waiting points are included than on the bus option.",
      ],
      [
        "Community reports",
        "No recent report contributes to this rating. Missing reports do not mean a route is safe.",
      ],
    ],
    steps: [
      "Meet at the pickup point.",
      "Travel directly by auto.",
      "Alight at the destination.",
    ],
    transport: "Booking, driver checks and fare information are not connected.",
  },
  {
    id: "walking",
    name: "Neighbourhood walking route",
    mode: "Walk only",
    score: 7.4,
    highlight: "No transfers",
    summary: "A walking route with gaps in lighting and hub coverage.",
    reasons: [
      ["Lighting", "Some sections have limited lighting."],
      [
        "Street activity",
        "Quieter residential stretches have less foot traffic.",
      ],
      ["Hub access", "No supported waiting hub is included along this route."],
      [
        "Community reports",
        "An uneven pavement report lowers the illustrative rating.",
      ],
    ],
    steps: [
      "Follow the neighbourhood approach.",
      "Continue on foot to the destination.",
    ],
    transport: "Pavement condition and accessibility have not been surveyed.",
  },
];

export function getDemoRoutes(start, destination) {
  if (start === destination) return [];
  const corridor = corridors[[start, destination].sort().join("-")];
  if (!corridor) return [];
  const hub = demoHubs.find((item) => item.id === corridor.hubId);
  return routeTypes.map((route, index) => ({
    ...route,
    minutes: corridor.times[index],
    distance: corridor.distances[index],
    hub:
      index === 0
        ? {
            id: hub.id,
            name: hub.name,
            amenities:
              "Amenities: " +
              hubAmenities
                .filter((amenity) => hub.amenities.includes(amenity.id))
                .map((amenity) => amenity.label)
                .join(", ") +
              ".",
          }
        : null,
  }));
}

export const homeUpdates = [
  {
    icon: "hub",
    title: "A place to pause",
    text: "The proposed Chathiram waiting hub brings seating, shade and lighting together.",
  },
  {
    icon: "community",
    title: "From the community",
    text: "A clearer walking approach near a bus stop is one example of useful community input. Community updates are not connected yet.",
  },
];
