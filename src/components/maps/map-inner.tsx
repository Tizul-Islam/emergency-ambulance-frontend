"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapInner({
  lat,
  lng,
  label,
  pickupLat,
  pickupLng,
}: {
  lat: number;
  lng: number;
  label?: string;
  pickupLat?: number;
  pickupLng?: number;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-64 w-full rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>{label ?? "Ambulance location"}</Popup>
      </Marker>
      {pickupLat != null && pickupLng != null && (
        <CircleMarker
          center={[pickupLat, pickupLng]}
          radius={10}
          pathOptions={{ color: "#dc2626", fillColor: "#ef4444", fillOpacity: 0.8 }}
        >
          <Popup>Pickup location</Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}
