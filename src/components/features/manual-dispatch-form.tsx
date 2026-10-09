"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAvailableAmbulancesAction, manualDispatchAction } from "@/actions/requests";
import type { Ambulance, EmergencyRequest } from "@/types/api";

export function ManualDispatchForm({ request }: { request: EmergencyRequest }) {
  const router = useRouter();
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const a = await getAvailableAmbulancesAction();
        setAmbulances(a || []);
      } catch {
        toast.error("Failed to load available resources.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAssign = async () => {
    if (!selectedAmbulance) {
      toast.warning("Please select an ambulance.");
      return;
    }
    setSubmitting(true);
    const res = await manualDispatchAction({
      requestId: request.id,
      ambulanceId: selectedAmbulance,
    });
    setSubmitting(false);

    if (res?.error) {
      if (res.error.toLowerCase().includes("conflict") || res.error.toLowerCase().includes("busy")) {
        toast.error("Ambulance is no longer available. Please refresh and try again.");
      } else {
        toast.error(res.error);
      }
    } else {
      toast.success("Ambulance assigned successfully!");
      router.push(`/emergencies/${request.id}`);
    }
  };

  const selected = ambulances.find(a => a.id === selectedAmbulance);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-1 md:p-8 text-white shadow-2xl min-h-[600px]">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      
      <div className="relative z-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full md:col-span-2 lg:col-span-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg">
            <h3 className="text-xl font-bold tracking-tight text-white/90">Emergency Request Details</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-slate-400">Description</p>
                <p className="font-semibold">{request.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Patient</p>
                <p className="font-semibold">{request.patient?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Pickup Location</p>
                <p className="font-semibold">{request.pickupAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Priority</p>
                <p className="font-semibold">{request.priority}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-full md:col-span-2 lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white/90">Select Ambulance</h3>
          <div className="grid gap-3 sm:grid-cols-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
            {loading ? (
              <p className="text-slate-400 animate-pulse col-span-2">Loading available ambulances...</p>
            ) : ambulances.length === 0 ? (
              <p className="text-slate-400 col-span-2">No available ambulances found.</p>
            ) : (
              ambulances.map(a => (
                <div 
                  key={a.id} 
                  onClick={() => setSelectedAmbulance(a.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all hover:scale-[1.02] ${
                    selectedAmbulance === a.id 
                      ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  } backdrop-blur-md`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <p className="font-bold text-lg text-white">{a.registrationNumber}</p>
                    <span className="text-xs px-2 py-1 rounded bg-white/10 font-medium">{a.type}</span>
                  </div>
                  <div className="space-y-1 text-sm text-slate-300">
                    <p>Capacity: <span className="text-white">{a.capacity || 'N/A'}</span></p>
                    <p>Driver: <span className="text-white">{a.driver?.name || 'Unassigned'}</span></p>
                    <p>Status: <span className="text-white">{a.status}</span></p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-span-full md:col-span-1 lg:col-span-1 flex flex-col justify-start space-y-4 pt-11">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h4 className="font-bold text-white mb-4">Assignment Summary</h4>
            <div className="space-y-3 text-sm text-slate-300 mb-6">
              <div>
                <p className="text-slate-400">Selected Vehicle</p>
                <p className="font-semibold text-white text-base">
                  {selected?.registrationNumber || "None selected"}
                </p>
              </div>
              {selected && (
                <>
                  <div>
                    <p className="text-slate-400">Type</p>
                    <p className="font-medium text-white">{selected.type}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Driver</p>
                    <p className="font-medium text-white">{selected.driver?.name || "Unknown"}</p>
                  </div>
                </>
              )}
            </div>
            
            <button
              onClick={handleAssign}
              disabled={submitting || !selectedAmbulance}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-blue-500/25 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {submitting ? "Assigning..." : "Assign Ambulance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
