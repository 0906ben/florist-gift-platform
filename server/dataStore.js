import fs from "node:fs/promises";
import path from "node:path";
import { getDataFilePath } from "./storagePaths.js";
import {
  cloneDefaultStoreData,
  createOrder,
  createProduct,
  deepClone,
  getAdminSummary,
  getProduct,
  getRecommendations,
  listAdminProducts,
  listOrders,
  listProfiles,
  listPublicProducts,
  updateOrder,
  updateProduct,
  upsertProfile
} from "./storeCore.js";

const DEFAULT_FILE_PATH = getDataFilePath();

async function ensureDirectory(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function createDataStore({ filePath = DEFAULT_FILE_PATH } = {}) {
  async function ensureFile() {
    await ensureDirectory(filePath);
    if (!(await fileExists(filePath))) {
      await fs.writeFile(filePath, JSON.stringify(cloneDefaultStoreData(), null, 2));
    }
  }

  async function readData() {
    await ensureFile();
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  }

  async function writeData(data) {
    await ensureDirectory(filePath);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  return {
    ensureFile,
    async readData() {
      return deepClone(await readData());
    },
    async listPublicProducts(filters = {}) {
      return listPublicProducts(await readData(), filters);
    },
    async listAdminProducts(filters = {}) {
      return listAdminProducts(await readData(), filters);
    },
    async getProduct(identifier) {
      return getProduct(await readData(), identifier);
    },
    async createProduct(input) {
      const data = await readData();
      const product = createProduct(data, input);
      await writeData(data);
      return product;
    },
    async updateProduct(productId, input) {
      const data = await readData();
      const product = updateProduct(data, productId, input);
      await writeData(data);
      return product;
    },
    async listProfiles() {
      return listProfiles(await readData());
    },
    async upsertProfile(input, profileId) {
      const data = await readData();
      const profile = upsertProfile(data, input, profileId);
      await writeData(data);
      return profile;
    },
    async listOrders() {
      return listOrders(await readData());
    },
    async createOrder(payload) {
      const data = await readData();
      const order = createOrder(data, payload);
      await writeData(data);
      return order;
    },
    async updateOrder(orderId, input) {
      const data = await readData();
      const order = updateOrder(data, orderId, input);
      await writeData(data);
      return order;
    },
    async getRecommendations(filters = {}) {
      return getRecommendations(await readData(), filters);
    },
    async getAdminSummary() {
      return getAdminSummary(await readData());
    }
  };
}
