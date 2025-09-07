import io from "socket.io-client"

const SOCKET_URL = "http://192.168.66.20:3000" // Android emulator
// const SOCKET_URL = "http://192.168.1.100:3000" // Use your IP for physical device

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
  }

  connect(userId) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      })

      this.socket.on("connect", () => {
        console.log("✅ Connected to server")
        this.isConnected = true
        this.reconnectAttempts = 0
        this.socket.emit("join", userId)
      })

      this.socket.on("disconnect", (reason) => {
        console.log("❌ Disconnected from server:", reason)
        this.isConnected = false
      })

      this.socket.on("reconnect", (attemptNumber) => {
        console.log("🔄 Reconnected after", attemptNumber, "attempts")
        this.socket.emit("join", userId)
      })

      this.socket.on("reconnect_error", (error) => {
        console.log("🔄 Reconnection failed:", error)
        this.reconnectAttempts++
      })
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Message events
  sendMessage(messageData) {
    if (this.socket && this.isConnected) {
      console.log("📤 Sending message:", messageData)
      this.socket.emit("message:send", messageData)
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("message:new", (data) => {
        console.log("📨 New message received:", data)
        callback(data)
      })
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on("message:sent", (data) => {
        console.log("✅ Message sent:", data)
        callback(data)
      })
    }
  }

  onMessageDelivered(callback) {
    if (this.socket) {
      this.socket.on("message:delivered", (data) => {
        console.log("📬 Message delivered:", data)
        callback(data)
      })
    }
  }

  onMessageRead(callback) {
    if (this.socket) {
      this.socket.on("message:read", (data) => {
        console.log("👁️ Message read:", data)
        callback(data)
      })
    }
  }

  onMessagesRead(callback) {
    if (this.socket) {
      this.socket.on("messages:read", callback)
    }
  }

  markMessageAsRead(messageId, senderId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("message:read", { messageId, senderId })
    }
  }

  markMessagesAsRead(senderId, receiverId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("messages:mark_read", { senderId, receiverId })
    }
  }

  // Typing events
  startTyping(receiverId, senderId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("typing:start", { receiverId, senderId })
    }
  }

  stopTyping(receiverId, senderId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("typing:stop", { receiverId, senderId })
    }
  }

  onTypingStart(callback) {
    if (this.socket) {
      this.socket.on("typing:start", callback)
    }
  }

  onTypingStop(callback) {
    if (this.socket) {
      this.socket.on("typing:stop", callback)
    }
  }

  // User status events
  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on("user_online", callback)
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on("user_offline", callback)
    }
  }

  // Remove listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }
}

export default new SocketService()
