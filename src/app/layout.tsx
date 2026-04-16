import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { RelayProvider } from "@/lib/RelayProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskTrekker",
  description: "A minimal issue tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RelayProvider>{children}</RelayProvider>
      </body>
    </html>
  );
}
