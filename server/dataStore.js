import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import { defaultStoreData } from "./seedData.js";
import { getDataFilePath } from "./storagePaths.js";

const DEFAULT_FILE_PATH = getDataFilePath();

const budgetRanges = {
  under_1500: [0, 1500],
  from_1500_to_2500: [1500, 2500],
  from_2500_to_4000: [2500, 4000],
  above_4000: [4000, Number.POSITIVE_INFINITY]
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return String(value || "")
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function asColorArray(value, fallback = []) {
  const colors = asArray(value);
  return colors.length ? colors : fallback;
}

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function sortByNewest(items, key = "updatedAt") {
  return [...items].sort(
    (left, right) => new Date(right[key] || 0).getTime() - new Date(left[key] || 0).getTime()
  );
}

function formatOrderNumber(sequence, now = new Date()) {
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, "0");
  const d = `${now.getDate()}`.padStart(2, "0");
  return `LB-${y}${m}${d}-${String(sequence).padStart(4, "0")}`;
}

function parseBudgetTier(tier) {
  return budgetRanges[tier] || null;
}

function normalizeImportantDates(value) {
  const rows = Array.isArray(value) ? value : [];
  return rows
    .map((row) => ({
      label: String(row.label || "").trim(),
      date: String(row.date || "").trim()
    }))
    .filter((row) => row.label && row.date);
}

function normalizeProductInput(input, existingProduct) {
  const now = new Date().toISOString();
  const name = String(input.name || existingProduct?.name || "").trim();
  const slugBase = String(input.slug || name || existingProduct?.slug || "").trim();

  return {
    id: existingProduct?.id || `prod_${nanoid(10)}`,
    slug: slugify(slugBase),
    name,
    subtitle: String(input.subtitle || existingProduct?.subtitle || "").trim(),
    category: String(input.category || existingProduct?.category || "bouquet").trim(),
    price: asNumber(input.price, existingProduct?.price || 0),
    compareAt: asNumber(input.compareAt, existingProduct?.compareAt || 0),
    stock: asNumber(input.stock, existingProduct?.stock || 0),
    status: String(input.status || existingProduct?.status || "active").trim(),
    featured: Boolean(input.featured ?? existingProduct?.featured ?? false),
    rating: existingProduct?.rating || 4.8,
    reviewCount: existingProduct?.reviewCount || 0,
    imageUrl: String(input.imageUrl || existingProduct?.imageUrl || "").trim(),
    palette: asColorArray(input.palette, existingProduct?.palette || ["#fbe5eb", "#e5afbf", "#7f4a5a"]),
    flowerTypes: asArray(input.flowerTypes || existingProduct?.flowerTypes || []),
    occasionTags: asArray(input.occasionTags || existingProduct?.occasionTags || []),
    moodTags: asArray(input.moodTags || existingProduct?.moodTags || []),
    description: String(input.description || existingProduct?.description || "").trim(),
    whyItWorks: String(input.whyItWorks || existingProduct?.whyItWorks || "").trim(),
    whoWillLoveIt: String(input.whoWillLoveIt || existingProduct?.whoWillLoveIt || "").trim(),
    reminder: String(input.reminder || existingProduct?.reminder || "").trim(),
    leadTimeDays: asNumber(input.leadTimeDays, existingProduct?.leadTimeDays || 2),
    createdAt: existingProduct?.createdAt || now,
    updatedAt: now
  };
}

function normalizeProfileInput(input, existingProfile) {
  return {
    id: existingProfile?.id || `profile_${nanoid(10)}`,
    name: String(input.name || existingProfile?.name || "").trim(),
    relationship: String(input.relationship || existingProfile?.relationship || "").trim(),
    ageRange: String(input.ageRange || existingProfile?.ageRange || "").trim(),
    stylePreference: String(input.stylePreference || existingProfile?.stylePreference || "").trim(),
    sweetTooth: String(input.sweetTooth || existingProfile?.sweetTooth || "").trim(),
    surprisePreference: String(
      input.surprisePreference || existingProfile?.surprisePreference || ""
    ).trim(),
    preferredColors: asArray(input.preferredColors || existingProfile?.preferredColors || []),
    favoriteFlowers: asArray(input.favoriteFlowers || existingProfile?.favoriteFlowers || []),
    note: String(input.note || existingProfile?.note || "").trim(),
    importantDates: normalizeImportantDates(input.importantDates || existingProfile?.importantDates || []),
    lastGift: String(input.lastGift || existingProfile?.lastGift || "").trim(),
    updatedAt: new Date().toISOString()
  };
}

