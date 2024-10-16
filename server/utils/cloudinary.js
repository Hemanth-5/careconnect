import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// const uploadResourcesToCloudinary = (req, buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.v2.uploader.upload_stream(
//       {
//         folder: `resources/${req.user.id}`,
//         public_id: `${Date.now()}_${req.file.originalname.split(".")[0]}`,
//       },
//       (error, result) => {
//         if (result) {
//           resolve(result);
//         } else {
//           reject(error);
//         }
//       }
//     );
//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

const uploadProfilePicturesToCloudinary = (req, buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: `careconnect/userProfiles/${req.user.id}`,
        public_id: `${req.user.id}_profile`,
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export { uploadProfilePicturesToCloudinary };
