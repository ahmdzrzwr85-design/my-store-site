"use client";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminDashboardPage() {
  async function logout() {
    await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.assign("/admin/login");
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#f4f5f6",
        color: "#202124",
        fontFamily: "Arial, sans-serif",
        padding: 20,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          borderBottom: "1px solid #dfe2e5",
          paddingBottom: 16,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24 }}>لوحة الإدارة</h1>
        <button
          onClick={logout}
          style={{
            minHeight: 40,
            padding: "0 14px",
            border: "1px solid #cfd2d6",
            borderRadius: 5,
            background: "white",
            cursor: "pointer",
          }}
        >
          تسجيل الخروج
        </button>
      </header>
      <nav
        aria-label="إدارة المتجر"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          padding: "18px 0",
        }}
      >
        {[
          ["لوحة التحكم", "/admin"],
          ["المنتجات", "/admin/products"],
          ["التصنيفات", "/admin/categories"],
          ["المتاجر", "/admin/stores"],
          ["العروض", "/admin/offers"],
          ["التحليلات", "/admin/analytics"],
        ].map(([item, href]) => (
          <a
            key={item}
            href={href}
            style={{
              color: "#30343a",
              padding: "8px 10px",
              borderBottom:
                item === "لوحة التحكم"
                  ? "2px solid #f97316"
                  : "2px solid transparent",
              textDecoration: "none",
            }}
          >
            {item}
          </a>
        ))}
      </nav>
      <p>اختر قسمًا من لوحة الإدارة.</p>
    </main>
  );
}
