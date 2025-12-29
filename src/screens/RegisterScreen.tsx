import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Easing, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailOnly } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { Ionicons } from '@expo/vector-icons';

export const RegisterScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [nameFocused, setNameFocused] = useState(false); // Focus state for Name
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmFocused, setConfirmFocused] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const particleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Initial entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 40,
                friction: 6,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous gentle floating animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Particle animation
        Animated.loop(
            Animated.timing(particleAnim, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            showToast("Almost there!", "Please fill in all the fields to create your account.", "error");
            return;
        }
        if (password !== confirmPassword) {
            showToast("Passwords don't match", "Make sure both password fields are identical.", "error");
            return;
        }

        try {
            const user = await createUserWithEmailOnly(email, password, name); // Pass name
            if (user) {
                showToast("Welcome aboard!", "Your account has been created successfully. Let's get you set up.", "success");
                navigation.replace('ProfileSetup');
            }
        } catch (error: any) {
            let errorMessage = "We couldn't create your account. Please try again.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered. Would you like to sign in instead?";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "This doesn't look like a valid email address. Please check and try again.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Your password is too weak. Please use at least 6 characters with a mix of letters and numbers.";
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = "Email sign-up is currently disabled. Please contact support.";
            }
            showToast("Registration unsuccessful", errorMessage, "error");
        }
    };

    return (
        <LinearGradient
            colors={['#1E0A3C', '#2E1065', '#3B1A8C', '#2E1065']}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Floating particles */}
                        {[...Array(6)].map((_, index) => (
                            <FloatingParticle key={index} delay={index * 400} index={index} />
                        ))}

                        <View className="flex-1 justify-center px-6 py-8">
                            {/* Logo Section */}
                            <Animated.View
                                style={{
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }, { scale: logoScale }],
                                }}
                                className="items-center mb-10"
                            >
                                {/* Floating animation */}
                                <Animated.View
                                    style={{
                                        transform: [{
                                            translateY: glowAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, -8],
                                            })
                                        }],
                                    }}
                                >
                                    <View
                                        className="w-28 h-28 rounded-full items-center justify-center bg-white/5 backdrop-blur-xl mb-4"
                                        style={{
                                            shadowColor: '#8B5CF6',
                                            shadowOffset: { width: 0, height: 6 },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 16,
                                        }}
                                    >
                                        <Image
                                            source={require('../../assets/logo.png')}
                                            style={{ width: 80, height: 80 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </Animated.View>

                                <Text
                                    className="text-white text-3xl font-poppins font-bold"
                                    style={{
                                        textShadowColor: '#8B5CF6',
                                        textShadowOffset: { width: 0, height: 0 },
                                        textShadowRadius: 20,
                                    }}
                                >
                                    Join HamSync
                                </Text>
                                <Text className="text-gray-300 font-inter text-center mt-2">
                                    Create your account to start learning.
                                </Text>
                            </Animated.View>

                            {/* Form Section */}
                            <Animated.View
                                style={{
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                }}
                            >
                                {/* Full Name Input */}
                                <View className="mb-4">
                                    <View
                                        className="rounded-2xl overflow-hidden"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: nameFocused ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <View className="bg-white/5 backdrop-blur-xl">
                                            <TextInput
                                                placeholder="Full Name"
                                                placeholderTextColor="#9ca3af"
                                                className="text-white p-4 font-inter"
                                                value={name}
                                                onChangeText={setName}
                                                onFocus={() => setNameFocused(true)}
                                                onBlur={() => setNameFocused(false)}
                                                autoCapitalize="words"
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Email Input */}
                                <View className="mb-4">
                                    <View
                                        className="rounded-2xl overflow-hidden"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: emailFocused ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <View className="bg-white/5 backdrop-blur-xl">
                                            <TextInput
                                                placeholder="Email Address"
                                                placeholderTextColor="#9ca3af"
                                                className="text-white p-4 font-inter"
                                                value={email}
                                                onChangeText={setEmail}
                                                onFocus={() => setEmailFocused(true)}
                                                onBlur={() => setEmailFocused(false)}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Password Input */}
                                <View className="mb-4">
                                    <View
                                        className="rounded-2xl overflow-hidden"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: passwordFocused ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <View className="bg-white/5 backdrop-blur-xl flex-row items-center">
                                            <TextInput
                                                placeholder="Password"
                                                placeholderTextColor="#9ca3af"
                                                secureTextEntry={!showPassword}
                                                className="text-white p-4 font-inter flex-1"
                                                value={password}
                                                onChangeText={setPassword}
                                                onFocus={() => setPasswordFocused(true)}
                                                onBlur={() => setPasswordFocused(false)}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}
                                                className="pr-4"
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons
                                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                                    size={22}
                                                    color="#9ca3af"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                {/* Confirm Password Input */}
                                <View className="mb-6">
                                    <View
                                        className="rounded-2xl overflow-hidden"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: confirmFocused ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <View className="bg-white/5 backdrop-blur-xl flex-row items-center">
                                            <TextInput
                                                placeholder="Confirm Password"
                                                placeholderTextColor="#9ca3af"
                                                secureTextEntry={!showConfirmPassword}
                                                className="text-white p-4 font-inter flex-1"
                                                value={confirmPassword}
                                                onChangeText={setConfirmPassword}
                                                onFocus={() => setConfirmFocused(true)}
                                                onBlur={() => setConfirmFocused(false)}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="pr-4"
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons
                                                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                                    size={22}
                                                    color="#9ca3af"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                {/* Sign Up Button */}
                                <TouchableOpacity
                                    onPress={handleRegister}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#8B5CF6', '#EC4899']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        className="py-4 rounded-2xl mb-4"
                                        style={{
                                            shadowColor: '#8B5CF6',
                                            shadowOffset: { width: 0, height: 8 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 12,
                                        }}
                                    >
                                        <Text className="text-white text-center font-poppins font-bold text-lg">
                                            Sign Up
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>

                            {/* Login Link */}
                            <Animated.View
                                style={{ opacity: fadeAnim }}
                                className="mt-6"
                            >
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text className="text-gray-400 text-center font-inter">
                                        Already have an account?{' '}
                                        <Text className="text-purple-400 font-bold">Login</Text>
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

// Floating particle component
const FloatingParticle = ({ delay, index }: { delay: number; index: number }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(translateY, {
                            toValue: -60,
                            duration: 3500 + index * 200,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateY, {
                            toValue: 0,
                            duration: 3500 + index * 200,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(translateX, {
                            toValue: index % 2 === 0 ? 30 : -30,
                            duration: 2500 + index * 150,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateX, {
                            toValue: 0,
                            duration: 2500 + index * 150,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(opacity, {
                            toValue: 0.6,
                            duration: 1500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0.2,
                            duration: 1500,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            ).start();
        }, delay);
    }, []);

    const positions = [
        { top: 100, left: 40 },
        { top: 180, right: 50 },
        { top: 300, left: 30 },
        { bottom: 200, right: 60 },
        { bottom: 300, left: 50 },
        { top: 240, right: 30 },
    ];

    const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#3B82F6'];

    return (
        <Animated.View
            style={{
                position: 'absolute',
                ...positions[index],
                transform: [{ translateY }, { translateX }],
                opacity,
            }}
        >
            <View
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors[index % colors.length],
                    shadowColor: colors[index % colors.length],
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 6,
                }}
            />
        </Animated.View>
    );
};
