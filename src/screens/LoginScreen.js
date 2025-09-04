import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native"

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in both email and password")
      return
    }

    Alert.alert("Login Successful", `Welcome ${email}!`, [
      {
        text: "Continue",
        onPress: () => navigation.navigate("Main"),
      },
    ])
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Please sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  loginButton: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
 
})

export default LoginScreen
