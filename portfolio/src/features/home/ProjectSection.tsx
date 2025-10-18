"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components";
import { featuredProjects } from "@/shared/metadata";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function ProjectsSection() {
  return (
    <section id="work" className="bg-secondary py-20 md:py-28">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Featured Projects
          </h2>
          <p className="text-muted-foreground mt-4 md:text-lg">
            A selection of projects I&apos;m proud of.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof featuredProjects)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card className="h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-48">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="gap-4">
          <Link
            href={""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            Live Demo <ArrowUpRight size={16} />
          </Link>

          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-semibold"
          >
            GitHub <FaGithub size={16} />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
