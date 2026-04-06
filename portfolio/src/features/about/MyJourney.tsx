"use client";
import { CUSTOM_VARIANTS } from "@/shared/animation";
import { motion } from "framer-motion";

export function MyJourney() {
  return (
    <section className="bg-secondary rounded-2xl py-15 md:py-28">
      <motion.div
        variants={CUSTOM_VARIANTS.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto max-w-3xl space-y-8 px-4"
      >
        <motion.div variants={CUSTOM_VARIANTS.item} className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            My Journey
          </h2>
          <p className="text-muted-foreground mt-4">
            A path shaped by curiosity, learning, and continuous growth.
          </p>
        </motion.div>
        <motion.p
          variants={CUSTOM_VARIANTS.item}
          className="text-muted-foreground text-lg leading-relaxed"
        >
          I didn&apos;t begin my programming journey with a clear goal in mind.
          It all started with a short video about HTML that sparked my
          curiosity. Encouraged by how approachable it seemed, I gave it a try.
          That small step led me to complete my first HTML/CSS course and build
          a simple e-commerce site using vanilla JavaScript. It was a modest
          project, but seeing it come to life gave me a sense of fulfillment and
          motivation to keep learning.
        </motion.p>
        <motion.p
          variants={CUSTOM_VARIANTS.item}
          className="text-muted-foreground text-lg leading-relaxed"
        >
          Things began to make more sense when I started exploring{" "}
          <strong>C#</strong>. Thanks to the resources and mentors I found along
          the way, I was introduced to foundational software engineering
          concepts like <strong>SOLID principles</strong> and{" "}
          <strong>design patterns</strong>. These ideas helped me shift my
          mindset, not just about writing code, but about designing systems that
          are thoughtful and maintainable.
        </motion.p>
        <motion.p
          variants={CUSTOM_VARIANTS.item}
          className="text-muted-foreground text-lg leading-relaxed"
        >
          Building on that foundation, I gradually expanded into the TypeScript
          ecosystem, learning to work with tools like <strong>React</strong> and{" "}
          <strong>Next.js</strong>. While I still have much to learn, I’m now
          focusing on backend development, aiming to understand how to build{" "}
          <strong>scalable architectures</strong> and{" "}
          <strong>type-safe data layers</strong>. My hope is to grow into a
          engineer who can contribute meaningfully to building reliable
          software, from frontend to backend.
        </motion.p>
      </motion.div>
    </section>
  );
}
