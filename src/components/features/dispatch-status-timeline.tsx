import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types/api";
import { REQUEST_FLOW } from "@/types/api";

const STATUS_LABELS: Record<string, string> = {
  REQUESTED: "Emergency Requested",
  PRIORITY_ASSIGNED: "Priority Assigned",
  AMBULANCE_ASSIGNED: "Ambulance Assigned",
  DRIVER_ACCEPTED: "Driver Accepted",
  EN_ROUTE: "En Route",
  PATIENT_PICKED_UP: "Patient Picked Up",
  TO_HOSPITAL: "Hospital Selected",
  ARRIVED: "Arrived",
  COMPLETED: "Completed",
};

interface DispatchStatusTimelineProps {
  currentStatus: RequestStatus;
  className?: string;
}

export function DispatchStatusTimeline({ currentStatus, className }: DispatchStatusTimelineProps) {
  if (currentStatus === "CANCELLED" || currentStatus === "FAILED") {
    return (
      <div className={cn("rounded-md border border-red-200 bg-red-50 p-4 text-red-800", className)}>
        <p className="font-semibold text-red-900">Dispatch {currentStatus}</p>
        <p className="text-sm">This dispatch was cancelled or failed.</p>
      </div>
    );
  }

  // Get index of current status to determine past/present/future
  // Skip REQUESTED as it's the 0th step, usually we show from PRIORITY_ASSIGNED
  const flow = REQUEST_FLOW.filter((s) => s !== "REQUESTED");
  const currentIndex = flow.indexOf(currentStatus as any);

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {flow.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={status} className="relative flex items-center gap-4">
            {/* Connecting line */}
            {index !== flow.length - 1 && (
              <div
                className={cn(
                  "absolute left-[11px] top-7 h-full w-[2px] -translate-x-1/2",
                  isCompleted ? "bg-green-500" : "bg-slate-200"
                )}
              />
            )}
            
            <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center bg-white">
              {isCompleted ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : isCurrent ? (
                <Clock className="h-6 w-6 text-blue-500" />
              ) : (
                <Circle className="h-6 w-6 text-slate-300" />
              )}
            </div>
            
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-sm font-semibold",
                  isCompleted ? "text-slate-900" : isCurrent ? "text-blue-700 font-bold" : "text-slate-400"
                )}
              >
                {STATUS_LABELS[status] || status}
              </span>
              {isCurrent && (
                <span className="text-xs text-blue-500">Current status</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
