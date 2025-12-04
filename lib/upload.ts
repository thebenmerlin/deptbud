import { v2 as cloudinary } from "cloudinary";
import { Logger } from "./logger";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadReceipt(
  file: Buffer,
  fileName: string,
  folder: string = "budget-receipts"
): Promise<{ url: string; publicId: string }> {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          public_id: `${folder}/${Date.now()}-${fileName}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file);
    });

    const uploadResult = result as any;
    Logger.info("Receipt uploaded successfully", {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
    });

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    Logger.error("Receipt upload failed", error);
    throw new Error("Failed to upload receipt");
  }
}

export async function deleteReceipt(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
    Logger.info("Receipt deleted successfully", { publicId });
  } catch (error) {
    Logger.error("Receipt deletion failed", error);
    throw new Error("Failed to delete receipt");
  }
}
