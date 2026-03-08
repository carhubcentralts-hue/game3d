export type { StorageDriver, UploadParams, UploadResult } from './types.js';
export { LocalDriver } from './drivers/local.js';
export { R2Driver } from './drivers/r2.js';
export type { R2Config } from './drivers/r2.js';

import { R2Driver } from './drivers/r2.js';
import { LocalDriver } from './drivers/local.js';
import type { StorageDriver } from './types.js';

let storageInstance: StorageDriver | null = null;

export function createStorage(): StorageDriver {
  if (storageInstance) return storageInstance;

  const r2AccountId = process.env.R2_ACCOUNT_ID;
  const r2AccessKey = process.env.R2_ACCESS_KEY_ID;
  const r2SecretKey = process.env.R2_SECRET_ACCESS_KEY;
  const r2Bucket = process.env.R2_BUCKET;
  const r2PublicUrl = process.env.R2_PUBLIC_URL;

  if (r2AccountId && r2AccessKey && r2SecretKey && r2Bucket && r2PublicUrl) {
    storageInstance = new R2Driver({
      accountId: r2AccountId,
      accessKeyId: r2AccessKey,
      secretAccessKey: r2SecretKey,
      bucket: r2Bucket,
      publicUrl: r2PublicUrl,
    });
  } else {
    const basePath = process.env.STORAGE_LOCAL_PATH || './storage';
    storageInstance = new LocalDriver(basePath);
  }

  return storageInstance;
}
