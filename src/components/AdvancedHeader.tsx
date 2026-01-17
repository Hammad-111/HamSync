import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Icons8Icon } from './Icons8Icon';

const { width } = Dimensions.get('window');

interface AdvancedHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    rightAction?: {
        icon: string;
        onPress: () => void;
    };
    customRight?: React.ReactNode;
    variant?: 'transparent' | 'solid';
}

export const AdvancedHeader: React.FC<AdvancedHeaderProps> = ({
    title,
    subtitle,
    showBack = true,
    rightAction,
    customRight,
    variant = 'transparent',
}) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.wrapper,
                {
                    paddingTop: insets.top + 28,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                    backgroundColor: variant === 'solid' ? theme.colors.headerGradient[0] : 'transparent'
                }
            ]}
        >
            <View style={styles.content}>
                {/* Left Section: Back Button or Spacer */}
                <View style={styles.leftSection}>
                    {showBack && (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                            activeOpacity={0.7}
                        >
                            <Icons8Icon name="back" size={24} color="white" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Center Section: Bold Typography */}
                <View style={styles.textSection}>
                    <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
                    {subtitle && <Text style={styles.subtitleText} numberOfLines={1}>{subtitle}</Text>}
                </View>

                {/* Right Section: Actions */}
                <View style={styles.rightSection}>
                    {customRight ? (
                        customRight
                    ) : rightAction ? (
                        <TouchableOpacity
                            onPress={rightAction.onPress}
                            style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                            activeOpacity={0.7}
                        >
                            <Icons8Icon name={rightAction.icon} size={24} color="white" />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 44 }} />
                    )}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        paddingBottom: 25,
        zIndex: 100,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftSection: {
        width: 50,
        alignItems: 'flex-start',
    },
    rightSection: {
        width: 50,
        alignItems: 'flex-end',
    },
    textSection: {
        flex: 1,
        paddingHorizontal: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    titleText: {
        color: 'white',
        fontSize: 34,
        fontWeight: '900',
        letterSpacing: -1.5,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
        lineHeight: 38,
    },
    subtitleText: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 0,
        letterSpacing: 0.5,
    },
});
