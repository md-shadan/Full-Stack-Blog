import api from './api.js';

export async function fetchPosts({ page = 0, size = 10, sort = 'latest', search = '' }) {
  const params = { page, size, sort, search };
  const { data } = await api.get('/api/posts', { params });
  return data;
}

export async function fetchPostById(id) {
  const { data } = await api.get(`/api/posts/${id}`);
  return data;
}

export async function createPost(payload) {
  const { data } = await api.post('/api/posts', payload);
  return data;
}

export async function updatePost(id, payload) {
  const { data } = await api.put(`/api/posts/${id}`, payload);
  return data;
}

export async function deletePost(id) {
  await api.delete(`/api/posts/${id}`);
}

export async function register(payload) {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
}
