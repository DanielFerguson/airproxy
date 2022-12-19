import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-control", "stale-while-revalidate, s-maxage=3600");

  const articles = [
    "airtable-api-and-express-js",
    "airtable-as-a-backend",
    "airtable-on-wordpress-with-react",
    "creating-multiple-records-at-once",
    "downfalls-of-airtable",
    "getting-a-personal-access-token",
    "project-management-in-airtable",
    "templates",
    "uploading-files-to-airtable",
    "what-is-airtable",
    "bringing-excel-into-the-21st-century",
    "social-media-collaboration",
    "agile-project-management",
    "security-and-airtable",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    <url>
        <loc>https://www.airproxy.app</loc>
    </url>
    <url>
        <loc>https://www.airproxy.app/blog</loc>
    </url>
    ${articles
      .map(
        (article) => `
    <url>
        <loc>https://www.airproxy.app/blog/${article}</loc>
    </url>
    `
      )
      .join("")}
</urlset>`;

  res.end(xml);
}
