// services/upload.service.ts

import { v2 as cloudinary } from "cloudinary";
import { logger } from "@/lib/logger";

export interface UploadResult {
  url: string;
  publicId: string;
  size: number;
  format: string;
}

export interface DeleteResult {
  success: boolean;
  message: string;
}

export class UploadService {
  static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  static readonly ALLOWED_FORMATS = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
  static readonly CLOUDINARY_FOLDER = "budget-system/receipts";

  /**
   * Upload file to Cloudinary
   */
  static async uploadFile(file: Buffer, filename: string): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.CLOUDINARY_FOLDER,
          resource_type: "auto",
          public_id: filename.split(".")[0],
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            logger.error("Cloudinary upload error:", error);
            reject(new Error(`Upload failed: ${error.message}`));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              size: result.bytes,
              format: result.format,
            });
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        }
      );

      uploadStream.end(file);
    });
  }

  /**
   * Delete file from Cloudinary
   */
  static async deleteFile(publicId: string): Promise<DeleteResult> {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.info(`File deleted: ${publicId}`);
      return {
        success: true,
        message: "File deleted successfully",
      };
    } catch (error) {
      logger.error("Cloudinary delete error:", error);
      throw new Error(`Delete failed: ${(error as any).message}`);
    }
  }

  /**
   * Validate file before upload
   */
  static validateFile(buffer: Buffer, filename: string): { valid: boolean; error?: string } {
    // Check file size
    if (buffer.length > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
      };
    }

    // Check file extension
    const ext = filename.split(".").pop()?.toLowerCase();
    if (!ext || !this.ALLOWED_FORMATS.includes(ext)) {
      return {
        valid: false,
        error: `File format not allowed. Allowed: ${this.ALLOWED_FORMATS.join(", ")}`,
      };
    }

    return { valid: true };
  }

  /**
   * Get file info from Cloudinary
   */
  static async getFileInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return {
        url: result.secure_url,
        size: result.bytes,
        format: result.format,
        uploadedAt: result.created_at,
      };
    } catch (error) {
      logger.error("Failed to get file info:", error);
      throw new Error("Failed to retrieve file information");
    }
  }

  /**
   * Upload receipt image
   */
  static async uploadReceipt(
    file: Buffer,
    expenseId: string,
    userId: string
  ): Promise<UploadResult> {
    // Validate file
    const validation = this.validateFile(file, `receipt_${expenseId}.pdf`);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `receipt_${userId}_${expenseId}_${timestamp}`;

    try {
      return await this.uploadFile(file, filename);
    } catch (error) {
      logger.error("Receipt upload failed:", error);
      throw error;
    }
  }

  /**
   * Upload proof document
   */
  static async uploadProof(
    file: Buffer,
    budgetId: string,
    documentType: string
  ): Promise<UploadResult> {
    // Validate file
    const validation = this.validateFile(file, `${documentType}_${budgetId}.pdf`);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `proof_${documentType}_${budgetId}_${timestamp}`;

    try {
      return await this.uploadFile(file, filename);
    } catch (error) {
      logger.error("Proof upload failed:", error);
      throw error;
    }
  }

  /**
   * Bulk delete files
   */
  static async bulkDeleteFiles(publicIds: string[]): Promise<DeleteResult[]> {
    const results: DeleteResult[] = [];

    for (const publicId of publicIds) {
      try {
        const result = await this.deleteFile(publicId);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          message: `Failed to delete ${publicId}`,
        });
      }
    }

    return results;
  }

  /**
   * Get upload URL with signature (for direct uploads)
   */
  static getUploadSignature(): {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
  } {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: this.CLOUDINARY_FOLDER,
      },
      process.env.CLOUDINARY_API_SECRET || ""
    );

    return {
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
      apiKey: process.env.CLOUDINARY_API_KEY || "",
    };
  }

  /**
   * Generate thumbnail URL
   */
  static getThumbnailUrl(publicId: string, width: number = 200, height: number = 200): string {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: "fill",
      quality: "auto",
    });
  }

  /**
   * Generate preview URL
   */
  static getPreviewUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      width: 800,
      height: 600,
      crop: "fit",
      quality: "auto",
    });
  }
}