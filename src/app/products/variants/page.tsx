"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Variant {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  variants?: Variant[];
}

export default function ProductVariantsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  useEffect(() => {
    fetch("/api/products")
      .then(async res => {
        if (!res.ok) throw new Error(await res.text() || "Failed to fetch products");
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load products. " + err.message);
        setLoading(false);
      });
  }, []);

  // Flatten all variants with product info
  const allVariants = products.flatMap(product =>
    (product.variants || []).map(variant => ({
      ...variant,
      productId: product.id,
      productName: product.name,
    }))
  );

  const filteredVariants = selectedProduct
    ? allVariants.filter(v => v.productId === selectedProduct)
    : allVariants;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Product Variants</h1>
        <Link href="/products">
          <button className="bg-blue-600 text-white font-semibold rounded-lg py-2 px-6 hover:bg-blue-700 transition-colors">
            Back to Products
          </button>
        </Link>
      </div>
      <div className="mb-6 flex gap-4 items-center">
        <label htmlFor="productFilter" className="font-medium">Filter by Product:</label>
        <select
          id="productFilter"
          className="border border-gray-300 rounded px-3 py-2"
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
        >
          <option value="">All Products</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filteredVariants.length === 0 ? (
        <div className="text-center text-gray-400">No variants found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Product</th>
                <th className="py-2 px-4 border-b">Variant</th>
                <th className="py-2 px-4 border-b">SKU</th>
                <th className="py-2 px-4 border-b">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariants.map(variant => (
                <tr key={variant.id}>
                  <td className="py-2 px-4 border-b">{variant.productName}</td>
                  <td className="py-2 px-4 border-b font-medium">{variant.name}</td>
                  <td className="py-2 px-4 border-b">{variant.sku || "-"}</td>
                  <td className="py-2 px-4 border-b">{variant.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
