export interface UploadParams {
  key: string;
  body: Buffer | Uint8Array;
  contentType?: string;
}

export interface UploadResult {
  key: string;
  url: string;
}

export interface StorageDriver {
  upload(params: UploadParams): Promise<UploadResult>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  getPublicUrl(key: string): string;
}
