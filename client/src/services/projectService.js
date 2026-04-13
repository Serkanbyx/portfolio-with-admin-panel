import axiosInstance from "../api/axiosInstance";

export const getProjects = (params) =>
  axiosInstance.get("/projects", { params });

export const getProjectBySlug = (slug) =>
  axiosInstance.get(`/projects/${slug}`);

export const getAdminProjects = () =>
  axiosInstance.get("/projects/admin/all");

export const createProject = (data) =>
  axiosInstance.post("/projects", data);

export const updateProject = (id, data) =>
  axiosInstance.put(`/projects/${id}`, data);

export const deleteProject = (id) =>
  axiosInstance.delete(`/projects/${id}`);

export const uploadProjectImage = (id, formData) =>
  axiosInstance.post(`/projects/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProjectImage = (id) =>
  axiosInstance.delete(`/projects/${id}/image`);
