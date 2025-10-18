"use client";
import { CUSTOM_VARIANTS } from "@/shared/animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components";
import { skillsData } from "@/shared/metadata";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Database,
  Languages,
  PenTool,
  Server,
  Shield,
  Terminal,
} from "lucide-react";
import type React from "react";

export function SkillsAndExpertise() {
  const skillCategories = [
    { title: "Languages", icon: Languages, skills: skillsData.languages },
    { title: "Frontend", icon: PenTool, skills: skillsData.frontend },
    { title: "Backend", icon: Server, skills: skillsData.backend },
    {
      title: "Databases & Caching",
      icon: Database,
      skills: skillsData.databases,
    },
    { title: "Security", icon: Shield, skills: skillsData.security },
    {
      title: "Architecture",
      icon: BrainCircuit,
      skills: skillsData.architecture,
    },
    { title: "Tools & DevOps", icon: Terminal, skills: skillsData.tools },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Skills & Expertise
          </h2>
          <p className="text-muted-foreground mt-4 md:text-lg">
            My technical toolkit for building modern and secure applications.
          </p>
        </div>
        <motion.ul
          variants={CUSTOM_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skillCategories
            .filter((category) => category.skills.length > 0)
            .map((category) => (
              <motion.li variants={CUSTOM_VARIANTS.item} key={category.title}>
                <SkillCard {...category} />
              </motion.li>
            ))}
        </motion.ul>
      </div>
    </section>
  );
}

function SkillCard({
  title,
  icon: Icon,
  skills,
}: {
  title: string;
  icon: React.ElementType;
  skills: readonly string[];
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Icon className="text-primary h-8 w-8" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
