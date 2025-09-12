
"use client";

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { useSettings } from '@/hooks/use-settings';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

// This is a client component because we need to access user settings
// for theme and font size and apply them to the html/body tags.
// We can't do this in a server component.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useSettings hook will handle applying the theme class to the root element.
  useSettings();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Bible Reading Plans</title>
        <meta name="description" content="Track your Bible reading journey." />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
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
