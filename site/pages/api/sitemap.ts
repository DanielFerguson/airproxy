import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/xml");

  // Instructing the Vercel edge to cache the file
  res.setHeader("Cache-control", "stale-while-revalidate, s-maxage=3600");

  // Generate sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
  <url>
    <loc>https://www.airproxy.app</loc>
    <lastmod>2022-12-04</lastmod>
  </url>
  <url>
    <loc>https://www.airproxy.app/blog</loc>
    <lastmod>2022-12-04</lastmod>
  </url>
  <url>
    <loc>https://www.airproxy.app/blog/getting-a-personal-access-token</loc>
    <lastmod>2022-12-04</lastmod>
  </url>
</urlset>`;

  res.end(xml);
}
