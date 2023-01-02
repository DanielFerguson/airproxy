import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import {
  GoogleIcon,
  TwitterIcon,
  GithubIcon,
} from "../../components/icons/iconic";

const Page: NextPage = () => {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src="/cloud.png" alt="Airproxy" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <span className="font-medium text-indigo-600">register one now</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <button
                onClick={() => signIn("github", { callbackUrl: "/app" })}
                className="group inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with GitHub</span>
                <GithubIcon className="h-5 w-5 fill-gray-700 group-hover:fill-gray-900" />
              </button>
            </div>

            <div>
              <button
                onClick={() => signIn("google", { callbackUrl: "/app" })}
                className="group inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Google</span>
                <GoogleIcon className="h-5 w-5 fill-gray-700 group-hover:fill-gray-900" />
              </button>
            </div>

            <div>
              <button
                onClick={() => signIn("twitter", { callbackUrl: "/app" })}
                className="group inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Twitter</span>
                <TwitterIcon className="h-5 w-5 fill-gray-700 group-hover:fill-gray-900" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
