import { useRouter } from "next/router";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../../components/NavBar";
import StatCard from "../../../components/StatCard";
import {
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ClockIcon,
  InboxIcon,
  InformationCircleIcon,
  PauseIcon,
  PhotoIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  ShareIcon,
  Square2StackIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
} from "@heroicons/react/20/solid";
import { Tooltip } from "react-tippy";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import millify from "millify";
import { ClipboardDocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { trpc } from "../../../utils/trpc";
import { toTitleCase } from "../../../utils/helpers";
import { ttlOptions } from "../../../utils/globals";

const viewTypeIcon = (type: string): JSX.Element => {
  switch (type) {
    case "grid":
      return <Squares2X2Icon className="mr-1.5 h-3 w-3" />;

    case "form":
      return <InboxIcon className="mr-1.5 h-3 w-3" />;

    case "calendar":
      return <CalendarDaysIcon className="mr-1.5 h-3 w-3" />;

    case "gallery":
      return <PhotoIcon className="mr-1.5 h-3 w-3" />;

    case "kanban":
      return <ViewColumnsIcon className="mr-1.5 h-3 w-3" />;

    case "timeline":
      return <ClockIcon className="mr-1.5 h-3 w-3" />;

    case "block":
      return <Square2StackIcon className="mr-1.5 h-3 w-3" />;

    default:
      return <QuestionMarkCircleIcon className="mr-1.5 h-3 w-3" />;
  }
};

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

  return (
    <div>
      <Head>
        <title>{base.data?.name} | Airproxy</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☁️</text></svg>"
        />
      </Head>

      <Toaster />

      <NavBar />

      <main className="mx-auto mt-16 grid max-w-3xl gap-y-12 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
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
        <div>
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
              limit={millify(200000, { precision: 2 })}
            />
            <StatCard
              name="Customers"
              stat={
                stats.data
                  ? millify(stats.data.customerCount, { precision: 2 })
                  : "0"
              }
            />
            <StatCard
              name="Protection Status"
              stat={base.data?.apiToken ? "Protected" : "Unprotected"}
            />
          </dl>

          {/* Chart */}
          <div className="mt-5 h-64 w-full overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-normal text-gray-900">
                Requests (Live)
              </h3>
            </div>

            {/* TODO: Re-add */}
            {/* <ResponsiveContainer>
              <BarChart
                data={requests && requests.length > 0 ? requests : dummyData}
                margin={{
                  top: 0,
                  right: 0,
                  bottom: 40,
                  left: 0,
                }}
              >
                <Bar dataKey="requests" fill="#8884d8" />
                {requests && requests.length > 0 && (
                  <ChartTooltip
                    formatter={(value, name, props) => [value, "Requests"]}
                  />
                )}
                <YAxis
                  type="number"
                  domain={
                    requests && requests.length > 0 ? [0, "dataMax"] : [0, 100]
                  }
                  hide
                />
                <XAxis domain={[0, "dataMax"]} dataKey="time" />
              </BarChart>
            </ResponsiveContainer> */}
          </div>

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
                    When you start receiving requests, you will be able to
                    monitor them here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* API Tokens */}
        <div>
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
                <button
                  type="button"
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
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create token
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tables */}
        <div>
          {/* Header */}
          <div className="sm:flex sm:items-center">
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
                          Name
                        </th>
                        {/* <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Views
                        </th> */}
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Requests (24h)
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          TTL
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {base.data?.tables
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((table) => (
                          <tr key={table.id}>
                            {/* Name */}
                            <td className="whitespace-nowrap py-6 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="flex items-center gap-2 font-medium text-gray-900">
                                <span>{table.name}</span>
                                {base.data?.active && table.active ? (
                                  <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                                    Disabled
                                  </span>
                                )}
                              </div>
                            </td>
                            {/* Views */}
                            {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex gap-2">
                                {table.views.length > 1 &&
                                  table.views.slice(0, 1).map((view) => (
                                    <span
                                      key={view.id}
                                      className="inline-flex items-center rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                                    >
                                      <Tooltip
                                        title={`${toTitleCase(view.type)} type`}
                                        position="top"
                                        trigger="mouseenter"
                                      >
                                        {viewTypeIcon(view.type)}
                                      </Tooltip>{" "}
                                      {view.name}
                                    </span>
                                  ))}
                                {table.views.length > 1 && (
                                  <span className="inline-flex items-center rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                                    +{table.views.length - 1}
                                    ...
                                  </span>
                                )}
                              </div>
                            </td> */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex items-center gap-3 text-gray-900">
                                {/* 24.7k{" "}
                                <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-700" />
                                  12.5%
                                </span> */}
                                Coming Soon
                              </div>
                            </td>
                            {/* TTL */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <select
                                className="mt-1 block w-full cursor-pointer rounded-md border-white py-2 pl-3 pr-10 text-base hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                                  <option
                                    key={option.name}
                                    value={option.seconds}
                                  >
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            {/* Actions */}
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
