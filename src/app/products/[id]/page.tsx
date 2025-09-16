"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export default function ProductManagePage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [variantName, setVariantName] = useState("");
  const [variantSku, setVariantSku] = useState("");
  const [variantQty, setVariantQty] = useState(0);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then(async res => {
        if (!res.ok) throw new Error(await res.text() || "Failed to fetch product");
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load product. " + err.message);
        setLoading(false);
      });
  }, [productId]);

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: variantName, sku: variantSku, quantity: variantQty }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to add variant");
      setVariantName("");
      setVariantSku("");
      setVariantQty(0);
      // Refresh product
      const updated = await fetch(`/api/products/${productId}`).then(r => r.json());
      setProduct(updated);
      setHistory(updated.history || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-700">Manage Product</h1>
        <Link href="/products">
          <button className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300">Back</button>
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : product ? (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="mb-4 text-gray-600">{product.description}</p>
            <h3 className="font-bold mb-2">Variants</h3>
            <table className="min-w-full bg-white rounded-lg shadow mb-4">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">SKU</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {(product.variants || []).map((variant: any) => (
                  <tr key={variant.id}>
                    <td className="py-2 px-4 border-b font-medium">{variant.name}</td>
                    <td className="py-2 px-4 border-b">{variant.sku || "-"}</td>
                    <td className="py-2 px-4 border-b">{variant.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handleAddVariant} className="flex gap-4 items-end mb-2">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={variantName} onChange={e => setVariantName(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 w-32" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input type="text" value={variantSku} onChange={e => setVariantSku(e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-32" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input type="number" value={variantQty} onChange={e => setVariantQty(Number(e.target.value))} required className="border border-gray-300 rounded px-3 py-2 w-24" />
              </div>
              <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700" disabled={saving}>{saving ? "Adding..." : "Add Variant"}</button>
            </form>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold mb-2">Update History</h3>
            {history.length === 0 ? (
              <div className="text-gray-400">No history yet.</div>
            ) : (
              <ul className="text-sm text-gray-700 space-y-1">
                {history.slice().reverse().map((h, i) => (
                  <li key={i}>
                    <span className="font-semibold">{h.type}</span> - {h.variantId ? `Variant: ${h.variantId}` : ""} {h.prevQuantity !== undefined ? `from ${h.prevQuantity} to ${h.newQuantity}` : ""} {h.updatedBy ? `by ${h.updatedBy}` : ""} at {new Date(h.updatedAt || h.addedAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
