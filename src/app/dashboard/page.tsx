"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 tracking-tight">Welcome to DF-Manager Dashboard</h1>
        <p className="text-gray-600 text-lg mb-8">You are now logged in.</p>
        <Link href="/products">
          <button className="bg-blue-600 text-white font-semibold rounded-lg py-2 px-6 hover:bg-blue-700 transition-colors">
            Manage Products
          </button>
        </Link>
      </div>
    </div>
  );
}
