import { mkdir, readFile, writeFile, unlink, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { StorageDriver, UploadParams, UploadResult } from '../types.js';

export class LocalDriver implements StorageDriver {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  async upload(params: UploadParams): Promise<UploadResult> {
    const filePath = join(this.basePath, params.key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, params.body);
    return {
      key: params.key,
      url: `/storage/${params.key}`,
    };
  }

  async download(key: string): Promise<Buffer> {
    const filePath = join(this.basePath, key);
    return readFile(filePath);
  }

  async delete(key: string): Promise<void> {
    const filePath = join(this.basePath, key);
    try {
      await unlink(filePath);
    } catch {
      // Ignore if file doesn't exist
    }
  }

  async exists(key: string): Promise<boolean> {
    const filePath = join(this.basePath, key);
    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getPublicUrl(key: string): string {
    return `/storage/${key}`;
  }
}
