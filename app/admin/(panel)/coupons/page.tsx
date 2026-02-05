"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus,
} from "@/services/api";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

/* =========================
   Types
========================= */
type CouponType = "FLAT" | "PERCENT";

type Coupon = {
  _id: string;
  code: string;
  type: CouponType;
  value: number;
  minAmount: number;
  maxDiscount?: number | null;
  expiry: string;
  isActive: boolean;
  createdAt: string;
};

type CouponForm = {
  code: string;
  type: CouponType;
  value: string;
  minAmount: string;
  maxDiscount: string;
  expiry: string;
};

/* =========================
   Page
========================= */
export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<CouponForm>({
    code: "",
    type: "FLAT",
    value: "",
    minAmount: "",
    maxDiscount: "",
    expiry: "",
  });

  /* =========================
     Load Coupons
  ========================= */
  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons();
      setCoupons(data);
    } catch (err) {
      console.error("Failed to load coupons", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  /* =========================
     Create Coupon
  ========================= */
  const handleCreate = async () => {
    if (!form.code || !form.value || !form.expiry) return;

    await createCoupon({
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minAmount: Number(form.minAmount || 0),
      maxDiscount:
        form.type === "PERCENT"
          ? Number(form.maxDiscount || 0)
          : null,
      expiry: form.expiry,
    });

    setForm({
      code: "",
      type: "FLAT",
      value: "",
      minAmount: "",
      maxDiscount: "",
      expiry: "",
    });

    loadCoupons();
  };

  /* =========================
     Confirm Delete (Modal)
  ========================= */
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await deleteCoupon(deleteId);
      setDeleteId(null);
      loadCoupons();
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading coupons...</p>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Coupons</h1>

      {/* =========================
          CREATE COUPON
      ========================= */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
        <input
          placeholder="CODE"
          className="border p-2 rounded"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value.toUpperCase() })
          }
        />

        <select
          className="border p-2 rounded"
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value as CouponType,
            })
          }
        >
          <option value="FLAT">FLAT</option>
          <option value="PERCENT">PERCENT</option>
        </select>

        <input
          type="number"
          placeholder="Value"
          className="border p-2 rounded"
          value={form.value}
          onChange={(e) =>
            setForm({ ...form, value: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Min Amount"
          className="border p-2 rounded"
          value={form.minAmount}
          onChange={(e) =>
            setForm({ ...form, minAmount: e.target.value })
          }
        />

        {form.type === "PERCENT" && (
          <input
            type="number"
            placeholder="Max Discount"
            className="border p-2 rounded"
            value={form.maxDiscount}
            onChange={(e) =>
              setForm({ ...form, maxDiscount: e.target.value })
            }
          />
        )}

        <input
          type="date"
          className="border p-2 rounded"
          value={form.expiry}
          onChange={(e) =>
            setForm({ ...form, expiry: e.target.value })
          }
        />

        <button
          onClick={handleCreate}
          className="md:col-span-6 bg-blue-600 text-white py-2 rounded"
        >
          Create Coupon
        </button>
      </div>

      {/* =========================
          DESKTOP TABLE
      ========================= */}
      <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">Value</th>
              <th className="p-3">Min</th>
              <th className="p-3">Max</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.code}</td>
                <td className="p-3">{c.type}</td>
                <td className="p-3">
                  {c.type === "FLAT"
                    ? `₹${c.value}`
                    : `${c.value}%`}
                </td>
                <td className="p-3">₹{c.minAmount}</td>
                <td className="p-3">
                  {c.maxDiscount ? `₹${c.maxDiscount}` : "—"}
                </td>
                <td className="p-3">
                  {new Date(c.expiry).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      c.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() =>
                      toggleCouponStatus(c._id).then(loadCoupons)
                    }
                    className={`px-3 py-1 rounded text-sm ${
                      c.isActive
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {c.isActive ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => setDeleteId(c._id)}
                    className="px-3 py-1 rounded text-sm bg-gray-100 text-red-600"
                  >
                    Delete
                  </button>
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
        {coupons.map((c) => (
          <div key={c._id} className="bg-white p-4 rounded shadow space-y-1">
            <p className="font-semibold">
              {c.code} ({c.type})
            </p>
            <p>
              Value:{" "}
              {c.type === "FLAT" ? `₹${c.value}` : `${c.value}%`}
            </p>
            <p>Min Amount: ₹{c.minAmount}</p>
            {c.maxDiscount && <p>Max Discount: ₹{c.maxDiscount}</p>}
            <p>
              Status:{" "}
              <span
                className={`font-medium ${
                  c.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {c.isActive ? "Active" : "Disabled"}
              </span>
            </p>

            <div className="flex justify-between mt-2">
              <button
                onClick={() =>
                  toggleCouponStatus(c._id).then(loadCoupons)
                }
                className={`text-sm ${
                  c.isActive ? "text-red-600" : "text-green-600"
                }`}
              >
                {c.isActive ? "Disable" : "Enable"}
              </button>

              <button
                onClick={() => setDeleteId(c._id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          DELETE CONFIRM MODAL
      ========================= */}
      <ConfirmDeleteModal
        open={!!deleteId}
        loading={deleting}
        title="Delete Coupon"
        description="Are you sure you want to delete this coupon? This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
