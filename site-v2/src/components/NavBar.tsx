import { signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 pt-6 md:px-0">
      <div>
        <Link href="/app">
          <h1 className="flex items-center gap-2 font-[Chewy] text-2xl text-gray-800">
            <img src="/cloud.png" alt="Airproxy" className="h-16 w-16" />
            {/* <span>Airproxy</span> */}
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* NOTE: If I want to add dark mode, this is here. */}
        {/* <button onClick={() => toggleDarkModePreference()}>
          {preferences && preferences.prefersDarkMode ? (
            <SunIcon className="h-5 w-5 text-gray-800" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-800" />
          )}
        </button> */}

        {/* Menu */}
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src={session?.user?.image ?? ""}
                alt="User icon"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/app"
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/"
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Home
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/documentation"
                    target="_blank"
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Docs
                  </Link>
                )}
              </Menu.Item>
              {/* <Menu.Item>
                {({ active }) => (
                  <Link
                    href={
                      userHasSubscription
                        ? "https://billing.stripe.com/p/login/aEU3gh5bbeZD3Pq4gg"
                        : "/billing"
                    }
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Subscriptions
                  </Link>
                )}
              </Menu.Item> */}
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/app/settings"
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Settings
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      signOut();
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default NavBar;
