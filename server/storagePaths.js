import path from "node:path";

function resolveStorageRoot() {
  return process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR)
    : process.cwd();
}

export function getDataFilePath() {
  return path.join(resolveStorageRoot(), "data", "store.json");
}

export function getUploadDir() {
  return path.join(resolveStorageRoot(), "uploads");
}
