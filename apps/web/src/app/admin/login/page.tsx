"use client";

import { FormEvent, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "بيانات خاطئة");
      const requestedPath = new URLSearchParams(window.location.search).get(
        "next",
      );
      const nextPath = requestedPath?.startsWith("/admin/")
        ? requestedPath
        : "/admin";
      window.location.assign(nextPath);
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "تعذر تسجيل الدخول",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login" dir="rtl">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <span className="admin-mark">Z</span>
        <h1>دخول الإدارة</h1>
        <label>
          البريد الإلكتروني
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          كلمة المرور
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "جارٍ التحقق..." : "تسجيل الدخول"}
        </button>
      </form>
      <style jsx>{`
        .admin-login {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: 24px;
          background: #f4f5f6;
          color: #202124;
          font-family: Arial, sans-serif;
        }
        .admin-login-form {
          width: min(100%, 390px);
          display: grid;
          gap: 16px;
          padding: 28px;
          background: #fff;
          border: 1px solid #e2e4e7;
          border-radius: 8px;
        }
        .admin-mark {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #f97316;
          color: white;
          font-size: 24px;
          font-weight: 900;
        }
        h1 {
          margin: 0 0 4px;
          font-size: 24px;
        }
        label {
          display: grid;
          gap: 7px;
          font-size: 14px;
          font-weight: 700;
        }
        input {
          min-width: 0;
          height: 44px;
          padding: 0 12px;
          border: 1px solid #cfd2d6;
          border-radius: 5px;
          font: inherit;
        }
        button {
          height: 46px;
          border: 0;
          border-radius: 5px;
          background: #f97316;
          color: white;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.65;
          cursor: wait;
        }
        [role="alert"] {
          margin: 0;
          color: #b42318;
        }
      `}</style>
    </main>
  );
}
