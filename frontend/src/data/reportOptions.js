import { demoHubs } from "./demoHubs.js";

export const reportCategories = [
  { value: "poor_lighting", label: "Poor lighting" },
  { value: "harassment_safety", label: "Harassment or safety concern" },
  { value: "unsafe_stop_hub", label: "Unsafe bus stop or mobility hub" },
  { value: "road_walkway_obstruction", label: "Road or walkway obstruction" },
  { value: "transport_concern", label: "Transport concern" },
  { value: "accessibility_issue", label: "Accessibility issue" },
  { value: "other", label: "Other" },
];

// Use the same area names as the hub directory. The API validates this list too.
export const reportAreas = [...new Set(demoHubs.map((hub) => hub.area))];
