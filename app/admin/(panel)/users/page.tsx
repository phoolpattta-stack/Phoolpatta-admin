
"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/api";
import Link from "next/link";

/* =========================
   Types
========================= */
type User = {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
  createdAt: string;
};

/* =========================
   Config
========================= */
const PAGE_SIZE = 10;

/* =========================
   Page
========================= */
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        // 🔥 SORT BY DATE (LATEST FIRST)
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        setUsers(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const currentUsers = users.slice(start, start + PAGE_SIZE);

  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* =========================
          DESKTOP TABLE
      ========================= */}
      <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
             
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
               
                <td className="p-3 text-center">
                  <StatusBadge blocked={user.isBlocked} />
                </td>
                <td className="p-3 text-center">
                  <Link
                    href={`/admin/users/${user._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
          MOBILE CARDS
      ========================= */}
      <div className="md:hidden space-y-3">
        {currentUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded shadow p-4 space-y-2"
          >
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm break-all">{user.email}</p>
            </div>

            <div className="flex justify-between items-center">
              <StatusBadge blocked={user.isBlocked} />
              <Link
                href={`/admin/users/${user._id}`}
                className="text-blue-600 text-sm"
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          PAGINATION
      ========================= */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>

        <p className="text-sm">
          Page <b>{page}</b> of <b>{totalPages}</b>
        </p>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* =========================
   Status Badge
========================= */
function StatusBadge({ blocked }: { blocked: boolean }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        blocked
          ? "bg-red-100 text-red-600"
          : "bg-green-100 text-green-600"
      }`}
    >
      {blocked ? "Blocked" : "Active"}
    </span>
  );
}
