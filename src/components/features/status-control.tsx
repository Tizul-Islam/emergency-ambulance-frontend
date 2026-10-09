"use client";
import { useState, useEffect } from "react";
import { ActionButton } from "./action-button";
import { updateStatusAction, getHospitalsAction } from "@/actions/requests";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { RequestStatus } from "@/types/api";

export function StatusControl({ dispatchId, current }: { dispatchId: string; current: RequestStatus }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState("");

  useEffect(() => {
    if (modalOpen && hospitals.length === 0) {
      getHospitalsAction().then(res => setHospitals(res || []));
    }
  }, [modalOpen, hospitals.length]);

  if (current === "COMPLETED" || current === "CANCELLED" || current === "FAILED") {
    return null;
  }

  const renderAction = () => {
    switch (current) {
      case "AMBULANCE_ASSIGNED":
        return (
          <ActionButton action={() => updateStatusAction(dispatchId, "DRIVER_ACCEPTED")} success="Driver accepted">
            Driver Accepted
          </ActionButton>
        );
      case "DRIVER_ACCEPTED":
        return (
          <ActionButton action={() => updateStatusAction(dispatchId, "EN_ROUTE")} success="En route to patient">
            Start Journey
          </ActionButton>
        );
      case "EN_ROUTE":
        return (
          <ActionButton action={() => updateStatusAction(dispatchId, "PATIENT_PICKED_UP")} success="Patient picked up">
            Patient Picked Up
          </ActionButton>
        );
      case "PATIENT_PICKED_UP":
        return (
          <button 
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
          >
            Select Hospital
          </button>
        );
      case "TO_HOSPITAL":
        return (
          <ActionButton action={() => updateStatusAction(dispatchId, "ARRIVED")} success="Arrived at hospital">
            Confirm Arrival
          </ActionButton>
        );
      case "ARRIVED":
        return (
          <ActionButton action={() => updateStatusAction(dispatchId, "COMPLETED")} success="Trip completed">
            Complete Trip
          </ActionButton>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 py-2">
        <h3 className="font-semibold text-slate-700">Next Action:</h3>
        {renderAction()}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Destination Hospital</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <label className="text-sm font-semibold block">Choose a hospital for the patient</label>
            <select 
              value={selectedHospital} 
              onChange={(e) => setSelectedHospital(e.target.value)} 
              className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
            >
              <option value="" disabled>Select a hospital...</option>
              {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} - {h.address}</option>)}
            </select>
          </div>
          <DialogFooter showCloseButton={true}>
             <ActionButton 
                action={async () => {
                  if (!selectedHospital) return { error: "Please select a hospital first" };
                  const r = await updateStatusAction(dispatchId, "TO_HOSPITAL", selectedHospital);
                  setModalOpen(false);
                  return r;
                }} 
                success="Ambulance heading to hospital"
              >
                Confirm Destination
             </ActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
