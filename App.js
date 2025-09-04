import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/MaterialIcons"


import LoginScreen from "./src/screens/LoginScreen"
import PostsScreen from "./src/screens/PostsScreen"
import PostDetailScreen from "./src/screens/PostDetailScreen"
import CounterScreen from "./src/screens/CounterScreen"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Stack Navigator for Posts
function PostsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostsList" component={PostsScreen} options={{ title: "Posts" }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: "Post Details" }} />
    </Stack.Navigator>
  )
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Posts") {
            iconName = "article"
          } else if (route.name === "Counter") {
            iconName = "calculate"
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#28a745",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen
        name="Posts"
        component={PostsStackNavigator}
        options={{
          tabBarLabel: "Posts",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Counter"
        component={CounterScreen}
        options={{
          tabBarLabel: "Counter",
        }}
      />
    </Tab.Navigator>
  )
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
