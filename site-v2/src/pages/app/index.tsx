import Head from "next/head";
import {
  PlusIcon,
  PauseIcon,
  PlayIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import {
  InformationCircleIcon,
  KeyIcon,
  LockClosedIcon,
  LockOpenIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  SignalIcon,
  SignalSlashIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tippy";
import NavBar from "../../components/NavBar";
import Link from "next/link";
import millify from "millify";
import { trpc } from "../../utils/trpc";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import type { NextPage, GetServerSideProps } from "next";
import "@tremor/react/dist/esm/tremor.css";
import {
  Card,
  Title,
  Text,
  ColGrid,
  Block,
  Metric,
  Callout,
  AreaChart,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Flex,
  ButtonInline,
  TextInput,
  Button,
} from "@tremor/react";

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
  const requests = trpc.request.getAll.useQuery();

  // Every 5 seconds, update the timestamps and refetch the requests
  useEffect(() => {
    const interval = setInterval(() => {
      requests.refetch();
      stats.refetch();
    }, 5 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Airproxy | Airtable in production, fearlessly.</title>
      </Head>

      <Toaster />
      <NavBar />

      {/* Register key */}
      {bases.data?.length === 0 && (
        <main className="mx-auto max-w-3xl px-4 pb-24 sm:mt-8">
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
            <Flex
              spaceX="space-x-3"
              alignItems="items-center"
              justifyContent="justify-center"
              marginTop="mt-6"
            >
              <TextInput
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="pak..."
                maxWidth="max-w-xs"
              />
              <Button
                type="button"
                text="Add key"
                icon={PlusIcon}
                iconPosition="left"
                size="sm"
                color="indigo"
                importance="primary"
                onClick={async () => {
                  console.log(keyValue);
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
              />
            </Flex>
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
        <main className="mx-auto max-w-3xl px-4 pb-24 sm:mt-8">
          <Title>Airproxy</Title>
          <Text>
            See an overview of all your bases, and stats over the last 30 days.
          </Text>

          {/* Stats */}
          <ColGrid numColsMd={3} gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
            <Card decoration="top" decorationColor="indigo">
              <Text>Total Requests</Text>
              <Flex
                justifyContent="justify-start"
                alignItems="items-center"
                spaceX="space-x-1.5"
              >
                <Metric>
                  {stats.data
                    ? millify(stats.data?.totalRequests, { precision: 2 })
                    : "0"}
                </Metric>
                <Text>
                  /{" "}
                  {subscription.data
                    ? millify(subscription.data.requestsPerMonth)
                    : "0"}
                </Text>
              </Flex>
            </Card>
            <Card decoration="top" decorationColor="indigo">
              <Text>Unique Users</Text>
              <Flex
                justifyContent="justify-start"
                alignItems="items-center"
                spaceX="space-x-1.5"
              >
                <Metric>
                  {stats.data
                    ? millify(stats.data.uniqueUsersCount, { precision: 2 })
                    : "0"}
                </Metric>
                <Text>
                  /{" "}
                  {subscription.data
                    ? millify(subscription.data.uniqueUsersPerMonth)
                    : "0"}
                </Text>
              </Flex>
            </Card>
            {/* TODO */}
            {/* <Card decoration="top" decorationColor="indigo">
              <Text>Coming Soon</Text>
              <Metric>Something</Metric>
            </Card> */}
          </ColGrid>

          {/* Requests Charts */}
          <Block marginTop="mt-6">
            <Card>
              <Title>Requests</Title>
              <Text>
                Live requests over the last 30 minutes. Time is in UTC.
              </Text>

              <AreaChart
                data={requests.data as { Date: string; Requests: number }[]}
                categories={["Requests"]}
                dataKey="Date"
                height="h-72"
                colors={["indigo"]}
                marginTop="mt-4"
              />

              {requests.data && requests.data.length === 0 && (
                <Callout
                  title="Where are my cool charts, dude?"
                  text="When you start receiving requests, you will be able to monitor them here."
                  icon={InformationCircleIcon}
                  color="yellow"
                  height=""
                  marginTop="mt-5"
                />
              )}

              {/* TODO */}
              {/* <ComposableMap
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
                </ComposableMap> */}
            </Card>
          </Block>

          {/* Bases */}
          <Card marginTop="mt-6">
            <Flex>
              <Block>
                <Title>Bases</Title>
                <Text>A list of all the bases, and their controls.</Text>
              </Block>
              <Flex
                alignItems="items-end"
                justifyContent="justify-end"
                spaceX="space-x-4"
              >
                {/* Refresh table list */}
                <ButtonInline
                  type="button"
                  text="Refresh List"
                  value=""
                  icon={ArrowPathIcon}
                  iconPosition="left"
                  color="indigo"
                  onClick={async () => {
                    if (!bases.data) return;

                    await toast.promise(refetchBases.mutateAsync(), {
                      loading: "Refetching bases...",
                      success: "Refetched bases",
                      error: "Failed to fetch bases",
                    });

                    bases.refetch();
                  }}
                />
                {/* Toggle every table */}
                <ButtonInline
                  type="button"
                  text={
                    bases.data &&
                    bases.data.filter((base) => base.active).length > 0
                      ? "Disable all"
                      : "Enable all"
                  }
                  value=""
                  icon={
                    bases.data &&
                    bases.data.filter((base) => base.active).length > 0
                      ? PauseCircleIcon
                      : PlayCircleIcon
                  }
                  iconPosition="left"
                  color="indigo"
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
                />
              </Flex>
            </Flex>
            <Table marginTop="mt-5">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Access</TableHeaderCell>
                  <TableHeaderCell>Tables</TableHeaderCell>
                  <TableHeaderCell>
                    <span className="sr-only">Actions</span>
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bases.data.map((base, index) => (
                  <TableRow key={base.id}>
                    <TableCell>
                      <Link
                        href={`/app/bases/${base.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <span className="mr-2">{base.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        text={base.active ? "Active" : "Disabled"}
                        color={base.active ? "emerald" : "gray"}
                        icon={base.active ? SignalIcon : SignalSlashIcon}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        text={base.apiToken ? "Protected" : "Public"}
                        color={base.apiToken ? "emerald" : "yellow"}
                        icon={base.apiToken ? LockClosedIcon : LockOpenIcon}
                      />
                    </TableCell>
                    <TableCell>
                      <Text>{base.tables.length} tables</Text>
                    </TableCell>
                    <TableCell>
                      <Flex>
                        {/* Bust cache */}
                        {/* @ts-ignore */}
                        <Tooltip
                          title="Bust Cache"
                          position="top"
                          trigger="mouseenter"
                        >
                          <ButtonInline
                            type="button"
                            icon={ArrowPathIcon}
                            iconPosition="left"
                            size="xs"
                            color="indigo"
                            text=""
                            onClick={async () => {
                              await toast.promise(
                                bustBaseCache.mutateAsync({
                                  baseId: base.id,
                                }),
                                {
                                  loading: "Busting...",
                                  success: `Busted ${base.name}`,
                                  error: "Whoops! Something went wrong.",
                                }
                              );

                              bases.refetch();
                            }}
                          />
                        </Tooltip>
                        {/* Disable table */}
                        {/* @ts-ignore */}
                        <Tooltip
                          title={base.active ? "Disable" : "Activate"}
                          position="top"
                          trigger="mouseenter"
                        >
                          <ButtonInline
                            type="button"
                            icon={base.active ? PauseIcon : PlayIcon}
                            iconPosition="left"
                            size="xs"
                            color="indigo"
                            text=""
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
                                  error: "Whoops! Something went wrong.",
                                }
                              );

                              bases.refetch();
                            }}
                          />
                        </Tooltip>
                        {/* Copy API key */}
                        {/* @ts-ignore */}
                        <Tooltip
                          title="Copy API Key"
                          position="top"
                          trigger="mouseenter"
                          disabled={!base.apiToken}
                        >
                          <ButtonInline
                            type="button"
                            disabled={!base.apiToken}
                            icon={KeyIcon}
                            iconPosition="left"
                            size="xs"
                            color="indigo"
                            text=""
                            onClick={() => {
                              if (!base.apiToken) return;

                              navigator.clipboard.writeText(
                                base.apiToken ?? ""
                              );

                              toast.success("Copied API Key!");
                            }}
                          />
                        </Tooltip>
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </main>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Page;
