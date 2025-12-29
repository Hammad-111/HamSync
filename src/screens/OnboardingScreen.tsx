import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'SkillSwap',
        description: 'Learn from peers, teach what you love. Connect with students who share your interests.',
        icon: '🔄',
        gradient: ['#06B6D4', '#3B82F6'],
        accentColor: '#06B6D4',
    },
    {
        id: '2',
        title: 'UniGuide',
        description: 'Real-time merit and admission updates. Never miss a deadline again.',
        icon: '🎓',
        gradient: ['#8B5CF6', '#EC4899'],
        accentColor: '#8B5CF6',
    },
    {
        id: '3',
        title: 'Karma Points',
        description: 'Gain rewards by helping the community. Build your reputation as a helpful student.',
        icon: '✨',
        gradient: ['#F59E0B', '#EF4444'],
        accentColor: '#F59E0B',
    }
];

export const OnboardingScreen = () => {
    const navigation = useNavigation<any>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const particleAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Continuous particle animation
        Animated.loop(
            Animated.timing(particleAnim, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Glow pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Float animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            // Animate transition
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -50,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setCurrentIndex(currentIndex + 1);
                slideAnim.setValue(50);
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                ]).start();
            });
        } else {
            navigation.replace('Login');
        }
    };

    const handleSkip = () => {
        navigation.replace('Login');
    };

    const currentSlide = SLIDES[currentIndex];

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const floatTranslateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15],
    });

    const particleRotate = particleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <LinearGradient
            colors={['#1E0A3C', '#2E1065', '#3B1A8C', '#2E1065']}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                {/* Skip Button */}
                <View className="flex-row justify-end px-6 pt-4">
                    <TouchableOpacity
                        onPress={handleSkip}
                        className="px-6 py-2 rounded-full bg-white/10"
                    >
                        <Text className="text-white/70 font-inter font-semibold">Skip</Text>
                    </TouchableOpacity>
                </View>

                {/* Floating particles in background */}
                {[...Array(6)].map((_, index) => (
                    <FloatingParticle key={index} delay={index * 500} index={index} />
                ))}

                {/* Main Content */}
                <View className="flex-1 justify-center items-center px-6">
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideAnim },
                                { translateY: floatTranslateY },
                            ],
                        }}
                        className="w-full items-center"
                    >
                        {/* Animated glow ring */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                width: 200,
                                height: 200,
                                top: -20,
                                opacity: glowOpacity,
                            }}
                        >
                            <LinearGradient
                                colors={[currentSlide.gradient[0], currentSlide.gradient[1]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-full h-full rounded-full opacity-30 blur-3xl"
                            />
                        </Animated.View>

                        {/* Rotating ring */}
                        <Animated.View
                            style={{
                                transform: [{ rotate: particleRotate }],
                                position: 'absolute',
                                width: 180,
                                height: 180,
                                top: -10,
                            }}
                        >
                            <LinearGradient
                                colors={[currentSlide.gradient[0], currentSlide.gradient[1], 'transparent']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-full h-full rounded-full opacity-40"
                                style={{ borderWidth: 3, borderColor: 'transparent' }}
                            />
                        </Animated.View>

                        {/* Icon Container */}
                        <View className="w-40 h-40 rounded-full items-center justify-center mb-12 bg-white/5 backdrop-blur-xl">
                            <Text className="text-8xl">{currentSlide.icon}</Text>
                        </View>

                        {/* Title */}
                        <Text
                            className="text-white text-5xl font-poppins font-bold text-center mb-6"
                            style={{
                                textShadowColor: currentSlide.accentColor,
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 20,
                            }}
                        >
                            {currentSlide.title}
                        </Text>

                        {/* Description */}
                        <Text className="text-gray-200 font-inter text-center text-lg leading-7 px-4">
                            {currentSlide.description}
                        </Text>

                        {/* Feature highlights */}
                        <View className="flex-row mt-8 gap-2">
                            {[...Array(3)].map((_, i) => (
                                <View
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor: i === currentIndex ? currentSlide.accentColor : '#ffffff40',
                                    }}
                                />
                            ))}
                        </View>
                    </Animated.View>
                </View>

                {/* Paginator Dots */}
                <View className="flex-row justify-center items-center h-16 mb-4">
                    {SLIDES.map((slide, i) => (
                        <View
                            key={i}
                            className="mx-1.5 rounded-full"
                            style={{
                                width: i === currentIndex ? 32 : 8,
                                height: 8,
                                backgroundColor: i === currentIndex ? slide.accentColor : '#ffffff30',
                            }}
                        />
                    ))}
                </View>

                {/* Next/Get Started Button */}
                <View className="px-6 pb-8">
                    <TouchableOpacity
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[currentSlide.gradient[0], currentSlide.gradient[1]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-5 rounded-2xl shadow-2xl"
                            style={{
                                shadowColor: currentSlide.accentColor,
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.5,
                                shadowRadius: 16,
                            }}
                        >
                            <Text className="text-white text-center font-poppins font-bold text-lg tracking-wide">
                                {currentIndex === SLIDES.length - 1 ? 'Get Started 🚀' : 'Next →'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Progress indicator */}
                    <Text className="text-white/50 text-center mt-4 font-inter text-sm">
                        {currentIndex + 1} of {SLIDES.length}
                    </Text>
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
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(translateY, {
                            toValue: -80,
                            duration: 4000 + index * 300,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateY, {
                            toValue: 0,
                            duration: 4000 + index * 300,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(translateX, {
                            toValue: index % 2 === 0 ? 40 : -40,
                            duration: 3000 + index * 200,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateX, {
                            toValue: 0,
                            duration: 3000 + index * 200,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(opacity, {
                            toValue: 0.7,
                            duration: 2000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0.2,
                            duration: 2000,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(scale, {
                            toValue: 1.5,
                            duration: 2500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(scale, {
                            toValue: 1,
                            duration: 2500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            ).start();
        }, delay);
    }, []);

    const positions = [
        { top: 120, left: 40 },
        { top: 200, right: 50 },
        { top: 350, left: 30 },
        { bottom: 250, right: 60 },
        { bottom: 350, left: 50 },
        { top: 280, right: 30 },
    ];

    const colors = ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

    return (
        <Animated.View
            style={{
                position: 'absolute',
                ...positions[index],
                transform: [{ translateY }, { translateX }, { scale }],
                opacity,
            }}
        >
            <View
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors[index % colors.length],
                    shadowColor: colors[index % colors.length],
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                }}
            />
        </Animated.View>
    );
};
