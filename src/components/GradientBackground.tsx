import React, { ReactNode, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, Platform, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { AnimatedParticles } from './AnimatedParticles';

const { width } = Dimensions.get('window');

// Create animated path component
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface GradientBackgroundProps {
    children?: ReactNode;
    particles?: boolean;
    particleCount?: number;
    variant?: 'header' | 'full' | 'solid';
    showHeader?: boolean;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    particles = true,
    particleCount = 12,
    variant = 'full',
    showHeader = true,
}) => {
    const { width } = useWindowDimensions();
    const { theme } = useTheme();

    // Advanced Elastic Interpolations
    const wave1 = useRef(new Animated.Value(0)).current;
    const wave2 = useRef(new Animated.Value(0)).current;
    const wave3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = (val: Animated.Value, duration: number, delay: number = 0) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(val, {
                        toValue: 1,
                        duration,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(val, {
                        toValue: 0,
                        duration,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        loop(wave1, 5500);
        loop(wave2, 9000, 500);
        loop(wave3, 7000, 200);
    }, []);

    if (variant === 'solid') {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                    {children}
                </SafeAreaView>
            </View>
        );
    }

    const headerHeight = variant === 'full' ? 440 : 320;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Main Header Color Block */}
            {showHeader && (
                <View style={[styles.headerContainer, { height: headerHeight }]}>
                    <LinearGradient
                        colors={theme.colors.headerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />

                    {particles && (
                        <View style={StyleSheet.absoluteFill}>
                            <AnimatedParticles count={particleCount} />
                        </View>
                    )}

                    {/* ULTRA-MODERN ENHANCED LIQUID CURVES */}
                    <View style={styles.curveContainer}>
                        <Svg height="300" width={width} viewBox={`0 0 ${width} 300`} fill="none">
                            <Defs>
                                <SvgGradient id="shimmerGrad" x1="0" y1="0" x2="1" y2="0">
                                    <Stop offset="0" stopColor={theme.colors.primary} stopOpacity="0.2" />
                                    <Stop offset="0.5" stopColor={theme.colors.primary} stopOpacity="0.4" />
                                    <Stop offset="1" stopColor={theme.colors.primary} stopOpacity="0.2" />
                                </SvgGradient>
                                <SvgGradient id="glowLine" x1="0" y1="0" x2="1" y2="0">
                                    <Stop offset="0" stopColor="white" stopOpacity="0.05" />
                                    <Stop offset="0.5" stopColor="white" stopOpacity="0.15" />
                                    <Stop offset="1" stopColor="white" stopOpacity="0.05" />
                                </SvgGradient>
                            </Defs>

                            {/* Layer 1: Deep Morphing Base (Using Gradient Shimmer) */}
                            <AnimatedPath
                                d={wave1.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [
                                        `M-50 160 C ${width * 0.2} 20, ${width * 0.5} 120, ${width + 100} 40 L ${width + 100} 300 L -50 300 Z`,
                                        `M-50 160 C ${width * 0.1} 60, ${width * 0.4} 80, ${width + 100} 20 L ${width + 100} 300 L -50 300 Z`
                                    ]
                                })}
                                fill="url(#shimmerGrad)"
                            />

                            {/* Layer 2: Counter-flow Surface Tension */}
                            <AnimatedPath
                                d={wave2.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [
                                        `M-50 160 C ${width * 0.4} 100, ${width * 0.8} 10, ${width + 100} 90 L ${width + 100} 300 L -50 300 Z`,
                                        `M-50 160 C ${width * 0.3} 140, ${width * 0.7} 60, ${width + 100} 120 L ${width + 100} 300 L -50 300 Z`
                                    ]
                                })}
                                fill={theme.colors.secondary || theme.colors.primary}
                                opacity={0.12}
                            />

                            {/* Layer 3: Main Solid Transition (Merging into Background) */}
                            <AnimatedPath
                                d={wave3.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [
                                        `M0 160 C ${width * 0.45} 60, ${width * 0.7} 40, ${width} 110 L ${width} 300 L 0 300 Z`,
                                        `M0 160 C ${width * 0.55} 90, ${width * 0.8} 20, ${width} 130 L ${width} 300 L 0 300 Z`
                                    ]
                                })}
                                fill={theme.colors.background}
                            />
                        </Svg>
                    </View>
                </View>
            )}

            <SafeAreaView
                style={styles.safeArea}
                edges={variant === 'header' ? ['bottom'] : ['top', 'bottom']}
            >
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
    },
    curveContainer: {
        position: 'absolute',
        bottom: -142, // Adjusted to compensate for height increase (300 - 160 + 2 overlap)
        width: '100%',
        zIndex: 100,
    },
    safeArea: {
        flex: 1,
    },
});
