import { motion } from "framer-motion";

const posts = [
  {
    title: "Chào mừng đến với blog!",
    excerpt: "Đây là bài viết đầu tiên trên blog cá nhân của tôi.",
    link: "#",
  },
];

export default function BlogSection() {
  return (
    <section className="py-16">
      <h2 className="text-primary mb-8 text-3xl font-bold">Blog</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <motion.a
            key={post.title}
            href={post.link}
            className="border-border bg-card block rounded-xl border p-6 shadow-md transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-accent mb-2 text-xl font-semibold">
              {post.title}
            </h3>
            <p className="text-muted-foreground mb-2">{post.excerpt}</p>
            <span className="text-primary-foreground text-sm">Đọc tiếp →</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
