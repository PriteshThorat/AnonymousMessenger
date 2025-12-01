import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import AuthProvider from "@/src/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next"

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
  other: {
    'google-site-verification': 'CeZFxqzL0jCPFqyU2-x6SXrGzRx0d8Z010PDkCNSlyM'
  }
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
        <Analytics/>
      </body>
      </AuthProvider>
    </html>
  );
}