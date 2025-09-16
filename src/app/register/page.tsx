"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import Image from "next/image";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <Image src="/next.svg" alt="DF-Manager Logo" width={64} height={64} className="mb-4" />
        <h1 className="text-3xl font-bold text-blue-700 mb-2 tracking-tight">DF-Manager</h1>
        <p className="mb-6 text-gray-500">Create a new account</p>
        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold rounded-lg py-2 mt-2 hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center mt-2">{success}</p>}
        </form>
        <div className="mt-6 text-gray-400 text-xs text-center">
          &copy; {new Date().getFullYear()} DF-Manager. All rights reserved.
        </div>
      </div>
    </div>
  );
}
