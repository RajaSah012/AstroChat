import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { useAuth } from "../context/AuthContext"

import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import HomeScreen from "../screens/HomeScreen"
import ChatScreen from "../screens/ChatScreen"

const Stack = createStackNavigator()

const AppNavigator = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return null // You can add a loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: "#075E54",
                },
                headerTintColor: "white",
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
