import axiosInstance from "../api/axiosInstance";

export const getSettings = () => axiosInstance.get("/settings");

export const updateSettings = (data) =>
  axiosInstance.put("/settings", data);
