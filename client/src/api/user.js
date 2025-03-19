import api from "./index";
import { API } from "../constants/api";

const userAPI = {
  // Profile
  getUserProfile: () => api.get(API.USERS.ME),
  updateUserProfile: (profileData) =>
    api.put(API.USERS.UPDATE_PROFILE, profileData),
};

export default userAPI;
