import Head from "next/head";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import {
  Bars3Icon,
  XMarkIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  UsersIcon,
  GlobeAsiaAustraliaIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { OrganizationJsonLd, LogoJsonLd, SoftwareAppJsonLd } from "next-seo";
import useSWR from "swr";
import Newsletter from "../components/Newsletter";

interface Request {
  id: number;
  latitude: number;
  longitude: number;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blog", href: "/blog" },
];

const features = [
  {
    name: "Scale Fearlessly",
    description:
      "Get the power of Airtable with the comfort of being able to scale globally, instantly.",
    icon: ArrowTrendingUpIcon,
  },
  {
    name: "Protect Everything",
    description:
      "Your data is your edge. We help you protect what's important so you can innovate quickly.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Observe Ability",
    description:
      "Location, location, location - it's not just for real estate. Gain deeper insights of your customers.",
    icon: ChartBarIcon,
  },
  {
    name: "Total Customisation",
    description:
      "Bases, tables, and views - we've got you covered. Set defaults, individual TTLs, and much more.",
    icon: CogIcon,
  },
  {
    name: "Bring Your Team",
    description:
      "Share schemas with your developers, generate test data, and get TypeScript types to build your UIs safely.",
    icon: UsersIcon,
  },
  {
    name: "CDNs For Days",
    description:
      "Did Airtable removing its file serving capabilities really suck for you, too? We've got you covered.",
    icon: GlobeAsiaAustraliaIcon,
  },
];

const pricing = {
  tiers: [
    {
      title: "Hobby",
      price: 27,
      frequency: "/month",
      description: "The essentials to provide your best work for clients.",
      features: ["Unlimited Bases", "Unlimited Tables", "10k Requests / month"],
      cta: "Get Started",
      mostPopular: false,
    },
    {
      title: "Team",
      price: 69,
      frequency: "/month",
      description: "A plan that scales with your rapidly growing business.",
      features: [
        "Unlimited Bases",
        "Unlimited Tables",
        "50k Requests / month",
        "Custom TTLs",
        "TypeScript Definition Generation",
        "API Protection",
      ],
      cta: "Get Started",
      mostPopular: false,
    },
    {
      title: "Business",
      price: 279,
      frequency: "/month",
      description: "Dedicated support and infrastructure for your company.",
      features: [
        "Unlimited Bases",
        "Unlimited Tables",
        "300k Requests / month",
        "Custom TTLs",
        "TypeScript Definition Generation",
        "API Protection",
        "Image CDN",
        "Toggle View Access",
      ],
      cta: "Get Started",
      mostPopular: true,
    },
  ],
};

export default function Page() {
  const session = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: requests } = useSWR<Request[]>("/api/requests");

  return (
    <div>
      <Head>
        <title>Airproxy | Airtable in production, fearlessly.</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☁️</text></svg>"
        ></link>
      </Head>

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
              url: "https://www.airproxy.app/airproxy.jpg",
              type: "image/jpeg",
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
        <div className="px-6 pt-6 lg:px-8">
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
                    {/* <span className="text-gray-600">
                      Announcing the public launch of Airproxy.{" "}
                      <Link
                        href="/blog/announcing-airproxy"
                        className="font-semibold text-indigo-600"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        Read more <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </span> */}
                    <span className="text-gray-600">
                      We&apos;re launching soon! Sign up to the newsletter to
                      stay in the loop.{" "}
                      <Link
                        href="#newsletter"
                        className="font-semibold text-indigo-600"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
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
                    <Link
                      // href={
                      //   session.status === "authenticated"
                      //     ? "/app"
                      //     : "/api/auth/signin"
                      // }
                      href="#newsletter"
                      className="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                    >
                      Get started <span className="line-through">today</span>{" "}
                      soon!
                    </Link>
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
                      {requests &&
                        requests.map(({ id, latitude, longitude }) => (
                          <Marker key={id} coordinates={[longitude, latitude]}>
                            <circle
                              r="12"
                              className="animate-ping-once fill-indigo-600"
                            />
                          </Marker>
                        ))}
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
      <div id="newsletter" className="-mt-24 z-30 relative">
        <Newsletter />
      </div>

      {/* Stats */}
      <div className="pt-12 sm:pt-16">
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
        <div className="pb-12 sm:pb-16 pt-12">
          <div className="relative">
            <div className="absolute inset-0 h-1/2" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <dl className="rounded-lg shadow-lg sm:grid sm:grid-cols-3">
                  <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                      Requests Delivered
                    </dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                      9M +
                    </dd>
                  </div>
                  <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                      Uptime
                    </dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                      100%
                    </dd>
                  </div>
                  <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                      Avg Response Time
                    </dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                      &lt; 299 ms
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="relative py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
          <h2 className="text-lg font-semibold text-indigo-600">
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
                  <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center rounded-xl bg-indigo-500 p-3 shadow-lg">
                          <feature.icon
                            className="h-8 w-8 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                        {feature.name}
                      </h3>
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
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-48">
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
                    className="mx-1 hidden h-5 w-5 text-indigo-600 md:block"
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
        className="mx-auto max-w-7xl bg-white pb-32 pt-16 px-4 sm:px-6 lg:px-8"
      >
        <h2 className="mt-2 text-3xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl">
          Pricing plans for teams of all sizes
        </h2>
        <p className="mt-6 max-w-2xl text-center mx-auto text-xl text-gray-500">
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
                  <p className="absolute top-0 -translate-y-1/2 transform rounded-full bg-indigo-500 py-1.5 px-4 text-sm font-semibold text-white">
                    Most popular
                  </p>
                ) : null}
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-bold tracking-tight">
                    ${tier.price}
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
                        className="h-6 w-6 flex-shrink-0 text-indigo-500"
                        aria-hidden="true"
                      />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#"
                className={classNames(
                  tier.mostPopular
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
                  "mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium"
                )}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>

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
            &copy; 2022 Aaiga, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
