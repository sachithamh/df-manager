"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function ProductManagePage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const [product, setProduct] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemQty, setItemQty] = useState(0);
  const [saving, setSaving] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Fetch product info and items
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/products/${productId}`).then(async res => {
        if (!res.ok) throw new Error(await res.text() || "Failed to fetch product");
        return res.json();
      }),
      fetch(`/api/items`).then(async res => {
        if (!res.ok) throw new Error(await res.text() || "Failed to fetch items");
        return res.json();
      })
    ])
      .then(([productData, itemsData]) => {
        setProduct(productData);
        setItems(itemsData.filter((item: any) => item.productId === productId));
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load product. " + err.message);
        setLoading(false);
      });
  }, [productId]);

  // Add new item for this product
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: itemQty }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to add item");
      setItemQty(0);
      // Refresh items
      const updatedItems = await fetch(`/api/items`).then(r => r.json());
      setItems(updatedItems.filter((item: any) => item.productId === productId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to update quantity");
      // Refresh items
      const updatedItems = await fetch(`/api/items`).then(r => r.json());
      setItems(updatedItems.filter((item: any) => item.productId === productId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Fetch history for a selected item
  const fetchItemHistory = async (itemId: string) => {
    setHistory([]);
    setSelectedItem(itemId);
    try {
      const res = await fetch(`/api/items/${itemId}/history`);
      if (!res.ok) throw new Error(await res.text() || "Failed to fetch history");
      const data = await res.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Add a history record for a selected item
  const handleAddHistory = async (e: React.FormEvent, itemId: string, change: number, note: string) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/items/${itemId}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ change, note }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to add history");
      await fetchItemHistory(itemId);
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
            <p className="mb-2 text-gray-600">{product.description}</p>
            <p className="mb-4 text-sm text-gray-500">SKU: {product.sku}</p>
            <h3 className="font-bold mb-2">Items</h3>
            <table className="min-w-full bg-white rounded-lg shadow mb-4">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Item ID</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border-b font-mono">{item.id}</td>
                    <td className="py-2 px-4 border-b">{item.quantity}</td>
                    <td className="py-2 px-4 border-b flex gap-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          const newQty = prompt("Enter new quantity", item.quantity);
                          if (newQty !== null) handleUpdateQuantity(item.id, Number(newQty));
                        }}
                        disabled={saving}
                      >Update Qty</button>
                      <button
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                        onClick={() => fetchItemHistory(item.id)}
                        disabled={saving}
                      >History</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Item History Modal/Section */}
            {selectedItem && (
              <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold">Item History (ID: {selectedItem})</h4>
                  <button className="text-red-500" onClick={() => { setSelectedItem(null); setHistory([]); }}>Close</button>
                </div>
                <form
                  className="flex gap-2 mb-2"
                  onSubmit={e => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const change = Number((form.elements.namedItem("change") as HTMLInputElement).value);
                    const note = (form.elements.namedItem("note") as HTMLInputElement).value;
                    handleAddHistory(e, selectedItem, change, note);
                    form.reset();
                  }}
                >
                  <input name="change" type="number" placeholder="Change" required className="border rounded px-2 py-1 w-24" />
                  <input name="note" type="text" placeholder="Note (optional)" className="border rounded px-2 py-1 w-48" />
                  <button type="submit" className="bg-blue-600 text-white rounded px-3 py-1" disabled={saving}>Add</button>
                </form>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="py-1 px-2 border-b">Change</th>
                      <th className="py-1 px-2 border-b">Note</th>
                      <th className="py-1 px-2 border-b">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr><td colSpan={3} className="text-center text-gray-400">No history</td></tr>
                    ) : (
                      history.map((h: any) => (
                        <tr key={h.id}>
                          <td className="py-1 px-2 border-b">{h.change}</td>
                          <td className="py-1 px-2 border-b">{h.note}</td>
                          <td className="py-1 px-2 border-b">{h.timestamp ? new Date(h.timestamp).toLocaleString() : "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <form onSubmit={handleAddItem} className="flex gap-4 items-end mb-2">
              <div>
                <label className="block text-sm font-medium mb-1">Initial Quantity</label>
                <input type="number" value={itemQty} onChange={e => setItemQty(Number(e.target.value))} required className="border border-gray-300 rounded px-3 py-2 w-32" />
              </div>
              <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700" disabled={saving}>{saving ? "Adding..." : "Add Item"}</button>
            </form>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </>
      ) : null}
    </div>
  );
}
