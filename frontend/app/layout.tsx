import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title:{ 
    template: "%s - Blossom Books",
    default: "Blossom Books - Your Online Bookstore",},
  description: "Blossom Books is your go-to online bookstore for a curated selection of captivating reads. Explore our diverse collection and find your next favorite book today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-poppins antiliased">
        {children}
      </body>
    </html>
  );
}
