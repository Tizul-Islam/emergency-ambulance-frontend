/** Distinct Dhaka-area coords per status — mirrors backend LOCATION_BY_STATUS. */
export const AMBULANCE_STATUS_OPTIONS = [
  "AVAILABLE",
  "ASSIGNED",
  "EN_ROUTE",
  "PICKING_UP",
  "TO_HOSPITAL",
  "MAINTENANCE",
  "OFFLINE",
] as const;

export type AmbulanceStatusOption = (typeof AMBULANCE_STATUS_OPTIONS)[number];

export const LOCATION_BY_STATUS: Record<
  AmbulanceStatusOption,
  { locationLat: number; locationLng: number; label: string }
> = {
  AVAILABLE: { locationLat: 23.8103, locationLng: 90.4125, label: "Gulshan depot" },
  ASSIGNED: { locationLat: 23.7925, locationLng: 90.4078, label: "Gulshan 2 approach" },
  EN_ROUTE: { locationLat: 23.7808, locationLng: 90.4167, label: "Banani corridor" },
  PICKING_UP: { locationLat: 23.7461, locationLng: 90.3742, label: "Dhanmondi pickup" },
  TO_HOSPITAL: { locationLat: 23.739, locationLng: 90.394, label: "Central hospital route" },
  MAINTENANCE: { locationLat: 23.8223, locationLng: 90.3654, label: "Mirpur workshop" },
  OFFLINE: { locationLat: 23.8759, locationLng: 90.3795, label: "Uttara garage" },
};

export const AMBULANCE_TYPES = ["BASIC", "ICU", "CARDIAC"] as const;
