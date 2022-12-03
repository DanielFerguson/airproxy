import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { NextSeo, ArticleJsonLd, BreadcrumbJsonLd } from "next-seo";
import Head from "next/head";

const navigation = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blog", href: "/blog" },
];

interface Meta {
  slug: string;
  title: string;
  description: string;
  published: string;
  tags: string[];
  images: string[];
}

interface IPageProps {
  children: React.ReactNode;
  meta: Meta;
}

export default function Page({ children, meta }: IPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/dracula-prism/dist/css/dracula-prism.css"
        ></link>
      </Head>

      <NextSeo
        title={meta.title}
        description={meta.description}
        canonical={`https://www.airproxy.app/blog/${meta.slug}`}
        openGraph={{
          title: meta.title,
          description: meta.description,
          url: `https://www.airproxy.app/blog/${meta.slug}`,
          type: "article",
          article: {
            publishedTime: meta.published,
            modifiedTime: meta.published,
            tags: meta.tags,
          },
          images: meta.images.map((imageUrl) => ({
            url: imageUrl,
          })),
        }}
        twitter={{
          handle: "@thedannyferg",
          site: "@airproxyapp",
          cardType: "summary_large_image",
        }}
      />
      <ArticleJsonLd
        type="BlogPosting"
        url={`https://www.airproxy.app/blog/${meta.slug}`}
        title={meta.title}
        images={meta.images}
        datePublished={meta.published}
        dateModified={meta.published}
        authorName="Dan Ferguson"
        isAccessibleForFree={true}
        description={meta.description}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Blog",
            item: "https://airproxy.app/blog",
          },
          {
            position: 2,
            name: meta.title,
            item: `https://airproxy.app/blog/${meta.slug}`,
          },
        ]}
      />

      <div>
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
                    <span className="text-5xl">☁️</span>
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
              <Dialog
                as="div"
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
              >
                <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden">
                  <div className="flex h-9 items-center justify-between">
                    <div className="flex">
                      <Link href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Airproxy</span>
                        <span className="text-5xl">☁️</span>
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
        <main className="prose lg:prose-xl mx-auto py-12 lg:py-32 px-6">
          <h1>
            <span className="block text-center text-lg font-semibold text-indigo-600">
              Airproxy
            </span>
            <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              {meta.title}
            </span>
          </h1>

          <img
            src={meta.images[0]}
            alt={meta.title}
            className="h-64 rounded-lg w-full object-center object-cover"
          />

          <article className="">{children}</article>
        </main>

        {/* Footer */}
        <footer className="bg-white">
          <div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            <nav
              className="-mx-5 -my-2 flex flex-wrap justify-center"
              aria-label="Footer"
            >
              {navigation.map((item) => (
                <div key={item.name} className="px-5 py-2">
                  <Link
                    href={item.href}
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>
            <p className="mt-8 text-center text-base text-gray-400">
              &copy; 2020 Aaiga, Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
