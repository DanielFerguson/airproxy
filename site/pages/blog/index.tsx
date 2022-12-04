import PageLayout from "../../components/layouts/PageLayout";
import { NextSeo, ArticleJsonLd } from "next-seo";

const posts = [
  {
    slug: "airtable-api-and-express-js",
    title: "Using Express JS with the Airtable API",
    description:
      "To use the Airtable API with Express scripts, you will need to follow these steps...",
    published: "2022-12-04T09:00:00+11:00",
    tags: ["api", "airtable", "creating", "multiple", "records", "generate"],
    images: [
      "https://images.unsplash.com/photo-1505739818593-e7506ebf74c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    slug: "airtable-as-a-backend",
    title: "Airtable as as Backend",
    description:
      "Whether Airtable is a suitable backend for your website depends on a number of factors, including the specific needs and requirements of your website, your budget, and your technical capabilities.",
    published: "2022-12-04T09:00:00+11:00",
    tags: [
      "api",
      "airtable",
      "backend",
      "saas",
      "database",
      "data",
      "pros",
      "cons",
      "downfalls",
      "shortcomings",
    ],
    images: [
      "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c2NhbGVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=700&q=60",
    ],
  },
  {
    slug: "airtable-on-wordpress-with-react",
    title: "Using Airtable on Wordpress with React",
    description:
      "To use the Airtable API with Express scripts, you will need to follow these steps...",
    published: "2022-12-04T09:00:00+11:00",
    tags: ["api", "airtable", "creating", "multiple", "records", "generate"],
    images: [
      "https://images.unsplash.com/photo-1560472355-109703aa3edc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    slug: "annoucing-airproxy",
    title: "Announcing Airproxy",
    description:
      "We are excited to announce the public release of Airproxy, the world's leading edge caching service for Airtable's API.",
    published: "2022-12-04T09:00:00+11:00",
    tags: [
      "announcing",
      "airproxy",
      "scaling",
      "global",
      "availability",
      "ease of use",
      "api",
    ],
    images: ["/global-map.png"],
  },
  {
    slug: "creating-multiple-records-at-once",
    title: "Creating Multiple Records with Airtable",
    description:
      "If you want to create multiple records in your Airtable base in a single API request, you can use the Airtable API's 'create' endpoint with an array of record objects in the request body.",
    published: "2022-12-04T09:00:00+11:00",
    tags: ["api", "airtable", "creating", "multiple", "records", "generate"],
    images: [
      "https://images.unsplash.com/photo-1501526029524-a8ea952b15be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    slug: "downfalls-of-airtable",
    title: "Downfalls of Airtable",
    description:
      "Airtable is a cloud-based database and collaboration platform that is popular for its user-friendly interface and flexible data management features. However, it is not without its drawbacks.",
    published: "2022-12-04T09:00:00+11:00",
    tags: [
      "downfalls",
      "shortcoming",
      "cons",
      "airtable",
      "cloud service",
      "airtable pricing",
      "airtable cost",
      "expensive",
      "request limit",
    ],
    images: [
      "https://images.unsplash.com/photo-1501862169286-518c291e3eed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    slug: "getting-a-personal-access-token",
    title: "Getting a Personal Access Token",
    description:
      "Are you looking to integrate your Airtable account with other applications or services? One of the first steps in doing so is to generate a personal access token.",
    published: "2022-12-04T09:00:00+11:00",
    tags: ["api", "airtable", "access", "token", "personal", "generate"],
    images: [
      "https://images.unsplash.com/photo-1623282033815-40b05d96c903?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    slug: "project-management-in-airtable",
    title: "Project Management in Airtable",
    description:
      "Airtable can be critical in agile project management rituals. Here are a few examples of how you can use Airtable in your agile workflow...",
    published: "2022-12-04T09:00:00+11:00",
    tags: ["api", "airtable", "creating", "multiple", "records", "generate"],
    images: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    slug: "templates",
    title: "Templates on Airtable",
    description:
      "Airtable templates are pre-built bases that you can use as a starting point for your own data.",
    published: "2022-12-04T09:00:00+11:00",
    tags: [
      "api",
      "airtable",
      "templates",
      "project management",
      "event planning",
      "recipe collection",
    ],
    images: [
      "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGVtcGxhdGVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=700&q=60",
    ],
  },
  {
    slug: "uploading-files-to-airtable",
    title: "Uploading Files to Airtable",
    description:
      "If you want to upload files to your Airtable account using the API, there are a few steps you need to follow...",
    published: "2022-12-04T09:00:00+11:00",
    tags: ["uploading", "files", "airtable", "api", "base", "table"],
    images: [
      "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNiJTIwdG8lMjBjbG91ZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=700&q=60",
    ],
  },
  {
    slug: "what-is-airtable",
    title: "What is Airtable?",
    description:
      "Airtable is a cloud-based platform that combines the features of a database, a spreadsheet, and a project management tool.",
    published: "2022-12-04T09:00:00+11:00",
    tags: [
      "what",
      "airtable",
      "is",
      "project",
      "management",
      "database",
      "spreadsheet",
      "views",
      "api",
    ],
    images: [
      "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdWR8ZW58MHx8MHx8&auto=format&fit=crop&w=700&q=60",
    ],
  },
];

const Page = () => {
  return (
    <div>
      <NextSeo
        title="Blog | Airproxy"
        description="We're here to help you take your Airtable game to the next level so you can deliver your value faster, futher, and more quickly."
        canonical="https://www.airproxy.app/blog"
        openGraph={{
          url: "https://www.airproxy.app/blog",
          title: "Blog | Airproxy",
          description:
            "We're here to help you take your Airtable game to the next level so you can deliver your value faster, futher, and more quickly.",
          siteName: "Airproxy",
          images: [
            {
              url: "https://www.airproxy.app/airproxy.jpg",
              type: "image/jpeg",
              width: 1200,
              height: 680,
              alt: "Airproxy helps you scale, fast.",
            },
          ],
        }}
        twitter={{
          handle: "@thedannyferg",
          site: "@airproxyapp",
          cardType: "summary_large_image",
        }}
      />

      {posts.map((post) => (
        <ArticleJsonLd
          key={`${post.title}-article-id`}
          type="BlogPosting"
          url={`/blog/${post.slug}`}
          title={post.title}
          images={[post.images[0]]}
          datePublished={post.published}
          dateModified={post.published}
          authorName="Dan Ferguson"
          description={post.description}
        />
      ))}

      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Upskill your Airtable skills
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
          We&apos;re here to help you take your Airtable game to the next level
          so you can deliver your value faster, futher, and more quickly.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.title}
            className="flex flex-col overflow-hidden rounded-lg shadow-lg"
          >
            <div className="flex-shrink-0">
              <img
                className="h-48 w-full object-cover"
                src={post.images[0]}
                alt=""
              />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
              <div className="flex-1">
                <p className="text-sm font-medium flex space-x-2 text-indigo-600">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </p>
                <a href={`/blog/${post.slug}`} className="mt-2 block">
                  <p className="text-xl font-semibold text-gray-900">
                    {post.title}
                  </p>
                  <p className="mt-3 text-base text-gray-500">
                    {post.description}
                  </p>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};
