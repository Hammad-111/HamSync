import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Icons8Icon } from '../components/Icons8Icon';

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
                            backgroundColor: theme.colors.primary + '25', // Increased from 15
                            width: (TAB_WIDTH || 80) - 12, // Handle initial render
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

                    // Map route names to Icons8 icon names
                    let iconName = 'home';
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'UniGuide') iconName = 'school';
                    else if (route.name === 'SyncLibrary') iconName = 'library';
                    else if (route.name === 'ChatSync') iconName = 'chat-bubble';
                    else if (route.name === 'Profile') iconName = 'user';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            activeOpacity={0.7}
                            style={styles.tabButton}
                        >
                            <View className="items-center justify-center">
                                {isFocused && (
                                    <Animated.View
                                        entering={FadeIn.duration(200)}
                                        style={{
                                            position: 'absolute',
                                            top: -6, // Slightly larger
                                            bottom: -6,
                                            left: -14,
                                            right: -14,
                                            backgroundColor: theme.colors.primary + '30', // Increased from 15
                                            borderRadius: 20,
                                            zIndex: -1,
                                        }}
                                    />
                                )}
                                <Icons8Icon
                                    name={iconName}
                                    size={22}
                                    color={isFocused ? theme.colors.primary : theme.colors.text.muted}
                                />
                                <Text
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
        height: 72, // Slightly taller
        borderRadius: 36, // More rounded
        backgroundColor: 'rgba(255,255,255,0.95)', // Almost solid white
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.15, // Increased
                shadowRadius: 24,
            },
            android: {
                elevation: 16, // Increased
            },
        }),
        borderWidth: 2, // Thicker border
        borderColor: 'rgba(255,255,255,1)', // Solid white border
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
