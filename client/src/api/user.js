import api from "./index";
import { API } from "../constants/api";

const userAPI = {
  // Profile
  getUserProfile: () => api.get(API.USERS.ME),
  updateUserProfile: (profileData) =>
    api.put(API.USERS.UPDATE_PROFILE, profileData),
  // updateUserProfilePicture: (pictureData) =>
  //   api.put(API.USERS.UPDATE_PROFILE_PICTURE, pictureData),
  updateProfilePicture: async (formData) => {
    try {
      const response = await api.put(
        API.USERS.UPDATE_PROFILE_PICTURE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      // Re-throw the error with more context
      if (error.response) {
        throw new Error(
          error.response.data.message || "Error updating profile picture"
        );
      }
      throw error;
    }
  },
};

export default userAPI;
