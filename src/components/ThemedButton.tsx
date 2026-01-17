import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'error';
    loading?: boolean;
    disabled?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
    style?: ViewStyle;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    style,
}) => {
    const { theme } = useTheme();

    const getGradientColors = (): [string, string] => {
        switch (variant) {
            case 'primary':
                return theme.colors.gradient.primary;
            case 'secondary':
                return theme.colors.gradient.secondary;
            case 'error':
                return [theme.colors.error, theme.colors.error + 'CC'];
            default:
                return theme.colors.gradient.primary;
        }
    };

    const getTextColor = () => {
        if (variant === 'outline') {
            return theme.colors.primary;
        }
        return theme.colors.text.inverse;
    };

    if (variant === 'outline') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[
                    styles.button,
                    {
                        borderWidth: 2,
                        borderColor: theme.colors.primary,
                        backgroundColor: 'transparent',
                        opacity: disabled ? 0.5 : 1,
                    },
                    style,
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.primary} />
                ) : (
                    <>
                        {icon && iconPosition === 'left' && (
                            <Ionicons
                                name={icon}
                                size={20}
                                color={getTextColor()}
                                style={styles.iconLeft}
                            />
                        )}
                        <Text style={[styles.text, { color: getTextColor() }]}>
                            {title}
                        </Text>
                        {icon && iconPosition === 'right' && (
                            <Ionicons
                                name={icon}
                                size={20}
                                color={getTextColor()}
                                style={styles.iconRight}
                            />
                        )}
                    </>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[{ opacity: disabled ? 0.5 : 1 }, style]}
        >
            <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.button,
                    {
                        borderRadius: theme.borderRadius.lg,
                        ...theme.shadows.md,
                        shadowColor: variant === 'error' ? theme.colors.error : theme.colors.primary,
                        shadowOpacity: 0.3,
                    },
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.text.inverse} />
                ) : (
                    <>
                        {icon && iconPosition === 'left' && (
                            <Ionicons
                                name={icon}
                                size={20}
                                color={getTextColor()}
                                style={styles.iconLeft}
                            />
                        )}
                        <Text style={[styles.text, { color: getTextColor() }]}>
                            {title}
                        </Text>
                        {icon && iconPosition === 'right' && (
                            <Ionicons
                                name={icon}
                                size={20}
                                color={getTextColor()}
                                style={styles.iconRight}
                            />
                        )}
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});
