import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert, StatusBar } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useAuth } from "../context/AuthContext"
import ApiService from "../services/api"
import SocketService from "../services/socket"
import { formatLastSeen, formatMessageTime } from "../utils/timeUtils"

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user) {
      loadUsers()
      setupSocketListeners()
    }

    return () => {
      SocketService.removeAllListeners()
    }
  }, [user])

  const setupSocketListeners = () => {
    SocketService.onUserOnline(({ userId }) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, isOnline: true, lastSeen: new Date() } : u)),
      )
    })

    SocketService.onUserOffline(({ userId, lastSeen }) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, isOnline: false, lastSeen: new Date(lastSeen) } : u)),
      )
    })

    SocketService.onNewMessage((message) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === message.sender.id
            ? {
                ...u,
                lastMessage: {
                  content: message.content,
                  createdAt: message.createdAt,
                  sender: message.sender.username,
                  status: message.status,
                },
                unreadCount: (u.unreadCount || 0) + 1,
              }
            : u,
        ),
      )
    })
  }

  const loadUsers = async () => {
    try {
      const response = await ApiService.getUsers()
      setUsers(response.users || [])
    } catch (error) {
      Alert.alert("Error", "Failed to load users")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadUsers()
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout, style: "destructive" },
    ])
  }

  const getStatusColor = (isOnline) => (isOnline ? "#25D366" : "#E0E0E0")

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() =>
        navigation.navigate("Chat", {
          userId: item.id,
          username: item.username,
          isOnline: item.isOnline,
          lastSeen: item.lastSeen,
        })
      }
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.username?.charAt(0).toUpperCase() || "?"}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.isOnline) }]} />
      </View>

      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.username}>{item.username || "Unknown User"}</Text>
          {item.lastMessage && <Text style={styles.messageTime}>{formatMessageTime(item.lastMessage.createdAt)}</Text>}
        </View>

        <View style={styles.messageRow}>
          {item.lastMessage ? (
            <View style={styles.lastMessageContainer}>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage.sender === user?.username ? "You: " : ""}
                {item.lastMessage.content}
              </Text>
              {item.lastMessage.sender === user?.username && (
                <Icon
                  name={
                    item.lastMessage.status === "read"
                      ? "done-all"
                      : item.lastMessage.status === "delivered"
                        ? "done-all"
                        : "done"
                  }
                  size={16}
                  color={item.lastMessage.status === "read" ? "#25D366" : "#999"}
                  style={styles.messageStatusIcon}
                />
              )}
            </View>
          ) : (
            <Text style={styles.noMessages}>No messages yet</Text>
          )}

          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount > 99 ? "99+" : item.unreadCount}</Text>
            </View>
          )}
        </View>

        <Text style={styles.lastSeen}>{item.isOnline ? "Online" : `Last seen ${formatLastSeen(item.lastSeen)}`}</Text>
      </View>
    </TouchableOpacity>
  )

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      <View style={styles.container}>
        <LinearGradient colors={["#075E54", "#128C7E"]} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Astro Chat App</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Icon name="more-vert" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.userProfile}>
            <View style={styles.currentUserAvatar}>
              <Text style={styles.currentUserAvatarText}>{user?.username?.charAt(0).toUpperCase() || "?"}</Text>
            </View>
            <Text style={styles.welcomeText}>Welcome, {user?.username || "User"}!</Text>
          </View>
        </LinearGradient>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#25D366"]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="chat" size={64} color="#E0E0E0" />
              <Text style={styles.emptyText}>{loading ? "Loading users..." : "No users found"}</Text>
              <Text style={styles.emptySubtext}>Pull down to refresh</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  logoutButton: {
    padding: 8,
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  currentUserAvatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  userItem: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "white",
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  lastMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  messageStatusIcon: {
    marginLeft: 4,
  },
  noMessages: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#25D366",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  lastSeen: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 15,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
})

export default HomeScreen
