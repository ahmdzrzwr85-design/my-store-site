const express = require("express");
const fs = require("fs");
const path = require("path");

require("dotenv").config();
const db = require("./db");

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

async function saveOrderToDatabase(order) {
  await db.query(
    `INSERT INTO orders (id, customer, items, totals, payment_method, payment, date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      order.id,
      order.customer,
      order.items,
      order.totals,
      order.paymentMethod || null,
      order.payment || null,
      order.date,
    ],
  );
}

async function saveOrder(order) {
  if (process.env.DATABASE_URL) {
    try {
      await saveOrderToDatabase(order);
      return;
    } catch (err) {
      console.error("فشل حفظ الطلب في قاعدة البيانات، سيتم الرجوع إلى orders.json:", err.message || err);
    }
  }

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);
}

app.post("/api/orders", async (req, res) => {
  const order = req.body;
  if (!order || !Array.isArray(order.items) || order.items.length === 0) {
    return res.status(400).json({ message: "طلب غير صالح" });
  }

  try {
    await saveOrder(order);
    res.status(201).json({ orderId: order.id, message: "تم حفظ الطلب" });
  } catch (err) {
    res.status(500).json({ message: "فشل حفظ الطلب" });
  }
});

app.get("/api/orders", async (req, res) => {
  if (process.env.DATABASE_URL) {
    try {
      const result = await db.query(
        `SELECT id, customer, items, totals, payment_method AS "paymentMethod", payment, date
         FROM orders
         ORDER BY date DESC`,
      );
      return res.json(result.rows);
    } catch (err) {
      console.error("فشل جلب الطلبات من قاعدة البيانات:", err.message || err);
    }
  }

  const orders = loadOrders();
  res.json(orders);
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

  try {
    await saveOrder(order);
    return res
      .status(201)
      .json({ orderId: order.id, message: "تمت معالجة الدفع وحفظ الطلب" });
  } catch (err) {
    return res.status(500).json({ message: "فشل معالجة الدفع" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
