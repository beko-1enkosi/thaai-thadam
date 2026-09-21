// Fictional hubs using recognizable area names. Nothing here is live or verified.
// Distances are fixed examples from a demo reference point, not GPS calculations.
export const hubDistanceOrigin = "a demo reference point in Thillai Nagar";

export const hubAmenities = [
  { id: "lighting", label: "Lighting", filterable: true },
  { id: "seating", label: "Seating", filterable: true },
  { id: "charging", label: "Charging", filterable: true },
  { id: "accessible", label: "Accessible", filterable: true },
  { id: "toilets", label: "Toilets", filterable: true },
  {
    id: "verified-transport",
    label: "Verified transport nearby",
    filterable: true,
  },
  { id: "shelter", label: "Shelter / shade" },
  { id: "visibility", label: "Visible surroundings" },
  { id: "emergency-info", label: "Emergency information" },
];

export const demoHubs = [
  {
    id: "thillai-waiting",
    isDemo: true,
    name: "Thillai Nagar waiting hub",
    area: "Thillai Nagar",
    address:
      "Illustrative waiting point near a main-road shopping frontage in Thillai Nagar.",
    distanceKm: 0.4,
    status: "Available in demo scenario",
    access:
      "Sample access hours: 06:00-22:00. No actual opening hours have been checked.",
    score: 8.8,
    amenities: [
      "lighting",
      "seating",
      "charging",
      "accessible",
      "shelter",
      "visibility",
      "emergency-info",
    ],
    transport: [
      "Sample local bus connection",
      "Illustrative auto pickup point; drivers are not verified",
    ],
    reasons: [
      "The example includes lighting, clear sightlines, and an active shop frontage.",
      "Step-free access and seating are assumed in the sample design, not audited.",
      "Toilets and verified transport are not included in this scenario, limiting the assigned score.",
    ],
    lastReviewed: "2026-09-01",
    journeyLocationId: "thillai",
  },
  {
    id: "chathiram-waiting",
    isDemo: true,
    name: "Chathiram waiting hub",
    area: "Chathiram Bus Stand",
    address:
      "Fictional waiting area near the Chathiram Bus Stand approach, beside a sample commercial frontage.",
    distanceKm: 3.4,
    status: "Available in demo scenario",
    access:
      "Sample access hours: 05:30-22:30. Facilities are not confirmed to exist.",
    score: 9.2,
    amenities: [
      "lighting",
      "seating",
      "charging",
      "accessible",
      "toilets",
      "verified-transport",
      "shelter",
      "visibility",
      "emergency-info",
    ],
    transport: [
      "Illustrative city bus interchange",
      "Verified auto partnership assumed only in the demo; no real drivers or bookings",
    ],
    reasons: [
      "Lighting and open sightlines are included at the sample waiting and transfer points.",
      "The scenario combines seating, shelter, step-free access, and toilet availability.",
      "A verified transport partnership is assumed for scoring only; it has not been established.",
    ],
    lastReviewed: "2026-09-02",
    journeyLocationId: "chathiram",
  },
  {
    id: "junction-waiting",
    isDemo: true,
    name: "Junction waiting hub",
    area: "Trichy Junction",
    address:
      "Illustrative transfer point near the Trichy Junction station approach; not an identified railway facility.",
    distanceKm: 4.7,
    status: "Available in demo scenario",
    access:
      "Sample access: all day, with charging from 06:00-22:00. No live availability is provided.",
    score: 9.0,
    amenities: [
      "lighting",
      "seating",
      "charging",
      "accessible",
      "toilets",
      "verified-transport",
      "shelter",
      "visibility",
      "emergency-info",
    ],
    transport: [
      "Sample rail-to-bus transfer",
      "Illustrative verified auto pickup; no verified provider is connected",
    ],
    reasons: [
      "The example includes a lit transfer area with seating and visible surroundings.",
      "Accessible access and toilets are assumed in the fictional facility description.",
      "Limited charging hours reduce the assigned score; transport verification is a scenario assumption.",
    ],
    lastReviewed: "2026-09-03",
    journeyLocationId: "junction",
  },
  {
    id: "cantonment-rest",
    isDemo: true,
    name: "Cantonment rest point",
    area: "Cantonment",
    address:
      "Fictional shaded waiting point near a Cantonment bus-stop approach.",
    distanceKm: 3.8,
    status: "Limited access in demo scenario",
    access:
      "Sample access hours: 07:00-19:00. The example closes in the evening; actual access is unknown.",
    score: 7.8,
    amenities: [
      "lighting",
      "seating",
      "accessible",
      "shelter",
      "visibility",
      "emergency-info",
    ],
    transport: [
      "Illustrative neighbourhood bus stop",
      "Sample walking connection; pavement condition has not been surveyed",
    ],
    reasons: [
      "Seating, shade, and clear surroundings support waiting in this example.",
      "Step-free access is part of the design scenario, not a real accessibility assessment.",
      "Earlier closure and the absence of charging, toilets, and verified transport lower the sample score.",
    ],
    lastReviewed: "2026-09-04",
    journeyLocationId: null,
  },
  {
    id: "rockfort-rest",
    isDemo: true,
    name: "Rockfort market rest point",
    area: "Rockfort",
    address:
      "Illustrative waiting space near a Rockfort market approach; no exact site is claimed.",
    distanceKm: 4.2,
    status: "Maintenance in demo scenario",
    access:
      "Unavailable in the sample maintenance scenario. This is not a real closure or service alert.",
    score: 6.6,
    amenities: ["seating", "shelter", "visibility", "emergency-info"],
    transport: [
      "Sample market-area bus connection; not available through this fictional hub during maintenance",
    ],
    reasons: [
      "The scenario includes active shop frontages and visible surroundings.",
      "Lighting is marked unavailable during fictional maintenance, reducing the rating.",
      "Step-free access, charging, toilets, and verified transport are not included in this example.",
    ],
    lastReviewed: "2026-09-05",
    journeyLocationId: null,
  },
  {
    id: "srirangam-waiting",
    isDemo: true,
    name: "Srirangam waiting point",
    area: "Srirangam",
    address:
      "Fictional waiting area near a Srirangam neighbourhood bus approach.",
    distanceKm: 8.6,
    status: "Limited access in demo scenario",
    access:
      "Sample access hours: 06:00-20:00. No current availability or operating facility is implied.",
    score: 8.1,
    amenities: [
      "lighting",
      "seating",
      "toilets",
      "shelter",
      "visibility",
      "emergency-info",
    ],
    transport: [
      "Illustrative neighbourhood bus connection",
      "Sample auto stand; no verified transport partnership",
    ],
    reasons: [
      "Lighting, shade, and toilet availability are included in the fictional design.",
      "Step-free access is not included, which limits the assigned score.",
      "Shorter access hours and no verified transport connection lower the sample rating.",
    ],
    lastReviewed: "2026-09-06",
    journeyLocationId: null,
  },
];

export function filterDemoHubs(query, selectedAmenities) {
  const search = query.trim().toLowerCase();
  return demoHubs.filter(
    (hub) =>
      `${hub.name} ${hub.area}`.toLowerCase().includes(search) &&
      selectedAmenities.every((amenity) => hub.amenities.includes(amenity)),
  );
}
