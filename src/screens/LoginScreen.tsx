import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { loginWithEmail } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedInput } from '../components/ThemedInput';
import { GradientBackground } from '../components/GradientBackground';

export const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;

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
        <GradientBackground variant="full" particleCount={4}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 justify-center items-center px-8 py-8">
                        <View className="w-full max-w-[450px]">
                            {/* Logo Section */}
                            <Animated.View
                                style={{
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }, { scale: logoScale }],
                                }}
                                className="items-center mb-10"
                            >
                                <View
                                    style={{
                                        backgroundColor: theme.colors.surface,
                                        ...theme.shadows.lg,
                                        width: 100,
                                        height: 100,
                                    }}
                                    className="rounded-[30px] items-center justify-center mb-6 border border-black/5"
                                >
                                    <Image
                                        source={require('../../assets/logo.png')}
                                        style={{ width: 70, height: 70 }}
                                        resizeMode="contain"
                                    />
                                </View>

                                <Text
                                    style={{ color: theme.colors.text.inverse }}
                                    className="text-4xl font-poppins font-bold"
                                >
                                    HamSync
                                </Text>
                                <Text style={{ color: theme.colors.text.inverse, opacity: 0.8 }} className="font-inter mt-1 text-sm">Unity in Learning</Text>
                            </Animated.View>

                            {/* Form Section */}
                            <Animated.View
                                style={{
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                    backgroundColor: theme.colors.surface,
                                    ...theme.shadows.sm,
                                    padding: 24,
                                    borderRadius: 30,
                                    borderWidth: 1,
                                    borderColor: 'rgba(0,0,0,0.05)'
                                }}
                            >
                                <Text style={{ color: theme.colors.text.primary }} className="text-2xl font-poppins font-bold mb-6">Welcome Back</Text>

                                <ThemedInput
                                    placeholder="Email Address"
                                    value={email}
                                    onChangeText={setEmail}
                                    leftIcon="mail-outline"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />

                                <ThemedInput
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    leftIcon="lock-closed-outline"
                                    rightIcon={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    onRightIconPress={() => setShowPassword(!showPassword)}
                                    secureTextEntry={!showPassword}
                                />

                                <TouchableOpacity
                                    className="items-end mb-6"
                                    onPress={() => showToast("Coming Soon", "Password reset functionality will be available in the next update.", "info")}
                                >
                                    <Text style={{ color: theme.colors.primary }} className="font-semibold text-xs">Forgot Password?</Text>
                                </TouchableOpacity>

                                {/* Sign In Button */}
                                <TouchableOpacity
                                    onPress={handleEmailLogin}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        ...theme.shadows.md,
                                        opacity: isLoading ? 0.7 : 1,
                                    }}
                                    className="py-4 rounded-2xl"
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={{ color: theme.colors.text.inverse }} className="text-center font-bold text-lg">
                                            Sign In
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                {/* Sign Up Link */}
                                <View className="mt-8 flex-row justify-center">
                                    <Text style={{ color: theme.colors.text.muted }} className="font-inter text-xs">
                                        New here?{' '}
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                        <Text style={{ color: theme.colors.primary }} className="font-bold text-xs underline">Create Account</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};
