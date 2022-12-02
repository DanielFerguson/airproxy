import { useRouter } from "next/router";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../../components/NavBar";
import useSWR from "swr";
import { Prisma } from "@prisma/client";
import StatCard from "../../../components/StatCard";
import {
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ClockIcon,
  InboxIcon,
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
} from "recharts";
import millify from "millify";
import { ClipboardDocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Base = Prisma.BaseGetPayload<{
  select: {
    id: true;
    name: true;
    active: true;
    apiToken: true;
    tables: {
      select: {
        views: true;
      };
    };
  };
}>;

interface Request {
  requests: number;
  time: string;
}

interface StatsResponse {
  totalRequests: number;
  customerCount: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const copyToClipboard = (value: string) => {
  navigator.clipboard.writeText(value);
};

const viewTypeIcon = (type: string): JSX.Element => {
  switch (type) {
    case "grid":
      return <Squares2X2Icon className="h-3 w-3 mr-1.5" />;

    case "form":
      return <InboxIcon className="h-3 w-3 mr-1.5" />;

    case "calendar":
      return <CalendarDaysIcon className="h-3 w-3 mr-1.5" />;

    case "gallery":
      return <PhotoIcon className="h-3 w-3 mr-1.5" />;

    case "kanban":
      return <ViewColumnsIcon className="h-3 w-3 mr-1.5" />;

    case "timeline":
      return <ClockIcon className="h-3 w-3 mr-1.5" />;

    case "block":
      return <Square2StackIcon className="h-3 w-3 mr-1.5" />;

    default:
      return <QuestionMarkCircleIcon className="h-3 w-3 mr-1.5" />;
  }
};

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const ttlOptions = [
  { name: "10m", seconds: 600 },
  { name: "15m", seconds: 900 },
  { name: "30m", seconds: 1800 },
  { name: "1h", seconds: 3600 },
  { name: "4h", seconds: 14400 },
  { name: "12h", seconds: 43200 },
  { name: "1d", seconds: 86400 },
  { name: "1w", seconds: 604800 },
];

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: base, mutate } = useSWR<Base>(`/api/bases/${id}`, fetcher, {
    refreshInterval: 1000 * 60,
  });

  const { data: requests } = useSWR<Request[]>(
    `/api/bases/${id}/requests`,
    fetcher,
    {
      refreshInterval: 1000 * 5,
      isPaused: () => !id,
    }
  );

  const { data: stats } = useSWR<StatsResponse>(
    `/api/bases/${id}/stats`,
    fetcher,
    {
      refreshInterval: 1000 * 5,
      isPaused: () => !id,
    }
  );

  const updateAllTables = async (disable: boolean) => {
    if (!base) return;

    await toast.promise(
      fetch(`/api/bases/${base.id}`, {
        method: "POST",
        body: JSON.stringify({
          action: disable ? "DISABLE_ALL_TABLES" : "ENABLE_ALL_TABLES",
        }),
      }),
      {
        error: "Whoops! An error occured.",
        loading: disable ? "Disabling all tables..." : "Enabling all tables...",
        success: disable
          ? "All tables are now disabled"
          : "All tables are now enabled",
      }
    );

    await mutate();
  };

  const toggleTableStatus = async (
    tableId: string,
    tableName: string,
    enabled: boolean
  ) => {
    if (!base) return;

    await toast.promise(
      fetch(`/api/tables/${tableId}`, {
        method: "POST",
        body: JSON.stringify({
          action: "TOGGLE_STATUS",
          enabled,
        }),
      }),
      {
        error: "Whoops! An error occured.",
        loading: enabled ? "Enabling all tables..." : "Disabling all tables...",
        success: enabled ? `Enabled ${tableName}` : `Disabled ${tableName}`,
      }
    );

    await mutate();
  };

  const toggleBaseStatus = async () => {
    if (!base) return;

    await toast.promise(
      fetch(`/api/bases/${id}`, {
        method: "POST",
        body: JSON.stringify({
          active: !base.active,
          action: "UPDATE_ACTIVE_STATUS",
        }),
      }),
      {
        error: "Whoops! Something went wrong.",
        loading: `Updating ${base.name} status.`,
        success: `${base.name} is now ${base.active ? "disabled." : "active!"}`,
      }
    );

    await mutate();
  };

  const updateTableTtl = async (
    ttl: string,
    tableId: string,
    tableName: string
  ) => {
    await toast.promise(
      fetch(`/api/tables/${tableId}`, {
        method: "POST",
        body: JSON.stringify({ action: "UPDATE_TABLE_TTL", ttl: ttl }),
      }),
      {
        loading: `Updating ${tableName} TTL...`,
        error: "Whoops! Something went wrong.",
        success: `Updated TTL for ${tableName}!`,
      }
    );

    await mutate();
  };

  const copyToken = async (apiToken: string) => {
    copyToClipboard(apiToken);
    toast.success("Copied token");
  };

  const removeTokenFromBase = async () => {
    await toast.promise(
      fetch(`/api/bases/${base?.id}`, {
        method: "POST",
        body: JSON.stringify({ action: "REMOVE_TOKEN_FROM_BASE" }),
      }),
      {
        error: "Whoops! Something went wrong.",
        loading: "Removing token from base...",
        success: "Removed token",
      }
    );

    await mutate();
  };

  const createAndAttachToken = async () => {
    if (!base) return;

    await toast.promise(
      fetch(`/api/bases/${base.id}`, {
        method: "POST",
        body: JSON.stringify({ action: "CREATE_AND_ADD_TOKEN_TO_BASE" }),
      }),
      {
        error: "Whoops! Something went wrong.",
        loading: "Protecting the APIs...",
        success: "Protected!",
      }
    );

    await mutate();
  };

  const copyApiUrl = (url: string) => {
    copyToClipboard(url);
    toast.success("Copied API URL.");
  };

  if (!base) return <></>;

  return (
    <div>
      <Head>
        <title>Airproxy | Airtable in production, fearlessly.</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☁️</text></svg>"
        />
      </Head>

      <Toaster />
      <NavBar />

      <main className="max-w-3xl mx-auto mt-16 grid gap-y-12 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-3xl font-medium text-gray-900">{base?.name}</h2>
            {base && base.active ? (
              <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                <span className="-ml-0.5 mr-1.5 relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Active
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                <span className="-ml-0.5 mr-1.5 relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                </span>
                Disabled
              </span>
            )}
          </div>

          <div>
            {/* Toggle Base Active Status */}
            {/* @ts-ignore */}
            <Tooltip
              title={base?.active ? "Disable base" : "Enable base"}
              position="top"
              trigger="mouseenter"
            >
              <button type="button" onClick={() => toggleBaseStatus()}>
                {base?.active ? (
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
                stats ? millify(stats.totalRequests, { precision: 2 }) : "0"
              }
              limit={millify(100000, { precision: 2 })}
            />
            <StatCard
              name="Customers"
              stat={
                stats ? millify(stats.customerCount, { precision: 2 }) : "0"
              }
            />
            <StatCard name="Egress" stat={"Coming soon"} />
          </dl>

          {/* Chart */}
          <div className="w-full h-64 overflow-hidden rounded-lg bg-white shadow mt-5">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-normal text-gray-900">
                Requests (Live)
              </h3>
            </div>

            <ResponsiveContainer>
              <BarChart
                data={requests}
                margin={{
                  top: 0,
                  right: 0,
                  bottom: 40,
                  left: 0,
                }}
              >
                <Bar dataKey="requests" fill="#8884d8" />
                <ChartTooltip
                  formatter={(value, name, props) => [value, "Requests"]}
                />
                <XAxis domain={[0, "dataMax"]} dataKey="time" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Tokens */}
        <div>
          {/* Header */}
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                {base?.apiToken ? "Protected" : "Unprotected"}
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                {base?.apiToken
                  ? "The APIs under this base are protected with an API key."
                  : "The APIs under this base are unprotected and can be accessed by anyone."}
              </p>
            </div>

            {/* Protected Actions */}
            {base?.apiToken ? (
              <div className="flex gap-3">
                {/* @ts-ignore */}
                <Tooltip title="Remove Key" position="top" trigger="mouseenter">
                  <button
                    type="button"
                    onClick={() => removeTokenFromBase()}
                    className="inline-flex items-center rounded-md border border-white bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </Tooltip>
                <button
                  type="button"
                  onClick={() => copyToken(base.apiToken ?? "")}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => createAndAttachToken()}
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
              <h1 className="text-xl font-semibold text-gray-900">
                API Routes
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the users in your account including their name,
                title, email and role.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              {base &&
              base.tables.filter((table) => table.active).length > 0 ? (
                <button
                  type="button"
                  onClick={() => updateAllTables(true)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Disable all
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => updateAllTables(false)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Enable all
                </button>
              )}
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
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          View
                        </th>
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
                          Status
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
                      {base?.tables
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((table) => (
                          <tr key={table.id}>
                            {/* Name */}
                            <td className="whitespace-nowrap py-6 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="font-medium text-gray-900">
                                {table.name}
                              </div>
                            </td>
                            {/* Views */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex">
                                <span
                                  key={table.views[0].id}
                                  className="inline-flex items-center rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                                >
                                  {/* @ts-ignore */}
                                  <Tooltip
                                    title={`${toTitleCase(
                                      table.views[0].type
                                    )} type`}
                                    position="top"
                                    trigger="mouseenter"
                                  >
                                    {viewTypeIcon(table.views[0].type)}
                                  </Tooltip>{" "}
                                  {table.views[0].name}
                                </span>
                              </div>
                            </td>
                            {/* Requests */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="text-gray-900 flex items-center gap-3">
                                24.7k{" "}
                                {/* <span className="inline-flex gap-1 items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-700" />
                                  12.5%
                                </span> */}
                              </div>
                            </td>
                            {/* Status */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {base.active && table.active ? (
                                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                                  Disabled
                                </span>
                              )}
                            </td>
                            {/* TTL */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <select
                                className="mt-1 block w-full rounded-md border-white cursor-pointer hover:border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                defaultValue={table.ttl}
                                onChange={(e) =>
                                  updateTableTtl(
                                    e.target.value,
                                    table.id,
                                    table.name
                                  )
                                }
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
                              <div className="flex justify-end items-center gap-x-3">
                                {/* Bust Cache */}
                                <button
                                  onClick={() => console.log("TODO")}
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
                                  onClick={() =>
                                    toggleTableStatus(
                                      table.id,
                                      table.name,
                                      !table.active
                                    )
                                  }
                                  disabled={!base.active}
                                  className={`${
                                    base.active
                                      ? "text-indigo-600 hover:text-indigo-900"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {/* @ts-ignore */}
                                  <Tooltip
                                    title={
                                      !base.active
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
                                  onClick={() =>
                                    copyApiUrl(
                                      `https://api.airproxy.app/${base.id}/${table.id}`
                                    )
                                  }
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
