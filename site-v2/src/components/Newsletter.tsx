import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { trpc } from "../utils/trpc";

const Newsletter = () => {
  const register = trpc.newsletter.register.useMutation();
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
      <Toaster />
      <div className="rounded-3xl bg-indigo-700 py-10 px-6 sm:py-16 sm:px-12 lg:flex lg:items-center lg:p-20">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Get notified when we&apos;re launching.
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-indigo-100">
            We&apos;re moments away from revolutionizing the way you manage your
            data. You&apos;re not going to want to miss it.
          </p>
        </div>
        <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
          <form
            className="sm:flex"
            onSubmit={async (e) => {
              e.preventDefault();

              await toast.promise(
                // @ts-ignore
                register.mutateAsync({ email }),
                {
                  loading: "Registering...",
                  success: "Thanks for subscribing!",
                  error: "Something went wrong.",
                }
              );

              setEmail("");
            }}
          >
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full rounded-md border-white px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
            />
            <button
              type="submit"
              className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-5 py-3 text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
            >
              Notify me
            </button>
          </form>
          <p className="mt-3 text-sm text-indigo-100">
            We&apos;ll never share your email address with anyone else.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
