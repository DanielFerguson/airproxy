import { NextSeo, ArticleJsonLd } from "next-seo";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blog", href: "/blog" },
];

const posts = [
  {
    slug: "security-and-airtable",
    title: "Security and Airtable",
    description:
      "Airtable offers a secure platform for managing and collaborating on data. Airproxy adds an additional layer of security for serving data directly to clients.",
    published: "2022-12-12T09:00:00+11:00",
    images: [
      "https://images.unsplash.com/photo-1480843669328-3f7e37d196ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    ],
  },
  {
    slug: "agile-project-management",
    title: "Agile Project Management",
    description:
      "Airtable allows teams to collaborate and manage their agile projects in one central location. See how it can help your team streamline its agile workflow.",
    published: "2022-12-12T09:00:00+11:00",
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80",
    ],
  },
  {
    slug: "bringing-excel-into-the-21st-century",
    title: "Bringing Excel Into The 21st Century",
    description:
      "Airtable is a versatile online platform that allows users to import Excel or Google Sheets data and manage it in a more flexible and visually appealing way.",
    published: "2022-12-12T09:00:00+11:00",
    images: [
      "https://images.unsplash.com/photo-1545830571-53a9a0967c88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80",
    ],
  },
  {
    slug: "social-media-collaboration",
    title: "Social Media Collaboration",
    description:
      "Enabling teams to collaborate and execute social media strategies with integrations, automations, and a user-friendly interface to streamline efforts.",
    published: "2022-12-12T09:00:00+11:00",
    images: [
      "https://plus.unsplash.com/premium_photo-1661767473365-726c22407adf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2426&q=80",
    ],
  },
  {
    slug: "airtable-api-and-express-js",
    title: "Using Express JS with the Airtable API",
    description:
      "To use the Airtable API with Express scripts, you will need to follow these steps...",
    published: "2022-12-04T09:00:00+11:00",
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
    images: [
      "https://images.unsplash.com/photo-1560472355-109703aa3edc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
  },
  {
    slug: "announcing-airproxy",
    title: "Announcing Airproxy",
    description:
      "We are excited to announce the public release of Airproxy, the world's leading edge caching service for Airtable's API.",
    published: "2022-12-04T09:00:00+11:00",
    images: ["/global-map.png"],
  },
  {
    slug: "creating-multiple-records-at-once",
    title: "Creating Multiple Records with Airtable",
    description:
      "If you want to create multiple records in your Airtable base in a single API request, you can use the Airtable API's 'create' endpoint with an array of record objects in the request body.",
    published: "2022-12-04T09:00:00+11:00",
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
    images: [
      "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdWR8ZW58MHx8MHx8&auto=format&fit=crop&w=700&q=60",
    ],
  },
];

const Page = () => {
  const session = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <NextSeo
        title="Blog | Airproxy"
        description="We're here to help you take your Airtable game to the next level so you can deliver your value faster, futher, and more quickly."
        canonical="https://www.airproxy.app/blog"
        openGraph={{
          type: "website",
          url: "https://www.airproxy.app/blog",
          title: "Blog | Airproxy",
          description:
            "We're here to help you take your Airtable game to the next level so you can deliver your value faster, futher, and more quickly.",
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

      {/* Hero */}
      <div className="isolate">
        {/* Background */}
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
          <svg
            className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9089FC" />
                <stop offset={1} stopColor="#FF80B5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Heaeder */}
        <div className="px-6 pt-6 lg:px-8">
          <div>
            <nav
              className="flex h-9 items-center justify-between"
              aria-label="Global"
            >
              <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Airproxy</span>
                  <img src="/cloud.png" alt="Airproxy" className="h-16 w-16" />
                </Link>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-center lg:gap-x-12">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="font-semibold text-gray-900 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-end">
                <Link
                  href={
                    session.status === "authenticated"
                      ? "/app"
                      : "/api/auth/signin"
                  }
                  className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                >
                  {session.status === "authenticated" ? "Dashboard" : "Log in"}
                </Link>
              </div>
            </nav>
            <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
              <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden">
                <div className="flex h-9 items-center justify-between">
                  <div className="flex">
                    <Link href="/" className="-m-1.5 p-1.5">
                      <span className="sr-only">Airproxy</span>
                      <img
                        src="/cloud.png"
                        alt="Airproxy"
                        className="h-16 w-16"
                      />
                    </Link>
                  </div>
                  <div className="flex">
                    <button
                      type="button"
                      className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="py-6">
                      <Link
                        href={
                          session.status === "authenticated"
                            ? "/app"
                            : "/api/auth/signin"
                        }
                        className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
                      >
                        {session.status === "authenticated"
                          ? "Dashboard"
                          : "Log in"}
                      </Link>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </div>
        </div>

        {/* Content */}
        <main>
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-20 sm:pt-48">
              <div>
                {/* Announcement */}
                {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                  <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                    <span className="text-gray-600">
                      Announcing the public launch of Airproxy.{" "}
                      <Link
                        href="/blog/announcing-airproxy"
                        className="font-semibold text-indigo-600"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        Read more <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </span>
                  </div>
                </div> */}

                {/* Middle */}
                <div>
                  <h1 className="text-5xl font-bold tracking-tight sm:text-center sm:text-6xl">
                    Upskill your Airtable skills.
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                    We&apos;re here to help you take your Airtable game to the
                    next level so you can deliver your value faster, futher, and
                    more quickly.
                  </p>
                </div>

                {/* SVG Highlight */}
                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                  <svg
                    className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
                    viewBox="0 0 1155 678"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                      fillOpacity=".3"
                      d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                    />
                    <defs>
                      <linearGradient
                        id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                        x1="1155.49"
                        x2="-78.208"
                        y1=".177"
                        y2="474.645"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#9089FC" />
                        <stop offset={1} stopColor="#FF80B5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Posts */}
      <div className="mx-auto mt-24 grid gap-5 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3 mx-auto max-w-md px-6 sm:max-w-3xl lg:max-w-5xl lg:px-8">
        {posts
          .sort(
            (a, b) =>
              new Date(b.published).getTime() - new Date(a.published).getTime()
          )
          .map((post) => (
            <div
              key={post.title}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={post.images[0]}
                  alt={post.title}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  {/* <p className="text-sm font-medium flex space-x-2 text-indigo-600">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </p> */}
                  <a href={`/blog/${post.slug}`} className="block">
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
