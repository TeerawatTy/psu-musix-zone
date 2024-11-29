// app/register/page.tsx

"use client";

import { useState } from "react";
import register from "../_actions/register";
import Link from "next/link";
import { redirect } from "next/navigation";
import SubmitButton from "../components/SubmitButton";
import { style } from "../constants/style";

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const result = await register(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.message);
      redirect("/login"); // Redirect to login page after successful registration
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <hr />
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex flex-col mb-2">
          <label htmlFor="name">Name</label>
          <input className={style} type="text" name="name" id="name" required />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="email">Email</label>
          <input className={style} type="email" name="email" id="email" required />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="password">Password</label>
          <input className={style} type="password" name="password" id="password" required />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <SubmitButton label="Register" />
      </form>
      <Link href="/login">Already have an account? Login here</Link>
    </div>
  );
}
