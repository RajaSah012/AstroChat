import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ApiService from "../services/api"
import SocketService from "../services/socket"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      if (token) {
        const response = await ApiService.getCurrentUser()
        if (response && response.user) {
          setUser(response.user)
          SocketService.connect(response.user.id)
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      await AsyncStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await ApiService.login(credentials)
      if (response && response.user) {
        setUser(response.user)
        SocketService.connect(response.user.id)
      }
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await ApiService.register(userData)
      if (response && response.user) {
        setUser(response.user)
        SocketService.connect(response.user.id)
      }
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token")
      SocketService.disconnect()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
