// app/register/page.tsx

"use client";

import { useState } from "react";
import register from "../_actions/register";
import Link from "next/link";
import { redirect } from "next/navigation";
import SubmitButton from "../components/SubmitButton";
import { style } from "../constants/style";
import { z } from "zod"; // Import Zod

// Define Zod validation schema
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    // Validate the inputs using Zod schema
    const validationResult = registerSchema.safeParse(formValues);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors.map(err => err.message).join(", ");
      setError(errorMessage); // Show validation error
      return;
    }

    // Proceed with the registration logic if validation is successful
    const result = await register(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.message);
      redirect("/login"); // Redirect to login page after successful registration
    }
  };

  return (
    <div
      className="flex items-center justify-center h-[720px] bg-gray-100"
      style={{
        backgroundImage: 'url("/wallpaper-2.png")',
        backgroundSize: "1920px 960px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Register</h1>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              className="text-black w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="text-black w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="text-black w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
