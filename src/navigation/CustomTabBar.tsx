import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const { width: windowWidth } = useWindowDimensions();

    // Responsive calculations
    const TAB_BAR_WIDTH = Math.min(windowWidth * 0.92, 450);
    const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;

    const translateX = useSharedValue(state.index * TAB_WIDTH);

    useEffect(() => {
        translateX.value = withSpring(state.index * TAB_WIDTH, {
            damping: 18,
            stiffness: 120,
        });
    }, [state.index, TAB_WIDTH]);

    const indicatorStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <View
            style={[
                styles.container,
                {
                    bottom: Math.max(insets.bottom, 12),
                    width: TAB_BAR_WIDTH,
                }
            ]}
        >
            <BlurView intensity={Platform.OS === 'ios' ? 40 : 100} tint="light" style={styles.blurContainer}>
                {/* Active Indicator Background */}
                <Animated.View
                    style={[
                        styles.indicator,
                        indicatorStyle,
                        {
                            backgroundColor: theme.colors.primary + '15',
                            width: TAB_WIDTH - 12,
                        }
                    ]}
                />

                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    let iconName: keyof typeof Ionicons.glyphMap = 'home';
                    if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
                    else if (route.name === 'UniGuide') iconName = isFocused ? 'school' : 'school-outline';
                    else if (route.name === 'SyncLibrary') iconName = isFocused ? 'library' : 'library-outline';
                    else if (route.name === 'ChatSync') iconName = isFocused ? 'chatbubbles' : 'chatbubbles-outline';
                    else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            activeOpacity={0.7}
                            style={styles.tabButton}
                        >
                            <View className="items-center justify-center">
                                <Ionicons
                                    name={iconName}
                                    size={22}
                                    color={isFocused ? theme.colors.primary : theme.colors.text.muted}
                                />
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.tabText,
                                        { color: isFocused ? theme.colors.primary : theme.colors.text.muted }
                                    ]}
                                >
                                    {route.name === 'ChatSync' ? 'Chat' : route.name}
                                </Text>
                                {isFocused && (
                                    <View
                                        style={[styles.activeDot, { backgroundColor: theme.colors.primary }]}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        height: 68,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.7)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        overflow: 'hidden',
    },
    blurContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    tabButton: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    indicator: {
        position: 'absolute',
        height: 52,
        borderRadius: 22,
        marginHorizontal: 6,
        zIndex: 1,
    },
    tabText: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 2,
        fontFamily: 'Inter_600SemiBold',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        bottom: -8,
    }
});
