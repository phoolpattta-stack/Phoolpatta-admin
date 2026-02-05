// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { createProduct } from "@/services/api";

// export default function CreateProductPage() {
//   const router = useRouter();

//   const [images, setImages] = useState<File[]>([]);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState(false);

//   const [product, setProduct] = useState({
//     name: "",
//     description: "",
//     category: "",
//     price: "",
//     discount: "",
//     stock: "",
//     isActive: true,
//   });

//   /* =========================
//      VALIDATION
//   ========================= */
//   const validate = () => {
//     const newErrors: Record<string, string> = {};

//     if (!product.name.trim()) newErrors.name = "Product name is required";
//     if (!product.category.trim()) newErrors.category = "Category is required";

//     if (!product.price || Number(product.price) <= 0)
//       newErrors.price = "Valid price is required";

//     if (Number(product.discount) < 0)
//       newErrors.discount = "Discount cannot be negative";

//     if (!product.stock || Number(product.stock) < 0)
//       newErrors.stock = "Stock must be 0 or more";

//     if (images.length === 0)
//       newErrors.images = "At least 1 image is required";

//     if (images.length > 5)
//       newErrors.images = "Maximum 5 images allowed";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /* =========================
//      CREATE PRODUCT
//   ========================= */
//   const handleCreate = async () => {
//     if (!validate()) return;

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("name", product.name);
//     formData.append("description", product.description);
//     formData.append("category", product.category);
//     formData.append("price", product.price.toString());
//     formData.append("discount", product.discount.toString());
//     formData.append("stock", product.stock.toString());
//     formData.append("isActive", String(product.isActive));

//     images.forEach((img) => formData.append("images", img));

//     try {
//       await createProduct(formData);
//       router.push("/admin/products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl">
//       <h1 className="text-2xl font-bold mb-6">Create Product</h1>

//       <div className="bg-white p-6 rounded-lg shadow space-y-4">
//         {/* Name */}
//         <div>
//           <input
//             className="input"
//             placeholder="Product Name"
//             value={product.name}
//             onChange={(e) =>
//               setProduct({ ...product, name: e.target.value })
//             }
//           />
//           {errors.name && <p className="error">{errors.name}</p>}
//         </div>

//         {/* Description */}
//         <textarea
//           className="input"
//           placeholder="Description"
//           value={product.description}
//           onChange={(e) =>
//             setProduct({ ...product, description: e.target.value })
//           }
//         />

//         {/* Category */}
//         <div>
//           <input
//             className="input"
//             placeholder="Category"
//             value={product.category}
//             onChange={(e) =>
//               setProduct({ ...product, category: e.target.value })
//             }
//           />
//           {errors.category && <p className="error">{errors.category}</p>}
//         </div>

//         {/* Price / Discount / Stock */}
//         <div className="grid grid-cols-3 gap-4">
//           <div>
//             <input
//               type="number"
//               className="input"
//               placeholder="Price"
//               value={product.price}
//               onChange={(e) =>
//                 setProduct({ ...product, price: e.target.value })
//               }
//             />
//             {errors.price && <p className="error">{errors.price}</p>}
//           </div>

//           <div>
//             <input
//               type="number"
//               className="input"
//               placeholder="Discount"
//               value={product.discount}
//               onChange={(e) =>
//                 setProduct({ ...product, discount: e.target.value })
//               }
//             />
//             {errors.discount && <p className="error">{errors.discount}</p>}
//           </div>

//           <div>
//             <input
//               type="number"
//               className="input"
//               placeholder="Stock"
//               value={product.stock}
//               onChange={(e) =>
//                 setProduct({ ...product, stock: e.target.value })
//               }
//             />
//             {errors.stock && <p className="error">{errors.stock}</p>}
//           </div>
//         </div>

//         {/* Active */}
//         <label className="flex items-center gap-2 text-sm">
//           <input
//             type="checkbox"
//             checked={product.isActive}
//             onChange={(e) =>
//               setProduct({ ...product, isActive: e.target.checked })
//             }
//           />
//           Product Active
//         </label>

//         {/* Images */}
//         <div>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={(e) =>
//               setImages(Array.from(e.target.files || []))
//             }
//           />
//           {errors.images && <p className="error">{errors.images}</p>}
//         </div>

//         {/* Actions */}
//         <div className="flex gap-4">
//           <button
//             disabled={loading}
//             onClick={handleCreate}
//             className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md disabled:opacity-60"
//           >
//             {loading ? "Creating..." : "Create Product"}
//           </button>

//           <button
//             onClick={() => router.back()}
//             className="border px-6 py-2 rounded-md"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/api";

/* =========================
   CATEGORY OPTIONS
========================= */
const CATEGORIES = [
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
  "bestseller",
];

export default function CreateProductPage() {
  const router = useRouter();

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
    isActive: true,
  });

  /* =========================
     VALIDATION
  ========================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.category) newErrors.category = "Category is required";

    if (!product.price || Number(product.price) <= 0)
      newErrors.price = "Valid price is required";

    if (Number(product.discount) < 0)
      newErrors.discount = "Discount cannot be negative";

    if (!product.stock || Number(product.stock) < 0)
      newErrors.stock = "Stock must be 0 or more";

    if (images.length === 0)
      newErrors.images = "At least 1 image is required";

    if (images.length > 5)
      newErrors.images = "Maximum 5 images allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     CREATE PRODUCT
  ========================= */
  const handleCreate = async () => {
    if (!validate()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("discount", product.discount);
    formData.append("stock", product.stock);
    formData.append("isActive", String(product.isActive));

    images.forEach((img) => formData.append("images", img));

    try {
      await createProduct(formData);
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* BASIC INFO */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div>
            <label className="label">Product Name</label>
            <input
              className="input"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[100px]"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/-/g, " ")}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="error">{errors.category}</p>
            )}
          </div>
        </div>

        {/* PRICING */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Pricing & Stock</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Price</label>
              <input
                type="number"
                className="input"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
              {errors.price && <p className="error">{errors.price}</p>}
            </div>

            <div>
              <label className="label">Discount (%)</label>
              <input
                type="number"
                className="input"
                value={product.discount}
                onChange={(e) =>
                  setProduct({ ...product, discount: e.target.value })
                }
              />
              {errors.discount && (
                <p className="error">{errors.discount}</p>
              )}
            </div>

            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                className="input"
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: e.target.value })
                }
              />
              {errors.stock && <p className="error">{errors.stock}</p>}
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={product.isActive}
              onChange={(e) =>
                setProduct({ ...product, isActive: e.target.checked })
              }
            />
            Product Active
          </label>
        </div>

        {/* IMAGES */}
        <div>
          <label className="label">Product Images (max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setImages(Array.from(e.target.files || []))
            }
          />
          {errors.images && <p className="error">{errors.images}</p>}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4">
          <button
            disabled={loading}
            onClick={handleCreate}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>

          <button
            onClick={() => router.back()}
            className="border px-6 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
