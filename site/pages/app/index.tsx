import Head from "next/head";
import useSWR from "swr";
import { PlusIcon, PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import {
  CheckCircleIcon,
  KeyIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Prisma } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";
import {
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { Tooltip } from "react-tippy";
import NavBar from "../../components/NavBar";
import Link from "next/link";
import StatCard from "../../components/StatCard";
import millify from "millify";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

type Base = Prisma.BaseGetPayload<{
  include: {
    tables: {
      include: {
        views: true;
      };
    };
  };
}>;

interface StatsResponse {
  totalRequests: number;
  customerCount: number;
  totalRequestsSize?: number;
}

interface LatLng {
  id: number;
  latitude: number;
  longitude: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const geoUrl = "/features.json";

const dummyData = [
  { time: "9:00am", requests: 5 },
  { time: "9:30am", requests: 5 },
  { time: "10:00am", requests: 5 },
  { time: "10:30am", requests: 5 },
  { time: "11:00am", requests: 5 },
  { time: "11:30am", requests: 5 },
  { time: "12:00pm", requests: 5 },
  { time: "12:30pm", requests: 5 },
  { time: "1:00pm", requests: 5 },
  { time: "1:30pm", requests: 5 },
  { time: "2:00pm", requests: 5 },
  { time: "2:30pm", requests: 5 },
  { time: "3:00pm", requests: 5 },
  { time: "3:30pm", requests: 5 },
  { time: "4:00pm", requests: 5 },
  { time: "4:30pm", requests: 5 },
  { time: "5:00pm", requests: 5 },
];

export default function Page() {
  const { data: bases, mutate } = useSWR<Base[]>("/api/bases", fetcher, {
    refreshInterval: 1000 * 60,
  });

  const { data: requests } = useSWR<Object[]>("/api/requests", fetcher, {
    refreshInterval: 1000 * 5,
  });

  const { data: recentRequests } = useSWR<LatLng[]>(
    "/api/recent-requests",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const { data: stats } = useSWR<StatsResponse>("/api/stats", fetcher, {
    refreshInterval: 1000 * 10,
  });

  const [keyValue, setKeyValue] = useState("");

  const addKey = () => {
    if (keyValue.length === 0) {
      toast.error("You need to add a key!");
      return;
    }

    toast.promise(
      fetch("/api/keys", {
        method: "POST",
        body: JSON.stringify({ key: keyValue }),
      }),
      {
        loading: "Saving key...",
        error: "This key didn't work.",
        success: "Key saved! 🥳",
      }
    );

    setKeyValue("");
  };

  const toggleBaseStatus = async (base: Base) => {
    await toast.promise(
      fetch(`/api/bases/${base.id}`, {
        method: "POST",
        body: JSON.stringify({
          active: !base.active,
          action: "UPDATE_ACTIVE_STATUS",
        }),
      }),
      {
        error: "Whoops! Something went wrong.",
        loading: `Updating ${base.name} status.`,
        success: `${base.name} is now ${base.active ? "inactive." : "active!"}`,
      }
    );

    await mutate();
  };

  return (
    <div>
      <Head>
        <title>Airproxy | Airtable in production, fearlessly.</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☁️</text></svg>"
        ></link>
      </Head>
      <Toaster />
      <NavBar />

      {/* Register */}
      {bases?.length === 0 && (
        <main className="max-w-3xl mx-auto mt-16">
          {/* Register a Token */}
          <div className="text-center">
            <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-3 text-sm font-medium text-gray-900">
              Add a key
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your Airtable Personal key,{" "}
              <a
                href="https://airtable.com/create/tokens"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-700"
              >
                available here.
              </a>
            </p>
            <div className="mt-6 flex rounded-md shadow-sm max-w-md mx-auto">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <input
                  type="password"
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                  className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="pat8jK..."
                />
              </div>
              <button
                type="button"
                onClick={() => addKey()}
                className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <PlusIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Add key</span>
              </button>
            </div>
          </div>
          <div className="max-w-lg mx-auto mt-8 text-center ">
            <p className="text-sm text-gray-500">
              The token requires the{" "}
              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                data.records:read
              </span>{" "}
              and{" "}
              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                schema.bases:read
              </span>{" "}
              permissions. We suggest setting permissions to `All current and
              future bases in all current and future workspaces`.
            </p>
          </div>
        </main>
      )}

      {bases && bases.length > 0 && (
        <main className="max-w-3xl mx-auto mt-16 grid gap-y-12 pb-24">
          {/* Bases */}
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Bases
            </h3>
            <ul
              role="list"
              className="grid grid-cols-1 mt-5 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {bases
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((base) => (
                  <li
                    key={base.id}
                    className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
                  >
                    <div className="flex flex-col w-full justify-between gap-y-6 p-6">
                      <div className="flex items-center justify-between">
                        <Link href={`/app/bases/${base.id}`}>
                          <h3 className="text-lg font-semibold text-indigo-600">
                            {base.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2">
                          {/* Protected status */}
                          {base.apiToken && (
                            // @ts-ignore
                            <Tooltip
                              title="Protected by token"
                              position="top"
                              trigger="mouseenter"
                            >
                              <KeyIcon className="h-5 w-5 text-green-700" />
                            </Tooltip>
                          )}
                          {/* Active status */}
                          {/* @ts-ignore */}
                          <Tooltip
                            title={
                              base.active
                                ? "Accessible via API"
                                : "Inaccessible via API"
                            }
                            position="top"
                            trigger="mouseenter"
                          >
                            {base.active ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-700" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-700" />
                            )}
                          </Tooltip>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        <li>
                          <b>{base.tables.length}</b> tables
                        </li>
                        <li>
                          Updated {/* @ts-ignore */}
                          <Tooltip
                            title="Updated by TTL"
                            position="top"
                            trigger="mouseenter"
                          >
                            <b>14 mins</b>
                          </Tooltip>{" "}
                          ago
                        </li>
                      </ul>
                      <div className="flex justify-end gap-x-3 mt-5">
                        <button onClick={() => toggleBaseStatus(base)}>
                          {/* @ts-ignore */}
                          <Tooltip
                            title={
                              base.active
                                ? "Block access to table"
                                : "Allow access to table"
                            }
                            position="top"
                            trigger="mouseenter"
                          >
                            {base.active ? (
                              <PauseIcon className="h-5 w-5 text-gray-700 hover:text-gray-900" />
                            ) : (
                              <PlayIcon className="h-5 w-5 text-gray-700 hover:text-gray-900" />
                            )}
                          </Tooltip>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
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
              <StatCard
                name="Egress"
                stat={
                  stats && stats.totalRequestsSize
                    ? millify(stats.totalRequestsSize, {
                        precision: 2,
                        units: ["B", "KB", "MB", "GB", "TB"],
                        space: true,
                      })
                    : "0"
                }
              />
            </dl>

            {/* Chart */}
            <div className="w-full overflow-hidden rounded-lg bg-white shadow mt-5">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-normal text-gray-900">
                  Requests (Live)
                </h3>
              </div>

              {/* Map */}
              <ComposableMap
                projection="geoMercator"
                width={1000}
                height={600}
                projectionConfig={{
                  rotate: [-10, 0, 0],
                  scale: 147,
                }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#FFF"
                        stroke="#4f46e5"
                        strokeWidth={1.25}
                      />
                    ))
                  }
                </Geographies>
                {recentRequests &&
                  recentRequests.map(({ id, latitude, longitude }) => (
                    <Marker key={id} coordinates={[longitude, latitude]}>
                      <circle
                        r="12"
                        className="animate-ping-once fill-indigo-600"
                      />
                    </Marker>
                  ))}
              </ComposableMap>

              {/* Bar Chart */}
              <div className="relative h-48 -mt-16">
                <ResponsiveContainer>
                  <BarChart
                    data={
                      requests && requests.length > 0 ? requests : dummyData
                    }
                    margin={{
                      top: 0,
                      right: 0,
                      bottom: 0,
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
                        requests && requests.length > 0
                          ? [0, "dataMax"]
                          : [0, 100]
                      }
                      hide
                    />
                    <XAxis dataKey="time" hide />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Notification */}
              {requests && requests.length === 0 && (
                <div className="rounded-md bg-blue-50 p-4">
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
          </div>
        </main>
      )}
    </div>
  );
}
