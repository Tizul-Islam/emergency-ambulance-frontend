import type { Metadata } from "next";
import AmbulancesClient from "./AmbulancesClient";

export const metadata: Metadata = { title: "Ambulances" };

export default function AmbulancesPage() {
  return <AmbulancesClient />;
}
