import axiosInstance from "../api/axiosInstance";

export const getSkills = () => axiosInstance.get("/skills");

export const createSkill = (data) =>
  axiosInstance.post("/skills", data);

export const updateSkill = (id, data) =>
  axiosInstance.put(`/skills/${id}`, data);

export const deleteSkill = (id) =>
  axiosInstance.delete(`/skills/${id}`);
