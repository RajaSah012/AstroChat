import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Animated,
    Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Login = ({ navigation, setIsLoggedIn }) => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const animate = new Animated.Value(0);

    // Hardcoded OTP for simulation
    const dummyOtp = '123456';

    const handleSendOtp = () => {
        if (!mobile) {
            Alert.alert('Error', 'Please enter a valid mobile number.');
            return;
        }
        setIsOtpSent(true);
        Alert.alert('Success', `OTP sent to ${mobile}. Use ${dummyOtp} to verify.`);
    };

    const handleVerifyOtp = () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid OTP.');
            return;
        }
        if (otp === dummyOtp) {
            setIsLoggedIn(true); // Update login status
            Alert.alert('Success', 'Login successful!');
        } else {
            Alert.alert('Error', 'Invalid OTP. Please try again.');
        }
    };

    const animateInput = (inputName) => {
        setFocusedInput(inputName);
        Animated.timing(animate, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: false,
        }).start();
    };

    return (
        <LinearGradient colors={['#1E1E1E', '#2C2C2C']} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome Back!</Text>
                    <Text style={styles.subtitle}>Login to continue</Text>
                </View>

                <View style={styles.formContainer}>
                    {!isOtpSent ? (
                        <>
                            <View style={styles.inputContainer}>
                                <Icon name="phone" size={20} color="#ccc" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mobile Number"
                                    placeholderTextColor="#ccc"
                                    value={mobile}
                                    onChangeText={setMobile}
                                    keyboardType="phone-pad"
                                    onFocus={() => animateInput('mobile')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
                                <Text style={styles.buttonText}>Send OTP</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.otpText}>Enter OTP sent to {mobile}</Text>
                            <View style={styles.inputContainer}>
                                <Icon name="lock" size={20} color="#ccc" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="OTP"
                                    placeholderTextColor="#ccc"
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="number-pad"
                                    onFocus={() => animateInput('otp')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                                <Text style={styles.buttonText}>Verify OTP</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                        <Text style={styles.linkText}>Don't have an account? Register</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
    },
    formContainer: {
        paddingHorizontal: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#FF7E5F',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    otpText: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 20,
    },
    linkText: {
        marginTop: 20,
        color: '#FF7E5F',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default Login;