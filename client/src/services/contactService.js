import axiosInstance from "../api/axiosInstance";

export const sendMessage = (data) =>
  axiosInstance.post("/contact", data);
