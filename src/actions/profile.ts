"use server";

import { api } from "@/lib/api";
import type { ActionResult, User } from "@/types/api";
import type { ProfileInput } from "@/lib/validations/profile";

export async function updateProfileAction(
  input: ProfileInput,
): Promise<ActionResult> {
  try {
    await api<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    return {};
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not update profile.",
    };
  }
}
