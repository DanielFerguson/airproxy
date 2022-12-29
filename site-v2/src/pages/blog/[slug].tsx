import Link from "next/link";
import { allArticles, type Article } from "contentlayer/generated";
import Footer from "../../components/Footer";
import TryAirtable from "../../components/cta/TryAirtable";
import { ArticleJsonLd, BreadcrumbJsonLd, NextSeo } from "next-seo";
import { useState } from "react";
import { navigation } from "../../utils/globals";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import type { GetStaticProps } from "next";
import Image from "next/image";

export async function getStaticPaths() {
  const paths = allArticles.map((article) => article.url);
  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params)
    return {
      notFound: true,
    };

  const article = allArticles.find(
    (article) => article._raw.flattenedPath === params.slug
  );

  return {
    props: {
      article,
    },
  };
};

interface Props {
  article: Article;
}

const ArticleLayout = ({ article }: Props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* SEO */}
      <>
        <NextSeo
          title={article.title}
          description={article.description}
          canonical={`https://www.airproxy.app/blog/${article.slug}`}
          openGraph={{
            title: article.title,
            description: article.description,
            url: `https://www.airproxy.app/blog/${article.slug}`,
            type: "article",
            article: {
              publishedTime: article.published,
              modifiedTime: article.published,
              tags: article.tags,
            },
            images: [
              {
                url: `https://www.airproxy.app/api/og?title=${article.title}`,
              },
            ],
          }}
          twitter={{
            handle: "@thedannyferg",
            site: "@airproxyapp",
            cardType: "summary_large_image",
          }}
          additionalLinkTags={[
            {
              rel: "icon",
              href: "https://www.airproxy.app/favicon.ico",
            },
            {
              rel: "apple-touch-icon",
              href: "https://www.airproxy.app/apple-touch-icon.png",
              sizes: "76x76",
            },
            {
              rel: "manifest",
              href: "/site.webmanifest",
            },
          ]}
        />

        <ArticleJsonLd
          type="BlogPosting"
          url={`https://www.airproxy.app/blog/${article.slug}`}
          title={article.title}
          images={article.images}
          datePublished={article.published}
          dateModified={article.published}
          authorName="Dan Ferguson"
          isAccessibleForFree={true}
          description={article.description}
        />

        <BreadcrumbJsonLd
          itemListElements={[
            {
              position: 1,
              name: "Blog",
              item: "https://www.airproxy.app/blog",
            },
            {
              position: 2,
              name: article.title,
              item: article.url,
            },
          ]}
        />
      </>

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
                    <Image
                      src="/cloud.png"
                      alt="Airproxy"
                      className="h-16 w-16"
                      fill
                    />
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
                  href="/api/auth/signin"
                  className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                >
                  Log in
                </Link>
              </div>
            </nav>
            <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
              <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden">
                <div className="flex h-9 items-center justify-between">
                  <div className="flex">
                    <Link href="#" className="-m-1.5 p-1.5">
                      <span className="sr-only">Airproxy</span>
                      <div className="relative h-16 w-16">
                        <Image src="/cloud.png" alt="Airproxy" fill />
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
                        href="/api/auth/signin"
                        className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
                      >
                        Log in
                      </Link>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="prose mx-auto py-12 px-6 lg:py-32 lg:prose-xl">
        <h1>
          <span className="block text-center text-lg font-semibold text-indigo-600">
            Airproxy
          </span>
          <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            {article.title}
          </span>
        </h1>

        <div className="relative mb-24 h-64 w-full">
          <Image
            src={article.images[0] ?? "#"}
            alt={article.title}
            className="rounded-lg object-cover object-center"
            fill
          />
        </div>

        <article
          dangerouslySetInnerHTML={{ __html: article.body.html }}
        ></article>
      </main>

      {article.next && (
        <div className="mx-auto -mb-8 max-w-3xl px-4 lg:mb-24 lg:-mt-28 lg:px-0">
          <div
            key={article.next.title}
            className="grid grid-cols-5 overflow-hidden rounded-lg shadow-lg"
          >
            <div className="col-span-5 sm:col-span-2">
              <div className="relative h-full w-full">
                <Image
                  className="object-cover"
                  src={article.next.image}
                  alt={article.next.title}
                  fill
                />
              </div>
            </div>
            <div className="col-span-5 flex flex-1 flex-col justify-between bg-white p-6 sm:col-span-3">
              <div className="flex-1">
                <p className="font-medium text-indigo-600">Next Up</p>
                <Link href={article.next.slug} className="mt-2 block">
                  <p className="text-2xl font-semibold text-gray-900">
                    {article.next.title}
                  </p>
                  <p className="mt-3 text-base leading-7 text-gray-500">
                    {article.next.description}
                  </p>
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex-shrink-0">
                  <span className="sr-only">Dan Ferguson</span>
                  <div className="relative h-10 w-10 rounded-full bg-indigo-500">
                    <Image
                      className="rounded-full"
                      src="/danferg.webp"
                      alt="Dan Ferguson"
                      fill
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Dan Ferguson
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <span>Co-Founder; Airproxy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Try Airtable CTA */}
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        <TryAirtable />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default ArticleLayout;
