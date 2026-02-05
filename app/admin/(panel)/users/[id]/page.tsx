// "use client";

// import { useEffect, useState } from "react";
// import { getUserById, toggleUserStatus } from "@/services/api";
// import { useParams, useRouter } from "next/navigation";

// export default function UserDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getUserById(id as string)
//       .then(setUser)
//       .finally(() => setLoading(false));
//   }, [id]);

//   const handleToggle = async () => {
//     await toggleUserStatus(user._id);
//     router.refresh();
//   };

//   if (loading) return <p>Loading user...</p>;
//   if (!user) return <p>User not found</p>;

//   return (
//     <div className="max-w-xl bg-white p-6 rounded shadow">
//       <h1 className="text-xl font-bold mb-4">User Details</h1>

//       <div className="space-y-2">
//         <p><b>Name:</b> {user.name}</p>
//         <p><b>Email:</b> {user.email}</p>
//         <p><b>Phone:</b> {user.phone}</p>
//         <p><b>Role:</b> {user.role}</p>
//         <p>
//           <b>Status:</b>{" "}
//           <span
//             className={`font-semibold ${
//               user.isBlocked ? "text-red-600" : "text-green-600"
//             }`}
//           >
//             {user.isBlocked ? "Blocked" : "Active"}
//           </span>
//         </p>
//       </div>

//       <button
//         onClick={handleToggle}
//         className={`mt-6 px-4 py-2 rounded text-white ${
//           user.isBlocked ? "bg-green-600" : "bg-red-600"
//         }`}
//       >
//         {user.isBlocked ? "Unblock User" : "Block User"}
//       </button>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { getUserById, toggleUserStatus } from "@/services/api";
import { useParams, useRouter } from "next/navigation";

/* =========================
   User Type
========================= */
type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  role: "USER" | "ADMIN";
  isBlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/* =========================
   Page Component
========================= */
export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /* =========================
     Fetch User
  ========================= */
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getUserById(id)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [id]);

  /* =========================
     Block / Unblock
  ========================= */
  const handleToggleStatus = async () => {
    if (!user) return;

    setActionLoading(true);
    try {
      await toggleUserStatus(user._id);
      router.refresh();
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================
     States
  ========================= */
  if (loading) {
    return <p className="text-gray-500">Loading user profile...</p>;
  }

  if (!user) {
    return <p className="text-red-600">User not found</p>;
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-2xl bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      {/* PROFILE DETAILS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <ProfileItem label="Name" value={user.name} />
        <ProfileItem label="Email" value={user.email} />
        <ProfileItem label="Phone" value={user.phone || "—"} />
        <ProfileItem label="Gender" value={user.gender || "—"} />
        <ProfileItem label="Role" value={user.role} />
        <ProfileItem
          label="Status"
          value={user.isBlocked ? "Blocked" : "Active"}
          valueClass={
            user.isBlocked ? "text-red-600" : "text-green-600"
          }
        />

        <div className="sm:col-span-2">
          <ProfileItem
            label="Address"
            value={user.address || "Not provided"}
          />
        </div>

        <ProfileItem
          label="Created At"
          value={
            user.createdAt
              ? new Date(user.createdAt).toLocaleString()
              : "—"
          }
        />
        <ProfileItem
          label="Updated At"
          value={
            user.updatedAt
              ? new Date(user.updatedAt).toLocaleString()
              : "—"
          }
        />
      </div>

      {/* ACTION */}
      <button
        onClick={handleToggleStatus}
        disabled={actionLoading}
        className={`mt-6 px-5 py-2 rounded text-white transition ${
          user.isBlocked
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        } disabled:opacity-50`}
      >
        {actionLoading
          ? "Processing..."
          : user.isBlocked
          ? "Unblock User"
          : "Block User"}
      </button>
    </div>
  );
}

/* =========================
   Reusable Field Component
========================= */
function ProfileItem({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className={`font-medium ${valueClass}`}>{value}</p>
    </div>
  );
}
