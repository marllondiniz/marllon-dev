import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import CookieConsentOnlyHome from "./components/CookieConsentOnlyHome";
import BodyOverlayControl from "./components/BodyOverlayControl";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const siteUrl = "https://zinid.tech";
const siteName = "Marllon Diniz - zinid.tech";
const siteDescription = "Desenvolvedor especializado em back-end, desenvolvimento web, integrações de APIs, automações e IA aplicada ao desenvolvimento. Início de um futuro próspero. Espírito Santo, Brasil.";
const keywords = [
  "desenvolvedor back-end",
  "desenvolvedor web",
  "integrações API",
  "automação",
  "IA aplicada",
  "inteligência artificial",
  "Python",
  "Node.js",
  "API REST",
  "desenvolvimento software",
  "Espírito Santo",
  "Brasil",
  "zinid.tech",
  "Marllon Diniz",
  "programador",
  "engenheiro de software",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Marllon Diniz — Desenvolvedor Back-end | Web | Integrações | Automação | IA aplicada",
    template: "%s | Marllon Diniz - zinid.tech",
  },
  description: siteDescription,
  keywords: keywords,
  authors: [{ name: "Marllon Diniz", url: siteUrl }],
  creator: "Marllon Diniz",
  publisher: "Marllon Diniz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: siteName,
    title: "Marllon Diniz — Desenvolvedor Back-end | Web | Integrações | Automação | IA aplicada",
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Marllon Diniz - Desenvolvedor Back-end e Web",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marllon Diniz — Desenvolvedor Back-end | Web | Integrações | Automação | IA aplicada",
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@marllondiniz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Adicione seus códigos de verificação aqui quando configurar
    google: "seu-codigo-google-search-console",
    // yandex: "seu-codigo-yandex",
    // bing: "seu-codigo-bing",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured data para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Marllon Diniz",
    url: "https://zinid.tech",
    image: "https://zinid.tech/marllon.jpeg",
    jobTitle: "Desenvolvedor Back-end",
    description:
      "Desenvolvedor especializado em back-end, desenvolvimento web, integrações de APIs, automações e IA aplicada ao desenvolvimento.",
    address: {
      "@type": "PostalAddress",
      addressRegion: "ES",
      addressCountry: "BR",
      addressLocality: "Espírito Santo",
    },
    email: "marllonzinid@gmail.com",
    sameAs: [
      "https://www.linkedin.com/in/marllon-diniz",
      "https://github.com/marllondiniz", // Adicione se tiver
    ],
    knowsAbout: [
      "Back-end Development",
      "Web Development",
      "API Integration",
      "Automation",
      "Artificial Intelligence",
      "Python",
      "Node.js",
      "REST API",
      "Software Development",
    ],
    worksFor: {
      "@type": "Organization",
      name: "zinid.tech",
      url: "https://zinid.tech",
    },
  };

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className} antialiased`}>
        <BodyOverlayControl />
        <Header />
        {children}
        <CookieConsentOnlyHome />
        <Analytics />
      </body>
    </html>
  );
}
