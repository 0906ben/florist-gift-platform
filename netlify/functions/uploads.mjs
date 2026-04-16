import { createImageBlobStore } from "../../server/blobDataStore.js";

export default async function handler(request) {
  const imageStore = createImageBlobStore();
  const { pathname } = new URL(request.url);
  const key = decodeURIComponent(pathname.replace("/uploads/", ""));

  if (!key || key === pathname) {
    return new Response("找不到圖片", { status: 404 });
  }

  const entry = await imageStore.getWithMetadata(key, { type: "blob" });

  if (!entry) {
    return new Response("找不到圖片", { status: 404 });
  }

  return new Response(entry.data, {
    headers: {
      "Content-Type": entry.metadata?.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}

export const config = {
  path: "/uploads/*"
};
