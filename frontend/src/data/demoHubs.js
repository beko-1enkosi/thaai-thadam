// Coordinates are fixed illustrative points around the named areas, not confirmed facilities.
// Fictional hubs with fixed illustrative data. No live availability or verified facilities.
export const hubDistanceOrigin = "a reference point in Thillai Nagar";

export const hubAmenities = [
  {
    id: "lighting",
    label: "Lighting",
    filterable: true,
  },
  {
    id: "seating",
    label: "Seating",
    filterable: true,
  },
  {
    id: "charging",
    label: "Charging",
    filterable: true,
  },
  {
    id: "accessible",
    label: "Accessible",
    filterable: true,
  },
  {
    id: "toilets",
    label: "Toilets",
    filterable: true,
  },
  {
    id: "verified-transport",
    label: "Transport pickup nearby",
    filterable: true,
  },
  {
    id: "shelter",
    label: "Shelter / shade",
  },
  {
    id: "visibility",
    label: "Visible surroundings",
  },
  {
    id: "emergency-info",
    label: "Emergency information",
  },
];

export const demoHubs = [
  {
    id: "thillai-waiting",
    latitude: 10.8201,
    longitude: 78.6824,
    isDemo: true,
    name: "Thillai Nagar waiting hub",
    area: "Thillai Nagar",
    address:
      "Proposed waiting point near a main road shopping frontage in Thillai Nagar.",
    distanceKm: 0.4,
    status: "Planned access",
    access: "06:00 to 22:00.",
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
    transport: ["Local bus connection", "Auto pickup point"],
    reasons: [
      "The design includes lighting, clear sightlines and an active shop frontage.",
      "Access without steps and seating contribute to the rating.",
      "Toilets and a checked transport connection are not included.",
    ],
    lastReviewed: "2026-09-01",
    journeyLocationId: "thillai",
  },
  {
    id: "chathiram-waiting",
    latitude: 10.8318,
    longitude: 78.6946,
    isDemo: true,
    name: "Chathiram waiting hub",
    area: "Chathiram Bus Stand",
    address:
      "Proposed waiting area near the Chathiram Bus Stand approach and commercial frontage.",
    distanceKm: 3.4,
    status: "Planned access",
    access: "05:30 to 22:30.",
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
    transport: ["City bus interchange", "Auto pickup partnership proposed"],
    reasons: [
      "Lighting and open sightlines support the waiting and transfer points.",
      "Seating, shelter, access without steps and toilets contribute to the rating.",
      "A transport partnership is assumed for scoring. No provider has been checked or connected.",
    ],
    lastReviewed: "2026-09-02",
    journeyLocationId: "chathiram",
  },
  {
    id: "junction-waiting",
    latitude: 10.7941,
    longitude: 78.6856,
    isDemo: true,
    name: "Junction waiting hub",
    area: "Trichy Junction",
    address:
      "Proposed transfer point near the Trichy Junction station approach.",
    distanceKm: 4.7,
    status: "Planned access",
    access: "All day. Charging hours: 06:00 to 22:00.",
    score: 9,
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
    transport: ["Rail and bus transfer", "Auto pickup partnership proposed"],
    reasons: [
      "The design includes a lit transfer area with seating and visible surroundings.",
      "Access without steps and toilets contribute to the rating.",
      "Limited charging hours reduce the rating. No transport provider has been checked.",
    ],
    lastReviewed: "2026-09-03",
    journeyLocationId: "junction",
  },
  {
    id: "cantonment-rest",
    latitude: 10.8024,
    longitude: 78.6812,
    isDemo: true,
    name: "Cantonment rest point",
    area: "Cantonment",
    address:
      "Proposed shaded waiting point near a Cantonment bus stop approach.",
    distanceKm: 3.8,
    status: "Limited access",
    access: "07:00 to 19:00. Evening access is not included.",
    score: 7.8,
    amenities: [
      "lighting",
      "seating",
      "accessible",
      "shelter",
      "visibility",
      "emergency-info",
    ],
    transport: ["Neighbourhood bus stop", "Walking connection"],
    reasons: [
      "Seating, shade and clear surroundings support waiting.",
      "Access without steps is included in the design, but has not been audited.",
      "Earlier closure and the absence of charging, toilets and a transport partnership reduce the rating.",
    ],
    lastReviewed: "2026-09-04",
    journeyLocationId: null,
  },
  {
    id: "rockfort-rest",
    latitude: 10.8272,
    longitude: 78.6972,
    isDemo: true,
    name: "Rockfort market rest point",
    area: "Rockfort",
    address: "Proposed waiting space near a Rockfort market approach.",
    distanceKm: 4.2,
    status: "Maintenance scenario",
    access:
      "Unavailable in the maintenance example. This is not a real closure alert.",
    score: 6.6,
    amenities: ["seating", "shelter", "visibility", "emergency-info"],
    transport: [
      "Market area bus connection, unavailable during the maintenance example",
    ],
    reasons: [
      "Active shop frontages and visible surroundings contribute to the rating.",
      "Lighting is unavailable in the maintenance example, reducing the rating.",
      "Access without steps, charging, toilets and a transport partnership are not included.",
    ],
    lastReviewed: "2026-09-05",
    journeyLocationId: null,
  },
  {
    id: "srirangam-waiting",
    latitude: 10.8561,
    longitude: 78.6902,
    isDemo: true,
    name: "Srirangam waiting point",
    area: "Srirangam",
    address:
      "Proposed waiting area near a Srirangam neighbourhood bus approach.",
    distanceKm: 8.6,
    status: "Limited access",
    access: "06:00 to 20:00.",
    score: 8.1,
    amenities: [
      "lighting",
      "seating",
      "toilets",
      "shelter",
      "visibility",
      "emergency-info",
    ],
    transport: ["Neighbourhood bus connection", "Auto pickup point"],
    reasons: [
      "Lighting, shade and toilets contribute to the rating.",
      "Access without steps is not included, which limits the rating.",
      "Shorter access hours and no transport partnership reduce the rating.",
    ],
    lastReviewed: "2026-09-06",
    journeyLocationId: null,
  },
];

export function filterDemoHubs(query, selectedAmenities) {
  const search = query.trim().toLowerCase();
  return demoHubs.filter(
    (hub) =>
      (hub.name + " " + hub.area).toLowerCase().includes(search) &&
      selectedAmenities.every((amenity) => hub.amenities.includes(amenity)),
  );
}
