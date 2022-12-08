import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../components/NavBar";
import useSWR from "swr";
import { TrashIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "react-tippy";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

interface TokenResponse {
  id: string;
  apiToken: string;
  name: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const copyToClipboard = (value: string) => {
  toast.success("Copied API URL to clipboard!");
  navigator.clipboard.writeText(value);
};

export default function Page() {
  const { data: bases, mutate } = useSWR<TokenResponse[]>(
    `/api/tokens`,
    fetcher,
    {
      refreshInterval: 1000 * 60 * 60,
    }
  );

  const deleteToken = async (baseId: string) => {
    await toast.promise(
      fetch(`/api/bases/${baseId}`, {
        method: "POST",
        body: JSON.stringify({ action: "REMOVE_TOKEN_FROM_BASE" }),
      }),
      {
        error: "Whoops! Something went wrong.",
        loading: "Removing the API token...",
        success: "Token removed.",
      }
    );

    await mutate();
  };

  return (
    <div>
      <Head>
        <title>API | Airproxy</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☁️</text></svg>"
        ></link>
      </Head>

      <Toaster />
      <NavBar />

      <main className="max-w-3xl mx-auto mt-16 grid gap-y-12 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-3xl font-medium text-gray-900">API</h2>
          </div>
        </div>

        {/* API Table */}
        <div>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                API Tokens
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the API tokens that protect your Bases, and the
                routes inside them.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Key
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Protects
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        ></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {bases &&
                        bases.map((base) => (
                          <tr key={base.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {/* @ts-ignore */}
                              <Tooltip
                                title="Click to copy token"
                                position="top"
                                trigger="mouseenter"
                              >
                                <button
                                  onClick={() => copyToClipboard(base.apiToken)}
                                  className="flex items-center gap-3"
                                >
                                  <span>{base.apiToken.slice(0, 6)}... </span>
                                  <ClipboardDocumentIcon className="h-4" />
                                </button>
                              </Tooltip>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {base.name}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => deleteToken(base.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                {/* @ts-ignore */}
                                <Tooltip
                                  title="Delete this token"
                                  position="top"
                                  trigger="mouseenter"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Tooltip>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
