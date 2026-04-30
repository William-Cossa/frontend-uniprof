import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Footer from "@/components/HomePage/footer/footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UniMentor",
  description: "Plataforma de Mentoria Profissional",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`light ${manrope.variable}`}>
      <body className="flex flex-col min-h-screen w-screen overflow-x-hidden font-[var(--font-manrope)]">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
        <Sonner richColors />
      </body>
    </html>
  );
}
