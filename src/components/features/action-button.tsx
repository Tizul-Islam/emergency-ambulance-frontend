"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types/api";

export function ActionButton({ 
  action, 
  children, 
  success, 
  variant, 
  size = "sm",
  className
}: { 
  action: () => Promise<ActionResult>; 
  children: React.ReactNode; 
  success?: string; 
  variant?: "default" | "destructive" | "outline"; 
  size?: "default" | "sm";
  className?: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <Button 
      variant={variant} 
      size={size} 
      disabled={pending} 
      className={className}
      onClick={() => start(async () => {
        const r = await action();
        if (r.error) return void toast.error(r.error);
        if (r.url) { window.location.href = r.url; return; }
        if (success) toast.success(success);
        router.refresh();
      })}
    >
      {pending ? "Working..." : children}
    </Button>
  );
}
