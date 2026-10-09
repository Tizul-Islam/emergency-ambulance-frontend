"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requestSchema, type RequestInput } from "@/schemas";
import { useWizard } from "@/store/wizard";
import { createRequestAction } from "@/actions/requests";
import { cn, label } from "@/lib/utils";

const STEPS = ["Details", "Location", "Review"];
const STEP_FIELDS: (keyof RequestInput)[][] = [["description", "priority"], ["pickupAddress", "pickupLat", "pickupLng"], []];

export function RequestWizard() {
  const router = useRouter();
  const { step, draft, setStep, save, reset } = useWizard();
  const [pending, start] = useTransition();
  const { register, handleSubmit, trigger, getValues, setValue, formState: { errors } } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema), mode: "onChange", defaultValues: draft as RequestInput,
  });
  const err = (k: keyof RequestInput) => errors[k] && <p className="mt-1 text-sm text-red-600">{errors[k]?.message}</p>;
  const next = async () => { if (await trigger(STEP_FIELDS[step])) { save(getValues()); setStep(step + 1); } };
  const locate = () => navigator.geolocation.getCurrentPosition(
    (p) => { setValue("pickupLat", p.coords.latitude, { shouldValidate: true }); setValue("pickupLng", p.coords.longitude, { shouldValidate: true }); },
    () => toast.error("Could not read your location. Enter the coordinates by hand."));
  const v = getValues();
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-extrabold">Request an ambulance</h1>
      <ol className="flex gap-2">{STEPS.map((s, i) => <li key={s} aria-current={i === step ? "step" : undefined} className={cn("flex-1 rounded-md border p-2 text-center text-sm", i === step ? "border-teal-700 bg-teal-700 font-semibold text-white" : "bg-white")}>{i + 1}. {s}</li>)}</ol>
      <Card>
        <form noValidate className="space-y-3" onSubmit={handleSubmit((vals) => start(async () => {
          const r = await createRequestAction(vals);
          if (r.error || !r.id) return void toast.error(r.error ?? "Could not send the request");
          reset(); toast.success("Ambulance requested"); router.replace(`/emergencies/${r.id}`);
        }))}>
          <div hidden={step !== 0} className="space-y-3">
            <div><label htmlFor="description" className="mb-1 block text-sm font-semibold">What is the emergency?</label><Input id="description" {...register("description")} />{err("description")}</div>
            <div><label htmlFor="priority" className="mb-1 block text-sm font-semibold">Priority</label>
              <select id="priority" className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" {...register("priority")}>{["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => <option key={p} value={p}>{label(p)}</option>)}</select></div>
          </div>
          <div hidden={step !== 1} className="space-y-3">
            <div><label htmlFor="pickupAddress" className="mb-1 block text-sm font-semibold">Pickup address</label><Input id="pickupAddress" {...register("pickupAddress")} />{err("pickupAddress")}</div>
            <div className="grid grid-cols-2 gap-3">
              <div><label htmlFor="pickupLat" className="mb-1 block text-sm font-semibold">Latitude</label><Input id="pickupLat" type="number" step="any" {...register("pickupLat", { valueAsNumber: true })} />{err("pickupLat")}</div>
              <div><label htmlFor="pickupLng" className="mb-1 block text-sm font-semibold">Longitude</label><Input id="pickupLng" type="number" step="any" {...register("pickupLng", { valueAsNumber: true })} />{err("pickupLng")}</div>
            </div>
            <Button type="button" variant="outline" onClick={locate}>Use my current location</Button>
          </div>
          {step === 2 && (
            <dl className="space-y-1 text-sm"><dt className="font-semibold">Emergency</dt><dd>{v.description}</dd><dt className="font-semibold">Priority</dt><dd>{label(v.priority)}</dd><dt className="font-semibold">Pickup</dt><dd>{v.pickupAddress} ({v.pickupLat}, {v.pickupLng})</dd></dl>
          )}
          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            {step < 2 ? <Button type="button" onClick={next}>Continue</Button> : <Button type="submit" variant="destructive" disabled={pending}>{pending ? "Sending..." : "Request ambulance"}</Button>}
          </div>
        </form>
      </Card>
    </div>
  );
}
