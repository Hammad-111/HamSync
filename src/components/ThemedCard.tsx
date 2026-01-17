import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedCardProps {
    children: ReactNode;
    style?: ViewStyle;
    gradient?: boolean;
    onPress?: () => void;
    padding?: keyof typeof import('../constants/theme').theme.spacing;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
    children,
    style,
    gradient = false,
    onPress,
    padding = 'lg',
}) => {
    const { theme } = useTheme();

    const cardStyle = {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[padding],
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.08)', // Increased from 0.05
        ...theme.shadows.md,
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.12, // Increased from 0.1
        ...style,
    };

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                <View style={cardStyle}>{children}</View>
            </TouchableOpacity>
        );
    }

    return <View style={cardStyle}>{children}</View>;
};
