import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token interceptor - add JWT to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth error interceptor - redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Agents API
export const agentsApi = {
  getAll: () => api.get('/agents'),
  getOne: (id: string) => api.get(`/agents/${id}`),
  create: (data: any) => api.post('/agents', data),
  update: (id: string, data: any) => api.put(`/agents/${id}`, data),
  delete: (id: string) => api.delete(`/agents/${id}`),
};

// Workflows API
export const workflowsApi = {
  getAll: () => api.get('/workflows'),
  getOne: (id: string) => api.get(`/workflows/${id}`),
  create: (data: any) => api.post('/workflows', data),
  update: (id: string, data: any) => api.put(`/workflows/${id}`, data),
  delete: (id: string) => api.delete(`/workflows/${id}`),
  publish: (id: string) => api.post(`/workflows/${id}/publish`),
};

// Testing API
export const testingApi = {
  createSuite: (data: any) => api.post('/testing/suites', data),
  getSuites: () => api.get('/testing/suites'),
  runSuite: (id: string) => api.post(`/testing/suites/${id}/run`),
  getResults: () => api.get('/testing/results'),
};

// Optimizer API
export const optimizerApi = {
  analyze: (agentId: string) => api.post('/optimizer/analyze', { agentId }),
  getSuggestions: (agentId: string) => api.get(`/optimizer/suggestions/${agentId}`),
  implementSuggestion: (id: string) => api.post(`/optimizer/suggestions/${id}/implement`),
  ignoreSuggestion: (id: string) => api.post(`/optimizer/suggestions/${id}/ignore`),
};

// Execution API
export const executionApi = {
  run: (workflowId: string, input: any) => api.post('/execution/run', { workflowId, input }),
  startDebug: (workflowId: string, input: any) =>
    api.post('/execution/debug/start', { workflowId, input }),
  step: (sessionId: string) => api.post(`/execution/debug/${sessionId}/step`),
  continue: (sessionId: string) => api.post(`/execution/debug/${sessionId}/continue`),
  getState: (sessionId: string) => api.get(`/execution/debug/${sessionId}/state`),
};

// Conversations API
export const conversationsApi = {
  getAll: () => api.get('/conversations'),
  getOne: (id: string) => api.get(`/conversations/${id}`),
  create: (data: { agentId: string }) => api.post('/conversations', data),
  sendMessage: (id: string, message: string) =>
    api.post(`/conversations/${id}/messages`, { message }),
  delete: (id: string) => api.delete(`/conversations/${id}`),
};

export default api;
