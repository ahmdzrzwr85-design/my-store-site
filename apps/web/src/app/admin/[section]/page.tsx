"use client";

import { useEffect, useState } from "react";

const sections: Record<string, string> = {
  products: "المنتجات",
  categories: "التصنيفات",
  stores: "المتاجر",
  offers: "العروض",
  analytics: "التحليلات",
};
const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminSectionPage({
  params,
}: {
  params: { section: string };
}) {
  const title = sections[params.section];
  const [stores, setStores] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.section !== "stores") return;
    fetch(`${apiBase}/admin/stores`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("انتهت الجلسة. سجّل الدخول مرة أخرى.");
        const result = await response.json();
        setStores(result.stores.map((store: { name: string }) => store.name));
      })
      .catch((loadError: unknown) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "تعذر تحميل البيانات",
        ),
      );
  }, [params.section]);

  if (!title)
    return (
      <main dir="rtl">
        <h1>القسم غير موجود</h1>
      </main>
    );
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        padding: 20,
        background: "#f4f5f6",
        color: "#202124",
        fontFamily: "Arial, sans-serif",
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
        <h1 style={{ margin: 0, fontSize: 24 }}>{title}</h1>
        <a href="/admin" style={{ color: "#30343a" }}>
          لوحة التحكم
        </a>
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
        {Object.entries(sections).map(([slug, label]) => (
          <a
            key={slug}
            href={`/admin/${slug}`}
            style={{
              color: "#30343a",
              padding: "8px 10px",
              borderBottom:
                slug === params.section
                  ? "2px solid #f97316"
                  : "2px solid transparent",
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      {params.section === "stores" &&
        (error ? (
          <p role="alert">{error}</p>
        ) : stores.length ? (
          <ul>
            {stores.map((store) => (
              <li key={store}>{store}</li>
            ))}
          </ul>
        ) : (
          <p>جارٍ تحميل المتاجر...</p>
        ))}
    </main>
  );
}
