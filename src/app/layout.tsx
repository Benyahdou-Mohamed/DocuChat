import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocuChat",
  description: "Turn PDFs into conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <Providers>
      <body className={cn("min-h-screen font-sans antialiased grainy",inter.className)}>
        <Navbar/>
        {children}</body>
        </Providers>
    </html>
  );
}
