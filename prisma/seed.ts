import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: "featured" },
    update: {},
    create: {
      name: "Featured",
      slug: "featured",
      description: "Seeded local category",
    },
  });
  const categoryNames = [
    ["الموبايلات", "mobiles"],
    ["اللابتوبات والكمبيوتر", "laptops"],
    ["الشاشات", "monitors"],
    ["السماعات", "headphones"],
    ["إكسسوارات الكمبيوتر", "computer-accessories"],
    ["الشواحن والطاقة", "chargers"],
    ["الكاميرات والتصوير", "cameras"],
    ["Gaming", "gaming"],
    ["التلفزيونات والترفيه", "tv-entertainment"],
    ["الساعات والأجهزة الذكية", "smart-devices"],
    ["الشبكات والإنترنت", "networking"],
    ["المنزل الذكي", "smart-home"],
  ] as const;
  for (const [name, slug] of categoryNames)
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: {
        name,
        slug,
        description: `اختيارات ${name} المناسبة للسوق المصري.`,
      },
    });
  const store = await prisma.store.upsert({
    where: { slug: "amazon-eg" },
    update: {},
    create: {
      name: "Amazon.eg",
      slug: "amazon-eg",
      website: "https://www.amazon.eg",
      affiliateUrl: "https://amzn.to/4cwMTl6",
      defaultDisclosure:
        "قد يحصل ZAR ZOR على عمولة من مشترياتك دون تكلفة إضافية.",
    },
  });
  await prisma.product.upsert({
    where: { slug: "starter-product" },
    update: {},
    create: {
      name: "Starter Product",
      slug: "starter-product",
      price: 29.99,
      affiliateUrl: "https://amzn.to/4cwMTl6",
      shortDescription: "بيانات تجريبية محلية، وليست سعرًا حقيقيًا.",
      isPublished: true,
      categoryId: category.id,
      storeId: store.id,
    },
  });
  await prisma.article.upsert({
    where: { slug: "how-to-choose-electronics" },
    update: {},
    create: {
      title: "كيف تختار إلكترونيات مناسبة؟",
      slug: "how-to-choose-electronics",
      excerpt: "دليل تجريبي لإضافة محتوى مفيد للسوق المصري.",
      content:
        "ابدأ بتحديد احتياجاتك وميزانيتك، ثم قارن المواصفات الأساسية قبل النظر إلى السعر فقط.",
      author: "فريق ZAR ZOR",
      isPublished: true,
      publishedAt: new Date(),
    },
  });
  await prisma.siteSetting.upsert({
    where: { key: "site_name" },
    update: {},
    create: { key: "site_name", value: "Local Catalog" },
  });
  await prisma.auditLog.create({
    data: {
      action: "seed",
      entity: "system",
      details: "Seeded local catalog",
    },
  });
  console.log("Local catalog seed complete.");
}

main().finally(() => prisma.$disconnect());
