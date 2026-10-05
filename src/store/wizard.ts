import { create } from "zustand";
import type { RequestInput } from "@/schemas";
interface WizardState { step: number; draft: Partial<RequestInput>; setStep: (s: number) => void; save: (d: Partial<RequestInput>) => void; reset: () => void }
export const useWizard = create<WizardState>((set) => ({
  step: 0, draft: { priority: "MEDIUM" },
  setStep: (step) => set({ step }),
  save: (d) => set((s) => ({ draft: { ...s.draft, ...d } })),
  reset: () => set({ step: 0, draft: { priority: "MEDIUM" } }),
}));
