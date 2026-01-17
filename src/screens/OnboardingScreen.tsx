import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { GradientBackground } from '../components/GradientBackground';
import { Icons8Icon } from '../components/Icons8Icon';

const SLIDES = [
    {
        id: '1',
        title: 'SkillSwap',
        description: 'Learn from peers, teach what you love. Connect with students who share your interests.',
        iconName: 'rocket'
    },
    {
        id: '2',
        title: 'UniGuide',
        description: 'Real-time merit and admission updates. Never miss a deadline again.',
        iconName: 'school-32'
    },
    {
        id: '3',
        title: 'Reputation',
        description: 'Earn trust by helping the community. Build your professional standing as a helpful student.',
        iconName: 'medal'
    }
];

export const OnboardingScreen = () => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const { width, height } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Responsive scaling
    const isSmallDevice = width < 375;
    const isTablet = width >= 768;
    const iconSize = isTablet ? 180 : (isSmallDevice ? 120 : 160);
    const titleSize = isTablet ? 'text-5xl' : (isSmallDevice ? 'text-3xl' : 'text-4xl');
    const descSize = isTablet ? 'text-xl' : (isSmallDevice ? 'text-base' : 'text-lg');

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
                Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: -30, duration: 250, useNativeDriver: true }),
            ]).start(() => {
                setCurrentIndex(currentIndex + 1);
                slideAnim.setValue(30);
                Animated.parallel([
                    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
                    Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
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
        <GradientBackground variant="full" particleCount={isTablet ? 10 : 6}>
            <SafeAreaView className="flex-1">
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    {/* Skip Button */}
                    <View className="flex-row justify-end px-6 pt-4">
                        <TouchableOpacity
                            onPress={handleSkip}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderColor: 'rgba(255,255,255,0.25)',
                                borderWidth: 1,
                                borderRadius: theme.borderRadius.md
                            }}
                            className="px-5 py-2"
                        >
                            <Text style={{ color: theme.colors.text.inverse }} className="font-semibold text-sm">Skip</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Main Content */}
                    <View className="flex-1 justify-center items-center px-8 py-10">
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { translateY: floatTranslateY },
                                ],
                                width: '100%',
                                maxWidth: isTablet ? 600 : 500,
                            }}
                            className="items-center"
                        >
                            {/* Icon Container */}
                            <View
                                style={{
                                    backgroundColor: theme.colors.surface,
                                    ...theme.shadows.lg,
                                    width: iconSize,
                                    height: iconSize,
                                    borderRadius: isTablet ? 60 : 45,
                                    borderWidth: 1.5,
                                    borderColor: theme.colors.border,
                                }}
                                className="items-center justify-center mb-10 overflow-hidden"
                            >
                                <Icons8Icon
                                    name={currentSlide.iconName}
                                    size={iconSize * 0.55}
                                    color={theme.colors.primary}
                                />
                                {/* Bottom Accent decoration */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: -5,
                                        width: '100%',
                                        height: 10,
                                        backgroundColor: theme.colors.primary,
                                        opacity: 0.1
                                    }}
                                />
                            </View>

                            {/* Title */}
                            <Text
                                style={{ color: theme.colors.text.inverse }}
                                className={`${titleSize} font-poppins font-bold text-center mb-5 tracking-tight`}
                            >
                                {currentSlide.title}
                            </Text>

                            {/* Description */}
                            <Text
                                style={{ color: theme.colors.text.inverse, opacity: 0.9 }}
                                className={`font-inter text-center ${descSize} leading-relaxed px-4`}
                            >
                                {currentSlide.description}
                            </Text>
                        </Animated.View>
                    </View>

                    {/* Footer Section */}
                    <View className="items-center px-8 pb-12">
                        <View style={{ width: '100%', maxWidth: isTablet ? 500 : 400 }}>
                            {/* Progress Dots */}
                            <View className="flex-row justify-center items-center mb-12">
                                {SLIDES.map((_, i) => (
                                    <View
                                        key={i}
                                        className="mx-2 rounded-full"
                                        style={{
                                            width: i === currentIndex ? 32 : 10,
                                            height: 10,
                                            backgroundColor: i === currentIndex ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
                                            borderWidth: 1,
                                            borderColor: i === currentIndex ? 'transparent' : 'rgba(255,255,255,0.1)'
                                        }}
                                    />
                                ))}
                            </View>

                            {/* Next Button */}
                            <TouchableOpacity
                                onPress={handleNext}
                                activeOpacity={0.9}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: isTablet ? 20 : 16,
                                    borderRadius: theme.borderRadius.xl,
                                    ...theme.shadows.lg
                                }}
                                className="w-full flex-row justify-center items-center"
                            >
                                <Text
                                    style={{ color: theme.colors.primary }}
                                    className="text-center font-bold text-lg tracking-wider"
                                >
                                    {currentIndex === SLIDES.length - 1 ? 'GET STARTED' : 'CONTINUE'}
                                </Text>
                                <View className="ml-3">
                                    <Icons8Icon
                                        name={currentIndex === SLIDES.length - 1 ? "rocket" : "chevron-right"}
                                        size={22}
                                        color={theme.colors.primary}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
};
