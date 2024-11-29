// app/login/page.tsx

"use client";

import { useActionState } from "react"; // Update to use `useActionState`
import { login } from "@/utils/loginUser"; // Ensure proper import
import Link from "next/link";
import { redirect } from "next/navigation";
import SubmitButton from "../components/SubmitButton"; // Adjust path if needed
import { style } from "../constants/style"; // Adjust path if needed

export default function Login() {
  const [data, action] = useActionState(login, {}); // Use `useActionState` instead of `useFormState`

  if (data.message) {
    redirect("/");
  }

  return (
    <div>
      <h1>Login</h1>
      <form action={action} className="mt-4">
        <div className="flex flex-col mb-2">
          <label htmlFor="email">Email</label>
          <input
            className={style}
            type="email"
            name="email"
            id="email"
            required
          />
          {data.error?.email && (
            <div className="text-red-600">{data.error.email[0]}</div>
          )}
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="password">Password</label>
          <input
            className={style}
            type="password"
            name="password"
            id="password"
            required
          />
          {data.error?.password && (
            <div className="text-red-600">{data.error.password[0]}</div>
          )}
        </div>
        <div>
          <input
            className="w-6 h-6 mr-2 mb-6"
            type="checkbox"
            name="remember"
            id="remember"
          />
          <label className="align-top" htmlFor="remember">
            Remember me
          </label>
        </div>
        <div>
          {data.error?.message && (
            <div className="text-red-600">{data.error.message}</div>
          )}
        </div>
        <div>
          {data.message ? (
            <p>{data.message}</p>
          ) : (
            <SubmitButton label="Login" />
          )}
        </div>
      </form>
      <hr />
      <Link href="/register">Don't have an account? Register</Link>
    </div>
  );
}
