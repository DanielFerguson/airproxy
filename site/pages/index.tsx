import Head from "next/head";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  Bars3Icon,
  XMarkIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CheckIcon,
  ChartBarIcon,
  UsersIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const navigation = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blog", href: "#" },
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
    name: "An Awesome Roadmap",
    description:
      "We've got a lot more on the way, and want to know how we can help you accelerate your business.",
    icon: BeakerIcon,
  },
];

const tiers = [
  {
    id: "tier-hobby",
    name: "Hobby",
    href: "#",
    priceMonthly: 49,
    description:
      "Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis.",
    features: [
      "Pariatur quod similique",
      "Sapiente libero doloribus modi nostrum",
      "Vel ipsa esse repudiandae excepturi",
      "Itaque cupiditate adipisci quibusdam",
    ],
  },
  {
    id: "tier-team",
    name: "Team",
    href: "#",
    priceMonthly: 79,
    description:
      "Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis.",
    features: [
      "Pariatur quod similique",
      "Sapiente libero doloribus modi nostrum",
      "Vel ipsa esse repudiandae excepturi",
      "Itaque cupiditate adipisci quibusdam",
      "Sapiente libero doloribus modi nostrum",
    ],
  },
];

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <Head>
        <title>Airproxy | Airtable in production, fearlessly.</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☁️</text></svg>"
        ></link>
      </Head>

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
                  <Link href="#" className="-m-1.5 p-1.5">
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
                          href="#"
                          className="font-semibold text-indigo-600"
                        >
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
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
                      businesses fearlessly without worrying about scaling, or
                      rate limits. Get busy building!
                    </p>
                    <div className="mt-8 flex gap-x-4 sm:justify-center">
                      <Link
                        href="/api/auth/signin"
                        className="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                      >
                        Get started today
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

        {/* Logos */}
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <img
                className="h-12"
                src="/icons/bettorbase.svg"
                alt="Bettorbase"
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <img
                className="h-12"
                src="/icons/imperialwealth.svg"
                alt="Imperial Wealth"
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <img
                className="h-12"
                src="/icons/the-cash-kings.svg"
                alt="The Cash Kings"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="relative py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
            <h2 className="text-lg font-semibold text-indigo-600">
              Deploy faster
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to scale your app.
            </p>
            <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
              Phasellus lorem quam molestie id quisque diam aenean nulla in.
              Accumsan in quis quis nunc, ullamcorper malesuada. Eleifend
              condimentum id viverra nulla.
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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative">
            <img
              className="mx-auto h-8"
              src="/icons/iw-color.svg"
              alt="Imperial Wealth"
            />
            <blockquote className="mt-10">
              <div className="mx-auto max-w-3xl text-center text-2xl font-medium leading-9 text-gray-900">
                <p>
                  &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Nemo expedita voluptas culpa sapiente alias molestiae.
                  Numquam corrupti in laborum sed rerum et corporis.&rdquo;
                </p>
              </div>
              <footer className="mt-8">
                <div className="md:flex md:items-center md:justify-center">
                  <div className="md:flex-shrink-0">
                    <img
                      className="mx-auto h-10 w-10 rounded-full"
                      src="/pugh.jpeg"
                      alt=""
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
                      CDO, Imperial Wealth
                    </div>
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="py-40">
          <div className="relative">
            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2 lg:gap-8">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className="flex flex-col rounded-3xl bg-white shadow-xl ring-1 ring-black/10"
                  >
                    <div className="p-8 sm:p-10">
                      <h3
                        className="text-lg font-semibold leading-8 tracking-tight text-indigo-600"
                        id={tier.id}
                      >
                        {tier.name}
                      </h3>
                      <div className="mt-4 flex items-baseline text-5xl font-bold tracking-tight text-gray-900">
                        ${tier.priceMonthly}
                        <span className="text-lg font-semibold leading-8 tracking-normal text-gray-500">
                          /mo
                        </span>
                      </div>
                      <p className="mt-6 text-base leading-7 text-gray-600">
                        {tier.description}
                      </p>
                    </div>
                    <div className="flex flex-1 flex-col p-2">
                      <div className="flex flex-1 flex-col justify-between rounded-2xl bg-gray-50 p-6 sm:p-8">
                        <ul role="list" className="space-y-6">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex items-start">
                              <div className="flex-shrink-0">
                                <CheckIcon
                                  className="h-6 w-6 text-indigo-600"
                                  aria-hidden="true"
                                />
                              </div>
                              <p className="ml-3 text-sm leading-6 text-gray-600">
                                {feature}
                              </p>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-8">
                          <Link
                            href={tier.href}
                            className="inline-block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold leading-5 text-white shadow-md hover:bg-indigo-700"
                            aria-describedby={tier.id}
                          >
                            Get started today
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative mx-auto mt-8 max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-md lg:max-w-4xl">
              <div className="flex flex-col gap-6 rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 lg:flex-row lg:items-center lg:gap-8">
                <div className="lg:min-w-0 lg:flex-1">
                  <h3 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
                    Free!
                  </h3>
                  <div className="mt-2 text-base leading-7 text-gray-600">
                    You read that right: ✨ free ✨. Get access to the platform
                    so you can try it out for yourself and feel the magic of
                    Airtable in production.
                  </div>
                </div>
                <div>
                  <Link
                    href="/api/auth/signin"
                    className="inline-block rounded-lg bg-indigo-50 px-4 py-2.5 text-center text-sm font-semibold leading-5 text-indigo-700 hover:bg-indigo-100"
                  >
                    Get started today <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
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
              &copy; 2020 Aaiga, Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
