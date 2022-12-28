import Link from "next/link";
import { navigation } from "../utils/globals";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {[...navigation, { name: "Sitemap", href: "/sitemap.xml" }].map(
            (item) => (
              <div key={item.name} className="px-5 py-2">
                <Link
                  href={item.href}
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              </div>
            )
          )}
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; 2022{" "}
          <a
            href="https://aaiga.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-purple-600 no-underline hover:text-purple-800 hover:underline"
          >
            aaiga
          </a>
          , Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
