import React, { createContext, useState, useContext, useEffect } from 'react'
import { login as apiLogin, signup as apiSignup } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
        const context = useContext(AuthContext)
        if (!context) {
                throw new Error('useAuth must be used within an AuthProvider')
        }
        return context
}

export const AuthProvider = ({ children }) => {
        const [user, setUser] = useState(null)
        const [loading, setLoading] = useState(true)

        useEffect(() => {
                const token = localStorage.getItem('token')
                const userData = localStorage.getItem('user')
                if (token && userData) {
                        setUser(JSON.parse(userData))
                }
                setLoading(false)
        }, [])

        const login = async (email, password) => {
                const response = await apiLogin(email, password)
                localStorage.setItem('token', response.access_token)

                const userData = { email }
                localStorage.setItem('user', JSON.stringify(userData))
                setUser(userData)
                return response
        }

        const signup = async (name, email, password) => {
                const response = await apiSignup(name, email, password)
                return response
        }

        const logout = () => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setUser(null)
        }

        return (
                <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
                        {children}
                </AuthContext.Provider>
        )
}
