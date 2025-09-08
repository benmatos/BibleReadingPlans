
"use client";

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { useSettings } from '@/hooks/use-settings';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

// This is a client component because we need to access user settings
// for theme and font size and apply them to the html/body tags.
// We can't do this in a server component.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = useSettings();

  // This useEffect handles applying the theme class (light/dark) to the root element.
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const currentTheme = settings.theme === "system" ? systemTheme : settings.theme;
    
    root.classList.remove("light", "dark");
    root.classList.add(currentTheme);
  }, [settings.theme]);

  return (
    <html lang="en">
      <head>
        <title>Bible Reading Plans</title>
        <meta name="description" content="Track your Bible reading journey." />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;0,7..72,600;0,7..72,700;1,7..72,400&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
