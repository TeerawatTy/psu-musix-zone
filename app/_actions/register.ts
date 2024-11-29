"use client";

export default async function register(formData: FormData) {
  const body = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || "Registration failed");
    }

    return await response.json(); // e.g., { message: "User registered successfully!" }
  } catch (error: any) {
    return { error: error.message };
  }
}
