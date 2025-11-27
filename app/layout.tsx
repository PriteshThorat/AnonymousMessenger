import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import AuthProvider from "@/src/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anonymous Messenger",
  description: "Created by Pritesh Thorat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
    lang="en" className="dark">
      <link rel="icon" href="/icon.jpg" sizes="any" />
      <AuthProvider>
      <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <Navbar />
        {children}
        <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}