"use client";

import { CUSTOM_VARIANTS } from "@/shared/animation";
import { Button } from "@/shared/components";
import { personalInfo } from "@/shared/metadata";
import { motion } from "framer-motion";

export function ContactCTA() {
  return (
    <motion.section
      variants={CUSTOM_VARIANTS.item}
      initial="hidden"
      whileInView={"visible"}
      viewport={{ once: true, amount: 0.5 }}
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Let&apos;s Connect
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl md:text-lg">
          I&apos;m always open to discussing new projects, creative ideas, or
          opportunities to be part of an amazing team. Feel free to reach out!
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <a href={`mailto:${personalInfo.socials[2].url}`}>Say Hello</a>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
