import type { Metadata } from "next";
import { RequestWizard } from "@/components/features/request-wizard";
export const metadata: Metadata = { title: "Request an ambulance" };
export default function Page() { return <RequestWizard />; }
