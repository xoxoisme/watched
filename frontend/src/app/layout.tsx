import type { Metadata } from "next";
import { Jersey_25 } from "next/font/google";
import "./globals.css";

const jersey25 = Jersey_25({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Watched",
  description: "Archive what you've watched"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={jersey25.variable}>
      <body className="min-h-screen bg-background text-white antialiased">
        {children}
      </body>
    </html>
  );
}
