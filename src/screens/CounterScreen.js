import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CounterScreen = () => {
  const [count, setCount] = useState(0)
  const [scaleValue] = useState(new Animated.Value(1))

  // Load saved count on component mount
  useEffect(() => {
    loadCount()
  }, [])

  // Save count whenever it changes
  useEffect(() => {
    saveCount()
  }, [count])

  const loadCount = async () => {
    try {
      const savedCount = await AsyncStorage.getItem("counter_value")
      if (savedCount !== null) {
        setCount(Number.parseInt(savedCount, 10))
      }
    } catch (error) {
      console.error("Error loading count:", error)
    }
  }

  const saveCount = async () => {
    try {
      await AsyncStorage.setItem("counter_value", count.toString())
    } catch (error) {
      console.error("Error saving count:", error)
    }
  }

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const increment = () => {
    setCount(count + 1)
    animateButton()
  }

  const decrement = () => {
    setCount(count - 1)
    animateButton()
  }

  const reset = () => {
    Alert.alert("Reset Counter", "Are you sure you want to reset the counter to 0?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setCount(0)
          animateButton()
        },
      },
    ])
  }

  const getCountColor = () => {
    if (count > 0) return "#28a745"
    if (count < 0) return "#dc3545"
    return "#6c757d"
  }

  const getCountMessage = () => {
    if (count === 0) return "Start counting!"
    if (count > 0) return `You've incremented ${count} times`
    return `You've decremented ${Math.abs(count)} times`
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>Current Count</Text>

          <Animated.View
            style={[
              styles.countDisplay,
              {
                transform: [{ scale: scaleValue }],
                borderColor: getCountColor(),
                borderWidth: 3,
              },
            ]}
          >
            <Text style={[styles.countText, { color: getCountColor() }]}>{count}</Text>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.decrementButton]} onPress={decrement}>
              <Text style={styles.buttonText}>−</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.incrementButton]} onPress={increment}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{getCountMessage()}</Text>
            <Text style={styles.persistText}>Counter value is automatically saved</Text>
          </View>
        </View>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  counterContainer: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    width: "100%",
    maxWidth: 300,
  },
  counterLabel: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    fontWeight: "500",
  },
  countDisplay: {
    backgroundColor: "#f8f9fa",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  countText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  incrementButton: {
    backgroundColor: "#28a745",
  },
  decrementButton: {
    backgroundColor: "#dc3545",
  },
  resetButton: {
    backgroundColor: "#6c757d",
    width: 80,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  infoContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 4,
  },
  persistText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
})

export default CounterScreen
