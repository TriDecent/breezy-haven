import { motion } from "framer-motion";

const projects = [
  {
    name: "Portfolio Website",
    description: "Website cá nhân hiện đại với Next.js, Tailwind, shadcn/ui.",
    link: "#",
    icon: "💻",
  },
  {
    name: "Landing Page",
    description: "Trang giới thiệu sản phẩm với hiệu ứng động đẹp mắt.",
    link: "#",
    icon: "🚀",
  },
];

export default function ProjectsSection() {
  return (
    <section className="py-20 md:py-32">
      <h2 className="mb-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-extrabold text-transparent drop-shadow-lg">
        Dự án nổi bật
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <motion.a
            key={project.name}
            href={project.link}
            className="bg-card group relative block rounded-2xl border-2 border-transparent p-8 shadow-xl transition-transform duration-300 hover:scale-[1.04] hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 100%)",
            }}
            whileHover={{ scale: 1.04 }}
          >
            <span className="absolute top-6 right-6 text-3xl transition-transform group-hover:scale-125">
              {project.icon}
            </span>
            <h3 className="text-accent group-hover:text-primary mb-3 text-2xl font-bold transition-colors">
              {project.name}
            </h3>
            <p className="text-muted-foreground mb-4 text-base">
              {project.description}
            </p>
            <span className="text-primary-foreground text-sm font-semibold group-hover:underline">
              Xem chi tiết →
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
