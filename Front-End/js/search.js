document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("global-search");
  if (!searchInput) return;

  const cards = Array.from(document.querySelectorAll(".product-card"));

  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const visible = !query || text.includes(query);
      card.style.display = visible ? "" : "none";
    });
  });
});
