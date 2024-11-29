// app/login/page.tsx


"use client";

import React, { useState } from "react";
import { loginUser } from "@/utils/loginUser";
import { useRouter } from "next/navigation"; // To handle redirection after login

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate user input
      if (!data.email || !data.password) {
        setError("Please fill in both fields.");
        return;
      }

      // Call the login function
      const result = await loginUser(data, false); // Pass 'remember' as false or true based on the user's choice
      if (result.message === "Login Success") {
        // Redirect to homepage or desired page after successful login
        router.push("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials or server error. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
