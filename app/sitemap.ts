import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zinid.tech";
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    // Adicione mais páginas conforme necessário
    // {
    //   url: `${baseUrl}/artigo/[slug]`,
    //   lastModified: currentDate,
    //   changeFrequency: "weekly",
    //   priority: 0.8,
    // },
  ];
}
