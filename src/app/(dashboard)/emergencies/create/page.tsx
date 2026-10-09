import type { Metadata } from "next";
import { RequestWizard } from "@/components/features/request-wizard";

export const metadata: Metadata = { title: "Create Emergency" };

export default function CreateEmergencyPage() {
  return <RequestWizard />;
}
