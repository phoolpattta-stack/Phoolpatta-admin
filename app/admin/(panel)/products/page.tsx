// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import {
//   getAllProducts,
//   toggleProductStatus,
 
// } from "@/services/api";

// export default function ProductsPage() {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* =========================
//      FETCH PRODUCTS
//   ========================= */
//   const fetchProducts = async () => {
//     setLoading(true);
//     const data = await getAllProducts();
//     setProducts(data.products);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   /* =========================
//      STATUS TOGGLE
//   ========================= */
//   const handleToggleStatus = async (id: string) => {
//     await toggleProductStatus(id);
//     fetchProducts();
//   };

//   /* =========================
//      DELETE PRODUCT
//   ========================= */
//   // const handleDelete = async (id: string) => {
//   //   const ok = confirm("Are you sure you want to delete this product?");
//   //   if (!ok) return;

//   //   await deleteProduct(id);
//   //   fetchProducts();
//   // };

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Products</h1>
//         <Link
//           href="/admin/products/create"
//           className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm"
//         >
//           + Add Product
//         </Link>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Category</th>
//               <th className="p-3">Price</th>
//               <th className="p-3">Stock</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="p-6 text-center">
//                   Loading products...
//                 </td>
//               </tr>
//             ) : products.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="p-6 text-center">
//                   No products found
//                 </td>
//               </tr>
//             ) : (
//               products.map((p) => (
//                 <tr key={p._id} className="border-t">
//                   <td className="p-3 font-medium">{p.name}</td>
//                   <td className="p-3">{p.category}</td>
//                   <td className="p-3 text-center">₹{p.price}</td>
//                   <td className="p-3 text-center">{p.stock}</td>

//                   {/* Status */}
//                   <td className="p-3 text-center">
//                     <button
//                       onClick={() => handleToggleStatus(p._id)}
//                       className={`px-3 py-1 rounded text-xs font-medium
//                         ${
//                           p.isActive
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                     >
//                       {p.isActive ? "Active" : "Disabled"}
//                     </button>
//                   </td>

//                   {/* Actions */}
//                   <td className="p-3 text-center space-x-3">
//                     <Link
//                       href={`/admin/products/${p._id}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Edit
//                     </Link>
//                     <button
//                       // onClick={() => handleDelete(p._id)}
//                       className="text-red-600 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getAllProducts,
  toggleProductStatus,
} from "@/services/api";

/* =========================
   CATEGORY FILTER OPTIONS
========================= */
const CATEGORIES = [
  "all",
  "jaimala",
  "bouquet",
  "floral-jewellery",
  "car-decoration",
  "bed-decoration",
  "bridal-chunni",
  "bride-chaddar",
  "home-decoration",
  "guruji-event-decoration",
  "customise-designs",
];

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  /* =========================
     FETCH PRODUCTS
  ========================= */
  const fetchProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================
     FILTER BY CATEGORY
  ========================= */
  useEffect(() => {
    let list =
      category === "all"
        ? products
        : products.filter((p) => p.category === category);

    setFiltered(list);
    setPage(1);
  }, [category, products]);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedProducts = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* =========================
     STATUS TOGGLE
  ========================= */
  const handleToggleStatus = async (id: string) => {
    await toggleProductStatus(id);
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Products</h1>

        <Link
          href="/admin/products/create"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm w-fit"
        >
          + Add Product
        </Link>
      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          className="input max-w-xs"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat.replace(/-/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE (DESKTOP) */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  Loading products...
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  No products found
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-center">₹{p.price}</td>
                  <td className="p-3 text-center">{p.stock}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(p._id)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        p.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.isActive ? "Active" : "Disabled"}
                    </button>
                  </td>

                  <td className="p-3 text-center space-x-3">
                    <Link
                      href={`/admin/products/${p._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    {/* <button className="text-red-600 hover:underline">
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CARDS (MOBILE) */}
      <div className="md:hidden grid gap-4">
        {paginatedProducts.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-lg shadow space-y-2">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">{p.category}</div>
            <div className="flex justify-between text-sm">
              <span>₹{p.price}</span>
              <span>Stock: {p.stock}</span>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => handleToggleStatus(p._id)}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  p.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {p.isActive ? "Active" : "Disabled"}
              </button>

              <Link
                href={`/admin/products/${p._id}`}
                className="text-blue-600 text-sm"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
