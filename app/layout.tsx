import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Budi Santoso — Mahasiswa Informatika & Creative Developer",
    template: "%s · Budi Santoso",
  },
  description:
    "Mahasiswa Informatika yang melayani Web Development, Design Ads Instagram, Editing Video, dan Voice Over. Bersama wujudkan ide Anda.",
  keywords: [
    "portfolio",
    "web developer",
    "freelancer",
    "design ads",
    "video editing",
    "voice over",
    "Indonesia",
  ],
  authors: [{ name: "Budi Santoso" }],
  openGraph: {
    title: "Budi Santoso — Mahasiswa Informatika & Creative Developer",
    description:
      "Web Development · Design Ads · Editing Video · Voice Over. Mari berkolaborasi.",
    url: SITE_URL,
    siteName: "Budi Santoso",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budi Santoso — Mahasiswa Informatika & Creative Developer",
    description: "Web Development · Design Ads · Editing Video · Voice Over.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
