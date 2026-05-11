import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RGU | Rathinam Global University — Where Students Transform Into Leaders",
  description:
    "Rathinam Global University — Career Ready, Globally Ready, Future Ready. " +
    "Experience The RGU Way: a structured student transformation model built for the world.",
  keywords:
    "Rathinam Global University, RGU, The RGU Way, Career Ready, Global University, " +
    "Higher Education, Coimbatore, Deemed University",
  openGraph: {
    title: "RGU | Rathinam Global University",
    description: "The RGU Way: Where Students Transform Into Leaders.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Sora — display / headings: geometric, premium, institutional */}
        {/* DM Sans — body / UI: the most professional clean sans on Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/fav.png" />
      </head>
      <body
        className="antialiased"
        style={{ background: "#080810", color: "#f8fafc" }}
      >
        {children}
      </body>
    </html>
  );
}
