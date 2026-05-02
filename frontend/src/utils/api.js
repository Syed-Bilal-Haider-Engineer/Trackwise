const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("tw_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
 console.log("API Request:", API_URL, path, options);
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
console.log("API Response:", res);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

async function upload(path, formData, method = "POST") {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // Auth
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  updateMe: (body) => request("/auth/me", { method: "PATCH", body: JSON.stringify(body) }),

  // Documents
  getDocuments: () => request("/documents"),
  createDocument: (fd) => upload("/documents", fd),
  updateDocument: (id, fd) => upload(`/documents/${id}`, fd, "PATCH"),
  deleteDocument: (id) => request(`/documents/${id}`, { method: "DELETE" }),

  // Time
  getTimeEntries: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/time${qs ? `?${qs}` : ""}`);
  },
  addTimeEntry: (body) => request("/time", { method: "POST", body: JSON.stringify(body) }),
  updateTimeEntry: (id, body) =>
    request(`/time/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteTimeEntry: (id) => request(`/time/${id}`, { method: "DELETE" }),
  getTimeSummary: () => request("/time/summary"),

  // AI
  getAiInsights: () => request("/ai/insights"),
  askAi: (question) => request("/ai/ask", { method: "POST", body: JSON.stringify({ question }) }),
  getStoredInsights: () => request("/ai/stored"),
  markInsightRead: (id) => request(`/ai/stored/${id}/read`, { method: "PATCH" }),

  getFileUrl: (path) => `${API_URL}${path}`,
};
