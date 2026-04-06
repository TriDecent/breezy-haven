import type { Metadata } from "next";
import { FaFacebook, FaGithub } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export const SITE_METADATA = {
  base: defineRouteMetadata({
    href: "/",
    metadata: {
      metadataBase: new URL(BASE_URL),
      title: {
        template: "%s - Trí's Portfolio",
        default: "Trí Decent",
      },
      icons: "/avatar.ico",
    },
  }),
  home: defineRouteMetadata({
    href: "/",
    metadata: {
      title: "Trí Decent",
      description:
        "A modern portfolio website built with Next.js, Tailwind, shadcn/ui, dark mode, and animations.",
      openGraph: {
        title: "Personal Portfolio",
        description:
          "A modern portfolio website built with Next.js, Tailwind, shadcn/ui, dark mode, and animations.",
        url: BASE_URL,
        siteName: "Personal Portfolio",
        images: [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: "Personal Portfolio",
          },
        ],
        locale: "en_US",
        type: "website",
      },
    },
  }),
  about: defineRouteMetadata({
    href: "/about",
    metadata: {
      title: "About",
      description:
        "Learn more about Trí Decent, a passionate software engineer focused on building scalable and efficient full-stack applications.",
      openGraph: {
        title: "About - Trí Decent",
        description:
          "Discover the background, skills, and experience of Trí Decent, a modern web developer.",
        url: `${BASE_URL}/about`,
        siteName: "Personal Portfolio",
        images: [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: "About Trí Decent",
          },
        ],
        locale: "en_US",
        type: "profile",
      },
    },
  }),
} as const;

type RouteMetadata = Readonly<{
  href: string;
  metadata: Metadata;
}>;

function defineRouteMetadata<T extends RouteMetadata>(routeMetadata: T): T {
  return routeMetadata;
}

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

export const skillsData = {
  languages: ["TypeScript", "C#", "JavaScript"],
  frontend: [
    "React",
    "Next.js",
    "Redux Toolkit",
    "RTK Query",
    "Framer Motion",
    "Tailwind CSS",
    "shadcn/ui",
    "React Hook Form",
  ],
  backend: [
    "Node.js",
    "Resend",
    "LiveKit",
    "NestJS (Learning)",
    "gRPC (Learning)",
    "tRPC (Learning)",
  ],
  databases: ["PostgreSQL", "Prisma", "Redis (Learning)"],
  authAccess: [
    "Better Auth (Core)",
    "Better Auth Plugins: Admin (RBAC), Organization, Subscription",
    "CASL (ABAC)",
  ],
  security: [
    "JWT (JSON Web Tokens)",
    "Data Encryption (RSA, AES)",
    "Password Hashing (bcrypt)",
    "Arcjet",
  ],
  architecture: [
    "SOLID Principles",
    "DRY Principle",
    "Immutable Patterns",
    "Composition over Inheritance",
    "Design Patterns (Strategy, Decorator, Observer, Provider)",
    "DDD",
    "REST API Design",
    "Microservices (Learning)",
  ],
  tools: ["Git", "Zod", "Docker"],
} as const;
