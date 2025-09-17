import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rıza Savurgan - Designer",
  description: "Brutalist and typography-focused portfolio of Rıza Savurgan, a designer based in Istanbul.",
  keywords: ["designer", "portfolio", "brutalist", "typography", "istanbul", "freelance"],
  authors: [{ name: "Rıza Savurgan" }],
  openGraph: {
    title: "Rıza Savurgan - Designer",
    description: "Brutalist and typography-focused portfolio of Rıza Savurgan, a designer based in Istanbul.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
