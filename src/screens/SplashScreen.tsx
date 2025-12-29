import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export const SplashScreen = () => {
    const navigation = useNavigation<any>();
    const nextScreenRef = useRef('Onboarding');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            nextScreenRef.current = user ? 'App' : 'Onboarding';
        });
        return unsubscribe;
    }, []);

    // Animation values
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const particleAnim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(-1)).current;
    const starBurstAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Logo entrance animation with bounce
        Animated.parallel([
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 40,
                friction: 6,
                useNativeDriver: true,
            }),
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        // Title fade in after logo
        setTimeout(() => {
            Animated.timing(titleOpacity, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        }, 600);

        // Tagline fade in
        setTimeout(() => {
            Animated.timing(taglineOpacity, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        }, 1000);

        // Continuous pulse animation for logo
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Rotation animation
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Glow pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Particle expansion animation
        Animated.loop(
            Animated.timing(particleAnim, {
                toValue: 1,
                duration: 3000,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            })
        ).start();

        // Shimmer effect
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Star burst animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(starBurstAnim, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(starBurstAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Wave animation
        Animated.loop(
            Animated.timing(waveAnim, {
                toValue: 1,
                duration: 3500,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            })
        ).start();

        // Navigate to Onboarding after 4.5 seconds
        const timer = setTimeout(() => {
            navigation.replace(nextScreenRef.current);
        }, 4500);

        return () => clearTimeout(timer);
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    const particleScale = particleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1.5],
    });

    const particleOpacity = particleAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.6, 0.3, 0],
    });

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-200, 200],
    });

    const starBurstScale = starBurstAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 2],
    });

    const starBurstOpacity = starBurstAnim.interpolate({
        inputRange: [0, 0.3, 1],
        outputRange: [0.8, 0.4, 0],
    });

    const waveTranslateY = waveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    return (
        <LinearGradient
            colors={['#1E0A3C', '#2E1065', '#3B1A8C', '#2E1065']}
            className="flex-1"
        >
            <SafeAreaView className="flex-1 justify-center items-center">
                {/* Floating particles in background */}
                {[...Array(8)].map((_, index) => (
                    <FloatingParticle key={index} delay={index * 400} index={index} />
                ))}

                {/* Animated wave rings */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        width: 350,
                        height: 350,
                        transform: [{ translateY: waveTranslateY }],
                        opacity: 0.15,
                    }}
                >
                    <View className="w-full h-full rounded-full border-2 border-cyan-300" />
                </Animated.View>

                {/* Expanding particle rings */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        width: 300,
                        height: 300,
                        transform: [{ scale: particleScale }],
                        opacity: particleOpacity,
                    }}
                >
                    <View className="w-full h-full rounded-full border-2 border-cyan-400/20" />
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        width: 250,
                        height: 250,
                        transform: [{ scale: particleScale }],
                        opacity: particleOpacity,
                    }}
                >
                    <View className="w-full h-full rounded-full border-2 border-purple-400/20" />
                </Animated.View>

                <View className="items-center">
                    {/* Animated Logo Container */}
                    <Animated.View
                        style={{
                            transform: [
                                { scale: Animated.multiply(logoScale, pulseAnim) },
                            ],
                            opacity: logoOpacity,
                        }}
                    >
                        <View className="relative">
                            {/* Star burst effect */}
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    width: 200,
                                    height: 200,
                                    top: -34,
                                    left: -34,
                                    transform: [{ scale: starBurstScale }],
                                    opacity: starBurstOpacity,
                                }}
                            >
                                {[...Array(8)].map((_, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            position: 'absolute',
                                            width: 3,
                                            height: 40,
                                            backgroundColor: '#06B6D4',
                                            top: 80,
                                            left: 98.5,
                                            transform: [{ rotate: `${i * 45}deg` }],
                                            borderRadius: 2,
                                        }}
                                    />
                                ))}
                            </Animated.View>

                            {/* Outer glow ring */}
                            <Animated.View
                                style={{
                                    opacity: glowOpacity,
                                    position: 'absolute',
                                    width: 160,
                                    height: 160,
                                    top: -14,
                                    left: -14,
                                }}
                            >
                                <LinearGradient
                                    colors={['#06B6D4', '#3B82F6', '#8B5CF6', '#06B6D4']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="w-full h-full rounded-full opacity-40 blur-xl"
                                />
                            </Animated.View>

                            {/* Rotating gradient ring */}
                            <Animated.View
                                style={{
                                    transform: [{ rotate }],
                                    position: 'absolute',
                                    width: 150,
                                    height: 150,
                                    top: -9,
                                    left: -9,
                                }}
                            >
                                <LinearGradient
                                    colors={['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="w-full h-full rounded-full opacity-50"
                                />
                            </Animated.View>

                            {/* Secondary rotating ring (opposite direction) */}
                            <Animated.View
                                style={{
                                    transform: [{ rotate: `${360}deg` }, { rotate: rotate }],
                                    position: 'absolute',
                                    width: 145,
                                    height: 145,
                                    top: -6.5,
                                    left: -6.5,
                                }}
                            >
                                <LinearGradient
                                    colors={['#EC4899', '#8B5CF6', '#3B82F6', '#06B6D4']}
                                    start={{ x: 1, y: 1 }}
                                    end={{ x: 0, y: 0 }}
                                    className="w-full h-full rounded-full opacity-30"
                                />
                            </Animated.View>

                            {/* Logo with shimmer effect */}
                            <View className="relative overflow-hidden rounded-full" style={{ width: 132, height: 132 }}>
                                <Image
                                    source={require('../../assets/logo.png')}
                                    style={{
                                        width: 132,
                                        height: 132,
                                        resizeMode: 'contain',
                                    }}
                                />
                                {/* Shimmer overlay */}
                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        transform: [{ translateX: shimmerTranslate }],
                                    }}
                                >
                                    <LinearGradient
                                        colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ width: 100, height: '100%' }}
                                    />
                                </Animated.View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* App Name with glow */}
                    <Animated.View style={{ opacity: titleOpacity }} className="mt-10">
                        <Text
                            className="text-white text-4xl font-poppins font-bold tracking-wider"
                            style={{
                                textShadowColor: '#06B6D4',
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 20,
                            }}
                        >
                            HamSync
                        </Text>
                    </Animated.View>

                    {/* Tagline */}
                    <Animated.View style={{ opacity: taglineOpacity }} className="mt-3">
                        <Text className="text-cyan-200 text-base font-inter tracking-wide">
                            Connect. Learn. Excel.
                        </Text>
                    </Animated.View>

                    {/* Enhanced Loading Indicator */}
                    <Animated.View style={{ opacity: taglineOpacity }} className="mt-14">
                        <View className="flex-row gap-3">
                            {[0, 1, 2].map((index) => (
                                <LoadingDot key={index} delay={index * 250} />
                            ))}
                        </View>
                    </Animated.View>
                </View>
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
                            toValue: -100,
                            duration: 3000 + index * 200,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateY, {
                            toValue: 0,
                            duration: 3000 + index * 200,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(translateX, {
                            toValue: index % 2 === 0 ? 30 : -30,
                            duration: 2000 + index * 150,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateX, {
                            toValue: 0,
                            duration: 2000 + index * 150,
                            easing: Easing.inOut(Easing.ease),
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
        { top: 100, left: 50 },
        { top: 150, right: 60 },
        { top: 250, left: 30 },
        { top: 300, right: 40 },
        { bottom: 200, left: 70 },
        { bottom: 250, right: 50 },
        { bottom: 350, left: 40 },
        { bottom: 400, right: 80 },
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
                }}
            />
        </Animated.View>
    );
};

// Enhanced loading dot component with animation
const LoadingDot = ({ delay }: { delay: number }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(opacity, {
                            toValue: 1,
                            duration: 700,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0.3,
                            duration: 700,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(scale, {
                            toValue: 1.3,
                            duration: 700,
                            useNativeDriver: true,
                        }),
                        Animated.timing(scale, {
                            toValue: 1,
                            duration: 700,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            ).start();
        }, delay);
    }, []);

    return (
        <Animated.View
            style={{
                opacity,
                transform: [{ scale }],
            }}
            className="w-2.5 h-2.5 bg-cyan-400 rounded-full"
        />
    );
};
