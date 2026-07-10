const products = [
  {
    id: 1,
    name: "تيشيرت قطن أنيق",
    description: "تيشيرت مريح يصلح لكل الأيام، خامة عالية الجودة.",
    price: 260,
    weight: 0.25,
    image:
      "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    name: "فستان صيفي",
    description: "فستان خفيف مثالي للخروج والمناسبات الصيفية.",
    price: 420,
    weight: 0.45,
    image:
      "https://images.pexels.com/photos/794062/pexels-photo-794062.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    name: "شنطة ظهر مميزة",
    description: "شنطة ظهر عملية وحجمها مناسب للدراسة والسفر الخفيف.",
    price: 360,
    weight: 0.8,
    image:
      "https://images.pexels.com/photos/4046713/pexels-photo-4046713.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 4,
    name: "جاكيت شبابي",
    description: "جاكيت أنيق ومقاوم للرياح مع تصميم عصري.",
    price: 550,
    weight: 1.1,
    image:
      "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 5,
    name: "شنطة ظهر رياضية",
    description: "شنطة ظهر خفيفة مع جيوب متعددة للحفاظ على الأغراض.",
    price: 320,
    weight: 0.6,
    image:
      "https://images.pexels.com/photos/2010427/pexels-photo-2010427.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 6,
    name: "قميص كاجوال قطن",
    description: "قميص أنيق يمكن ارتداؤه يومياً مع بنطلون جينز أو شورت.",
    price: 280,
    weight: 0.22,
    image:
      "https://images.pexels.com/photos/1002645/pexels-photo-1002645.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 7,
    name: "فستان سهرة بسيط",
    description: "فستان عصري للمناسبات الخاصة بخامة ناعمة ومريحة.",
    price: 590,
    weight: 0.55,
    image:
      "https://images.pexels.com/photos/1866088/pexels-photo-1866088.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 8,
    name: "سترة خفيفة للربيع",
    description: "سترة متعددة الاستخدامات تناسب الطقس الدافئ والأشهر المعتدلة.",
    price: 470,
    weight: 0.7,
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 9,
    name: "شنطة يد كلاسيكية",
    description: "شنطة يد أنيقة مناسبة للخروج والعمل بتصميم عملي وجميل.",
    price: 430,
    weight: 0.4,
    image:
      "https://images.pexels.com/photos/1370554/pexels-photo-1370554.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 10,
    name: "طقم تيشيرت وشورت",
    description: "طقم رياضي مريح مناسب للنشاطات اليومية والرياضة الخفيفة.",
    price: 330,
    weight: 0.5,
    image:
      "https://images.pexels.com/photos/1002632/pexels-photo-1002632.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 11,
    name: "حقيبة كتف أنيقة",
    description: "حقيبة كتف صغيرة مثالية للمناسبات والسفر القصير.",
    price: 380,
    weight: 0.35,
    image:
      "https://images.pexels.com/photos/449746/pexels-photo-449746.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 12,
    name: "بلوزة نسائية مطرزة",
    description: "بلوزة مميزة بتطريز خفيف يضفي لمسة أنثوية جذابة.",
    price: 290,
    weight: 0.2,
    image:
      "https://images.pexels.com/photos/1709025/pexels-photo-1709025.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 13,
    name: "جاكيت جينز عصري",
    description: "جاكيت جينز يضفي طابعاً شبابياً على أي إطلالة.",
    price: 520,
    weight: 1.2,
    image:
      "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 14,
    name: "شنطة سفر عملية",
    description: "شنطة سفر واسعة بخامات متينة وتجهيزات داخلية منظمة.",
    price: 610,
    weight: 1.8,
    image:
      "https://images.pexels.com/photos/374737/pexels-photo-374737.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 15,
    name: "فستان ميدي أنيق",
    description: "فستان ميدي أنيق مناسب للخروج والعمل والمناسبات البسيطة.",
    weight: 0.6,
    price: 450,
    image:
      "https://images.pexels.com/photos/4041688/pexels-photo-4041688.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

// Currency/exchange settings
const EGP_TO_USD = 0.032; // 1 EGP -> USD (configurable)
const SHIPPING_USD_PER_KG = 2.5; // default shipping rate per kg in USD

// load cart from localStorage so multiple pages share state
const cart = JSON.parse(localStorage.getItem("ah_cart") || "[]");
let productGrid;
let cartCount;
let cartItems;
let subtotalText;
let totalText;
let paymentInfo;
let cartModal;
const apiUrl = "/api/orders";

function persistCart() {
  localStorage.setItem("ah_cart", JSON.stringify(cart));
}

function getCartTotals() {
  const subtotalEGP = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const subtotalUSD = subtotalEGP * EGP_TO_USD;
  const totalWeight = cart.reduce(
    (sum, item) => sum + (item.weight || 0) * item.quantity,
    0,
  );
  const shippingUSD = +(totalWeight * SHIPPING_USD_PER_KG).toFixed(2);
  const totalUSD = +(subtotalUSD + shippingUSD).toFixed(2);
  return {
    subtotalEGP,
    subtotalUSD: +subtotalUSD.toFixed(2),
    totalWeight: +totalWeight.toFixed(2),
    shippingUSD,
    totalUSD,
  };
}

function initPage() {
  productGrid = document.getElementById("productGrid");
  cartCount = document.getElementById("cartCount");
  cartItems = document.getElementById("cartItems");
  subtotalText = document.getElementById("subtotalText");
  totalText = document.getElementById("totalText");
  shippingText = document.getElementById("shippingText");
  paymentInfo = document.getElementById("paymentInfo");
  cartModal = document.getElementById("cartModal");

  renderProducts();
  updateCartDisplay();
  updatePaymentInfoText();

  document.querySelectorAll(".payment-option").forEach(function (option) {
    option.addEventListener("click", function () {
      var options = document.querySelectorAll(".payment-option");
      for (var i = 0; i < options.length; i++) {
        options[i].classList.remove("active");
      }
      option.classList.add("active");
      var input = option.querySelector("input");
      if (input) {
        input.checked = true;
      }
      updatePaymentInfoText();
    });
  });

  if (cartModal) {
    cartModal.addEventListener("click", function (event) {
      if (event.target === cartModal) {
        closeCart();
      }
    });
  }
}

function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-card-body">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price-row">
              <span class="product-price">${product.price.toLocaleString()} ج (${(product.price * EGP_TO_USD).toFixed(2)}$)</span>
              <button onclick="addToCart(${product.id})">أضف إلى السلة</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function addToCart(productId) {
  const item = products.find((product) => product.id === productId);
  if (!item) return;

  const existing = cart.find((product) => product.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  persistCart();
  updateCartDisplay();
  openCart();
}

function updateCartDisplay() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalQuantity;
  if (cartItems)
    cartItems.innerHTML = cart.length
      ? cart
          .map(
            (item) => `
            <div class="cart-item">
              <img src="${item.image}" alt="${item.name}" />
              <div class="item-details">
                <h4>${item.name}</h4>
                <span>${item.price.toLocaleString()} ج لكل قطعة</span>
                <span>الوزن: ${(item.weight || 0).toFixed(2)} كجم</span>
                <span>الإجمالي: ${(item.price * item.quantity).toLocaleString()} ج (~$${(item.price * EGP_TO_USD * item.quantity).toFixed(2)})</span>
              </div>
              <div class="quantity-control">
                <button onclick="changeQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
              </div>
            </div>
          `,
          )
          .join("")
      : "<p>السلة فارغة، أضف منتجات للطلب.</p>";
  const totals = getCartTotals();
  if (subtotalText)
    subtotalText.textContent = `${totals.subtotalUSD.toFixed(2)} $ (≈ ${totals.subtotalEGP.toLocaleString()} ج)`;
  if (shippingText)
    shippingText.textContent = `${totals.shippingUSD.toFixed(2)} $`;
  if (totalText) totalText.textContent = `${totals.totalUSD.toFixed(2)} $`;
  persistCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find((product) => product.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    const index = cart.findIndex((product) => product.id === productId);
    cart.splice(index, 1);
  }
  persistCart();
  updateCartDisplay();
}

function openCart() {
  // if modal exists (on index page) show it, otherwise navigate to cart page
  if (cartModal) {
    cartModal.classList.add("active");
    cartModal.setAttribute("aria-hidden", "false");
    if (!cart.length && paymentInfo) {
      paymentInfo.innerHTML = "<p>السلة فارغة، اختر منتجات لإكمال الطلب.</p>";
    }
  } else {
    window.location = "cart.html";
  }
}

function closeCart() {
  if (!cartModal) return;
  cartModal.classList.remove("active");
  cartModal.setAttribute("aria-hidden", "true");
}

function getCartTotal() {
  const t = getCartTotals();
  return t.totalUSD;
}

function getCustomerInfo() {
  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");
  const addressInput = document.getElementById("customerAddress");

  return {
    name: nameInput && nameInput.value ? nameInput.value.trim() : "",
    phone: phoneInput && phoneInput.value ? phoneInput.value.trim() : "",
    address:
      addressInput && addressInput.value ? addressInput.value.trim() : "",
  };
}

function validateCustomerInfo(customer) {
  return customer.name && customer.phone && customer.address;
}

function saveOrderLocally(order) {
  const savedOrders = JSON.parse(localStorage.getItem("ah_orders") || "[]");
  savedOrders.push(order);
  localStorage.setItem("ah_orders", JSON.stringify(savedOrders));
}

async function sendOrderToServer(order) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("فشل حفظ الطلب على الخادم");
  }

  return response.json();
}

