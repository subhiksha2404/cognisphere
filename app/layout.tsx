import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cognisphere - AI-Powered Cognitive Health Management",
  description: "Advanced neurological risk assessment, treatment planning, and cognitive rehabilitation for Alzheimer's, Parkinson's, Epilepsy, and Hypoxia-related conditions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-gray-900 bg-gray-50`}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}


