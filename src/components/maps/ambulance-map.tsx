"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full rounded-lg" />,
});

export function AmbulanceMap({
  lat,
  lng,
  label,
  pickupLat,
  pickupLng,
}: {
  lat?: number | null;
  lng?: number | null;
  label?: string;
  pickupLat?: number;
  pickupLng?: number;
}) {
  if (lat == null || lng == null) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        Location data not available from the API yet.
      </div>
    );
  }

  return (
    <MapInner
      lat={lat}
      lng={lng}
      label={label}
      pickupLat={pickupLat}
      pickupLng={pickupLng}
    />
  );
}
