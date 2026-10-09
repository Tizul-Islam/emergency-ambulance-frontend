import type { Metadata } from "next";
import { Archivo, Public_Sans, Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const head = Archivo({
  subsets: ["latin"],
  variable: "--font-head",
  weight: ["700", "800"],
});
const body = Public_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: {
    default: "Emergency Ambulance Dispatch",
    template: "%s | Emergency Dispatch",
  },
  description:
    "Request an ambulance, track dispatch status, and pay for your trip online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(head.variable, body.variable, "font-sans", geist.variable)}
    >
      <body>
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
