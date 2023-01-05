import { type NextPage } from "next";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Bars3Icon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import {
  NextSeo,
  OrganizationJsonLd,
  LogoJsonLd,
  SoftwareAppJsonLd,
} from "next-seo";
import { classNames, isDiscountPeriod } from "../utils/helpers";
import { navigation, features, pricing } from "../utils/globals";
// import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import dynamic from "next/dynamic";

const LemonSqueezy = dynamic(() => import("../components/LemonSqueezy"), {
  ssr: false,
});

const Home: NextPage = () => {
  const session = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <LemonSqueezy />

      {/* SEO */}
      <>
        <NextSeo
          title="Airproxy | Airtable in production, fearlessly."
          description="Gain the full power of the Airtable platform, and build businesses fearlessly without worrying about scaling, or rate limits. Get busy building!"
          canonical="https://www.airproxy.app/"
          openGraph={{
            type: "website",
            url: "https://www.airproxy.app",
            title: "Airproxy | Airtable in production, fearlessly.",
            description:
              "Gain the full power of the Airtable platform, and build businesses fearlessly without worrying about scaling, or rate limits. Get busy building!",
            images: [
              {
                url: "https://www.airproxy.app/og.png",
                type: "image/png",
                width: 1200,
                height: 680,
                alt: "Airproxy helps you scale, fast!",
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

        <SoftwareAppJsonLd
          name="Airproxy"
          price="27.00"
          priceCurrency="AUD"
          operatingSystem="WEB"
          applicationCategory="Productivity"
        />

        <LogoJsonLd
          key="aaiga-logo-ld"
          logo="https://www.airproxy.app/a.png"
          url="https://www.aaiga.com.au"
        />

        <LogoJsonLd
          key="airproxy-logo-ld"
          logo="https://www.airproxy.app/cloud.png"
          url="https://www.airproxy.app"
        />

        <OrganizationJsonLd
          type="OnlineBusiness"
          id="https://www.aaiga.com.au"
          logo="https://www.airproxy.app/a.png"
          legalName="Aaiga Inc."
          name="Aaiga"
          address={{
            addressLocality: "Ballarat",
            addressRegion: "VIC",
            postalCode: "3350",
            addressCountry: "AU",
          }}
          contactPoint={[
            {
              contactType: "customer service",
              email: "contact@aaiga.com.au",
              areaServed: "AU",
              availableLanguage: ["English"],
            },
          ]}
          url="https://www.aaiga.com.au/"
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

        {/* Header */}
        <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
          <div>
            <nav
              className="flex h-9 items-center justify-between"
              aria-label="Global"
            >
              <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                <Link href="#" className="-m-1.5 p-1.5">
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
                    <Link href="#" className="-m-1.5 p-1.5">
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
                        className="font-semibold text-[#544CE6]"
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
                    Use Airtable in production; fearlessly.
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                    Gain the full power of the Airtable platform, and build
                    businesses without worrying about scaling, limitations or
                    rate limits. Get busy building!
                  </p>
                  <div className="mt-8 flex gap-x-4 sm:justify-center">
                    {session.status === "authenticated" ? (
                      <Link
                        href="/app"
                        className="inline-block rounded-lg bg-[#544CE6] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#544CE6] hover:bg-indigo-700 hover:ring-indigo-700"
                      >
                        Go to Dashboard
                      </Link>
                    ) : (
                      <button
                        onClick={() => signIn("auth0")}
                        className="inline-block rounded-lg bg-[#544CE6] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#544CE6] hover:bg-indigo-700 hover:ring-indigo-700"
                      >
                        Get started today!
                      </button>
                    )}
                    {/* <Link
                        href="#"
                        className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                      >
                        Live demo
                      </Link> */}
                  </div>

                  {/* Map */}
                  <div className="pt-16">
                    <ComposableMap
                      projection="geoMercator"
                      width={800}
                      height={600}
                      className="w-full"
                      projectionConfig={{
                        rotate: [-10, 0, 0],
                        scale: 100,
                      }}
                    >
                      <Geographies geography={"/features.json"}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#FFF"
                              stroke="#4f46e5"
                              strokeWidth={1.25}
                            />
                          ))
                        }
                      </Geographies>
                      {/* NOTE: Connect up with tRPC */}
                      {/* {requests &&
                        requests.map(({ id, latitude, longitude }) => (
                          <Marker key={id} coordinates={[longitude, latitude]}>
                            <circle
                              r="12"
                              className="animate-ping-once fill-[#544CE6]"
                            />
                          </Marker>
                        ))} */}
                    </ComposableMap>
                  </div>
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

      {/* Newsletter CTA */}
      {/* <div id="newsletter" className="relative z-30 -mt-24">
        <Newsletter />
      </div> */}

      {/* Stats */}
      {/* <div className="pt-12 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by businesses with a bias for action
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              We&apos;re already enabling businesses to scale into international
              markets, <br /> so they can deliver products to market faster.
            </p>
          </div>
        </div>
        <div className="pb-12 pt-12 sm:pb-16">
          <div className="relative">
            <div className="absolute inset-0 h-1/2" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <dl className="rounded-lg shadow-lg sm:grid sm:grid-cols-3">
                  <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                      Requests Delivered
                    </dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-[#544CE6]">
                      9M +
                    </dd>
                  </div>
                  <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                      Uptime
                    </dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-[#544CE6]">
                      100%
                    </dd>
                  </div>
                  <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                      Avg Response Time
                    </dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-[#544CE6]">
                      &lt; 299 ms
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Features */}
      <div id="features" className="relative pb-24 sm:pb-32 lg:pb-40">
        <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
          <h2 className="text-lg font-semibold text-[#544CE6]">
            Innovate faster
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build, and scale.
          </p>
          <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            Forget about the hassle of building and maintaining your own caching
            layer. Airproxy is a fully managed service that scales with your
            business.
          </p>
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root h-full rounded-lg bg-gray-50 px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center rounded-xl bg-[#544CE6] p-3 shadow-lg">
                          <feature.icon
                            className="h-8 w-8 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div className="mt-8">
                        {feature.comingSoon && (
                          <span className="mb-2 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                            {typeof feature.comingSoon === "boolean"
                              ? "Coming soon"
                              : feature.comingSoon}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                          {feature.name}
                        </h3>
                      </div>
                      <p className="mt-5 text-base leading-7 text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimony */}
      <div className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8 lg:pb-40">
        <div className="relative">
          <img
            className="mx-auto h-8"
            src="/icons/iw-color.svg"
            alt="Imperial Wealth"
          />
          <blockquote className="mt-10">
            <div className="mx-auto max-w-3xl text-center text-2xl font-medium leading-9 text-gray-900">
              <p>
                &ldquo;Our teams can now easily use the data they need to create
                great content for our users, and our developers can focus on
                other important tasks instead of optimizing our Airtable
                integration. Airproxy has been a game-changer for our business
                and I highly recommend it to anyone looking to unlock the full
                potential of Airtable&apos;s API.&rdquo;
              </p>
            </div>
            <footer className="mt-8">
              <div className="md:flex md:items-center md:justify-center">
                <div className="md:flex-shrink-0">
                  <img
                    className="mx-auto h-10 w-10 rounded-full"
                    src="/pugh.jpeg"
                    alt="Daniel Pugh, COO of Imperial Wealth"
                  />
                </div>
                <div className="mt-3 text-center md:mt-0 md:ml-4 md:flex md:items-center">
                  <div className="text-base font-medium text-gray-900">
                    Daniel Pugh
                  </div>

                  <svg
                    className="mx-1 hidden h-5 w-5 text-[#544CE6] md:block"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M11 0h3L9 20H6l5-20z" />
                  </svg>

                  <div className="text-base font-medium text-gray-500">
                    Chief Data Officer, Imperial Wealth
                  </div>
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Pricing */}
      <div
        id="pricing"
        className="mx-auto max-w-7xl bg-white px-4 pb-32 pt-16 sm:px-6 lg:px-8"
      >
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Pricing plans for teams of all sizes
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xl text-gray-500">
          Choose an affordable plan that&apos;s packed with the best features
          for engaging your audience, creating customer loyalty, and driving
          sales.
        </p>

        {/* Tiers */}
        <div className="mt-24 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
          {pricing.tiers.map((tier) => (
            <div
              key={tier.title}
              className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {tier.title}
                </h3>
                {tier.mostPopular ? (
                  <p className="absolute top-0 -translate-y-1/2 transform rounded-full bg-[#544CE6] py-1.5 px-4 text-sm font-semibold text-white">
                    Most popular
                  </p>
                ) : null}
                <p className="mt-4 flex items-baseline text-gray-900">
                  {isDiscountPeriod() && (
                    <span className="pr-3 text-5xl font-bold italic tracking-tight line-through">
                      ${tier.price}
                    </span>
                  )}
                  <span className="text-5xl font-bold tracking-tight">
                    $
                    {isDiscountPeriod()
                      ? Math.ceil(tier.price * 0.8)
                      : tier.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold">
                    {tier.frequency}
                  </span>
                </p>
                <p className="mt-6 text-gray-500">{tier.description}</p>

                {/* Feature list */}
                <ul role="list" className="mt-6 space-y-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex">
                      <CheckIcon
                        className="h-6 w-6 flex-shrink-0 text-[#544CE6]"
                        aria-hidden="true"
                      />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {session.status === "authenticated" ? (
                <a
                  href={`${tier.link}&checkout[custom][user_id]=${session.data.user?.id}&checkout[email]=${session.data.user?.email}&checkout[discount_code]=EARLYBIRD`}
                  className={classNames(
                    tier.mostPopular
                      ? "bg-[#544CE6] text-white hover:bg-[#544CE6]"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
                    "lemonsqueezy-button mt-8 block w-full rounded-md border border-transparent py-3 px-6 text-center font-medium"
                  )}
                >
                  Get Started
                </a>
              ) : (
                <button
                  onClick={() => signIn("auth0")}
                  className={classNames(
                    tier.mostPopular
                      ? "bg-[#544CE6] text-white hover:bg-[#544CE6]"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
                    "mt-8 block w-full rounded-md border border-transparent py-3 px-6 text-center font-medium"
                  )}
                >
                  Get Started
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
