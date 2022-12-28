import Head from "next/head";
import {
  PlusIcon,
  PauseIcon,
  PlayIcon,
  ArrowPathIcon,
  KeyIcon as SolidKeyIcon,
} from "@heroicons/react/20/solid";
import { KeyIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { Tooltip } from "react-tippy";
import NavBar from "../../components/NavBar";
import Link from "next/link";
import StatCard from "../../components/StatCard";
import millify from "millify";
import { secondsToStr } from "../../utils/helpers";
import { trpc } from "../../utils/trpc";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import type { GetServerSideProps } from "next";
import type { NextPage } from "next";

const Page: NextPage = () => {
  const [keyValue, setKeyValue] = useState("");
  const bases = trpc.base.getAll.useQuery();
  const addPersonalAccessToken = trpc.personalAccessToken.add.useMutation();
  const toggleBase = trpc.base.toggleStatus.useMutation();
  const stats = trpc.stat.overall.useQuery();
  const bustBaseCache = trpc.base.bustCache.useMutation();
  const setAllBaseStatus = trpc.base.setAllStatus.useMutation();
  const refetchBases = trpc.base.refetch.useMutation();
  const subscription = trpc.user.subscription.useQuery();

  return (
    <div>
      <Head>
        <title>Airproxy | Airtable in production, fearlessly.</title>
      </Head>

      <Toaster />

      <NavBar />

      {/* Register key */}
      {bases.data?.length === 0 && (
        <main className="mx-auto mt-16 max-w-3xl">
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
            <div className="mx-auto mt-6 flex max-w-md rounded-md shadow-sm">
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
                onClick={async () => {
                  await toast.promise(
                    addPersonalAccessToken.mutateAsync({ token: keyValue }),
                    {
                      loading: "Adding key...",
                      success: "Key added",
                      error: "Error adding key",
                    }
                  );

                  setKeyValue("");
                  bases.refetch();
                }}
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
          <div className="mx-auto mt-8 max-w-lg text-center">
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

      {bases.data && bases.data.length > 0 && (
        <main className="mx-auto mt-16 grid max-w-3xl gap-y-12 pb-24">
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
                    ? millify(stats.data?.totalRequests, { precision: 2 })
                    : "0"
                }
                limit={millify(
                  subscription.data ? subscription.data.requestsPerMonth : 0,
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
              {/* <StatCard name="Something" stat="Add" /> */}
            </dl>

            {/* Chart */}
            {/* <div className="mt-5 w-full overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-normal text-gray-900">
                  Requests (Live)
                </h3>
              </div>

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

              {requests.data && requests.data.length > 0 && (
                <div className="relative -mt-16 h-48">
                  <ResponsiveContainer>
                    <BarChart
                      data={requests.data}
                      margin={{
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                      }}
                    >
                      <Bar dataKey="requests" fill="#8884d8" />
                      <ChartTooltip
                        formatter={(value, name, props) => [value, "Requests"]}
                      />
                      <YAxis type="number" domain={[0, "dataMax"]} hide />
                      <XAxis dataKey="time" hide />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {requests.data && requests.data.length === 0 && (
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
            </div> */}
          </div>

          {/* Bases */}
          <div>
            {/* Header */}
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">Bases</h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the bases under your Personal Access Tokens, and
                  their controls.
                </p>
              </div>
              <div className="mt-4 flex sm:mt-0 sm:ml-16 sm:flex-none">
                {/* @ts-ignore */}
                <Tooltip
                  title="Reimport Bases"
                  placement="top"
                  trigger="mouseenter"
                >
                  <button
                    type="button"
                    onClick={async () => {
                      if (!bases.data) return;

                      await toast.promise(refetchBases.mutateAsync(), {
                        loading: "Refetching bases...",
                        success: "Refetched bases",
                        error: "Failed to fetch bases",
                      });

                      bases.refetch();
                    }}
                    className="mr-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                </Tooltip>
                <button
                  type="button"
                  onClick={async () => {
                    if (!bases.data) return;

                    await toast.promise(
                      setAllBaseStatus.mutateAsync({
                        status: !(
                          bases.data.filter((base) => base.active).length > 0
                        ),
                      }),
                      {
                        loading: "Updating all bases...",
                        success: !(
                          bases.data.filter((base) => base.active).length > 0
                        )
                          ? "Enabled all bases"
                          : "Disabled all bases",
                        error: "Failed to set all bases",
                      }
                    );

                    bases.refetch();
                  }}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {bases.data &&
                  bases.data.filter((base) => base.active).length > 0
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
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Access
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Tables
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
                      <tbody className="bg-white">
                        {bases.data.map((base, index) => (
                          <tr
                            key={base.id}
                            className={
                              index % 2 === 0 ? undefined : "bg-gray-50"
                            }
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              <Link
                                href={`/app/bases/${base.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <span className="mr-2">{base.name}</span>
                              </Link>
                              {base.active ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                  Disabled
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {base.apiToken ? "Protected" : "Public"}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {base.tables.length} tables
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {secondsToStr(base.ttl)}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <span className="flex items-center justify-center gap-2">
                                {/* @ts-ignore */}
                                <Tooltip
                                  title="Bust Cache"
                                  position="top"
                                  trigger="mouseenter"
                                >
                                  <button
                                    onClick={async () => {
                                      await toast.promise(
                                        bustBaseCache.mutateAsync({
                                          baseId: base.id,
                                        }),
                                        {
                                          loading: "Busting...",
                                          success: `Busted ${base.name}`,
                                          error:
                                            "Whoops! Something went wrong.",
                                        }
                                      );

                                      bases.refetch();
                                    }}
                                  >
                                    <ArrowPathIcon className="h-3 w-3" />
                                  </button>
                                </Tooltip>
                                {/* @ts-ignore */}
                                <Tooltip
                                  title={base.active ? "Disable" : "Activate"}
                                  position="top"
                                  trigger="mouseenter"
                                >
                                  <button
                                    onClick={async () => {
                                      await toast.promise(
                                        toggleBase.mutateAsync({
                                          baseId: base.id,
                                        }),
                                        {
                                          loading: "Toggling...",
                                          success: base.active
                                            ? `Disabled ${base.name}`
                                            : `Activated ${base.name}`,
                                          error:
                                            "Whoops! Something went wrong.",
                                        }
                                      );

                                      bases.refetch();
                                    }}
                                  >
                                    {base.active ? (
                                      <PauseIcon className="h-3 w-3" />
                                    ) : (
                                      <PlayIcon className="h-3 w-3" />
                                    )}
                                  </button>
                                </Tooltip>
                                {/* @ts-ignore */}
                                <Tooltip
                                  title="Copy API Key"
                                  position="top"
                                  trigger="mouseenter"
                                  disabled={!base.apiToken}
                                >
                                  <button
                                    disabled={!base.apiToken}
                                    onClick={() => {
                                      if (!base.apiToken) return;

                                      navigator.clipboard.writeText(
                                        base.apiToken ?? ""
                                      );

                                      toast.success("Copied API Key!");
                                    }}
                                  >
                                    <SolidKeyIcon
                                      className={`h-3 w-3 ${
                                        base.apiToken ? "" : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                </Tooltip>
                              </span>
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
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // If the user is not authenticated, redirect to the login page
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Page;
