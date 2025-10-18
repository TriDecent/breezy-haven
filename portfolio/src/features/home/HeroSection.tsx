"use client";

import { Button } from "@/shared/components";
import { personalInfo } from "@/shared/metadata";
import { motion, stagger, type Variants } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto max-w-3xl px-4 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {personalInfo.tagline}
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-muted-foreground mx-auto mt-6 max-w-xl md:text-xl"
        >
          {personalInfo.subline}
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-center gap-4"
        >
          <Button asChild size="lg">
            <Link href="/work">View My Work</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`mailto:${personalInfo.socials[2].url}`}>
              Get in Touch
            </Link>
          </Button>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="mt-12 flex justify-center gap-6"
        >
          {personalInfo.socials.map((social) => (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <social.icon size={24} />
              <span className="sr-only">{social.name}</span>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: stagger(0.3) },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};
