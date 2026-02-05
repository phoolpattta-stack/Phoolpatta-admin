"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/services/api";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
    isActive: true,
    images: [] as string[],
  });

  /* =========================
     FETCH PRODUCT
  ========================= */
  useEffect(() => {
    getProductById(id as string)
      .then((data) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  /* =========================
     VALIDATION
  ========================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!product.name.trim()) newErrors.name = "Name is required";
    if (!product.category.trim()) newErrors.category = "Category is required";
    if (!product.price || Number(product.price) <= 0)
      newErrors.price = "Valid price required";
    if (Number(product.discount) < 0)
      newErrors.discount = "Discount cannot be negative";
    if (!product.stock || Number(product.stock) < 0)
      newErrors.stock = "Stock must be 0 or more";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     UPDATE PRODUCT
  ========================= */
  const handleUpdate = async () => {
    if (!validate()) return;

    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("price", product.price.toString());
    formData.append("discount", product.discount.toString());
    formData.append("stock", product.stock.toString());
    formData.append("isActive", String(product.isActive));

    images.forEach((img) => formData.append("images", img));

    await updateProduct(id as string, formData);
    router.push("/admin/products");
  };

  if (loading) return <p>Loading product...</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        {/* Name */}
        <div>
          <input
            className="input"
            value={product.name}
            onChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
            placeholder="Product Name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        {/* Description */}
        <textarea
          className="input"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          placeholder="Description"
        />

        {/* Category */}
        <div>
          <input
            className="input"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            placeholder="Category"
          />
          {errors.category && <p className="error">{errors.category}</p>}
        </div>

        {/* Price / Discount / Stock */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <input
              type="number"
              className="input"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
              placeholder="Price"
            />
            {errors.price && <p className="error">{errors.price}</p>}
          </div>

          <div>
            <input
              type="number"
              className="input"
              value={product.discount}
              onChange={(e) =>
                setProduct({ ...product, discount: e.target.value })
              }
              placeholder="Discount"
            />
            {errors.discount && <p className="error">{errors.discount}</p>}
          </div>

          <div>
            <input
              type="number"
              className="input"
              value={product.stock}
              onChange={(e) =>
                setProduct({ ...product, stock: e.target.value })
              }
              placeholder="Stock"
            />
            {errors.stock && <p className="error">{errors.stock}</p>}
          </div>
        </div>

        {/* Active */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={product.isActive}
            onChange={(e) =>
              setProduct({ ...product, isActive: e.target.checked })
            }
          />
          Product Active
        </label>

        {/* Existing Images */}
        {product.images.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Current Images</p>
            <div className="flex gap-3 flex-wrap">
              {product.images.map((img) => (
                <img
                  key={img}
                  src={img}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Replace Images */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setImages(Array.from(e.target.files || []))
          }
        />

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
          >
            Update Product
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
