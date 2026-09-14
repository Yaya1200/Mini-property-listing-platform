"use client";

import { useRegister } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";

type Role = "admin" | "property_owner" | "regular_user";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("regular_user");
  const [adminCode, setAdminCode] = useState("");
  const [validationError, setValidationError] = useState("");

  const {
    mutate: register,
    isPending,
    error,
  } = useRegister();

  const registerError =
    error as AxiosError<{ message?: string }> | null;

  
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  setValidationError("");

  if (!name.trim()) {
    setValidationError("Name is required.");
    return;
  }

  if (!email.trim()) {
    setValidationError("Email is required.");
    return;
  }

  if (password.length < 6) {
    setValidationError(
      "Password must be at least 6 characters long.",
    );
    return;
  }

  if (password !== confirmPassword) {
    setValidationError("Passwords do not match.");
    return;
  }

  if (role === "admin" && !adminCode.trim()) {
    setValidationError("Admin code is required.");
    return;
  }

  register({
    email: email.trim(),
    password,
    name: name.trim(),
    role,
    ...(role === "admin"
      ? {
          adminCode: adminCode.trim(),
        }
      : {}),
  });
};



  const handleRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedRole = event.target.value as Role;

    setRole(selectedRole);

    // Clear admin code when the user is no longer registering as admin.
    if (selectedRole !== "admin") {
      setAdminCode("");
    }

    setValidationError("");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Choose your account type to get started.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="John Doe"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <p className="mt-1.5 text-xs text-gray-500">
              Must be at least 6 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="••••••••"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Account Type
            </label>

            <select
              id="role"
              name="role"
              value={role}
              onChange={handleRoleChange}
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="regular_user">
                Regular User
              </option>

              <option value="property_owner">
                Property Owner
              </option>

              <option value="admin">
                Admin
              </option>
            </select>

            <p className="mt-1.5 text-xs text-gray-500">
              Your account type determines which dashboard you
              can access.
            </p>
          </div>

          {/* Admin Code */}
          {role === "admin" && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <label
                htmlFor="adminCode"
                className="block text-sm font-medium text-gray-700"
              >
                Admin Code
              </label>

              <input
                id="adminCode"
                name="adminCode"
                type="password"
                autoComplete="off"
                required
                value={adminCode}
                onChange={(event) =>
                  setAdminCode(event.target.value)
                }
                placeholder="Enter admin code"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <p className="mt-2 text-xs text-yellow-700">
                An admin code is required to create an administrator
                account.
              </p>
            </div>
          )}

          {/* Validation Error */}
          {validationError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {validationError}
              </p>
            </div>
          )}

          {/* API Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {registerError?.response?.data?.message ||
                  "Registration failed. Please try again."}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? "Creating account..."
              : "Create account"}
          </button>

          {/* Login */}
          <div className="border-t pt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

