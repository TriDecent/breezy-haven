import type { Metadata } from "next";
import { FaFacebook, FaGithub } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

export const siteMetadata: Metadata = {
  title: "Portfolio cá nhân | Next.js",
  description:
    "Website portfolio hiện đại với Next.js, Tailwind, shadcn/ui, dark mode, animation.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Portfolio cá nhân | Next.js",
    description:
      "Website portfolio hiện đại với Next.js, Tailwind, shadcn/ui, dark mode, animation.",
    url: "https://yourdomain.com",
    siteName: "Portfolio cá nhân",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Portfolio cá nhân | Next.js",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
} as const;

export const personalInfo = {
  name: "Trần Vũ Anh Trí",
  role: "Software Engineer",
  tagline: "Crafting scalable and efficient full-stack applications.",
  subline:
    "I build modern web experiences with a focus on clean code, performance, and user-centric design.",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/tridecent",
      icon: FaGithub,
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/TriDecent",
      icon: FaFacebook,
    },
    {
      name: "Email",
      url: "mailto:22521528@gm.uit.edu.vn",
      icon: IoMail,
    },
  ],
} as const;

export const featuredProjects = [
  {
    title: "Project Alpha",
    description:
      "A full-stack e-commerce platform built with a modern tech stack, focusing on performance and scalability.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    image: `https://placehold.co/1280x720/000000/FFFFFF?text=Project+Alpha`,
  },
  {
    title: "ServiceHub API",
    description:
      "A robust RESTful API developed with NestJS, implementing clean architecture and SOLID principles.",
    tags: ["NestJS", "C#", "SOLID", "JWT", "Swagger"],
    liveUrl: null,
    githubUrl: "#",
    image: `https://placehold.co/1280x720/1a1a1a/FFFFFF?text=ServiceHub+API`,
  },
] as const;
