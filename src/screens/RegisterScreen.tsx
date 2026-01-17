import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailOnly } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { GradientBackground } from '../components/GradientBackground';
import { ThemedInput } from '../components/ThemedInput';

export const RegisterScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            showToast("Almost there!", "Please fill in all the fields to create your account.", "error");
            return;
        }
        if (password !== confirmPassword) {
            showToast("Passwords don't match", "Make sure both password fields are identical.", "error");
            return;
        }

        setLoading(true);
        try {
            const user = await createUserWithEmailOnly(email, password, name);
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
        } finally {
            setLoading(false);
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
                        <View className="w-full max-w-[500px]">
                            {/* Logo Section */}
                            <View className="items-center mb-10">
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
                                    Join HamSync
                                </Text>
                                <Text style={{ color: theme.colors.text.inverse, opacity: 0.8 }} className="font-inter mt-1 text-sm">Empowering Your Academic Journey</Text>
                            </View>

                            {/* Form Section */}
                            <View
                                style={{
                                    backgroundColor: theme.colors.surface,
                                    ...theme.shadows.sm,
                                    padding: 24,
                                    borderRadius: 30,
                                    borderWidth: 1,
                                    borderColor: 'rgba(0,0,0,0.05)'
                                }}
                            >
                                <Text style={{ color: theme.colors.text.primary }} className="text-2xl font-poppins font-bold mb-6">Create Account</Text>

                                <ThemedInput
                                    placeholder="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    leftIcon="person-outline"
                                    autoCapitalize="words"
                                />

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

                                <ThemedInput
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    leftIcon="lock-closed-outline"
                                    rightIcon={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                    onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    secureTextEntry={!showConfirmPassword}
                                />

                                <TouchableOpacity
                                    onPress={handleRegister}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        ...theme.shadows.md,
                                        opacity: loading ? 0.7 : 1,
                                    }}
                                    className="py-4 rounded-2xl mt-4"
                                >
                                    <Text style={{ color: theme.colors.text.inverse }} className="text-center font-bold text-lg">
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>

                                {/* Login Link */}
                                <View className="mt-8 flex-row justify-center">
                                    <Text style={{ color: theme.colors.text.muted }} className="font-inter text-xs">
                                        Already have an account?{' '}
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={{ color: theme.colors.primary }} className="font-bold text-xs underline">Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};
