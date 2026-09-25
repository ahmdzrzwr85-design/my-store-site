document.addEventListener("DOMContentLoaded", () => {
  const compareKey = "zar-zor-compare";
  const productNames = {
    "smart-watch": "ساعة ذكية بميزة القياس",
    "wireless-headphones": "سماعات لاسلكية",
    smartphone: "هاتف ذكي",
    "camera-4k": "كاميرا 4K",
  };

  const getCompared = () =>
    JSON.parse(localStorage.getItem(compareKey) || "[]");
  const saveCompared = (items) =>
    localStorage.setItem(compareKey, JSON.stringify(items));

  const links = document.querySelectorAll(".main-nav a");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    }
  });

  document.querySelectorAll(".btn-link").forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.currentTarget.getAttribute("href");
      if (target) {
        window.location.href = target;
      }
    });
  });

  const compareCards = document.querySelectorAll(".compare-product");
  if (compareCards.length) {
    const compared = getCompared();
    const count = document.getElementById("compare-count");
    const compareNow = document.getElementById("compare-now");
    const clearCompare = document.getElementById("clear-compare");

    const refreshCompareTray = () => {
      const selected = getCompared();
      if (count) count.textContent = selected.length;
      if (compareNow) compareNow.disabled = selected.length < 2;
      compareCards.forEach((card) => {
        const checkbox = card.querySelector(".compare-check");
        if (checkbox)
          checkbox.checked = selected.some(
            (item) => item.id === card.dataset.compareId,
          );
      });
    };

    compareCards.forEach((card) => {
      const checkbox = card.querySelector(".compare-check");
      checkbox.addEventListener("change", () => {
        const selected = getCompared().filter(
          (item) => item.id !== card.dataset.compareId,
        );
        if (checkbox.checked) {
          selected.push({
            id: card.dataset.compareId,
            name:
              productNames[card.dataset.compareId] ||
              card.querySelector("h3").textContent,
            category: card.dataset.category,
            price: card.dataset.price,
            rating: card.dataset.rating,
            store: card.dataset.store,
          });
        }
        saveCompared(selected);
        refreshCompareTray();
      });
    });

    compareNow?.addEventListener("click", () => {
      if (getCompared().length >= 2) window.location.href = "compare.html";
    });

    clearCompare?.addEventListener("click", () => {
      saveCompared([]);
      refreshCompareTray();
    });

    refreshCompareTray();
  }

  const compareResults = document.getElementById("compare-results");
  if (compareResults) {
    const selected = getCompared();
    if (selected.length < 2) {
      compareResults.innerHTML =
        '<div class="empty-compare"><h2>لم تختر منتجات كافية</h2><p>اختار منتجين على الأقل من صفحة المنتجات لبدء المقارنة.</p><a class="btn btn-primary" href="products.html">اختيار المنتجات</a></div>';
      return;
    }

    const rows = [
      ["القسم", "category"],
      ["السعر الحالي", "price"],
      ["التقييم", "rating"],
      ["المتجر", "store"],
    ];
    compareResults.innerHTML = `<div class="compare-table-wrap"><table class="compare-table"><thead><tr><th>المواصفات</th>${selected.map((item) => `<th>${item.name}</th>`).join("")}</tr></thead><tbody>${rows.map(([label, key]) => `<tr><th>${label}</th>${selected.map((item) => `<td>${key === "rating" ? `⭐ ${item[key]}` : item[key]}</td>`).join("")}</tr>`).join("")}</tbody></table></div><button class="btn btn-secondary compare-clear-page" id="clear-compare-page" type="button">مسح المقارنة</button>`;
    document
      .getElementById("clear-compare-page")
      .addEventListener("click", () => {
        saveCompared([]);
        window.location.reload();
      });
  }
});
