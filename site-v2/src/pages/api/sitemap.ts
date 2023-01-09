import { allArticles } from "contentlayer/generated";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-control", "stale-while-revalidate, s-maxage=3600");

  const articleSlugs = allArticles.map((article) => article.slug);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    <url>
        <loc>https://www.airproxy.app</loc>
    </url>
    <url>
        <loc>https://www.airproxy.app/documentation</loc>
    </url>
    <url>
        <loc>https://www.airproxy.app/blog</loc>
    </url>
    ${articleSlugs
      .map(
        (slug) => `
    <url>
        <loc>https://www.airproxy.app/blog/${slug}</loc>
    </url>
    `
      )
      .join("")}
</urlset>`;

  res.end(xml);
}
