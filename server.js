const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const ordersFile = path.join(__dirname, "orders.json");

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function loadOrders() {
  try {
    if (!fs.existsSync(ordersFile)) {
      return [];
    }
    const data = fs.readFileSync(ordersFile, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Failed to load orders:", error);
    return [];
  }
}

function saveOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");
}

app.post("/api/orders", (req, res) => {
  const order = req.body;
  if (!order || !Array.isArray(order.items) || order.items.length === 0) {
    return res.status(400).json({ message: "طلب غير صالح" });
  }

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  res.status(201).json({ orderId: order.id, message: "تم حفظ الطلب" });
});

app.get("/api/orders", (req, res) => {
  const orders = loadOrders();
  res.json(orders);
});

// Endpoint to simulate card payment processing (DO NOT store raw card numbers)
// Expects: { order: {...}, card: { type: 'visa', last4: '4242', token: 'tok_xxx' } }
app.post("/api/card-pay", (req, res) => {
  const { order, card } = req.body || {};
  if (!order || !Array.isArray(order.items) || order.items.length === 0) {
    return res.status(400).json({ message: "طلب غير صالح" });
  }
  if (!card || !card.last4) {
    return res.status(400).json({ message: "معلومات البطاقة غير كافية" });
  }

  // Mask card info and attach to order (do NOT store full PAN/CVV)
  order.payment = {
    method: "card",
    card: {
      type: card.type || "card",
      last4: String(card.last4).slice(-4),
    },
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  return res
    .status(201)
    .json({ orderId: order.id, message: "تمت معالجة الدفع وحفظ الطلب" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
