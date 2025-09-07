import AsyncStorage from "@react-native-async-storage/async-storage"

const BASE_URL = "http://192.168.66.20:3000/api" // Android emulator
// const BASE_URL = "http://192.168.1.100:3000/api" // Use your IP for physical device

class ApiService {
  async getToken() {
    return await AsyncStorage.getItem("token")
  }

  async setToken(token) {
    await AsyncStorage.setItem("token", token)
  }

  async removeToken() {
    await AsyncStorage.removeItem("token")
  }

  async makeRequest(endpoint, options = {}) {
    const token = await this.getToken()

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong")
    }

    return data
  }

  // Auth methods
  async register(userData) {
    const response = await this.makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })

    if (response.token) {
      await this.setToken(response.token)
    }

    return response
  }

  async login(credentials) {
    const response = await this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (response.token) {
      await this.setToken(response.token)
    }

    return response
  }

  async getCurrentUser() {
    return await this.makeRequest("/auth/me")
  }

  // User methods
  async getUsers() {
    return await this.makeRequest("/users")
  }

  // Message methods
  async getMessages(userId, page = 1) {
    return await this.makeRequest(`/messages/conversations/${userId}/messages?page=${page}`)
  }
}

export default new ApiService()
