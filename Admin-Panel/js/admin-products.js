const API_BASE = window.ZAR_ZOR_API_URL || "http://localhost:4000/api";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("product-form");
  const tableBody = document.getElementById("products-table-body");
  const message = document.getElementById("form-message");
  const apiStatus = document.getElementById("api-status");

  const renderProducts = (products) => {
    if (!products.length) {
      tableBody.innerHTML =
        '<tr><td colspan="5">لا توجد منتجات محفوظة بعد.</td></tr>';
      return;
    }

    tableBody.innerHTML = products
      .map(
        (product) =>
          `<tr><td>${product.name}</td><td>${product.price ?? "-"} ج</td><td>${product.isDeal ? "عرض" : "-"}</td><td>${product.category?.name || "إلكترونيات"}</td><td>${product.isPublished ? "مفعل" : "مسودة"}</td></tr>`,
      )
      .join("");
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("load failed");
      const data = await response.json();
      renderProducts(data.products || []);
      apiStatus.textContent = "متصل بقاعدة البيانات";
      apiStatus.classList.add("is-online");
    } catch {
      tableBody.innerHTML =
        '<tr><td colspan="5">تعذر الاتصال بالـ API. شغّل الخادم على المنفذ 4000.</td></tr>';
      apiStatus.textContent = "غير متصل بالـ API";
      apiStatus.classList.add("is-offline");
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "جاري حفظ المنتج...";
    message.className = "admin-form-message";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.isPublished = formData.has("isPublished");
    payload.isFeatured = formData.has("isFeatured");
    payload.isDeal = formData.has("isDeal");

    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر حفظ المنتج");

      message.textContent = "تم حفظ المنتج بنجاح.";
      message.classList.add("is-success");
      form.reset();
      form.querySelector('[name="isPublished"]').checked = true;
      await loadProducts();
    } catch (error) {
      message.textContent = error.message;
      message.classList.add("is-error");
    }
  });

  loadProducts();
});
