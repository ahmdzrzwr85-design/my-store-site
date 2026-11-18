document.addEventListener("DOMContentLoaded", () => {
  const compareKey = "zar-zor-compare";
  const productNames = {
    "smart-watch": "ساعة ذكية بميزة القياس",
    "wireless-headphones": "سماعات لاسلكية",
    smartphone: "هاتف ذكي",
    "camera-4k": "كاميرا 4K",
  };
  const liveProductsGrid = document.querySelector("[data-live-products]");
  const apiBase = window.ZAR_ZOR_API_URL;

  const addLiveProductCards = async () => {
    if (!liveProductsGrid || !apiBase) return;
    try {
      const response = await fetch(`${apiBase}/products`);
      if (!response.ok) return;
      const { products } = await response.json();
      products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";

        if (product.isDeal || product.isFeatured) {
          const badge = document.createElement("div");
          badge.className = `badge ${product.isDeal ? "badge-hot" : "badge-featured"}`;
          badge.textContent = product.isDeal ? "عرض" : "اختيارنا";
          card.append(badge);
        }

        const image = document.createElement("img");
        image.alt = product.name;
        if (product.imageUrl) {
          try {
            const imageUrl = new URL(product.imageUrl);
            if (
              imageUrl.protocol === "https:" ||
              imageUrl.protocol === "http:"
            ) {
              image.src = imageUrl.href;
            }
          } catch {
            // Ignore invalid image URLs entered in the admin panel.
          }
        }
        card.append(image);

        const body = document.createElement("div");
        body.className = "product-body";
        const name = document.createElement("h3");
        name.textContent = product.name;
        body.append(name);

        const prices = document.createElement("div");
        prices.className = "price-row";
        const currentPrice = document.createElement("span");
        currentPrice.className = "current-price";
        currentPrice.textContent =
          product.price == null
            ? "السعر حسب المتجر"
            : `${new Intl.NumberFormat("ar-EG").format(product.price)} ج`;
        prices.append(currentPrice);
        if (product.oldPrice != null) {
          const oldPrice = document.createElement("span");
          oldPrice.className = "old-price";
          oldPrice.textContent = `${new Intl.NumberFormat("ar-EG").format(product.oldPrice)} ج`;
          prices.append(oldPrice);
        }
        body.append(prices);

        const storeRow = document.createElement("div");
        storeRow.className = "store-row";
        const store = document.createElement("span");
        store.textContent =
          product.store?.name || product.category?.name || "ZAR ZOR";
        const link = document.createElement("a");
        link.className = "btn btn-link";
        link.textContent = "شوف المنتج";
        link.href = "product-details.html";
        if (product.affiliateUrl) {
          try {
            const affiliateUrl = new URL(product.affiliateUrl);
            if (
              affiliateUrl.protocol === "https:" ||
              affiliateUrl.protocol === "http:"
            ) {
              link.href = affiliateUrl.href;
              link.target = "_blank";
              link.rel = "noopener noreferrer";
            }
          } catch {
            // Keep the local product-details link for invalid URLs.
          }
        }
        storeRow.append(store, link);
        body.append(storeRow);
        card.append(body);
        liveProductsGrid.append(card);
      });
    } catch {
      // Keep the existing static catalog visible if the API is unavailable.
    }
  };

  void addLiveProductCards();

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
      if (target && !event.currentTarget.hasAttribute("target")) {
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
