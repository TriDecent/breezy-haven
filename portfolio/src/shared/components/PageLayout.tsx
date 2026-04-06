import React from "react";

type Props = { children: React.ReactNode };

export const PageLayout = ({ children }: Props) => {
  return (
    <div className="text-foreground bg-background flex min-h-screen flex-col transition-colors duration-300">
      <div className="container mx-auto flex flex-1 flex-col">{children}</div>
    </div>
  );
};

PageLayout.Header = function Header({ children }: Props) {
  return (
    <header className="bg-background/80 sticky top-0 z-50 backdrop-blur-xs dark:backdrop-blur-sm">
      {children}
    </header>
  );
};

PageLayout.Main = function Main({ children }: Props) {
  return <main className="flex-grow pt-16 backdrop-blur-xs">{children}</main>;
};

PageLayout.Footer = function Footer({ children }: Props) {
  return <footer className="bg-background py-8">{children}</footer>;
};
