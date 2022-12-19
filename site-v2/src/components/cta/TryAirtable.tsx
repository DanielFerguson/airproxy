import Link from "next/link";

const TryAirtable = () => {
  return (
    <div className="overflow-hidden rounded-lg bg-indigo-700 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
      <div className="px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
        <div className="lg:self-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">
              Millisecond response times, with global scaling.
            </span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Focus on building great experiences for your users, not API
            limitation. Sign up now and see how Airproxy can help you unlock the
            full potential of Airtable&apos;s API.
          </p>
          <Link
            href="/api/auth/signin"
            className="mt-8 inline-flex items-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 shadow hover:bg-indigo-50"
          >
            Sign up for free
          </Link>
        </div>
      </div>
      <div className="aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1 -mt-6">
        <img
          className="translate-x-6 translate-y-6 transform rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
          src="/screenshot.png"
          alt="App screenshot"
        />
      </div>
    </div>
  );
};

export default TryAirtable;
