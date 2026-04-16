function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const text = query.toString();
  return text ? `?${text}` : "";
}

async function request(path, options = {}) {
  const hasCustomBody = options.body instanceof FormData;
  const response = await fetch(path, {
    headers: hasCustomBody ? undefined : {
      "Content-Type": "application/json"
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "請求失敗");
  }

  return payload;
}

export function getProducts(filters) {
  return request(`/api/store/products${buildQuery(filters)}`);
}

export function getRecommendations(filters) {
  return request(`/api/store/recommendations${buildQuery(filters)}`);
}

export function getProduct(identifier) {
  return request(`/api/store/products/${identifier}`);
}

export function getProfiles() {
  return request("/api/store/profiles");
}

export function saveProfile(profile, profileId) {
  return request(profileId ? `/api/store/profiles/${profileId}` : "/api/store/profiles", {
    method: profileId ? "PUT" : "POST",
    body: JSON.stringify(profile)
  });
}

export function createOrder(payload) {
  return request("/api/store/orders", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getAdminSummary() {
  return request("/api/admin/summary");
}

export function getAdminProducts(filters) {
  return request(`/api/admin/products${buildQuery(filters)}`);
}

export function createAdminProduct(payload) {
  return request("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateAdminProduct(productId, payload) {
  return request(`/api/admin/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function getAdminOrders() {
  return request("/api/admin/orders");
}

export function updateAdminOrder(orderId, payload) {
  return request(`/api/admin/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function getAdminProfiles() {
  return request("/api/admin/profiles");
}

export async function uploadAdminImage(file) {
  const body = new FormData();
  body.append("image", file);
  return request("/api/admin/uploads", {
    method: "POST",
    body
  });
}
