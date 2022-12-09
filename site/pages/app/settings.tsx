import Head from "next/head";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../components/NavBar";

const Page = () => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    await fetch(`/api/user`, {
      method: "DELETE",
    });

    toast.success("Your account has been deleted.");

    setConfirmDelete(false);

    window.location.href = "/";
  };

  return (
    <div>
      <Head>
        <title>API | Airproxy</title>
      </Head>

      <Toaster />
      <NavBar />

      <main className="max-w-3xl mx-auto mt-16 grid gap-y-12 pb-24 w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-3xl font-medium text-gray-900">API</h2>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between w-full">
          {/* Delete Your Account */}
          <div className="flex items-center justify-between w-full">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Delete Your Account
            </label>
            <button
              type="button"
              onClick={() => deleteAccount()}
              className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {confirmDelete ? "Are you sure?" : "Delete Account"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
