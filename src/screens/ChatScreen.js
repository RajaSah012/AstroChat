import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useAuth } from "../context/AuthContext"
import ApiService from "../services/api"
import SocketService from "../services/socket"
import { formatLastSeen } from "../utils/timeUtils"

const { width } = Dimensions.get("window")

const ChatScreen = ({ route, navigation }) => {
  const { userId, username, isOnline: initialOnlineStatus, lastSeen: initialLastSeen } = route.params
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [otherUserOnline, setOtherUserOnline] = useState(initialOnlineStatus)
  const [otherUserLastSeen, setOtherUserLastSeen] = useState(initialLastSeen)
  const flatListRef = useRef()
  const typingTimeoutRef = useRef()

  useEffect(() => {
    if (user) {
      loadMessages()
      setupSocketListeners()
      SocketService.markMessagesAsRead(userId, user.id)
    }

    return () => {
      SocketService.removeAllListeners()
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [user])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerUsername}>{username}</Text>
          <Text style={styles.headerStatus}>
            {otherUserOnline ? "online" : `last seen ${formatLastSeen(otherUserLastSeen)}`}
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#075E54",
        elevation: 4,
        shadowOpacity: 0.3,
      },
      headerTintColor: "white",
      headerTitleStyle: {
        fontWeight: "bold",
      },
      headerLeft: () => (
        <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{username?.charAt(0).toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      ),
    })
  }, [otherUserOnline, otherUserLastSeen, username])

  const setupSocketListeners = () => {
    SocketService.onNewMessage((message) => {
      if (message.sender.id === userId) {
        setMessages((prevMessages) => [...prevMessages, message])
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true })
        }, 100)
        SocketService.markMessageAsRead(message.id, message.sender.id)
      }
    })

    SocketService.onMessageSent((message) => {
      setMessages((prevMessages) => [...prevMessages, message])
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    })

    SocketService.onMessageDelivered(({ messageId, deliveredAt }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "delivered", deliveredAt } : msg)),
      )
    })

    SocketService.onMessageRead(({ messageId, readAt }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "read", readAt } : msg)),
      )
    })

    SocketService.onMessagesRead(({ receiverId, readAt }) => {
      if (receiverId === user?.id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.sender.id === user.id && msg.receiver.id === userId ? { ...msg, status: "read", readAt } : msg,
          ),
        )
      }
    })

    SocketService.onTypingStart(({ senderId }) => {
      if (senderId === userId) {
        setOtherUserTyping(true)
      }
    })

    SocketService.onTypingStop(({ senderId }) => {
      if (senderId === userId) {
        setOtherUserTyping(false)
      }
    })

    SocketService.onUserOnline(({ userId: onlineUserId }) => {
      if (onlineUserId === userId) {
        setOtherUserOnline(true)
        setOtherUserLastSeen(new Date())
      }
    })

    SocketService.onUserOffline(({ userId: offlineUserId, lastSeen }) => {
      if (offlineUserId === userId) {
        setOtherUserOnline(false)
        setOtherUserLastSeen(new Date(lastSeen))
      }
    })
  }

  const loadMessages = async () => {
    try {
      const response = await ApiService.getMessages(userId)
      setMessages(response.messages || [])
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false })
      }, 100)
    } catch (error) {
      Alert.alert("Error", "Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return

    const messageData = {
      receiverId: userId,
      senderId: user.id,
      content: newMessage.trim(),
    }

    SocketService.sendMessage(messageData)
    setNewMessage("")
    stopTyping()
  }

  const handleTextChange = (text) => {
    setNewMessage(text)

    if (text.length > 0 && !isTyping && user) {
      setIsTyping(true)
      SocketService.startTyping(userId, user.id)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 1000)
  }

  const stopTyping = () => {
    if (isTyping && user) {
      setIsTyping(false)
      SocketService.stopTyping(userId, user.id)
    }
  }

  const getMessageStatusIcon = (message) => {
    if (message.sender.id !== user?.id) return null

    switch (message.status) {
      case "sent":
        return <Icon name="done" size={16} color="#999" style={styles.statusIcon} />
      case "delivered":
        return <Icon name="done-all" size={16} color="#999" style={styles.statusIcon} />
      case "read":
        return <Icon name="done-all" size={16} color="#4FC3F7" style={styles.statusIcon} />
      default:
        return <Icon name="schedule" size={16} color="#999" style={styles.statusIcon} />
    }
  }

  const renderMessage = ({ item, index }) => {
    const isMyMessage = item.sender.id === user?.id
    const nextMessage = messages[index + 1]
    const isLastInGroup = !nextMessage || nextMessage.sender.id !== item.sender.id

    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer]}>
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
            isLastInGroup && isMyMessage && styles.myMessageTail,
            isLastInGroup && !isMyMessage && styles.otherMessageTail,
          ]}
        >
          <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
            {item.content}
          </Text>

          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isMyMessage ? styles.myMessageTime : styles.otherMessageTime]}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
            {getMessageStatusIcon(item)}
          </View>
        </View>
      </View>
    )
  }

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
        {/* Chat Background */}
        <View style={styles.chatBackground}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="chat-bubble-outline" size={64} color="#E0E0E0" />
                <Text style={styles.emptyText}>{loading ? "Loading messages..." : "No messages yet"}</Text>
                <Text style={styles.emptySubtext}>{loading ? "Please wait..." : "Start the conversation!"}</Text>
              </View>
            }
          />

          {otherUserTyping && (
            <View style={styles.typingIndicator}>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Input Container */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={newMessage}
                onChangeText={handleTextChange}
                placeholder="Type a message"
                placeholderTextColor="#999"
                multiline
                maxLength={1000}
                textAlignVertical="center"
              />
              <TouchableOpacity
                style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!newMessage.trim()}
              >
                <Icon name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECE5DD",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    alignItems: "flex-start",
    marginLeft: -10,
  },
  headerUsername: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  headerStatus: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  headerBackButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  headerAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  chatBackground: {
    flex: 1,
    backgroundColor: "#ECE5DD",
  },
  messagesList: {
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 1,
    paddingHorizontal: 8,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: width * 0.8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  myMessageBubble: {
    backgroundColor: "#DCF8C6",
    borderBottomRightRadius: 2,
  },
  otherMessageBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 2,
  },
  myMessageTail: {
    borderBottomRightRadius: 2,
  },
  otherMessageTail: {
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: "#000",
  },
  otherMessageText: {
    color: "#000",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 2,
  },
  messageTime: {
    fontSize: 11,
    marginRight: 4,
  },
  myMessageTime: {
    color: "#999",
  },
  otherMessageTime: {
    color: "#999",
  },
  statusIcon: {
    marginLeft: 2,
  },
  typingIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: "flex-start",
  },
  typingBubble: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#999",
    marginHorizontal: 1,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  inputContainer: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    maxHeight: 100,
    minHeight: 20,
    paddingVertical: 8,
    textAlignVertical: "center",
  },
  sendButton: {
    backgroundColor: "#25D366",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#E0E0E0",
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

export default ChatScreen
