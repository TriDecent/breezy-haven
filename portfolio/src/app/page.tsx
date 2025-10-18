import { HeroSection, ProjectsSection } from "@/features/home";
import { SITE_METADATA } from "@/shared/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = SITE_METADATA.home.metadata;

function HomePage() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
    </>
  );
}

export default HomePage;
