
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  login: (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password }),

  getMyLeaves: () =>
    axios.get(`${API_URL}/leaves/mine`, { headers: getAuthHeader() }),

  createLeave: (data) =>
    axios.post(`${API_URL}/leaves`, data, { headers: getAuthHeader() }),

  getAllLeaves: () =>
    axios.get(`${API_URL}/leaves`, { headers: getAuthHeader() }),

  updateLeaveStatus: (id, status) =>
    axios.patch(
      `${API_URL}/leaves/${id}/status`,
      { status },
      { headers: getAuthHeader() }
    ),
};
