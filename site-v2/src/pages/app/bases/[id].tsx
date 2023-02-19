import { useRouter } from "next/router";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../../components/NavBar";
import {
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
  ShareIcon,
} from "@heroicons/react/20/solid";
import { Tooltip } from "react-tippy";
import millify from "millify";
import {
  PauseCircleIcon,
  PlayCircleIcon,
  SignalIcon,
  SignalSlashIcon,
} from "@heroicons/react/24/outline";
import { trpc } from "../../../utils/trpc";
import { ttlOptions } from "../../../utils/globals";
import {
  Title,
  Text,
  ColGrid,
  Card,
  Flex,
  Metric,
  Block,
  ButtonInline,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Button,
} from "@tremor/react";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next/types";
import Link from "next/link";

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

      <main className="mx-auto max-w-3xl px-4 pb-24 sm:mt-8">
        <Title>{base.data?.name}</Title>
        <Text>Interact with tables, and stats over the last 30 days.</Text>

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
            </Flex>
          </Card>
          {/* TODO */}
          <Card
            decoration="top"
            decorationColor={base.data?.apiToken ? "emerald" : "red"}
          >
            <Text>Protection</Text>
            <Metric>{base.data?.apiToken ? "Protected" : "Public"}</Metric>
          </Card>
        </ColGrid>

        {/* TODO: API Token */}
        <Card marginTop="mt-6">
          <Flex>
            <Block>
              <Title>API Token</Title>
              <Text>
                {subscription.data?.level !== "Team" &&
                subscription.data?.level !== "Business"
                  ? "You need a Team or Business subscription in order to create API tokens."
                  : base.data?.apiToken
                  ? "The APIs under this base are protected with an API key."
                  : "The APIs under this base are unprotected and can be accessed by anyone."}
              </Text>
              {subscription.data?.level !== "Team" &&
                subscription.data?.level !== "Business" && (
                  <Link href="/#pricing">
                    <Text color="indigo">
                      Upgrade to get access to API keys.
                    </Text>
                  </Link>
                )}
            </Block>
            <Button
              type="button"
              text={base.data?.apiToken ? "Remove Token" : "Create Token"}
              disabled={
                subscription.data?.level !== "Team" &&
                subscription.data?.level !== "Business"
              }
              iconPosition="left"
              size="sm"
              color="indigo"
              importance="secondary"
              onClick={async () => {
                if (!base.data?.id) return;

                if (base.data?.apiToken) {
                  // Remove token
                  await toast.promise(
                    removeToken.mutateAsync({
                      baseId: base.data.id,
                    }),
                    {
                      loading: "Removing API token...",
                      success: "Removed API token.",
                      error: "Failed to remove API.",
                    }
                  );
                } else {
                  // Create token
                  await toast.promise(
                    createToken.mutateAsync({ baseId: base.data.id }),
                    {
                      loading: "Creating token...",
                      success: "Token created!",
                      error: "Failed to create token",
                    }
                  );
                }

                base.refetch();
              }}
            />
          </Flex>
        </Card>

        {/* Tables */}
        <Card marginTop="mt-6">
          <Flex>
            <Block>
              <Title>Tables</Title>
              <Text>A list of all the tables, and their controls.</Text>
            </Block>
            <Flex
              alignItems="items-end"
              justifyContent="justify-end"
              spaceX="space-x-4"
            >
              {/* Toggle every table */}
              <ButtonInline
                type="button"
                text={
                  base.data &&
                  base.data.tables.filter((table) => table.active).length > 0
                    ? "Disable all"
                    : "Enable all"
                }
                value=""
                icon={
                  base.data &&
                  base.data.tables.filter((table) => table.active).length > 0
                    ? PauseCircleIcon
                    : PlayCircleIcon
                }
                iconPosition="left"
                color="indigo"
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
              />
            </Flex>
          </Flex>
          <Table marginTop="mt-5">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Requests</TableHeaderCell>
                <TableHeaderCell>TTL</TableHeaderCell>
                <TableHeaderCell>
                  <span className="sr-only">Actions</span>
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* @ts-ignore */}
              {base.data &&
                base.data.tables
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((table) => (
                    <TableRow key={table.id}>
                      <TableCell>
                        <Text>{table.name}</Text>
                      </TableCell>
                      <TableCell>
                        <Text>
                          <Badge
                            text={table.active ? "Active" : "Disabled"}
                            color={table.active ? "emerald" : "gray"}
                            icon={table.active ? SignalIcon : SignalSlashIcon}
                          />
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text>Coming Soon</Text>
                      </TableCell>
                      <TableCell>
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
                            />
                          </Tooltip>
                          {/* Disable table */}
                          {/* @ts-ignore */}
                          <Tooltip
                            title={table.active ? "Disable" : "Activate"}
                            position="top"
                            trigger="mouseenter"
                          >
                            <ButtonInline
                              type="button"
                              icon={table.active ? PauseIcon : PlayIcon}
                              iconPosition="left"
                              size="xs"
                              color="indigo"
                              text=""
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
                            />
                          </Tooltip>
                          {/* Copy API key */}
                          {/* @ts-ignore */}
                          <Tooltip
                            title="Copy API URL"
                            position="top"
                            trigger="mouseenter"
                          >
                            <ButtonInline
                              type="button"
                              icon={ShareIcon}
                              iconPosition="left"
                              size="xs"
                              color="indigo"
                              text=""
                              onClick={() => {
                                // Copy the API URL
                                navigator.clipboard.writeText(
                                  `https://api.airproxy.app/${base.data?.id}/${table.id}`
                                );

                                toast.success("Copied the API URL");
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
    </div>
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
        destination: "/api/auth/signin",
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
