import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../components/NavBar";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  KeyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { trpc } from "../../utils/trpc";
import { TrashIcon } from "@heroicons/react/20/solid";
import type { PersonalAccessToken } from "@prisma/client";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addToken, setAddToken] = useState(false);
  const [keyValue, setKeyValue] = useState("");
  const personalAccessTokens = trpc.personalAccessToken.getAll.useQuery();
  const deletePersonalAccessToken =
    trpc.personalAccessToken.delete.useMutation();
  const createPersonalAccessToken = trpc.personalAccessToken.add.useMutation();
  const deleteAccount = trpc.user.delete.useMutation();

  const [selectedToken, setSelectedToken] =
    useState<PersonalAccessToken | null>();

  return (
    <div>
      <Head>
        <title>Settings | Airproxy</title>
      </Head>

      <Toaster />

      <NavBar />

      {/* Confirm Delete Modal */}
      <Transition.Root show={confirmDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setConfirmDelete}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:inline-block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setConfirmDelete(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Delete Your Account
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete your account? All of
                          your data will be permanently removed from our servers
                          forever. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={async () => {
                        toast.promise(deleteAccount.mutateAsync(), {
                          loading: "Deleting account...",
                          success: "Account deleted",
                          error: "Failed to delete account",
                        });

                        setConfirmDelete(false);

                        await router.push("/");
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Add token modal */}
      <Transition.Root show={addToken} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setAddToken}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <KeyIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Add a token
                      </Dialog.Title>
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
                      <div className="relative flex flex-grow items-stretch py-4 focus-within:z-10">
                        <input
                          type="password"
                          value={keyValue}
                          onChange={(e) => setKeyValue(e.target.value)}
                          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="pat8jK..."
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          The token requires the{" "}
                          <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            data.records:read
                          </span>{" "}
                          and{" "}
                          <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            schema.bases:read
                          </span>{" "}
                          permissions. We suggest setting permissions to `All
                          current and future bases in all current and future
                          workspaces`.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={async () => {
                        await toast.promise(
                          createPersonalAccessToken.mutateAsync({
                            token: keyValue,
                          }),
                          {
                            loading: "Adding token...",
                            success: "Token added",
                            error: "Error adding token",
                          }
                        );

                        personalAccessTokens.refetch();

                        setKeyValue("");
                        setAddToken(false);
                      }}
                    >
                      Add token
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setAddToken(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Delete token confirmation modal */}
      <Transition.Root
        show={selectedToken !== null && selectedToken !== undefined}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setSelectedToken(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:inline-block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setSelectedToken(null)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Delete this token
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          All of the services which use it also will be removed
                          from our servers forever, and any APIs dependent on it
                          will stop working.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        if (!selectedToken) return;

                        toast.promise(
                          deletePersonalAccessToken.mutateAsync({
                            id: selectedToken.id,
                          }),
                          {
                            loading: "Deleting token...",
                            success: "Token deleted!",
                            error: "Failed to delete token",
                          }
                        );

                        setSelectedToken(null);

                        personalAccessTokens.refetch();
                      }}
                    >
                      Delete Token
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setSelectedToken(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <main className="mx-auto mt-16 grid w-full max-w-3xl px-4 pb-24 sm:gap-y-12 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-3xl font-medium text-gray-900">Settings</h2>
          </div>
        </div>

        {/* Personal Access Tokens */}
        <div className="mt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                Personal Access Tokens
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the Personal Access Tokens attached to your
                account.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={() => setAddToken(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add token
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                      >
                        Token
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Created
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Bases
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Tables
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {personalAccessTokens.data?.map((token) => (
                      <tr key={token.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                          {token.token.slice(0, 12) + "..."}
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                          {token.createdAt.toDateString()}
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                          {/* {token.bases.length} */}-
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                          {/* {token.bases.reduce(
                            (total, base) => total + base.tables.length,
                            0
                          )} */}
                          -
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                          <button
                            className="pr-4 text-indigo-600 hover:text-indigo-900"
                            onClick={() => setSelectedToken(token)}
                          >
                            <TrashIcon className="h-3 w-3" />
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

        {/* Actions */}
        <div className="items-between mt-8 flex w-full flex-col justify-center">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                Account Actions
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Actions that can be performed on your account.
              </p>
            </div>
          </div>
          {/* Delete Your Account */}
          <div className="mt-8 flex w-full items-center justify-between">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Delete Your Account
            </label>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
