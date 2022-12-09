import { signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSession } from "next-auth/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import type { UserPreferences } from "@prisma/client";
import toast from "react-hot-toast";
import useSWR from "swr";
import Link from "next/link";

interface PreferenceResponse {
  preferences: UserPreferences;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const NavBar = () => {
  const { data: session } = useSession();

  const userHasSubscription = false;

  const { data: preferences, mutate } = useSWR<UserPreferences>(
    "/api/preferences",
    fetcher
  );

  const toggleDarkModePreference = async () => {
    if (!preferences) return;

    let updatedPreferences = preferences;
    updatedPreferences.prefersDarkMode = !updatedPreferences.prefersDarkMode;

    await toast.promise(
      fetch("/api/preferences", {
        method: "PUT",
        body: JSON.stringify({ ...updatedPreferences }),
      }),
      {
        loading: "Updating preferences..",
        error: "Whoops! Something went wrong.",
        success: "Preferences saved!",
      }
    );

    await mutate();
  };

  return (
    <header className="flex items-center justify-between max-w-3xl mx-auto pt-6 w-full">
      <div>
        <Link href="/app">
          <h1 className="font-[Chewy] flex items-center gap-2 text-2xl text-gray-800">
            <img src="/cloud.png" alt="Airproxy" className="h-16 w-16" />
            <span>Airproxy</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button onClick={() => toggleDarkModePreference()}>
          {preferences && preferences.prefersDarkMode ? (
            <SunIcon className="h-5 w-5 text-gray-800" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-800" />
          )}
        </button>

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
                    Home
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
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
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/app/api"
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    API
                  </Link>
                )}
              </Menu.Item>
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
                    onClick={() => signOut()}
                    className={`w-full text-left block px-4 py-2 text-sm text-gray-700 ${
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
