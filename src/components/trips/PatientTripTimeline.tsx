import { DispatchStatusTimeline } from "@/components/features/dispatch-status-timeline";
import { RequestStatus } from "@/types/api";

export function PatientTripTimeline({ status }: { status: RequestStatus }) {
  // We reuse the robust DispatchStatusTimeline as the Trip lifecycle directly tracks the Dispatch/EmergencyRequest status in the backend.
  return <DispatchStatusTimeline currentStatus={status} />;
}
