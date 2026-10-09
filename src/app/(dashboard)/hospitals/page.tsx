import type { Metadata } from "next";
import HospitalsClient from "./HospitalsClient";

export const metadata: Metadata = { title: "Hospitals" };

export default function HospitalsPage() {
  return <HospitalsClient />;
}
