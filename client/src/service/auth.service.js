import { API } from "../constants/api";

export const login = async (username, password) => {
  const response = await fetch(API.USERS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  // Parse the response and get the tokens and role
  const data = await response.json();

  console.log(data);

  // Store tokens and role in localStorage
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("role", data.role); // Storing the role

  return data;
};
