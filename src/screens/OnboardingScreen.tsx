import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { GradientBackground } from '../components/GradientBackground';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'SkillSwap',
        description: 'Learn from peers, teach what you love. Connect with students who share your interests.',
        iconName: 'swap-horizontal-outline'
    },
    {
        id: '2',
        title: 'UniGuide',
        description: 'Real-time merit and admission updates. Never miss a deadline again.',
        iconName: 'school-outline'
    },
    {
        id: '3',
        title: 'Reputation',
        description: 'Earn trust by helping the community. Build your professional standing as a helpful student.',
        iconName: 'ribbon-outline'
    }
];

export const OnboardingScreen = () => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
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
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
            ]).start(() => {
                setCurrentIndex(currentIndex + 1);
                slideAnim.setValue(30);
                Animated.parallel([
                    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
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
    const floatTranslateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15],
    });

    return (
        <GradientBackground variant="full" particleCount={6}>
            <SafeAreaView className="flex-1">
                {/* Skip Button */}
                <View className="flex-row justify-end px-6 pt-4">
                    <TouchableOpacity
                        onPress={handleSkip}
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', borderWidth: 1 }}
                        className="px-5 py-2 rounded-xl"
                    >
                        <Text style={{ color: theme.colors.text.inverse }} className="font-semibold text-sm">Skip</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View className="flex-1 justify-center items-center px-8">
                    <View className="w-full max-w-[500px] items-center">
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
                            {/* Icon Container */}
                            <View
                                style={{
                                    backgroundColor: theme.colors.surface,
                                    ...theme.shadows.lg,
                                    width: 160,
                                    height: 160,
                                }}
                                className="rounded-[40px] items-center justify-center mb-10 border border-black/5"
                            >
                                <Ionicons name={currentSlide.iconName as any} size={80} color={theme.colors.primary} />
                            </View>

                            {/* Title */}
                            <Text
                                style={{ color: theme.colors.text.primary }}
                                className="text-4xl font-poppins font-bold text-center mb-4"
                            >
                                {currentSlide.title}
                            </Text>

                            <Text
                                style={{ color: theme.colors.text.secondary }}
                                className="font-inter text-center text-lg leading-7 px-2"
                            >
                                {currentSlide.description}
                            </Text>
                        </Animated.View>
                    </View>
                </View>

                {/* Footer Section */}
                <View className="items-center pb-10">
                    <View className="w-full max-w-[500px] px-8">
                        {/* Progress Dots */}
                        <View className="flex-row justify-center items-center mb-10">
                            {SLIDES.map((_, i) => (
                                <View
                                    key={i}
                                    className="mx-1.5 rounded-full"
                                    style={{
                                        width: i === currentIndex ? 24 : 8,
                                        height: 8,
                                        backgroundColor: i === currentIndex ? theme.colors.primary : theme.colors.border,
                                    }}
                                />
                            ))}
                        </View>

                        {/* Next Button */}
                        <TouchableOpacity
                            onPress={handleNext}
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: theme.colors.primary,
                                ...theme.shadows.md
                            }}
                            className="py-4 rounded-2xl"
                        >
                            <Text style={{ color: theme.colors.text.inverse }} className="text-center font-bold text-lg tracking-wide">
                                {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                            </Text>
                        </TouchableOpacity>

                        {/* Indicator */}
                        <Text style={{ color: theme.colors.text.muted }} className="text-center mt-4 font-inter text-xs">
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
};
