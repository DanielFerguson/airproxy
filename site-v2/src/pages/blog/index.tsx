import { NextSeo, ArticleJsonLd } from "next-seo";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Footer from "../../components/Footer";
import { navigation } from "../../utils/globals";
import { allArticles, type Article } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import Image from "next/image";

interface Props {
  articles: Article[];
}

const Page = ({ articles }: Props) => {
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

      {articles.map((article) => (
        <ArticleJsonLd
          key={`${article.title}-article-id`}
          type="Blog"
          url={`/blog/${article.slug}`}
          title={article.title}
          images={[article.images[0] ?? ""]}
          datePublished={article.published}
          dateModified={article.published}
          authorName="Dan Ferguson"
          description={article.description}
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
        <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
          <div>
            <nav
              className="flex h-9 items-center justify-between"
              aria-label="Global"
            >
              <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Airproxy</span>
                  <div className="relative h-16 w-16">
                    <Image src="/cloud.png" alt="Airproxy" fill={true} />
                  </div>
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
                      <div className="relative h-16 w-16">
                        <Image src="/cloud.png" alt="Airproxy" fill={true} />
                      </div>
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
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
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
                </div>

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

      {/* Articles */}
      <div className="mx-auto my-24 grid max-w-md gap-5 px-6 sm:max-w-3xl sm:grid-cols-2 lg:max-w-5xl lg:grid-cols-3 lg:px-8">
        {articles
          .sort(
            (a, b) =>
              new Date(b.published).getTime() - new Date(a.published).getTime()
          )
          .map((article) => (
            <div
              key={article.title}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg"
            >
              <div className="flex-shrink-0">
                <div className="relative h-48 w-full">
                  <Image
                    className="object-cover"
                    src={article.images[0] ?? "#"}
                    alt={article.title}
                    layout="fill"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  {/* <p className="text-sm font-medium flex space-x-2 text-indigo-600">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </p> */}
                  <a href={`/blog/${article.slug}`} className="block">
                    <p className="text-xl font-semibold text-gray-900">
                      {article.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      {article.description}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Footer />
    </div>
  );
};

export async function getStaticProps() {
  const articles = allArticles.sort((a, b) => {
    return compareDesc(new Date(a.published), new Date(b.published));
  });
  return { props: { articles } };
}

export default Page;
