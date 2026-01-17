import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface AnimatedParticlesProps {
    count?: number;
}

export const AnimatedParticles: React.FC<AnimatedParticlesProps> = ({ count = 10 }) => {
    const { theme } = useTheme();

    const particleColors = [
        theme.colors.primary,
        theme.colors.secondary,
        theme.colors.accent,
        theme.colors.accentGlow,
    ];

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {[...Array(count)].map((_, index) => (
                <Particle
                    key={index}
                    index={index}
                    color={particleColors[index % particleColors.length]}
                    delay={index * 300}
                />
            ))}
        </View>
    );
};

interface ParticleProps {
    index: number;
    color: string;
    delay: number;
}

const Particle: React.FC<ParticleProps> = ({ index, color, delay }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.loop(
                Animated.parallel([
                    // Vertical movement
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
                    // Horizontal movement
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
                    // Opacity pulsing
                    Animated.sequence([
                        Animated.timing(opacity, {
                            toValue: 0.7,
                            duration: 2000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0.3,
                            duration: 2000,
                            useNativeDriver: true,
                        }),
                    ]),
                    // Scale pulsing
                    Animated.sequence([
                        Animated.timing(scale, {
                            toValue: 1.3,
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

    // Generate random positions
    const positions = [
        { top: '10%', left: '15%' },
        { top: '20%', right: '20%' },
        { top: '35%', left: '10%' },
        { top: '50%', right: '15%' },
        { top: '65%', left: '25%' },
        { bottom: '25%', right: '10%' },
        { bottom: '40%', left: '20%' },
        { top: '45%', right: '30%' },
        { top: '75%', left: '35%' },
        { top: '85%', right: '25%' },
    ] as const;

    const size = 4 + (index % 3) * 2; // 4px, 6px, or 8px

    return (
        <Animated.View
            style={[
                styles.particle,
                positions[index % positions.length],
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    shadowColor: color,
                    transform: [{ translateY }, { translateX }, { scale }],
                    opacity,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    particle: {
        position: 'absolute',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
});
