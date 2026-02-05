"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminOrders } from "@/services/api";
import StatusBadge from "@/components/StatusBadge";

export interface Order {
  _id: string;
  finalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  createdAt: string;

  userId?: {
    _id: string;
    name: string;
    email?: string;
  };

  deliveryAddress?: {
    fullName: string;
    phone: string;
  };
}


export default function OrdersPage() {
const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date | amount
  const [order, setOrder] = useState("desc");   // asc | desc
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (pageNo = 1) => {
    try {
      setLoading(true);

      const res = await getAdminOrders({
        status,
        paymentMethod,
        sortBy,
        order,
        search,
        page: pageNo,
        limit: 10
      });

      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [status, paymentMethod, sortBy, order]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* FILTER + SORT BAR */}
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <select className="border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="PLACED">Placed</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PACKED">Packed</option>
          <option value="OUT_FOR_DELIVERY">Out for delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select className="border p-2 rounded" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="">All Payments</option>
          <option value="COD">COD</option>
          <option value="ONLINE">Online</option>
        </select>

        <select className="border p-2 rounded" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>

        <select className="border p-2 rounded" value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <div className="flex gap-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Order ID / Phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => fetchOrders(1)}
            className="bg-black text-white px-4 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No orders found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-xs break-all">{o._id}</td>
                  <td className="p-3">{o.userId?.name}</td>
                  <td className="p-3 font-medium">₹{o.finalAmount}</td>
                  <td className="p-3"><StatusBadge status={o.orderStatus} /></td>
                  <td className="p-3">
                    <Link href={`/admin/orders/${o._id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button disabled={page === 1} onClick={() => fetchOrders(page - 1)} className="px-3 py-1 border rounded disabled:opacity-40">
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button disabled={page === totalPages} onClick={() => fetchOrders(page + 1)} className="px-3 py-1 border rounded disabled:opacity-40">
          Next
        </button>
      </div>
    </div>
  );
}
