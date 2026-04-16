import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createDataStore } from "../server/dataStore.js";

function createTempDataFile(name) {
  const filePath = path.join(os.tmpdir(), `${name}-${Date.now()}.json`);
  try {
    fs.unlinkSync(filePath);
  } catch {}
  return filePath;
}

test("data store returns seeded public products", async () => {
  const store = createDataStore({ filePath: createTempDataFile("lazy-bloom-products") });
  const products = await store.listPublicProducts();

  assert.ok(Array.isArray(products));
  assert.ok(products.length >= 5);
  assert.equal(products.every((item) => item.status === "active"), true);
});

test("data store creates a product visible in admin list", async () => {
  const store = createDataStore({ filePath: createTempDataFile("lazy-bloom-create-product") });
  const payload = {
    name: "測試白玫瑰花束",
    subtitle: "供測試用",
    category: "bouquet",
    price: 1299,
    compareAt: 1499,
    stock: 12,
    status: "active",
    featured: false,
    flowerTypes: "白玫瑰, 滿天星",
    occasionTags: "birthday, anniversary",
    moodTags: "柔和, 穩妥",
    palette: "#ffffff, #f3f1f1, #d1c8c8",
    description: "測試商品",
    whyItWorks: "穩妥",
    whoWillLoveIt: "喜歡白色系的人",
    reminder: "提前一天",
    leadTimeDays: 1
  };

  const product = await store.createProduct(payload);
  assert.equal(product.name, payload.name);

  const products = await store.listAdminProducts();
  assert.ok(products.some((item) => item.name === payload.name));
});

test("data store creates order and reduces stock", async () => {
  const store = createDataStore({ filePath: createTempDataFile("lazy-bloom-create-order") });
  const product = (await store.listPublicProducts())[0];

  const order = await store.createOrder({
    items: [{ productId: product.id, quantity: 1 }],
    customer: {
      name: "Tester",
      email: "tester@example.com",
      phone: "0912000111"
    },
    shipping: {
      recipientName: "Receiver",
      phone: "0922000111",
      city: "台北市",
      district: "中山區",
      addressLine1: "南京東路 1 號",
      addressLine2: "",
      deliveryDate: "2026-04-12",
      deliverySlot: "14:00-18:00",
      note: ""
    },
    addOns: {
      giftWrap: true,
      handwriteCard: false,
      cardMessage: "",
      deliveryDecoration: "灰紙"
    },
    paymentMethod: "credit-card"
  });

  assert.equal(order.items[0].productId, product.id);

  const updated = (await store.listAdminProducts()).find((item) => item.id === product.id);
  assert.equal(updated.stock, product.stock - 1);
});
