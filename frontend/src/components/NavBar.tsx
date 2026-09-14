// src/components/NavBar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";

export default function NavBar() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <div className="flex space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {user?.role === "admin" && (
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>
        )}
        {user && (user.role === "property_owner" || user.role === "admin") && (
          <Link href="/owner" className="hover:underline">
            Owner
          </Link>
        )}
        {user && (
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        )}
      </div>
      <div>
        {!user ? (
          <>
            <Link href="/login" className="mr-4 hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </>
        ) : (
          <button onClick={logout} className="hover:underline">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