function applyProductFilters(products, filters = {}, { admin = false } = {}) {
  const keyword = String(filters.q || "").trim().toLowerCase();
  const category = String(filters.category || "").trim();
  const occasion = String(filters.occasion || "").trim();
  const featuredOnly = String(filters.featured || "").trim() === "true";
  const budgetTier = String(filters.budgetTier || "").trim();
  const range = parseBudgetTier(budgetTier);

  return products.filter((product) => {
    if (!admin && product.status !== "active") {
      return false;
    }

    if (category && product.category !== category) {
      return false;
    }

    if (occasion && !product.occasionTags.includes(occasion)) {
      return false;
    }

    if (featuredOnly && !product.featured) {
      return false;
    }

    if (range && (product.price < range[0] || product.price > range[1])) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const haystacks = [
      product.name,
      product.subtitle,
      product.description,
      ...product.flowerTypes,
      ...product.moodTags
    ]
      .join(" ")
      .toLowerCase();

    return haystacks.includes(keyword);
  });
}

export function createDataStore({ filePath = DEFAULT_FILE_PATH } = {}) {
  function ensureFile() {
    ensureDirectory(filePath);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultStoreData, null, 2));
    }
  }

  function readData() {
    ensureFile();
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  }

  function writeData(data) {
    ensureDirectory(filePath);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  function listPublicProducts(filters = {}) {
    const data = readData();
    return sortByNewest(
      applyProductFilters(data.products, filters, { admin: false })
    );
  }

  function listAdminProducts(filters = {}) {
    const data = readData();
    return sortByNewest(
      applyProductFilters(data.products, filters, { admin: true })
    );
  }

  function getProduct(identifier) {
    const data = readData();
    return data.products.find((product) => product.id === identifier || product.slug === identifier) || null;
  }

  function createProduct(input) {
    const data = readData();
    const product = normalizeProductInput(input);

    if (!product.name || !product.slug) {
      throw new Error("商品名稱為必填");
    }

    if (data.products.some((item) => item.slug === product.slug)) {
      throw new Error("商品網址代稱重複，請調整名稱或 slug");
    }

    data.products.unshift(product);
    writeData(data);
    return product;
  }

  function updateProduct(productId, input) {
    const data = readData();
    const index = data.products.findIndex((product) => product.id === productId);

    if (index === -1) {
      throw new Error("找不到指定商品");
    }

    const updated = normalizeProductInput(input, data.products[index]);

    if (
      data.products.some(
        (item) => item.id !== productId && item.slug === updated.slug
      )
    ) {
      throw new Error("商品網址代稱重複，請調整後再儲存");
    }

    data.products[index] = updated;
    writeData(data);
    return updated;
  }

  function listProfiles() {
    const data = readData();
    return sortByNewest(data.profiles, "updatedAt");
  }

  function upsertProfile(input, profileId) {
    const data = readData();
    const index = data.profiles.findIndex((profile) => profile.id === profileId);
    const existing = index === -1 ? null : data.profiles[index];
    const profile = normalizeProfileInput(input, existing);

    if (!profile.name) {
      throw new Error("檔案名稱為必填");
    }

    if (existing) {
      data.profiles[index] = profile;
    } else {
      data.profiles.unshift(profile);
    }

    writeData(data);
    return profile;
  }

  function listOrders() {
    const data = readData();
    return sortByNewest(data.orders, "createdAt");
  }

  function createOrder(payload) {
    const data = readData();
    const items = Array.isArray(payload.items) ? payload.items : [];
    const now = new Date();

    if (!items.length) {
      throw new Error("購物車沒有商品");
    }

    const customer = {
      name: String(payload.customer?.name || "").trim(),
      email: String(payload.customer?.email || "").trim(),
      phone: String(payload.customer?.phone || "").trim()
    };

    const shipping = {
      recipientName: String(payload.shipping?.recipientName || "").trim(),
      phone: String(payload.shipping?.phone || "").trim(),
      city: String(payload.shipping?.city || "").trim(),
      district: String(payload.shipping?.district || "").trim(),
      addressLine1: String(payload.shipping?.addressLine1 || "").trim(),
      addressLine2: String(payload.shipping?.addressLine2 || "").trim(),
      deliveryDate: String(payload.shipping?.deliveryDate || "").trim(),
      deliverySlot: String(payload.shipping?.deliverySlot || "").trim(),
      note: String(payload.shipping?.note || "").trim()
    };

    if (!customer.name || !customer.email || !customer.phone) {
      throw new Error("請完整填寫訂購人資訊");
    }

    if (!shipping.recipientName || !shipping.phone || !shipping.city || !shipping.district || !shipping.addressLine1) {
      throw new Error("請完整填寫收件資訊");
    }

    const normalizedItems = items.map((cartItem) => {
      const product = data.products.find((entry) => entry.id === cartItem.productId);

      if (!product || product.status !== "active") {
        throw new Error("購物車內有商品已下架，請重新整理");
      }

      const quantity = Math.max(1, asNumber(cartItem.quantity, 1));
      if (product.stock < quantity) {
        throw new Error(`${product.name} 庫存不足`);
      }

      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity
      };
    });

    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const addOns = {
      giftWrap: Boolean(payload.addOns?.giftWrap),
      handwriteCard: Boolean(payload.addOns?.handwriteCard),
      cardMessage: String(payload.addOns?.cardMessage || "").trim(),
      deliveryDecoration: String(payload.addOns?.deliveryDecoration || "簡約灰紙").trim()
    };

    const totals = {
      subtotal,
      shippingFee: subtotal >= 3000 ? 0 : 240,
      wrapFee: addOns.giftWrap ? 180 : 0,
      cardFee: addOns.handwriteCard ? 120 : 0,
      scheduleFee: shipping.deliveryDate && shipping.deliverySlot ? 150 : 0
    };
    totals.total =
      totals.subtotal +
      totals.shippingFee +
      totals.wrapFee +
      totals.cardFee +
      totals.scheduleFee;

    const paymentMethod = String(payload.paymentMethod || "credit-card").trim();
    const paymentStatus =
      paymentMethod === "cash-on-delivery"
        ? "pending_collection"
        : paymentMethod === "bank-transfer"
          ? "awaiting_manual_confirmation"
          : "authorized_demo";

    normalizedItems.forEach((item) => {
      const product = data.products.find((entry) => entry.id === item.productId);
      product.stock -= item.quantity;
      product.updatedAt = now.toISOString();
    });

    const sequence = data.meta.nextOrderSequence || 1;
    const order = {
      id: `order_${nanoid(10)}`,
      orderNo: formatOrderNumber(sequence, now),
      createdAt: now.toISOString(),
      status: "confirmed",
      paymentStatus,
      fulfillmentStatus: "queued",
      paymentMethod,
      customer,
      shipping,
      addOns,
      items: normalizedItems,
      totals
    };

    if (payload.recipientProfileId) {
      const profile = data.profiles.find((entry) => entry.id === payload.recipientProfileId);
      if (profile) {
        profile.lastGift = normalizedItems.map((item) => item.name).join("、");
        profile.updatedAt = now.toISOString();
      }
    }

    data.orders.unshift(order);
    data.meta.nextOrderSequence = sequence + 1;
    writeData(data);
    return order;
  }

  function updateOrder(orderId, input) {
    const data = readData();
    const index = data.orders.findIndex((order) => order.id === orderId);

    if (index === -1) {
      throw new Error("找不到指定訂單");
    }

    data.orders[index] = {
      ...data.orders[index],
      status: String(input.status || data.orders[index].status).trim(),
      paymentStatus: String(input.paymentStatus || data.orders[index].paymentStatus).trim(),
      fulfillmentStatus: String(
        input.fulfillmentStatus || data.orders[index].fulfillmentStatus
      ).trim()
    };

    writeData(data);
    return data.orders[index];
  }

  function getRecommendations(filters = {}) {
    return listPublicProducts(filters)
      .sort((left, right) => {
        const featuredDelta = Number(right.featured) - Number(left.featured);
        if (featuredDelta !== 0) {
          return featuredDelta;
        }

        return right.rating - left.rating;
      })
      .slice(0, 4);
  }

  function getAdminSummary() {
    const data = readData();
    const revenue = data.orders.reduce((sum, order) => sum + order.totals.total, 0);
    const lowStockProducts = data.products.filter((product) => product.stock <= 5);
    const pendingOrders = data.orders.filter(
      (order) =>
        order.fulfillmentStatus !== "delivered" &&
        order.fulfillmentStatus !== "cancelled"
    );

    return {
      metrics: {
        revenue,
        orders: data.orders.length,
        activeProducts: data.products.filter((product) => product.status === "active").length,
        profiles: data.profiles.length,
        lowStockCount: lowStockProducts.length,
        pendingOrders: pendingOrders.length
      },
      recentOrders: sortByNewest(data.orders, "createdAt").slice(0, 5),
      lowStockProducts: sortByNewest(lowStockProducts).slice(0, 5)
    };
  }

  return {
    ensureFile,
    readData: () => deepClone(readData()),
    listPublicProducts,
    listAdminProducts,
    getProduct,
    createProduct,
    updateProduct,
    listProfiles,
    upsertProfile,
    listOrders,
    createOrder,
    updateOrder,
    getRecommendations,
    getAdminSummary
  };
}
