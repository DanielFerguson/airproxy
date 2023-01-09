import { NextSeo } from "next-seo";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";
import { navigation } from "../utils/globals";
import { allArticles, type Article } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import Image from "next/image";

const Page = ({ articles }: { articles: Article[] }) => {
  const session = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* SEO */}
      <>
        <NextSeo
          title="Docs | Airproxy"
          description="Learn how to take your Airtable game to the next level so you can deliver your value faster, futher, and more quickly."
          canonical="https://www.airproxy.app/docs"
          openGraph={{
            type: "website",
            url: "https://www.airproxy.app/docs",
            title: "Docs | Airproxy",
            description:
              "Learn how to take your Airtable game to the next level so you can deliver your value faster, futher, and more quickly.",
            images: [
              {
                url: "https://www.airproxy.app/og.png",
                type: "image/png",
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
                {session.status === "authenticated" ? (
                  <Link
                    href="/app"
                    className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <button
                    onClick={() => signIn("auth0")}
                    className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                  >
                    Log in
                  </button>
                )}
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
                      {session.status === "authenticated" ? (
                        <Link
                          href="/app"
                          className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <button
                          onClick={() => signIn("auth0")}
                          className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
                        >
                          Log in
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </div>
        </div>

        {/* Content */}
        <div className="relative px-6 pt-20 sm:pt-0 lg:px-8">
          <div className="mx-auto max-w-3xl sm:pt-24">
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
                  Get Up And Running.
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                  Start using your Airtable data in minutes with Airproxy. Learn
                  how you can take full advantage of your data with our guides
                  and tutorials.
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
      </div>

      {/* Articles */}
      <div className="prose relative z-40 mx-auto my-24 gap-5 px-6 sm:max-w-3xl md:prose-lg lg:max-w-5xl lg:px-8 xl:prose-xl">
        <h2>Table of Contents</h2>
        <ul>
          <li>
            <Link href="#getting-started">Getting Started</Link>
            <ul>
              <li>
                <Link href="#what-is-airproxy">What is Airproxy?</Link>
              </li>
              <li>
                <Link href="#add-a-personal-access-token">
                  Add a Personal Access Token{" "}
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="#the-dashboard">The Dashboard</Link>
          </li>
          <li>
            <Link href="#getting-started">Using the API</Link>
          </li>
        </ul>
        <h2 id="getting-started">Getting Started</h2>
        <h3 id="what-is-airproxy">What is Airproxy?</h3>
        <p>
          Airproxy is a service that allows you to connect to your Airtable
          account, and use your data in your application. It&apos;s a great way
          to get started with Airtable, and start building your application.
        </p>
        <h3 id="add-a-personal-access-token">Add a Personal Access Token</h3>
        <p>
          You can get started by{" "}
          <button onClick={() => signIn("auth0")} className="inline-block">
            signing up for a free account
          </button>
          . Once you&apos;ve signed up, you&apos;ll be able to connect to your
          Airtable account, and start using your data in your application.
        </p>
        <p>
          You will need to create a Personal Access Token in your Airtable
          account, and then paste it into the Airproxy dashboard. We recommend
          creating a new Personal Access Token for Airproxy. You can do this by
          going to your Airtable account, and clicking on your profile picture
          in the top right corner, or by{" "}
          <a
            href="https://airtable.com/create/token"
            target="_blank"
            rel="noopener noreferrer"
          >
            using this link.
          </a>
          .
        </p>
        <p>
          Then, click on &quot;Developer hub&qout; in the dropdown menu. Then,
          click on &quot;Personal access tokens&qout; on the left sidebar. Then,
          click on &quot;Create new token&quot;. Then, give your token a name,
          and click on &quot;Create token&quot;.
        </p>
        <p>
          In order to use Airproxy, you will need to select the following
          scopes:
        </p>
        <ul>
          <li className="italic">data.records:read</li>
          <li className="italic">schema.bases:read</li>
        </ul>
        <p>
          In order for Airproxy to automatically detect and import new bases and
          workspaces in the future, you will need to select the following
          permission:
        </p>
        <ul>
          <li className="italic">
            All current and future bases in all current and future workspaces
          </li>
        </ul>
        <h2 id="the-dashboard">The Dashboard</h2>
        <h3>Overview</h3>
        {/* Charts */}
        {/* Stats */}
        {/* Table and Controls */}
        <h3>Bases</h3>
        {/* Charts */}
        {/* Stats */}
        {/* Table and Controls */}
        <h3>Protecting Your Data</h3>
        {/* Create an API token */}
        {/* Remove an API token */}
        {/* Using an API token */}
        <h2 id="using-the-api">Using the API</h2>
        <h3>Authentication</h3>
        <h3>Content Delivery Network</h3>
        <h3>Busting The Cache</h3>
      </div>

      <Footer />
    </div>
  );
};

export async function getStaticProps() {
  const articles = allArticles.sort((a, b) =>
    compareDesc(new Date(a.published), new Date(b.published))
  );

  return { props: { articles } };
}

export default Page;
