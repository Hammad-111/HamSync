import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { View, Text, Animated, TouchableOpacity, Platform, Dimensions, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
    showToast: (title: string, message: string, type?: ToastType) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

const { width } = Dimensions.get('window');
const TOAST_WIDTH = width * 0.9;
const TOAST_HEIGHT = 70;

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('info');

    // Animations
    const translateY = useRef(new Animated.Value(-150)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = (title: string, msg: string, toastType: ToastType = 'info') => {
        if (timerRef.current) clearTimeout(timerRef.current);

        setTitle(title);
        setMessage(msg);
        setType(toastType);
        setVisible(true);

        // Reset animations
        progressAnim.setValue(0);
        scaleAnim.setValue(0.9);

        // Entrance Animation
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                friction: 6,
                tension: 50,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 50,
                useNativeDriver: true,
            }),
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: false, // width property doesn't support native driver
            })
        ]).start();

        // Auto hide after 4 seconds
        timerRef.current = setTimeout(() => {
            hideToast();
        }, 2000);
    };

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -150,
                duration: 400,
                easing: Easing.in(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start(() => {
            setVisible(false);
        });
    };

    const getGradientColors = (): readonly [string, string] => {
        switch (type) {
            case 'success': return ['#059669', '#10B981']; // Emerald to Green
            case 'error': return ['#DC2626', '#EF4444'];   // Red to Light Red
            case 'info': return ['#2563EB', '#3B82F6'];    // Blue to Light Blue
            default: return ['#2563EB', '#3B82F6'];
        }
    };

    const getIconName = () => {
        switch (type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'warning';
            case 'info': return 'information-circle';
            default: return 'information-circle';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {visible && (
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: Platform.OS === 'ios' ? 60 : 40,
                        alignSelf: 'center',
                        width: TOAST_WIDTH,
                        transform: [
                            { translateY },
                            { scale: scaleAnim }
                        ],
                        zIndex: 9999,
                    }}
                >
                    <View
                        style={{
                            shadowColor: getGradientColors()[1],
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.3,
                            shadowRadius: 16,
                            elevation: 10,
                            borderRadius: 24, // Equivalent to rounded-3xl
                            backgroundColor: '#1E1E2E', // Solid background as requested
                        }}
                        className="rounded-3xl overflow-hidden"
                    >
                        <View className="bg-[#1E1E2E] flex-row items-center p-4">
                            {/* Icon Container */}
                            <LinearGradient
                                colors={getGradientColors()}
                                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name={getIconName()} size={20} color="white" />
                            </LinearGradient>

                            {/* Text Content */}
                            <View className="flex-1 mr-2">
                                <Text
                                    className="text-white font-poppins font-bold text-sm"
                                    numberOfLines={1}
                                >
                                    {title}
                                </Text>
                                <Text
                                    className="text-gray-300 font-inter text-xs mt-0.5"
                                    numberOfLines={2}
                                >
                                    {message}
                                </Text>
                            </View>

                            {/* Close Button */}
                            <TouchableOpacity
                                onPress={hideToast}
                                className="w-8 h-8 items-center justify-center bg-white/5 rounded-full"
                            >
                                <Ionicons name="close" size={16} color="white" style={{ opacity: 0.7 }} />
                            </TouchableOpacity>
                        </View>

                        {/* Progress Bar */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: 3,
                                backgroundColor: getGradientColors()[1],
                                width: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%']
                                }),
                                opacity: 0.8
                            }}
                        />
                    </View>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};
