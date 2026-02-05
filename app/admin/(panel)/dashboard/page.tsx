"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "@/services/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [range, setRange] = useState("today");
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    const data = await getAdminDashboardStats(range);
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [range]);

  if (loading || !stats) {
    return <p className="p-10 text-center">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* ORDERS */}
      <Section title="Orders Overview">
        <Stat title="Total Orders" value={stats.orders.total} />
        <Stat title="Delivered Orders" value={stats.orders.delivered} />
        <Stat title="Cancelled Orders" value={stats.orders.cancelled} />
        <Stat title="Pending Orders" value={stats.orders.pending} />
      </Section>

      {/* PAYMENTS */}
      <Section title="Payments & Revenue">
        <Stat title="Paid Orders" value={stats.payments.paid} />
        <Stat title="COD Orders" value={stats.payments.cod} />
        <Stat title="Total Revenue" value={`₹${stats.revenue.total}`} />
      </Section>

      {/* PRODUCTS */}
      <Section title="Products & Inventory">
        <Stat title="Total Products" value={stats.products.total} />
        <Stat title="Active Products" value={stats.products.active} />
        <Stat title="Inactive Products" value={stats.products.inactive} />
        <Stat title="Out of Stock" value={stats.products.outOfStock} />
      </Section>

      {/* USERS */}
      <Section title="Users">
        <Stat title="Total Users" value={stats.users.total} />
      </Section>
    </div>
  );
}

/* =========================
   REUSABLE COMPONENTS
========================= */

function Section({ title, children }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white rounded shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
