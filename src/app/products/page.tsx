"use client";
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";


type Product = {
  id: string;
  name: string;
  description: string;
  variants?: any[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch products");
        }
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

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Products</h1>
        <Link href="/products/add">
          <button className="bg-blue-600 text-white font-semibold rounded-lg py-2 px-6 hover:bg-blue-700 transition-colors">
            Add Product
          </button>
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-400">No products found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Variants</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b font-medium">{product.name}</td>
                  <td className="py-2 px-4 border-b">{product.description}</td>
                  <td className="py-2 px-4 border-b">{product.variants?.length || 0}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/products/${product.id}`}>
                      <button className="bg-blue-500 text-white rounded px-3 py-1 text-sm hover:bg-blue-600">Manage</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
