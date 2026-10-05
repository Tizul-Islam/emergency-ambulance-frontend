import type { Metadata } from "next";
import { Archivo, Public_Sans, Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const head = Archivo({ subsets: ["latin"], variable: "--font-head", weight: ["700", "800"] });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-body" });
export const metadata: Metadata = {
  title: { default: "Ambulance Dispatch", template: "%s | Ambulance Dispatch" },
  description: "Request an ambulance, track it in real time and pay for your trip online.",
  openGraph: { title: "Ambulance Dispatch", description: "Request an ambulance and track it in real time.", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(head.variable, body.variable, "font-sans", geist.variable)}>
      <body>{children}<Toaster richColors position="top-center" /></body>
    </html>
  );
}
