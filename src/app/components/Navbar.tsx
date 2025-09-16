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

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-xl font-bold text-blue-700 tracking-tight">
          DF-Manager
        </Link>
        <button
          className="md:hidden flex items-center px-3 py-2 border rounded text-blue-700 border-blue-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
        <div className={`flex-col md:flex-row md:flex md:items-center w-full md:w-auto ${open ? 'flex' : 'hidden'}` + " md:space-x-6 space-y-2 md:space-y-0 mt-4 md:mt-0"}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded text-base font-medium transition-colors ${pathname === link.href ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
