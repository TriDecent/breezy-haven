"use client";
import avatarImg from "@/../public/avatar.png";
import { CUSTOM_VARIANTS } from "@/shared/animation";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <motion.section
      variants={CUSTOM_VARIANTS.container}
      initial="hidden"
      animate="visible"
      viewport={{ amount: 0.5 }}
      className="mx-auto min-h-screen max-w-3xl space-y-4 px-4 py-20 text-center md:py-28"
    >
      <motion.h1
        variants={CUSTOM_VARIANTS.item}
        className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
      >
        About Me
      </motion.h1>

      <motion.div
        variants={CUSTOM_VARIANTS.item}
        className="relative mx-auto w-fit"
      >
        <span
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-fuchsia-300 via-purple-600 to-sky-400 opacity-75 blur-xl"
          aria-hidden="true"
        />
        <Avatar className="relative h-28 w-28">
          <AvatarImage src={avatarImg.src} />
          <AvatarFallback>Trí Decent</AvatarFallback>
        </Avatar>
      </motion.div>

      <motion.p
        variants={CUSTOM_VARIANTS.item}
        className="text-muted-foreground mt-6 md:text-xl"
      >
        Hi, I&apos;m Anh Trí, a Fullstack Developer with an interest in building
        web applications that serve people well, and I&apos;m always eager to
        grow and learn from others.
      </motion.p>
    </motion.section>
  );
}
