import { ScrollArea, ScrollBar } from "@/shared/components";
import { Education } from "./Education";
import { Hero } from "./Hero";
import { MyJourney } from "./MyJourney";
import { SkillsAndExpertise } from "./SkillsAndExpertise";
import { ContactCTA } from "./ContactCTA";

export function AboutSection() {
  return (
    <ScrollArea className="h-screen" type="always">
      <ScrollBar orientation="vertical" />
      <div className="min-h-screen snap-start">
        <Hero />
      </div>
      <div className="min-h-screen snap-start">
        <MyJourney />
      </div>
      <div className="min-h-screen snap-start">
        <SkillsAndExpertise />
      </div>
      <div className="min-h-screen snap-start">
        <Education />
      </div>
      <div className="min-h-screen snap-start">
        <ContactCTA />
      </div>
    </ScrollArea>
  );
}
