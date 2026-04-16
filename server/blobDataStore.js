import { getStore } from "@netlify/blobs";
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

const DATA_STORE_NAME = "lazy-bloom-data";
const DATA_KEY = "store";
const IMAGE_STORE_NAME = "lazy-bloom-images";

function createConflictError() {
  const error = new Error("資料正在更新，請稍後再試一次");
  error.status = 409;
  return error;
}

export function createBlobDataStore() {
  const store = getStore(DATA_STORE_NAME);

  async function ensureFile() {
    const existing = await store.getWithMetadata(DATA_KEY, { type: "json" });
    if (existing) {
      return existing;
    }

    await store.setJSON(DATA_KEY, cloneDefaultStoreData(), {
      metadata: { schema: 1 },
      onlyIfNew: true
    });

    return store.getWithMetadata(DATA_KEY, { type: "json" });
  }

  async function readRecord() {
    const entry = await ensureFile();
    return {
      data: deepClone(entry.data),
      etag: entry.etag
    };
  }

  async function mutate(mutator) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { data, etag } = await readRecord();
      const result = mutator(data);
      const response = await store.setJSON(DATA_KEY, data, {
        metadata: { schema: 1 },
        onlyIfMatch: etag
      });

      if (response.modified) {
        return result;
      }
    }

    throw createConflictError();
  }

  return {
    ensureFile,
    async readData() {
      return (await readRecord()).data;
    },
    async listPublicProducts(filters = {}) {
      return listPublicProducts((await readRecord()).data, filters);
    },
    async listAdminProducts(filters = {}) {
      return listAdminProducts((await readRecord()).data, filters);
    },
    async getProduct(identifier) {
      return getProduct((await readRecord()).data, identifier);
    },
    async createProduct(input) {
      return mutate((data) => createProduct(data, input));
    },
    async updateProduct(productId, input) {
      return mutate((data) => updateProduct(data, productId, input));
    },
    async listProfiles() {
      return listProfiles((await readRecord()).data);
    },
    async upsertProfile(input, profileId) {
      return mutate((data) => upsertProfile(data, input, profileId));
    },
    async listOrders() {
      return listOrders((await readRecord()).data);
    },
    async createOrder(payload) {
      return mutate((data) => createOrder(data, payload));
    },
    async updateOrder(orderId, input) {
      return mutate((data) => updateOrder(data, orderId, input));
    },
    async getRecommendations(filters = {}) {
      return getRecommendations((await readRecord()).data, filters);
    },
    async getAdminSummary() {
      return getAdminSummary((await readRecord()).data);
    }
  };
}

export function createImageBlobStore() {
  return getStore(IMAGE_STORE_NAME);
}
