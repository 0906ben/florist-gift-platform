import { createBlobDataStore, createImageBlobStore } from "../../server/blobDataStore.js";

function json(data, status = 200) {
  return Response.json(data, { status });
}

function errorResponse(error) {
  const status = error.status || 400;
  return json(
    {
      error: error.message || "發生未預期錯誤"
    },
    status
  );
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function createImageKey(file) {
  const extension = file.name?.includes(".")
    ? `.${file.name.split(".").pop().toLowerCase()}`
    : ".jpg";

  return `${Date.now()}-${crypto.randomUUID()}${extension}`;
}

async function handleUpload(request, imageStore) {
  const form = await request.formData();
  const file = form.get("image");

  if (!(file instanceof File)) {
    return json({ error: "沒有收到圖片檔案" }, 400);
  }

  if (!file.type.startsWith("image/")) {
    return json({ error: "只能上傳圖片檔" }, 400);
  }

  if (file.size > 5 * 1024 * 1024) {
    return json({ error: "圖片檔案不能超過 5MB" }, 400);
  }

  const key = createImageKey(file);

  await imageStore.set(key, file, {
    metadata: {
      contentType: file.type,
      originalName: file.name || key
    }
  });

  return json({ imageUrl: `/uploads/${key}` }, 201);
}

async function route(request) {
  const store = createBlobDataStore();
  const imageStore = createImageBlobStore();
  const { pathname, searchParams } = new URL(request.url);

  if (request.method === "GET" && pathname === "/api/health") {
    const data = await store.readData();
    return json({
      ok: true,
      brand: data.meta.brandName
    });
  }

  if (request.method === "GET" && pathname === "/api/store/products") {
    return json(await store.listPublicProducts(Object.fromEntries(searchParams)));
  }

  if (request.method === "GET" && pathname === "/api/store/recommendations") {
    return json(await store.getRecommendations(Object.fromEntries(searchParams)));
  }

  if (request.method === "GET" && pathname.startsWith("/api/store/products/")) {
    const identifier = decodeURIComponent(pathname.replace("/api/store/products/", ""));
    const product = await store.getProduct(identifier);

    if (!product || product.status !== "active") {
      return json({ error: "找不到商品" }, 404);
    }

    return json(product);
  }

  if (request.method === "GET" && pathname === "/api/store/profiles") {
    return json(await store.listProfiles());
  }

  if (request.method === "POST" && pathname === "/api/store/profiles") {
    return json(await store.upsertProfile(await parseJson(request)), 201);
  }

  if (request.method === "PUT" && pathname.startsWith("/api/store/profiles/")) {
    const profileId = decodeURIComponent(pathname.replace("/api/store/profiles/", ""));
    return json(await store.upsertProfile(await parseJson(request), profileId));
  }

  if (request.method === "POST" && pathname === "/api/store/orders") {
    return json(await store.createOrder(await parseJson(request)), 201);
  }

  if (request.method === "GET" && pathname === "/api/admin/summary") {
    return json(await store.getAdminSummary());
  }

  if (request.method === "GET" && pathname === "/api/admin/products") {
    return json(await store.listAdminProducts(Object.fromEntries(searchParams)));
  }

  if (request.method === "POST" && pathname === "/api/admin/products") {
    return json(await store.createProduct(await parseJson(request)), 201);
  }

  if (request.method === "PUT" && pathname.startsWith("/api/admin/products/")) {
    const productId = decodeURIComponent(pathname.replace("/api/admin/products/", ""));
    return json(await store.updateProduct(productId, await parseJson(request)));
  }

  if (request.method === "GET" && pathname === "/api/admin/orders") {
    return json(await store.listOrders());
  }

  if (request.method === "PATCH" && pathname.startsWith("/api/admin/orders/")) {
    const orderId = decodeURIComponent(pathname.replace("/api/admin/orders/", ""));
    return json(await store.updateOrder(orderId, await parseJson(request)));
  }

  if (request.method === "GET" && pathname === "/api/admin/profiles") {
    return json(await store.listProfiles());
  }

  if (request.method === "POST" && pathname === "/api/admin/uploads") {
    return handleUpload(request, imageStore);
  }

  return json({ error: "找不到 API 路徑" }, 404);
}

export default async function handler(request) {
  try {
    return await route(request);
  } catch (error) {
    return errorResponse(error);
  }
}

export const config = {
  path: "/api/*"
};