async function persistOrder(order) {
  try {
    if (window.location.protocol === "file:") {
      throw new Error("file-protocol");
    }

    const result = await sendOrderToServer(order);
    return { source: "server", orderId: result.orderId };
  } catch (error) {
    saveOrderLocally(order);
    return { source: "local", orderId: `LOCAL-${Date.now()}` };
  }
}

async function checkout() {
  if (!cart.length) {
    alert("السلة فارغة، يرجى إضافة منتجات أولاً.");
    return;
  }

  const customer = getCustomerInfo();
  if (!validateCustomerInfo(customer)) {
    alert("يرجى إدخال الاسم ورقم الهاتف والعنوان لإكمال الطلب.");
    return;
  }

  const paymentElement = document.querySelector(
    'input[name="payment"]:checked',
  );
  const paymentMethod = paymentElement ? paymentElement.value : "cod";
  const order = {
    id: `ORD-${Date.now()}`,
    customer,
    items: cart.map(({ id, name, price, image, quantity }) => ({
      id,
      name,
      price,
      image,
      quantity,
    })),
    paymentMethod,
    // include totals in both currencies and weight
    totals: getCartTotals(),
    total: getCartTotals().totalUSD,
    date: new Date().toISOString(),
  };

  // If PayPal selected, create PayPal order on server and redirect user
  // If card selected, save pending order and redirect to card payment page
  if (paymentMethod === "card") {
    try {
      localStorage.setItem("ah_pending_order", JSON.stringify(order));
      window.location.href = "card-payment.html";
      return;
    } catch (err) {
      alert("فشل توجيه لصفحة الدفع بالبطاقة: " + err.message);
      return;
    }
  }

  const result = await persistOrder(order);
  const isServer = result.source === "server";
  if (paymentInfo) {
    paymentInfo.innerHTML = isServer
      ? `<strong>تم حفظ الطلب رقم ${result.orderId} بنجاح.</strong> سيتم التواصل معك قريباً.`
      : `<strong>تم حفظ الطلب محلياً.</strong> لتشغيل السجل كقاعدة بيانات حقيقية، افتح الموقع عبر خادم Node.js.`;
  }

  alert("تم إنشاء الطلب بنجاح.");
  cart.length = 0;
  persistCart();
  updateCartDisplay();
}

function updatePaymentInfoText() {
  const paymentElement = document.querySelector(
    'input[name="payment"]:checked',
  );
  const paymentInfoText = document.getElementById("paymentInfo");

  if (!paymentInfoText || !paymentElement) return;
  if (paymentElement.value === "card") {
    paymentInfoText.innerHTML =
      "<p>للدفع بالبطاقة اضغط متابعة الدفع، ستنتقل إلى صفحة آمنة لإدخال بيانات البطاقة.</p>";
  } else {
    paymentInfoText.innerHTML =
      "<p>سيتم الدفع عند استلام المنتج من عنوانك.</p>";
  }
}

document.addEventListener("DOMContentLoaded", initPage);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeCart();
  }
});
