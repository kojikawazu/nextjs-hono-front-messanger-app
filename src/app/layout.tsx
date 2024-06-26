import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/app/components/header/header-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nextjs Messanger App",
  description: "Nextjs Messanger App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <HeaderClient />
        {children}
      </body>
    </html>
  );
}
