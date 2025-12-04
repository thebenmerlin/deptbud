import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadReceipt(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'deptbud/receipts',
          resource_type: 'auto',
          max_file_size: 5000000,
          allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
        },
        (error, result) => {
          if (error) reject(new Error(`Upload failed: ${error.message}`));
          else resolve(result?.secure_url || '');
        }
      );

      uploadStream.on('error', (err) => reject(err));
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('File upload failed');
  }
}

export async function deleteReceipt(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('File deletion failed');
  }
}
