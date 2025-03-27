import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads an image to Cloudinary
 * @param {string} filePath - The path to the file or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise} - Cloudinary upload result
 */
export const uploadImage = async (filePath, options = {}) => {
  try {
    // Default options for profile pictures
    const defaultOptions = {
      folder: "careconnect/profile_pictures",
      transformation: [
        { width: 400, height: 400, crop: "fill" },
        { quality: "auto" },
      ],
    };

    // Merge default options with provided options
    const uploadOptions = { ...defaultOptions, ...options };

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise} - Cloudinary deletion result
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

/**
 * Uploads a PDF document to Cloudinary
 * @param {string} filePath - The path to the PDF file or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise} - Cloudinary upload result
 */
export const uploadPDF = async (filePath, options = {}) => {
  try {
    // Default options for PDF documents
    const defaultOptions = {
      folder: "careconnect/documents",
      resource_type: "auto", // Allows Cloudinary to detect file type
      format: "pdf",
    };

    // Merge default options with provided options
    const uploadOptions = { ...defaultOptions, ...options };

    // Upload the PDF to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return result;
  } catch (error) {
    console.error("Error uploading PDF to Cloudinary:", error);
    throw new Error("Failed to upload PDF to Cloudinary");
  }
};
