import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export const SplashScreen = () => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const nextScreenRef = useRef('Onboarding');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            nextScreenRef.current = user ? 'App' : 'Onboarding';
        });
        return unsubscribe;
    }, []);

    // Animation values
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;
    const backgroundScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Background subtle zoom
        Animated.timing(backgroundScale, {
            toValue: 1.1,
            duration: 4000,
            useNativeDriver: true,
        }).start();

        // Logo Entrance
        Animated.parallel([
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]).start();

        // Reveal content
        setTimeout(() => {
            Animated.timing(contentOpacity, {
                toValue: 1,
                duration: 1000,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        }, 800);

        // Progress Bar
        Animated.timing(progressWidth, {
            toValue: 1,
            duration: 3500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false, // width is not supported by native driver
        }).start();

        // Navigation
        const timer = setTimeout(() => {
            navigation.replace(nextScreenRef.current);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    const barWidth = progressWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Animated.View
                style={{
                    flex: 1,
                    transform: [{ scale: backgroundScale }]
                }}
            >
                <LinearGradient
                    colors={theme.colors.headerGradient}
                    style={{ flex: 1 }}
                />
            </Animated.View>

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <SafeAreaView className="flex-1 justify-center items-center">
                    {/* Logo Section */}
                    <Animated.View
                        style={{
                            transform: [{ scale: logoScale }],
                            opacity: logoOpacity,
                            alignItems: 'center',
                        }}
                    >
                        <View style={{
                            width: 150,
                            height: 150,
                            backgroundColor: 'white',
                            borderRadius: 40,
                            padding: 25,
                            ...theme.shadows.lg,
                            shadowColor: 'black',
                            shadowOpacity: 0.2,
                        }}>
                            <Image
                                source={require('../../assets/logo.png')}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    resizeMode: 'contain',
                                }}
                            />
                        </View>
                    </Animated.View>

                    {/* App Name & Tagline */}
                    <Animated.View
                        style={{
                            opacity: contentOpacity,
                            alignItems: 'center',
                            marginTop: 30,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 44,
                                fontFamily: 'Poppins-Bold',
                                letterSpacing: 1,
                                textShadowColor: 'rgba(0,0,0,0.2)',
                                textShadowOffset: { width: 0, height: 4 },
                                textShadowRadius: 10,
                            }}
                        >
                            HamSync
                        </Text>
                        <Text
                            style={{
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: 16,
                                fontFamily: 'Inter-Medium',
                                marginTop: 4,
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                            }}
                        >
                            Unity in Learning
                        </Text>
                    </Animated.View>

                    {/* Minimal Loading Bar */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 80,
                            width: width * 0.5,
                            height: 4,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Animated.View
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: barWidth,
                                backgroundColor: 'white',
                                borderRadius: 2,
                            }}
                        />
                    </View>

                    <Animated.View style={{ position: 'absolute', bottom: 40, opacity: contentOpacity }}>
                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' }}>
                            v2.0 • Premium Edition
                        </Text>
                    </Animated.View>
                </SafeAreaView>
            </View>
        </View>
    );
};
