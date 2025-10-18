import { AboutSection } from "@/features/about";
import { SITE_METADATA } from "@/shared/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = SITE_METADATA.about.metadata;

export default function AboutPage() {
  return <AboutSection />;
}
