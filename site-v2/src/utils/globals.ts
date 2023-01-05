import {
  CogIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  UsersIcon,
  GlobeAsiaAustraliaIcon,
  MoonIcon,
  SignalIcon,
  CloudArrowDownIcon,
  BeakerIcon,
  LockClosedIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export const navigation = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Docs", href: "/documentation" },
];

export const dummyData = [
  { time: "9:00am", requests: 5 },
  { time: "9:30am", requests: 5 },
  { time: "10:00am", requests: 5 },
  { time: "10:30am", requests: 5 },
  { time: "11:00am", requests: 5 },
  { time: "11:30am", requests: 5 },
  { time: "12:00pm", requests: 5 },
  { time: "12:30pm", requests: 5 },
  { time: "1:00pm", requests: 5 },
  { time: "1:30pm", requests: 5 },
  { time: "2:00pm", requests: 5 },
  { time: "2:30pm", requests: 5 },
  { time: "3:00pm", requests: 5 },
  { time: "3:30pm", requests: 5 },
  { time: "4:00pm", requests: 5 },
  { time: "4:30pm", requests: 5 },
  { time: "5:00pm", requests: 5 },
];

export const geoUrl = "/features.json";

export const ttlOptions = [
  { name: "10m", seconds: 600 },
  { name: "15m", seconds: 900 },
  { name: "30m", seconds: 1800 },
  { name: "1h", seconds: 3600 },
  { name: "4h", seconds: 14400 },
  { name: "12h", seconds: 43200 },
  { name: "1d", seconds: 86400 },
  { name: "1w", seconds: 604800 },
];

export const features = [
  {
    name: "Scale Fearlessly",
    description:
      "Get the power of Airtable with the comfort of being able to scale globally, instantly.",
    icon: ArrowTrendingUpIcon,
    comingSoon: false,
  },
  {
    name: "Protect Your Data",
    description:
      "Your data is your edge. We help you protect what's important so you can innovate quickly.",
    icon: ShieldCheckIcon,
    comingSoon: false,
  },
  {
    name: "Observability",
    description:
      "Location, location, location - it's not just for real estate. Gain deeper insights of your users.",
    icon: ChartBarIcon,
    comingSoon: false,
  },
  {
    name: "Total Customisation",
    description:
      "Bases, tables, and views - we've got you covered. Set defaults, individual TTLs, and much more.",
    icon: CogIcon,
    comingSoon: false,
  },
  {
    name: "Serve Static Files",
    description:
      "Did Airtable removing its file serving capabilities really suck for you, too? We'll be your CDN.",
    icon: CloudArrowDownIcon,
    comingSoon: false,
  },
  {
    name: "Bring Your Team",
    description:
      "Share schemas with your developers, generate test data, and get TypeScript types to build your UIs safely.",
    icon: UsersIcon,
    comingSoon: "Q1 2023",
  },
  {
    name: "Dark Mode",
    description:
      "Doing some late night coding? No longer will you need to burn out your retinas.",
    icon: MoonIcon,
    comingSoon: "Q1 2023",
  },
  {
    name: "Type Generator",
    description:
      "Generate TypeScript types and interfaces from your Airtable schemas.",
    icon: BeakerIcon,
    comingSoon: "Q1 2023",
  },
  {
    name: "Private CDNs",
    description:
      "Protect your static assets with private CDNs, secured with API keys.",
    icon: LockClosedIcon,
    comingSoon: "Q1 2023",
  },
  {
    name: "Image Optimisations",
    description:
      "Compress, resize, and optimise your images on the fly with our CDN.",
    icon: PhotoIcon,
    comingSoon: "Q1 2023",
  },
  {
    name: "Typesafe APIs",
    description:
      "Move faster with type-safe APIs that are generated from your Airtable schemas.",
    icon: ShieldCheckIcon,
    comingSoon: "Q2 2023",
  },
  {
    name: "Webhooks",
    description:
      "Get notified when your data changes with webhooks, and power your user interfaces in real time.",
    icon: SignalIcon,
    comingSoon: "Q2 2023",
  },
];

export const pricing = {
  tiers: [
    {
      title: "Hobby",
      price: 27,
      frequency: "/month",
      description: "The essentials to provide your best work for clients.",
      features: [
        "Unlimited bases",
        "Unlimited tables",
        "Up to 1k unique users",
        "Up to 10k requests / month",
      ],
      link: "https://airproxy.lemonsqueezy.com/checkout/buy/61a1ef0c-65a3-453b-aaf8-97aff3af1712?embed=1",
      mostPopular: false,
    },
    {
      title: "Team",
      price: 69,
      frequency: "/month",
      description: "A plan that scales with your rapidly growing business.",
      features: [
        "Unlimited bases",
        "Unlimited tables",
        "Up to 5k unique users",
        "Up to 50k requests / month",
        "Custom TTLs",
        "TypeScript definition generation",
        "API protection",
      ],
      link: "https://airproxy.lemonsqueezy.com/checkout/buy/a8b9d123-0dda-4869-ac1d-689d33e43d3b?embed=1",
      mostPopular: true,
    },
    {
      title: "Business",
      price: 179,
      frequency: "/month",
      description: "Dedicated support and infrastructure for your company.",
      features: [
        "Unlimited bases",
        "Unlimited tables",
        "Up to 20K unique users",
        "Up to 500k requests / month",
        "Custom TTLs",
        "TypeScript definition generation",
        "API protection",
        "Toggle view access",
        "Image CDN",
      ],
      link: "https://airproxy.lemonsqueezy.com/checkout/buy/020e0597-77f7-4336-8fd7-fbeaf08768ae?embed=1",
      mostPopular: false,
    },
  ],
};
