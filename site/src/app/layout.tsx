import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/contexts/ThemeContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Formdown - Markdown-based Form Builder",
    template: "%s | Formdown"
  },
  description: "Create beautiful, interactive HTML forms using a simple markdown-like syntax. Build forms quickly with real-time preview, validation, and seamless integration.",
  keywords: [
    "form builder",
    "markdown forms",
    "html forms",
    "form generator",
    "web forms",
    "interactive forms",
    "form validation",
    "formdown",
    "javascript forms",
    "typescript forms"
  ],
  authors: [{ name: "iyulab" }],
  creator: "iyulab",
  publisher: "iyulab",
  metadataBase: new URL('https://formdown.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://formdown.dev',
    title: 'Formdown - Markdown-based Form Builder',
    description: 'Create beautiful, interactive HTML forms using a simple markdown-like syntax. Build forms quickly with real-time preview, validation, and seamless integration.',
    siteName: 'Formdown',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Formdown - Markdown-based Form Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formdown - Markdown-based Form Builder',
    description: 'Create beautiful, interactive HTML forms using a simple markdown-like syntax.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Formdown',
    description: 'Create beautiful, interactive HTML forms using a simple markdown-like syntax',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'iyulab',
      url: 'https://github.com/iyulab'
    },
    url: 'https://formdown.dev',
    downloadUrl: 'https://github.com/iyulab/formdown',
    sameAs: [
      'https://github.com/iyulab/formdown',
      'https://www.npmjs.com/package/@formdown/core'
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('formdown-theme');
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
                  
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.body.classList.add('dark');
                  }
                } catch (e) {
                  // Silently fail
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
