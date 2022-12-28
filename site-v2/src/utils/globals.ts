import {
  CogIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  UsersIcon,
  GlobeAsiaAustraliaIcon,
} from "@heroicons/react/24/outline";

export const navigation = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blog", href: "/blog" },
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
    name: "Protect Everything",
    description:
      "Your data is your edge. We help you protect what's important so you can innovate quickly.",
    icon: ShieldCheckIcon,
    comingSoon: false,
  },
  {
    name: "Observe Ability",
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
    name: "Bring Your Team",
    description:
      "Share schemas with your developers, generate test data, and get TypeScript types to build your UIs safely.",
    icon: UsersIcon,
    comingSoon: true,
  },
  {
    name: "CDNs For Days",
    description:
      "Did Airtable removing its file serving capabilities really suck for you, too? We've got you covered.",
    icon: GlobeAsiaAustraliaIcon,
    comingSoon: true,
  },
];

export const pricing = {
  tiers: [
    {
      title: "Hobby",
      requestsPerMonth: 10_000,
      price: 27,
      frequency: "/month",
      description: "The essentials to provide your best work for clients.",
      features: ["Unlimited Bases", "Unlimited Tables", "10k Requests / month"],
      cta: "Get Started",
      link: "https://airproxy.lemonsqueezy.com/checkout/buy/61a1ef0c-65a3-453b-aaf8-97aff3af1712?embed=1",
      mostPopular: false,
    },
    {
      title: "Team",
      requestsPerMonth: 50_000,
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
      link: "https://airproxy.lemonsqueezy.com/checkout/buy/a8b9d123-0dda-4869-ac1d-689d33e43d3b?embed=1",
      cta: "Get Started",
      mostPopular: false,
    },
    {
      title: "Business",
      requestsPerMonth: 300_000,
      price: 179,
      frequency: "/month",
      description: "Dedicated support and infrastructure for your company.",
      features: [
        "Unlimited Bases",
        "Unlimited Tables",
        "300k Requests / month",
        "Custom TTLs",
        "TypeScript Definition Generation",
        "API Protection",
        "Toggle View Access",
        "Image CDN",
      ],
      link: "https://airproxy.lemonsqueezy.com/checkout/buy/020e0597-77f7-4336-8fd7-fbeaf08768ae?embed=1",
      cta: "Get Started",
      mostPopular: true,
    },
  ],
};
