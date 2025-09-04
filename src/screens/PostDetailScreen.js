import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share } from "react-native"

const PostDetailScreen = ({ route, navigation }) => {
  const { post } = route.params

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.title}\n\n${post.body}`,
        title: post.title,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.postContainer}>
          <Text style={styles.postTitle}>{post.title}</Text>

          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>Post ID: {post.id}</Text>
            <Text style={styles.metaText}>User ID: {post.userId}</Text>
          </View>

          <View style={styles.bodyContainer}>
            <Text style={styles.bodyLabel}>Content:</Text>
            <Text style={styles.postBody}>{post.body}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>Share Post</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Back to Posts</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 12,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
    textTransform: "capitalize",
    lineHeight: 28,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  bodyContainer: {
    marginBottom: 24,
  },
  bodyLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  postBody: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    textAlign: "justify",
  },
  buttonContainer: {
    gap: 12,
  },
  shareButton: {
    backgroundColor: "#17a2b8",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default PostDetailScreen
