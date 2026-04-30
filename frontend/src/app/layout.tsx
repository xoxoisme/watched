import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Watched",
  description: "Archive what you've watched"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background text-white antialiased">
        {children}
      </body>
    </html>
  );
}
