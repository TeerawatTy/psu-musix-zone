// app/login/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { loginUser } from "@/utils/loginUser"; // Adjust according to your logic
import { useRouter } from "next/navigation"; // Correct import from next/navigation
import { z } from "zod"; // Import Zod

// Define Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error state before each submission

    // Validate the inputs using Zod schema
    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors.map((err) => err.message).join(", ");
      setError(errorMessage); // Show validation error
      return;
    }

    // Proceed with the login logic if validation is successful
    const result = await loginUser({ email, password }, false); // False for "remember me" for now

    if (result?.error) {
      setError(result.error.message); // Show error message
    } else if (result?.redirectTo) {
      // Redirect admin to the admin page
      router.push(result.redirectTo);
    } else {
      // Redirect regular users to the homepage
      router.push("/");
      window.location.reload(); // Refresh the page
    }
  };

  // Optional: Check if the user is already logged in
  useEffect(() => {
    // Check if user is authenticated by checking a token in localStorage (as an example)
    const isAuthenticated = !!localStorage.getItem("authToken");
    if (isAuthenticated) {
      router.push(""); // Redirect to the home page
    }
  }, [router]);

  return (
    <div
      className="flex items-center justify-center min-h-[720px] bg-gray-100"
      style={{
        backgroundImage: 'url("/wallpaper-2.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Login</h1>

        {error && <p className="text-red-500 text-center">{error}</p>} {/* Error message display */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-black w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-black w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-orange-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
