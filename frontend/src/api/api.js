import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH =============
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
};

// ============= FILES =============
export const filesAPI = {
  list: () => api.get('/files/'),
  get: (id) => api.get(`/files/${id}/`),
  delete: (id) => api.delete(`/files/${id}/`),
  upload: (file, comment) => {
    const formData = new FormData();
    formData.append('file', file);
    if (comment) formData.append('comment', comment);
    return api.post('/files/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  rename: (id, newName) => api.post(`/files/${id}/rename/`, { name: newName }),
  addComment: (id, comment) => api.post(`/files/${id}/comment/`, { comment }),
  share: (id) => api.post(`/files/${id}/share/`),
  download: (id) => api.get(`/files/${id}/download/`, { responseType: 'blob' }),
};

// ============= USERS (Admin) =============
export const usersAPI = {
  list: () => api.get('/users/'),
  get: (id) => api.get(`/users/${id}/`),
  create: (data) => api.post('/users/', data),
  update: (id, data) => api.patch(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
};

// ============= SHARE =============
export const shareAPI = {
  getByLink: (link) => api.get(`/share/${link}/`),
};

export default api;