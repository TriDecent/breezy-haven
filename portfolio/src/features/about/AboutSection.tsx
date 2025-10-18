export default function AboutSection() {
  return (
    <section className="py-16">
      <h2 className="text-primary mb-8 text-3xl font-bold">Về tôi</h2>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-accent mb-2 text-xl font-semibold">Kỹ năng</h3>
          <ul className="text-muted-foreground ml-6 list-disc">
            <li>Next.js, React, TypeScript</li>
            <li>Tailwind CSS, shadcn/ui</li>
            <li>Framer Motion, UI/UX</li>
          </ul>
        </div>
        <div>
          <h3 className="text-accent mb-2 text-xl font-semibold">
            Học vấn & Kinh nghiệm
          </h3>
          <ul className="text-muted-foreground ml-6 list-disc">
            <li>Cử nhân Công nghệ thông tin</li>
            <li>2+ năm kinh nghiệm phát triển web</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
