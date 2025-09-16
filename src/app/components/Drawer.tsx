"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export default function Drawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Drawer toggle button for mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label="Open navigation drawer"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:static md:block md:w-56`}
      >
        <div className="flex flex-col h-full pt-8 pb-4 px-4">
          <div className="text-2xl font-bold text-blue-700 mb-8 tracking-tight text-center md:text-left">
            DF-Manager
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${pathname === link.href ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto text-gray-400 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} DF-Manager
          </div>
        </div>
      </aside>
    </>
  );
}
