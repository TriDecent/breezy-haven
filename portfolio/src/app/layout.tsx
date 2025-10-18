import "@/styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

import { MainLayout } from "@/features/layout";
import { SITE_METADATA } from "@/shared/metadata";
import { ThemeProvider } from "next-themes";

export const metadata = SITE_METADATA.base.metadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen ${inter.className} bg-background text-foreground font-sans antialiased transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
