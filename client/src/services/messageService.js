import axiosInstance from "../api/axiosInstance";

export const getMessages = (params) =>
  axiosInstance.get("/messages", { params });

export const markAsRead = (id) =>
  axiosInstance.patch(`/messages/${id}/read`);

export const deleteMessage = (id) =>
  axiosInstance.delete(`/messages/${id}`);
