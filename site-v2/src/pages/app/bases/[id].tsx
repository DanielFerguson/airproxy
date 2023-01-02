import { useRouter } from "next/router";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../../components/NavBar";
import StatCard from "../../../components/StatCard";
import {
  ArrowPathIcon,
  InformationCircleIcon,
  PauseIcon,
  PlayIcon,
  ShareIcon,
} from "@heroicons/react/20/solid";
import { Tooltip } from "react-tippy";
import millify from "millify";
import { ClipboardDocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { trpc } from "../../../utils/trpc";
import { ttlOptions } from "../../../utils/globals";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") {
    return null;
  }

  const base = trpc.base.get.useQuery({ id });
  const stats = trpc.stat.statsPerBase.useQuery({ baseId: id });
  const setTableStatus = trpc.table.setStatus.useMutation();
  const createToken = trpc.base.createToken.useMutation();
  const removeToken = trpc.base.removeToken.useMutation();
  const setTableTtl = trpc.table.setTtl.useMutation();
  const setBaseStatus = trpc.base.setStatus.useMutation();
  const setAllTablesStatus = trpc.base.setAllTablesStatus.useMutation();
  const bustTableCache = trpc.table.bustCache.useMutation();
  const subscription = trpc.user.subscription.useQuery();

  return (
    <div>
      <Head>
        <title>{base.data?.name} | Airproxy</title>
      </Head>

      <Toaster />
      <NavBar />

      <main className="mx-auto mt-16 grid max-w-3xl gap-y-12 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-0">
          <div className="flex items-center gap-5">
            <h2 className="text-3xl font-medium text-gray-900">
              {base.data?.name}
            </h2>
            {base.data?.active ? (
              <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                <span className="relative -ml-0.5 mr-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Active
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                <span className="relative -ml-0.5 mr-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gray-500"></span>
                </span>
                Disabled
              </span>
            )}
          </div>

          <div>
            {/* Toggle Base Active Status */}
            {/* @ts-ignore */}
            <Tooltip
              title={base.data?.active ? "Disable base" : "Enable base"}
              position="top"
              trigger="mouseenter"
            >
              <button
                type="button"
                onClick={async () => {
                  if (!base.data) return;

                  await toast.promise(
                    setBaseStatus.mutateAsync({
                      baseId: base.data.id,
                      status: !base.data.active,
                    }),
                    {
                      loading: "Updating base status...",
                      success: base.data.active
                        ? "Base disabled"
                        : "Base enabled",
                      error: "Failed to update base status",
                    }
                  );

                  base.refetch();
                }}
              >
                {base.data?.active ? (
                  <PauseIcon className="h-5 w-5" />
                ) : (
                  <PlayIcon className="h-5 w-5" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 md:px-0">
          {/* Cards */}
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Last 30 days
          </h3>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard
              name="Total Requests"
              stat={
                stats.data
                  ? millify(stats.data.totalRequests, { precision: 2 })
                  : "0"
              }
              limit={millify(
                subscription.data ? subscription.data?.requestsPerMonth : 0,
                { precision: 2 }
              )}
            />
            <StatCard
              name="Unique Users"
              stat={
                stats.data
                  ? millify(stats.data.uniqueUsersCount, { precision: 2 })
                  : "0"
              }
            />
            <StatCard
              name="Protection Status"
              stat={base.data?.apiToken ? "Protected" : "Unprotected"}
            />
          </dl>

          {/* Notification */}
          {base.data?.requests && base.data?.requests.length === 0 && (
            <div className="mt-4 rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon
                    className="h-5 w-5 text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    When you start receiving requests, you will be able to see
                    stats here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* API Tokens */}
        <div className="px-4 md:px-0">
          {/* Header */}
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                {base.data?.apiToken ? "Protected" : "Unprotected"}
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                {base.data?.apiToken
                  ? "The APIs under this base are protected with an API key."
                  : "The APIs under this base are unprotected and can be accessed by anyone."}
              </p>
            </div>

            {/* Protected Actions */}
            {base.data?.apiToken ? (
              <div className="flex gap-3">
                {/* @ts-ignore */}
                <Tooltip title="Remove Key" position="top" trigger="mouseenter">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!base.data?.apiToken) return;

                      await toast.promise(
                        removeToken.mutateAsync({ baseId: base.data.id }),
                        {
                          loading: "Removing API token...",
                          success: "Removed API token.",
                          error: "Failed to remove API.",
                        }
                      );

                      base.refetch();
                    }}
                    className="inline-flex items-center rounded-md border border-white bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </Tooltip>
                <button
                  type="button"
                  onClick={() => {
                    if (!base.data?.apiToken) return;

                    navigator.clipboard.writeText(base.data.apiToken);
                    toast.success("Copied to clipboard!");
                  }}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                {/* @ts-ignore */}
                <Tooltip
                  title="You need to upgrade your plan to use this feature."
                  position="top"
                  trigger="mouseenter"
                  disabled={
                    subscription.data?.level === "Team" ||
                    subscription.data?.level === "Business"
                  }
                >
                  <button
                    type="button"
                    disabled={
                      subscription.data?.level !== "Team" &&
                      subscription.data?.level !== "Business"
                    }
                    onClick={async () => {
                      if (!base.data?.id) return;

                      await toast.promise(
                        createToken.mutateAsync({ baseId: base.data.id }),
                        {
                          loading: "Creating token...",
                          success: "Token created!",
                          error: "Failed to create token",
                        }
                      );

                      base.refetch();
                    }}
                    className={
                      "inline-flex items-center rounded-md border border-white bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" +
                      (subscription.data?.level !== "Team" &&
                      subscription.data?.level !== "Business"
                        ? " cursor-not-allowed opacity-50"
                        : "")
                    }
                  >
                    Create token
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* Tables */}
        <div>
          {/* Header */}
          <div className="px-4 sm:flex sm:items-center md:px-0">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Tables</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the tables under this base, and their controls.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={async () => {
                  if (!base.data) return;

                  await toast.promise(
                    setAllTablesStatus.mutateAsync({
                      baseId: base.data.id,
                      status: !(
                        base.data.tables.filter((table) => table.active)
                          .length > 0
                      ),
                    }),
                    {
                      loading: "Disabling...",
                      success: "Disabled all tables.",
                      error: "Failed to disable all",
                    }
                  );

                  base.refetch();
                }}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {base.data &&
                base.data.tables.filter((table) => table.active).length > 0
                  ? "Disable all"
                  : "Enable all"}
              </button>
            </div>
          </div>
          {/* Table */}
          <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:inline-block"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:inline-block"
                  >
                    Requests
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 pl-6 text-left text-sm font-semibold text-gray-900 sm:inline-block"
                  >
                    TTL
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {base.data?.tables
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((table, index) => (
                    <tr
                      key={table.id}
                      className={index % 2 === 0 ? undefined : "bg-gray-50"}
                    >
                      <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <span>{table.name}</span>
                        {table.active ? (
                          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 sm:hidden">
                            Active
                          </span>
                        ) : (
                          <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 sm:hidden">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-3.5 text-sm text-gray-500 sm:inline-block">
                        {table.active ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-3.5 text-sm text-gray-500 sm:inline-block">
                        Coming Soon
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-3.5 text-sm text-gray-500 sm:inline-block">
                        {/* @ts-ignore */}
                        <Tooltip
                          title="You need to upgrade your plan to use this feature."
                          position="top"
                          trigger="mouseenter"
                          disabled={
                            subscription.data?.level === "Team" ||
                            subscription.data?.level === "Business"
                          }
                        >
                          <select
                            disabled={
                              subscription.data?.level !== "Team" &&
                              subscription.data?.level !== "Business"
                            }
                            className="mt-1 block w-full cursor-pointer rounded-md border-transparent bg-transparent py-2 pl-3 pr-10 text-base hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            defaultValue={table.ttl}
                            onChange={async (e) => {
                              await toast.promise(
                                setTableTtl.mutateAsync({
                                  tableId: table.id,
                                  ttl: parseInt(e.target.value),
                                }),
                                {
                                  loading: "Updating TTL...",
                                  success: "TTL updated",
                                  error: "Failed to update TTL",
                                }
                              );

                              base.refetch();
                            }}
                          >
                            {ttlOptions.map((option) => (
                              <option key={option.name} value={option.seconds}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </Tooltip>
                      </td>
                      <td className="relative whitespace-nowrap py-1.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end gap-x-3">
                          {/* Bust Cache */}
                          <button
                            onClick={async () => {
                              await toast.promise(
                                bustTableCache.mutateAsync({
                                  tableId: table.id,
                                }),
                                {
                                  loading: "Busting cache...",
                                  success: "Cache busted",
                                  error: "Failed to bust cache",
                                }
                              );

                              base.refetch();
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {/* @ts-ignore */}
                            <Tooltip
                              title="Refresh data"
                              position="top"
                              trigger="mouseenter"
                            >
                              <ArrowPathIcon className="h-4 w-4" />
                            </Tooltip>
                          </button>
                          <button
                            onClick={async () => {
                              await toast.promise(
                                setTableStatus.mutateAsync({
                                  tableId: table.id,
                                  active: !table.active,
                                }),
                                {
                                  loading: "Updating...",
                                  success: table.active
                                    ? "Table disabled"
                                    : "Table enabled",
                                  error: "Failed to update table",
                                }
                              );

                              base.refetch();
                            }}
                            disabled={!base.data?.active}
                            className={`${
                              base.data?.active
                                ? "text-indigo-600 hover:text-indigo-900"
                                : "text-gray-500"
                            }`}
                          >
                            {/* @ts-ignore */}
                            <Tooltip
                              title={
                                !base.data?.active
                                  ? "Base is disabled"
                                  : table.active
                                  ? "Disable API access"
                                  : "Enable API access"
                              }
                              position="top"
                              trigger="mouseenter"
                            >
                              {table.active ? (
                                <PauseIcon className="h-4 w-4" />
                              ) : (
                                <PlayIcon className="h-4 w-4" />
                              )}
                            </Tooltip>
                          </button>
                          <button
                            onClick={() => {
                              // Copy the API URL
                              navigator.clipboard.writeText(
                                `https://api.airproxy.app/${base.data?.id}/${table.id}`
                              );

                              toast.success("Copied the API URL");
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {/* @ts-ignore */}
                            <Tooltip
                              title="Copy the API URL"
                              position="top"
                              trigger="mouseenter"
                            >
                              <ShareIcon className="h-4 w-4" />
                            </Tooltip>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
