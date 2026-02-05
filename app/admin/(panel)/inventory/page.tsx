"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAllProducts,
  getProductById,
  updateProduct,
  toggleProductStatus,
} from "@/services/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  images: string[];
  category: string;
  description?: string;
  discount?: number;
};

const PAGE_SIZE = 8;

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  /* ================= FETCH (SAME AS PRODUCTS PAGE) ================= */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(); // already unwrapped
      setProducts(data.products || []);
    } catch (err) {
      console.error("Inventory fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(
    1,
    Math.ceil(products.length / PAGE_SIZE)
  );

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [products, page]);

  /* ================= STOCK UPDATE (FORMDATA – CORRECT) ================= */
const updateStock = async (id: string, delta: number) => {
  try {
    setUpdatingId(id);

    // getProductById returns product directly (per API doc)
    const product = await getProductById(id);

    if (!product || typeof product.stock !== "number") {
      throw new Error("Invalid product response");
    }

    const newStock = Math.max(0, product.stock + delta);

    // Build FormData (same as edit product page)
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description || "");
    formData.append("category", product.category);
    formData.append("price", product.price.toString());
    formData.append("discount", product.discount?.toString() || "0");
    formData.append("stock", newStock.toString());
    formData.append("isActive", String(product.isActive));

    await updateProduct(id, formData);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, stock: newStock } : p
      )
    );
  } catch (error) {
    console.error("Stock update failed", error);
  } finally {
    setUpdatingId(null);
  }
};


  /* ================= STATUS TOGGLE ================= */
  const toggleStatus = async (id: string) => {
    await toggleProductStatus(id);
    fetchProducts();
  };

  /* ================= STATS ================= */
  const stats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    low: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
    out: products.filter((p) => p.stock === 0).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <span className="text-sm text-gray-500">
          Stock management
        </span>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Total Products" value={stats.total} />
        <Stat title="Active" value={stats.active} />
        <Stat title="Low Stock" value={stats.low} />
        <Stat title="Out of Stock" value={stats.out} />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-center">Price</th>
              <th className="p-4 text-center">Stock</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No products available
                </td>
              </tr>
            )}

            {paginatedProducts.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={p.images?.[0] || "/placeholder.png"}
                    className="w-12 h-12 rounded object-cover border"
                  />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      {p.category}
                    </p>
                  </div>
                </td>

                <td className="p-4 text-center font-medium">
                  ₹{p.price}
                </td>

                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => updateStock(p._id, -1)}
                      disabled={updatingId === p._id}
                      className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      −
                    </button>

                    <span className="w-6 text-center font-semibold">
                      {p.stock}
                    </span>

                    <button
                      onClick={() => updateStock(p._id, 1)}
                      disabled={updatingId === p._id}
                      className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {p.stock === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      Out of stock
                    </p>
                  )}
                </td>

                <td className="p-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      p.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleStatus(p._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
