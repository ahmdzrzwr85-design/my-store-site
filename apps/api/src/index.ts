import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 4000);

const slugFromText = (value: string, fallback: string) => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `${fallback}-${Date.now()}`;
};

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "zar-zor-api" });
});

app.get("/api/products", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true, store: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ products });
  } catch (error) {
    console.error("Failed to load products", error);
    res.status(500).json({ error: "تعذر تحميل المنتجات" });
  }
});

app.post("/api/products", async (req, res) => {
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
