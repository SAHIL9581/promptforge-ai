import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
        baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if (token) {
                config.headers.Authorization = `Bearer ${token}`
        }
        return config
})

// Authentication
export const signup = async (name, email, password) => {
        const response = await api.post('/api/auth/signup', { name, email, password })
        return response.data
}

export const login = async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password })
        return response.data
}

// Problems
export const getSystemProblem = async () => {
        const response = await api.get('/api/problem/system')
        return response.data
}

export const getAIProblem = async () => {
        const response = await api.get('/api/problem/ai')
        return response.data
}

// Prompt Generation
export const generatePrompt = async (idea) => {
        const response = await api.post('/api/generate-prompt', { idea })
        return response.data
}

// Evaluation
export const evaluatePrompt = async (problemText, problemSource, userPrompt) => {
        const response = await api.post('/api/evaluate', {
                problem_text: problemText,
                problem_source: problemSource,
                user_prompt: userPrompt
        })
        return response.data
}

// Profile
export const getProfile = async () => {
        const response = await api.get('/api/profile')
        return response.data
}

// Reports
export const downloadReport = async (attemptId) => {
        const response = await api.get(`/api/report/${attemptId}`, {
                responseType: 'blob'
        })
        return response.data
}

// Technical Challenge APIs
export const getTechnicalChallenge = async (category, difficulty = null) => {
        const response = await api.post('/api/technical-challenge', {
                category,
                difficulty
        })
        return response.data
}

export const evaluateTechnicalPrompt = async (problem, userPrompt, constraints) => {
        const response = await api.post('/api/technical-evaluate', {
                problem,
                user_prompt: userPrompt,
                constraints
        })
        return response.data
}

export default api
