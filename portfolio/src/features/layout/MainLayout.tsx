import { PageLayout } from "@/shared/components";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <PageLayout>
      <Header />
      <PageLayout.Main>{children}</PageLayout.Main>
      <Footer />
    </PageLayout>
  );
}
