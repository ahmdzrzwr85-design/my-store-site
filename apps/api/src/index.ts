import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createHmac, timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config({
  path: fileURLToPath(new URL("../../../.env", import.meta.url)),
});

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 4000);
const sessionCookie = "zz_admin_session";

const signSession = () => {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is required");
  const payload = Buffer.from(
    JSON.stringify({ isAdmin: true, exp: Date.now() + 8 * 60 * 60 * 1000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
};

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookie}=`))
    ?.slice(sessionCookie.length + 1);
  const [payload, signature] = token?.split(".") ?? [];
  const secret = process.env.ADMIN_PASSWORD;

  if (!payload || !signature || !secret) {
    res.status(401).json({ error: "يلزم تسجيل دخول مدير" });
    return;
  }

  const expected = createHmac("sha256", secret).update(payload).digest();
  let supplied: Buffer;
  try {
    supplied = Buffer.from(signature, "base64url");
  } catch {
    res.status(401).json({ error: "جلسة غير صالحة" });
    return;
  }
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    res.status(401).json({ error: "جلسة غير صالحة" });
    return;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (session.isAdmin !== true || session.exp <= Date.now()) {
      res.status(401).json({ error: "انتهت صلاحية الجلسة" });
      return;
    }
  } catch {
    res.status(401).json({ error: "جلسة غير صالحة" });
    return;
  }
  next();
};

const slugFromText = (value: string, fallback: string) => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `${fallback}-${Date.now()}`;
};

app.use(
  cors({
    origin: process.env.WEB_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "zar-zor-api" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body as Record<string, unknown>;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    res.status(503).json({ error: "بيانات دخول المدير غير مضبوطة في .env" });
    return;
  }
  const emailMatches =
    typeof email === "string" &&
    Buffer.byteLength(email.trim()) === Buffer.byteLength(adminEmail) &&
    timingSafeEqual(Buffer.from(email.trim()), Buffer.from(adminEmail));
  const passwordMatches =
    typeof password === "string" &&
    Buffer.byteLength(password) === Buffer.byteLength(adminPassword) &&
    timingSafeEqual(Buffer.from(password), Buffer.from(adminPassword));
  if (!emailMatches || !passwordMatches) {
    res.status(401).json({ error: "بيانات خاطئة" });
    return;
  }

  const token = signSession();
  res.cookie(sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60 * 1000,
  });
  res.json({ ok: true });
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie(sessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  res.json({ ok: true });
});

app.get("/api/admin/stores", requireAdmin, async (_req, res) => {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ stores });
  } catch (error) {
    console.error("Failed to load stores", error);
    res.status(500).json({ error: "تعذر تحميل المتاجر" });
  }
});

app.get("/api/products", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isPublished: true },
      include: { category: true, store: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ products });
  } catch (error) {
    console.error("Failed to load products", error);
    res.status(500).json({ error: "تعذر تحميل المنتجات" });
  }
});

app.post("/api/products", requireAdmin, async (req, res) => {
  const {
    name,
    description,
    shortDescription,
    price,
    oldPrice,
    imageUrl,
    affiliateUrl,
    categoryName,
    storeName,
    isPublished,
    isFeatured,
    isDeal,
  } = req.body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2) {
    res.status(400).json({ error: "اسم المنتج مطلوب" });
    return;
  }

  const parsedPrice =
    price === "" || price === undefined ? null : Number(price);
  const parsedOldPrice =
    oldPrice === "" || oldPrice === undefined ? null : Number(oldPrice);

  if (parsedPrice !== null && !Number.isFinite(parsedPrice)) {
    res.status(400).json({ error: "السعر غير صحيح" });
    return;
  }

  const baseSlug = slugFromText(name, "product");
  const slug = `${baseSlug}-${Date.now()}`;

  try {
    const category =
      typeof categoryName === "string" && categoryName.trim()
        ? await prisma.category.upsert({
            where: { slug: slugFromText(categoryName, "category") },
            update: { name: categoryName.trim() },
            create: {
              name: categoryName.trim(),
              slug: slugFromText(categoryName, "category"),
            },
          })
        : null;
    const store =
      typeof storeName === "string" && storeName.trim()
        ? await prisma.store.upsert({
            where: { slug: slugFromText(storeName, "store") },
            update: { name: storeName.trim() },
            create: {
              name: storeName.trim(),
              slug: slugFromText(storeName, "store"),
            },
          })
        : null;

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: typeof description === "string" ? description : null,
        shortDescription:
          typeof shortDescription === "string" ? shortDescription : null,
        price: parsedPrice,
        oldPrice: parsedOldPrice,
        imageUrl: typeof imageUrl === "string" ? imageUrl : null,
        affiliateUrl: typeof affiliateUrl === "string" ? affiliateUrl : null,
        categoryId: category?.id ?? null,
        storeId: store?.id ?? null,
        isPublished: Boolean(isPublished),
        isFeatured: Boolean(isFeatured),
        isDeal: Boolean(isDeal),
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error("Failed to create product", error);
    res.status(500).json({ error: "تعذر حفظ المنتج في قاعدة البيانات" });
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
