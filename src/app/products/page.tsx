"use client";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 tracking-tight">Products</h1>
        <p className="text-gray-600 text-lg mb-8">Manage your warehouse products and variants.</p>
        <Link href="/products/add">
          <button className="bg-blue-600 text-white font-semibold rounded-lg py-2 px-6 mb-4 hover:bg-blue-700 transition-colors">
            Add Product
          </button>
        </Link>
        {/* Product list will go here */}
        <div className="mt-8 text-gray-400 text-xs text-center">
          &copy; {new Date().getFullYear()} DF-Manager. All rights reserved.
        </div>
      </div>
    </div>
  );
}
