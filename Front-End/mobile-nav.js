(() => {
  const header = document.querySelector(".header-inner");
  const navigation = header?.querySelector(".main-nav");
  if (!header || !navigation) return;

  const menu = document.createElement("details");
  menu.className = "mobile-menu";

  const toggle = document.createElement("summary");
  toggle.setAttribute("aria-label", "فتح قائمة التنقل");
  toggle.setAttribute("title", "القائمة");
  toggle.textContent = "☰";

  const links = document.createElement("div");
  links.className = "mobile-menu-links";

  [
    ["الرئيسية", "index.html"],
    ["العروض", "offers.html"],
    ["الأكثر مبيعًا", "products.html"],
  ].forEach(([label, href]) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (navigation.querySelector(`a[href="${href}"].active`)) {
      link.classList.add("active");
    }
    links.append(link);
  });

  menu.append(toggle, links);
  navigation.insertAdjacentElement("afterend", menu);
})();
