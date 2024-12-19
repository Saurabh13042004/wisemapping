import axios from "./axiosInstance";

export const loginUser = async (credentials) => {
  return axios.post("/users/login", credentials);
};

export const registerUser = async (userData) => {
  return axios.post("/users/register", userData);
};
