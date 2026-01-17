import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    TextInputProps,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedInputProps extends TextInputProps {
    label?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
    label,
    leftIcon,
    rightIcon,
    onRightIconPress,
    error,
    containerStyle,
    onFocus,
    onBlur,
    ...props
}) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const focusAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = (e: any) => {
        setIsFocused(true);
        Animated.timing(focusAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        Animated.timing(focusAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
        if (onBlur) onBlur(e);
    };

    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0,0,0,0.05)', theme.colors.primary],
    });

    const elevation = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 4],
    });

    return (
        <View style={[{ marginBottom: 20 }, containerStyle]}>
            {label && (
                <Text
                    style={{
                        color: theme.colors.text.primary,
                        fontSize: 14,
                        fontWeight: '600',
                        marginBottom: 8,
                        marginLeft: 4,
                        opacity: 0.8,
                    }}
                >
                    {label}
                </Text>
            )}

            <Animated.View
                style={{
                    borderRadius: theme.borderRadius.lg,
                    borderWidth: 1.5,
                    borderColor: borderColor,
                    backgroundColor: theme.colors.surface,
                    overflow: 'hidden',
                    ...theme.shadows.sm,
                    shadowOpacity: focusAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.05, 0.15],
                    }),
                    elevation: elevation,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
                    {leftIcon && (
                        <Ionicons
                            name={leftIcon}
                            size={20}
                            color={isFocused ? theme.colors.primary : theme.colors.text.muted}
                            style={{ marginRight: 12 }}
                        />
                    )}

                    <TextInput
                        style={{
                            flex: 1,
                            color: theme.colors.text.primary,
                            paddingVertical: 14,
                            fontSize: 16,
                            fontFamily: 'Inter_500Medium',
                        }}
                        placeholderTextColor={theme.colors.text.muted}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        {...props}
                    />

                    {rightIcon && (
                        <TouchableOpacity onPress={onRightIconPress} activeOpacity={0.7} style={{ padding: 4 }}>
                            <Ionicons
                                name={rightIcon}
                                size={20}
                                color={theme.colors.text.muted}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>

            {error && (
                <Text
                    style={{
                        color: theme.colors.error,
                        fontSize: 12,
                        marginTop: 4,
                        marginLeft: 4,
                    }}
                >
                    {error}
                </Text>
            )}
        </View>
    );
};
