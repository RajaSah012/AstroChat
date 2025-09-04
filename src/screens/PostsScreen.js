import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native"

const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts")
      const data = await response.json()
      setPosts(data.slice(0, 20)) // Limit to 20 posts for better performance
    } catch (error) {
      Alert.alert("Error", "Failed to fetch posts. Please check your internet connection.")
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchPosts()
  }

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.postCard} onPress={() => navigation.navigate("PostDetail", { post: item })}>
      <Text style={styles.postTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.postBody} numberOfLines={3}>
        {item.body}
      </Text>
      <View style={styles.postFooter}>
        <Text style={styles.postId}>Post #{item.id}</Text>
        <Text style={styles.readMore}>Read More →</Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Latest Posts</Text>
            <Text style={styles.headerSubtitle}>{posts.length} posts available</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>End of List</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  headerContainer: {
    backgroundColor: "#28a745",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  postCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  postBody: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postId: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  readMore: {
    fontSize: 14,
    color: "#28a745",
    fontWeight: "600",
  },
  footerContainer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
})

export default PostsScreen