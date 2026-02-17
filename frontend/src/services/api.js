import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
                'Content-Type': 'application/json',
        },
        // withCredentials: true, // ❌ REMOVED
        timeout: 30000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
        (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
        },
        (error) => {
                console.error('Request error:', error);
                return Promise.reject(error);
        }
);


// Response interceptor for handling errors
api.interceptors.response.use(
        (response) => response,
        (error) => {
                // Log detailed error for debugging
                if (error.response) {
                        console.error('Response error:', error.response.status, error.response.data);
                } else if (error.request) {
                        console.error('Network error - no response received:', error.message);
                } else {
                        console.error('Request setup error:', error.message);
                }

                if (error.response?.status === 401) {
                        // Token expired or invalid
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                }

                return Promise.reject(error);
        }
);

// Authentication
export const signup = async (name, email, password) => {
        const response = await api.post('/api/auth/signup', { name, email, password });
        return response.data;
};

export const login = async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data;
};

// Problems
export const getSystemProblem = async () => {
        const response = await api.get('/api/problem/system');
        return response.data;
};

export const getAIProblem = async () => {
        const response = await api.get('/api/problem/ai');
        return response.data;
};

// Prompt Generation
export const generatePrompt = async (idea) => {
        const response = await api.post('/api/generate-prompt', { idea });
        return response.data;
};

// Evaluation
export const evaluatePrompt = async (problemText, problemSource, userPrompt) => {
        const response = await api.post('/api/evaluate', {
                problem_text: problemText,
                problem_source: problemSource,
                user_prompt: userPrompt,
        });
        return response.data;
};

// Profile
export const getProfile = async () => {
        const response = await api.get('/api/profile');
        return response.data;
};

export const updateProfile = async (data) => {
        const response = await api.put('/api/profile', data);
        return response.data;
};

// Reports
export const downloadReport = async (attemptId) => {
        const response = await api.get(`/api/report/${attemptId}`, {
                responseType: 'blob',
        });
        return response.data;
};

// Technical Challenge APIs
export const getTechnicalChallenge = async (category, difficulty = null) => {
        const response = await api.post('/api/technical-challenge', {
                category,
                difficulty,
        });
        return response.data;
};

export const evaluateTechnicalPrompt = async (problem, userPrompt, constraints) => {
        const response = await api.post('/api/technical-evaluate', {
                problem,
                user_prompt: userPrompt,
                constraints,
        });
        return response.data;
};

// Get single attempt details
export const getAttemptDetail = async (attemptId) => {
        const response = await api.get(`/api/attempt/${attemptId}`);
        return response.data;
};


export default api;
