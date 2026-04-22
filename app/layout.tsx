import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "./components/ConditionalHeader";
import ConditionalSiteFooter from "./components/ConditionalSiteFooter";
import MainPadding from "./components/MainPadding";
import CookieConsentOnlyHome from "./components/CookieConsentOnlyHome";
import BodyOverlayControl from "./components/BodyOverlayControl";
import { Analytics } from "@vercel/analytics/next";
import { SITE_HOST, SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const siteUrl = SITE_URL;
const siteName = SITE_NAME;
const defaultSiteTitle = `${SITE_HOST} — Desenvolvimento Back-end | Web | Integrações | Automação | Dados`;
const siteDescription =
  "Desenvolvedor especializado em back-end, desenvolvimento web, integrações de APIs, automações e soluções orientadas a dados. Início de um futuro próspero. Espírito Santo, Brasil.";
const keywords = [
  "desenvolvedor back-end",
  "desenvolvedor web",
  "integrações API",
  "automação",
  "dados",
  "Python",
  "Node.js",
  "API REST",
  "desenvolvimento software",
  "Espírito Santo",
  "Brasil",
  SITE_HOST,
  "programador",
  "engenheiro de software",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultSiteTitle,
    template: `%s | ${SITE_HOST}`,
  },
  description: siteDescription,
  keywords: keywords,
  authors: [{ name: SITE_HOST, url: siteUrl }],
  creator: SITE_HOST,
  publisher: SITE_HOST,
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
    title: defaultSiteTitle,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_HOST} — desenvolvimento back-end e web`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSiteTitle,
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
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
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
    "@type": "Organization",
    name: SITE_HOST,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    logo: `${SITE_URL}/favicon.png`,
    description:
      "Desenvolvedor especializado em back-end, desenvolvimento web, integrações de APIs, automações e soluções orientadas a dados.",
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
        <ConditionalHeader />
        <MainPadding>{children}</MainPadding>
        <ConditionalSiteFooter />
        <CookieConsentOnlyHome />
        <Analytics />
      </body>
    </html>
  );
}
