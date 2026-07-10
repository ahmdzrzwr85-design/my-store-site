const express = require("express");
const fs = require("fs");
const path = require("path");

require("dotenv").config();
const db = require("./db");

const app = express();
const port = process.env.PORT || 3000;
const ordersFile = path.join(__dirname, "orders.json");
const productsFile = path.join(__dirname, "products.json");

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
  try {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to save orders:", error);
  }
}

function loadProducts() {
  try {
    if (!fs.existsSync(productsFile)) {
      return [];
    }
    const data = fs.readFileSync(productsFile, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Failed to load products:", error);
    return [];
  }
}

function saveProducts(products) {
  try {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to save products:", error);
  }
}

function adminAuth(req, res, next) {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const provided = req.headers["x-admin-password"];
  if (!provided || provided !== adminPassword) {
    return res.status(401).json({ message: "غير مفوّض" });
  }
  next();
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

app.get("/api/orders", adminAuth, (req, res) => {
  const orders = loadOrders();
  res.json(orders);
});

app.put("/api/orders/:id/status", adminAuth, (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "حالة الطلب مطلوبة" });

  const orders = loadOrders();
  const order = orders.find((item) => item.id === id);
  if (!order) return res.status(404).json({ message: "الطلب غير موجود" });

  order.status = status;
  saveOrders(orders);
  res.json(order);
});

app.get("/api/customers", adminAuth, (req, res) => {
  const orders = loadOrders();
  const customers = [];
  const seen = new Set();
  for (const order of orders) {
    const key = `${order.customer.name}||${order.customer.phone}`;
    if (!seen.has(key)) {
      seen.add(key);
      customers.push({
        name: order.customer.name,
        phone: order.customer.phone,
        address: order.customer.address,
        lastOrder: order.date,
      });
    }
  }
  res.json(customers);
});

app.get("/api/products", (req, res) => {
  const products = loadProducts();
  res.json(products);
});

app.post("/api/products", adminAuth, (req, res) => {
  const product = req.body;
  if (!product || !product.name || !product.price || !product.category) {
    return res.status(400).json({ message: "بيانات المنتج غير مكتملة" });
  }

  const products = loadProducts();
  const nextId = products.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const newProduct = { ...product, id: nextId };
  products.push(newProduct);
  saveProducts(products);

  res.status(201).json(newProduct);
});

app.put("/api/products/:id", adminAuth, (req, res) => {
  const id = Number(req.params.id);
  const updates = req.body;
  const products = loadProducts();
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "المنتج غير موجود" });
  }
  products[index] = { ...products[index], ...updates, id };
  saveProducts(products);
  res.json(products[index]);
});

app.delete("/api/products/:id", adminAuth, (req, res) => {
  const id = Number(req.params.id);
  let products = loadProducts();
  products = products.filter((item) => item.id !== id);
  saveProducts(products);
  res.json({ message: "تم حذف المنتج" });
});

// Run DB migrations on startup when DATABASE_URL is set
if (process.env.DATABASE_URL) {
  try {
    const mig = fs.readFileSync(
      path.join(__dirname, "db", "migrations", "init.sql"),
      "utf8",
    );
    db.pool
      .query(mig)
      .then(() => {
        console.log("Migrations applied");
      })
      .catch((err) => {
        console.error("Migration error:", err.message || err);
      });
  } catch (err) {
    console.error("Could not read migration file:", err.message || err);
  }
}

// Endpoint to store encrypted bank account information
// Expects: { ownerName, bankName, iban }
app.post("/api/bank-account", async (req, res) => {
  if (!process.env.DATABASE_URL)
    return res.status(503).json({ message: "DATABASE_URL not configured" });
  const { ownerName, bankName, iban } = req.body || {};
  if (!ownerName || !iban)
    return res.status(400).json({ message: "ownerName and iban required" });
  try {
    const encrypted = db.encrypt(iban);
    const onlyDigits = String(iban).replace(/\D/g, "");
    const last4 = onlyDigits.slice(-4);
    const result = await db.query(
      "INSERT INTO bank_accounts (owner_name, bank_name, iban_encrypted, last4) VALUES ($1,$2,$3,$4) RETURNING id, created_at",
      [ownerName, bankName || null, encrypted, last4],
    );
    const row = result.rows[0];
    res.status(201).json({ id: row.id, created_at: row.created_at });
  } catch (err) {
    console.error("/api/bank-account error", err);
    res.status(500).json({ message: "فشل حفظ حساب البنك" });
  }
});

// Get bank account metadata (no raw IBAN). To retrieve full IBAN set ALLOW_DECRYPT=true in env (admin only).
app.get("/api/bank-account/:id", async (req, res) => {
  if (!process.env.DATABASE_URL)
    return res.status(503).json({ message: "DATABASE_URL not configured" });
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "invalid id" });
  try {
    const result = await db.query(
      "SELECT id, owner_name, bank_name, last4, iban_encrypted, created_at FROM bank_accounts WHERE id=$1",
      [id],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "not found" });
    const r = result.rows[0];
    const out = {
      id: r.id,
      ownerName: r.owner_name,
      bankName: r.bank_name,
      last4: r.last4,
      created_at: r.created_at,
    };
    if (process.env.ALLOW_DECRYPT === "true") {
      try {
        out.iban = db.decrypt(r.iban_encrypted);
      } catch (e) {
        out.iban_error = "decrypt_failed";
      }
    }
    res.json(out);
  } catch (err) {
    console.error("/api/bank-account/:id", err);
    res.status(500).json({ message: "خطأ" });
  }
});

// Create a payout (simulate Visa/bank transfer)
// Expects: { bankAccountId, amountCents, currency }
app.post("/api/payout", async (req, res) => {
  if (!process.env.DATABASE_URL)
    return res.status(503).json({ message: "DATABASE_URL not configured" });
  const { bankAccountId, amountCents, currency } = req.body || {};
  if (!bankAccountId || !amountCents)
    return res
      .status(400)
      .json({ message: "bankAccountId and amountCents required" });
  try {
    // record payout
    const result = await db.query(
      "INSERT INTO payouts (bank_account_id, amount_cents, currency, status) VALUES ($1,$2,$3,$4) RETURNING id, created_at",
      [bankAccountId, amountCents, currency || "USD", "completed"],
    );
    const r = result.rows[0];

    // also append to local payouts.json for simple audit (keeps previous JSON-based flow working)
    const payoutsFile = path.join(__dirname, "payouts.json");
    const record = {
      id: r.id,
      bankAccountId,
      amountCents,
      currency: currency || "USD",
      status: "completed",
      created_at: r.created_at,
    };
    try {
      let arr = [];
      if (fs.existsSync(payoutsFile))
        arr = JSON.parse(fs.readFileSync(payoutsFile, "utf8") || "[]");
      arr.push(record);
      fs.writeFileSync(payoutsFile, JSON.stringify(arr, null, 2), "utf8");
    } catch (e) {
      console.error("Failed to write payouts.json", e.message || e);
    }

    res
      .status(201)
      .json({ payoutId: r.id, message: "Payout recorded (simulated)" });
  } catch (err) {
    console.error("/api/payout error", err);
    res.status(500).json({ message: "فشل تسجيل السحب" });
  }
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
