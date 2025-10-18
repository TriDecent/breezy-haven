import { PageLayout } from "@/shared/components";
import { personalInfo } from "@/shared/metadata";

export const Footer = () => {
  return (
    <PageLayout.Footer>
      <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {personalInfo.name}. All Rights
          Reserved.
        </p>
        <div className="flex gap-4">
          {personalInfo.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <social.icon size={20} />
              <span className="sr-only">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </PageLayout.Footer>
  );
};
