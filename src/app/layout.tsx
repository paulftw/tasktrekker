import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { RelayProvider } from "@/lib/RelayProvider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RelayProvider>{children}</RelayProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
