"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" size="sm" aria-label="Log out">
        <LogOut className="mr-1 size-4" />
        Log out
      </Button>
    </form>
  );
}
