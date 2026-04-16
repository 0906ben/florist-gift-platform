import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { nanoid } from "nanoid";
import { createDataStore } from "./dataStore.js";
import { getUploadDir } from "./storagePaths.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "..", "dist");
const uploadDir = getUploadDir();

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    callback(null, `${Date.now()}-${nanoid(8)}${extension || ".jpg"}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (_request, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("只能上傳圖片檔"));
      return;
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

function sendError(response, error, status = 400) {
  response.status(status).json({
    error: error.message || "發生未預期錯誤"
  });
}

export function createApp({ dataFile } = {}) {
  const app = express();
  const store = createDataStore({ filePath: dataFile });

  store.ensureFile();

  app.use(express.json({ limit: "1mb" }));
  app.use("/uploads", express.static(uploadDir));

  app.get("/api/health", (_request, response) => {
    response.json({
      ok: true,
      brand: store.readData().meta.brandName
    });
  });

  app.get("/api/store/products", (request, response) => {
    response.json(store.listPublicProducts(request.query));
  });

  app.get("/api/store/recommendations", (request, response) => {
    response.json(store.getRecommendations(request.query));
  });

  app.get("/api/store/products/:identifier", (request, response) => {
    const product = store.getProduct(request.params.identifier);
    if (!product || product.status !== "active") {
      response.status(404).json({ error: "找不到商品" });
      return;
    }
    response.json(product);
  });

  app.get("/api/store/profiles", (_request, response) => {
    response.json(store.listProfiles());
  });

  app.post("/api/store/profiles", (request, response) => {
    try {
      const profile = store.upsertProfile(request.body);
      response.status(201).json(profile);
    } catch (error) {
      sendError(response, error);
    }
  });

  app.put("/api/store/profiles/:profileId", (request, response) => {
    try {
      const profile = store.upsertProfile(request.body, request.params.profileId);
      response.json(profile);
    } catch (error) {
      sendError(response, error);
    }
  });

  app.post("/api/store/orders", (request, response) => {
    try {
      const order = store.createOrder(request.body);
      response.status(201).json(order);
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/admin/summary", (_request, response) => {
    response.json(store.getAdminSummary());
  });

  app.get("/api/admin/products", (request, response) => {
    response.json(store.listAdminProducts(request.query));
  });

  app.post("/api/admin/products", (request, response) => {
    try {
      const product = store.createProduct(request.body);
      response.status(201).json(product);
    } catch (error) {
      sendError(response, error);
    }
  });

  app.put("/api/admin/products/:productId", (request, response) => {
    try {
      const product = store.updateProduct(request.params.productId, request.body);
      response.json(product);
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/admin/orders", (_request, response) => {
    response.json(store.listOrders());
  });

  app.post("/api/admin/uploads", upload.single("image"), (request, response) => {
    if (!request.file) {
      response.status(400).json({ error: "沒有收到圖片檔案" });
      return;
    }

    response.status(201).json({
      imageUrl: `/uploads/${request.file.filename}`
    });
  });

  app.patch("/api/admin/orders/:orderId", (request, response) => {
    try {
      const order = store.updateOrder(request.params.orderId, request.body);
      response.json(order);
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/admin/profiles", (_request, response) => {
    response.json(store.listProfiles());
  });

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(distPath));
    app.get("/{*path}", (_request, response) => {
      response.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use((error, _request, response, _next) => {
    sendError(response, error, 500);
  });

  return app;
}
