"use client";

import { FormEvent, useEffect, useState } from "react";

const sections: Record<string, string> = {
  products: "المنتجات",
  categories: "التصنيفات",
  stores: "المتاجر",
  offers: "العروض",
  analytics: "التحليلات",
};
const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";

type Product = {
  id: string;
  name: string;
  price: number | null;
  isPublished: boolean;
  isDeal: boolean;
  category: { name: string } | null;
};

export default function AdminSectionPage({
  params,
}: {
  params: { section: string };
}) {
  const title = sections[params.section];
  const [stores, setStores] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const endpoint =
      params.section === "stores"
        ? `${apiBase}/admin/stores`
        : params.section === "products"
          ? `${apiBase}/admin/products`
          : null;
    if (!endpoint) return;
    fetch(endpoint, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("انتهت الجلسة. سجّل الدخول مرة أخرى.");
        const result = await response.json();
        if (params.section === "stores") {
          setStores(result.stores.map((store: { name: string }) => store.name));
        } else {
          setProducts(result.products);
        }
      })
      .catch((loadError: unknown) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "تعذر تحميل البيانات",
        ),
      );
  }, [params.section]);

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, FormDataEntryValue | boolean> =
      Object.fromEntries(formData.entries());
    payload.isPublished = formData.has("isPublished");
    payload.isFeatured = formData.has("isFeatured");
    payload.isDeal = formData.has("isDeal");

    try {
      const response = await fetch(`${apiBase}/products`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "تعذر حفظ المنتج");
      form.reset();
      setMessage("تم حفظ المنتج بنجاح.");
      const refreshed = await fetch(`${apiBase}/admin/products`, {
        credentials: "include",
      });
      if (!refreshed.ok) throw new Error("تم الحفظ، لكن تعذر تحديث القائمة.");
      const refreshedResult = await refreshed.json();
      setProducts(refreshedResult.products);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "تعذر حفظ المنتج",
      );
    } finally {
      setSubmitting(false);
    }
  }

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
      {params.section === "products" && (
        <>
          <form
            onSubmit={handleProductSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              maxWidth: 1000,
              padding: "20px 0",
            }}
          >
            <label>
              اسم المنتج
              <input name="name" required minLength={2} />
            </label>
            <label>
              السعر بالجنيه
              <input name="price" type="number" min="0" step="0.01" />
            </label>
            <label>
              السعر قبل الخصم
              <input name="oldPrice" type="number" min="0" step="0.01" />
            </label>
            <label>
              رابط الصورة
              <input name="imageUrl" type="url" />
            </label>
            <label>
              رابط المنتج أو العمولة
              <input name="affiliateUrl" type="url" />
            </label>
            <label>
              التصنيف
              <input name="categoryName" />
            </label>
            <label>
              المتجر
              <input name="storeName" />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              وصف قصير
              <textarea name="shortDescription" rows={2} />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              الوصف الكامل
              <textarea name="description" rows={3} />
            </label>
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 16,
              }}
            >
              <label>
                <input name="isPublished" type="checkbox" defaultChecked /> نشر
                المنتج
              </label>
              <label>
                <input name="isFeatured" type="checkbox" /> منتج مميز
              </label>
              <label>
                <input name="isDeal" type="checkbox" /> عرض
              </label>
              <button type="submit" disabled={submitting}>
                {submitting ? "جارٍ الحفظ..." : "حفظ المنتج"}
              </button>
            </div>
          </form>
          {message && <p role="status">{message}</p>}
          {error && <p role="alert">{error}</p>}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                maxWidth: 1000,
                borderCollapse: "collapse",
                textAlign: "right",
              }}
            >
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th>السعر</th>
                  <th>التصنيف</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>
                      {product.price === null ? "-" : `${product.price} ج`}
                    </td>
                    <td>{product.category?.name || "-"}</td>
                    <td>
                      {product.isPublished ? "منشور" : "مسودة"}
                      {product.isDeal ? " · عرض" : ""}
                    </td>
                  </tr>
                ))}
                {!products.length && (
                  <tr>
                    <td colSpan={4}>لا توجد منتجات بعد.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
