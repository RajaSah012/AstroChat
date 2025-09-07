export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "recently"

  const now = new Date()
  const lastSeenDate = new Date(lastSeen)
  const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60))

  if (diffInMinutes < 1) return "just now"
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hours ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} days ago`

  return lastSeenDate.toLocaleDateString()
}

export const formatMessageTime = (timestamp) => {
  if (!timestamp) return ""

  const date = new Date(timestamp)
  const now = new Date()
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diffInDays === 1) {
    return "Yesterday"
  } else if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" })
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }
}

export const formatChatTime = (timestamp) => {
  if (!timestamp) return ""

  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
