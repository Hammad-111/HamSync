import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, Easing, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { loginWithEmail } from '../services/authService';
import { ActivityIndicator } from 'react-native';
import { useToast } from '../contexts/ToastContext';
import { Ionicons } from '@expo/vector-icons';

export const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

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

        // Continuous subtle pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2500,
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

    const handleEmailLogin = async () => {
        if (!email || !password) {
            showToast("Hold on!", "Please fill in both your email and password to continue.", "error");
            return;
        }

        setIsLoading(true);
        try {
            const user = await loginWithEmail(email, password);
            if (user) {
                showToast("Welcome back!", "You're all set. Let's get started.", "success");
                navigation.replace('App');
            }
        } catch (error: any) {
            let errorMessage = "We couldn't sign you in. Please try again.";
            if (error.code === 'auth/invalid-credential') {
                errorMessage = "The email or password you entered doesn't match our records. Please double-check and try again.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "This doesn't look like a valid email address. Please check and try again.";
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = "We couldn't find an account with this email. Would you like to sign up instead?";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "The password you entered is incorrect. Please try again.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many failed attempts. Please wait a moment before trying again.";
            }
            showToast("Unable to sign in", errorMessage, "error");
        } finally {
            setIsLoading(false);
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
                                className="items-center mb-12"
                            >
                                {/* Subtle shadow effect */}
                                <Animated.View
                                    style={{
                                        transform: [{
                                            scale: glowAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.05],
                                            })
                                        }],
                                    }}
                                >
                                    <View
                                        className="w-32 h-32 rounded-full items-center justify-center bg-white/5 backdrop-blur-xl mb-6"
                                        style={{
                                            shadowColor: '#06B6D4',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.2,
                                            shadowRadius: 12,
                                        }}
                                    >
                                        <Image
                                            source={require('../../assets/logo.png')}
                                            style={{ width: 100, height: 100 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </Animated.View>

                                <Text
                                    className="text-white text-4xl font-poppins font-bold"
                                    style={{
                                        textShadowColor: '#06B6D4',
                                        textShadowOffset: { width: 0, height: 0 },
                                        textShadowRadius: 20,
                                    }}
                                >
                                    HamSync
                                </Text>
                                <Text className="text-gray-300 font-inter mt-2 text-base">Welcome back!</Text>
                            </Animated.View>

                            {/* Form Section */}
                            <Animated.View
                                style={{
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                }}
                            >
                                <Text className="text-white text-2xl font-poppins font-bold mb-6">Login</Text>

                                {/* Email Input */}
                                <View className="mb-4">
                                    <View
                                        className="rounded-2xl overflow-hidden"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: emailFocused ? '#06B6D4' : 'rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <View className="bg-white/5 backdrop-blur-xl">
                                            <TextInput
                                                placeholder="Email"
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
                                <View className="mb-6">
                                    <View
                                        className="rounded-2xl overflow-hidden"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: passwordFocused ? '#06B6D4' : 'rgba(255,255,255,0.1)',
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

                                {/* Sign In Button */}
                                <TouchableOpacity
                                    onPress={handleEmailLogin}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#06B6D4', '#3B82F6']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        className="py-4 rounded-2xl mb-4"
                                        style={{
                                            shadowColor: '#06B6D4',
                                            shadowOffset: { width: 0, height: 8 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 12,
                                            opacity: isLoading ? 0.7 : 1,
                                        }}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <Text className="text-white text-center font-poppins font-bold text-lg">
                                                Sign In
                                            </Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>

                            {/* Sign Up Link */}
                            <Animated.View
                                style={{ opacity: fadeAnim }}
                                className="mt-8"
                            >
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text className="text-gray-400 text-center font-inter">
                                        Don't have an account?{' '}
                                        <Text className="text-cyan-400 font-bold">Sign Up</Text>
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

    const colors = ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];

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
