import type { Role } from "@/types/api";

export const DEMO_PASSWORD = "Password123!";

export const DEMO_CREDENTIALS: Record<
  Role,
  { email: string; password: string; label: string }
> = {
  ADMIN: {
    email: "admin@dispatch.com",
    password: DEMO_PASSWORD,
    label: "Admin Demo Login",
  },
  PATIENT: {
    email: "patient1@dispatch.com",
    password: DEMO_PASSWORD,
    label: "Patient Demo Login",
  },
  DISPATCHER: {
    email: "dispatcher1@dispatch.com",
    password: DEMO_PASSWORD,
    label: "Dispatcher Demo Login",
  },
};
