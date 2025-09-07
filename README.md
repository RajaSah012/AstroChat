# Real-Time Chat Application

A professional chat application built with React Native CLI and Node.js with Socket.IO for real-time messaging.

## Features

### 🚀 Core Features
- **Email/Password Authentication** - Secure login system
- **Real-time Messaging** - Instant message delivery using Socket.IO
- **Message Status** - Sent, Delivered, Read receipts with icons
- **Online Status** - See who's online with green indicators
- **Typing Indicators** - Animated dots when someone is typing

### 📱 Mobile App Features
- **Sender/Receiver Layout** - Messages properly aligned (sender right, receiver left)
- **Message Bubbles** - Professional chat bubbles with tails
- **Time Stamps** - Smart time formatting (just now, 5 min ago, etc.)
- **User Avatars** - Colorful avatars with initials
- **Pull to Refresh** - Refresh user list
- **Keyboard Handling** - Proper keyboard avoidance

### 🔧 Technical Features
- **JWT Authentication** - Secure token-based auth
- **MongoDB Database** - Persistent message storage
- **Socket.IO** - Real-time bidirectional communication
- **Message Delivery** - Reliable message delivery system
- **Error Handling** - Comprehensive error handling

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)


### Mobile App Setup

1. **Navigate to mobile directory:**
   \`\`\`bash
   cd mobile
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Install iOS dependencies (iOS only):**
   \`\`\`bash
   cd ios && pod install && cd ..
   \`\`\`


5. **Run the app:**
   \`\`\`bash
   # For Android
   npm run android

   # For iOS
   npm run ios
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users with last messages
- `GET /api/users/profile` - Get user profile

### Messages
- `GET /api/messages/:userId` - Get messages with specific user
- `POST /api/messages` - Send a message
- `PUT /api/messages/read/:senderId` - Mark messages as read

## Socket Events

### Client to Server
- `message:send` - Send a new message
- `message:delivered` - Confirm message delivery
- `message:read` - Confirm message read
- `messages:mark_read` - Mark all messages as read
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server to Client
- `message:new` - Receive new message
- `message:sent` - Message sent confirmation
- `message:delivered` - Message delivered confirmation
- `message:read` - Message read confirmation
- `messages:read` - All messages read confirmation
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `user_online` - User came online
- `user_offline` - User went offline


## Testing

1. **Register two users** with different email addresses
2. **Login with both users** on different devices/emulators
3. **Send messages** between users
4. **Verify real-time delivery** and status updates
5. **Test typing indicators** and online status

## Troubleshooting

### Common Issues

1. **Connection Issues:**
   - Make sure both devices are on the same network
   - Update IP address in API configuration
   - Check firewall settings

2. **MongoDB Connection:**
   - Ensure MongoDB is running
   - Check connection string in .env file

3. **Socket Connection:**
   - Verify server is running on correct port
   - Check network connectivity
   - Look for CORS issues

### Debug Tips

- Check server logs for errors
- Use React Native debugger for mobile issues
- Monitor network requests in development tools
- Check MongoDB logs for database issues


## Technologies Used

- **Frontend:** React Native CLI, React Navigation
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.IO
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** React Native StyleSheet

