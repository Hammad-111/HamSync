import React from 'react';
import { View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassViewProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}

export const GlassView: React.FC<GlassViewProps> = ({ children, className = "", intensity = 20 }) => {
    return (
        <View className={`overflow-hidden rounded-2xl border border-white/20 bg-white/10 ${className}`}>
            {Platform.OS === 'android' ? (
                <View className="p-4 bg-white/5">
                    {children}
                </View>
            ) : (
                <BlurView intensity={intensity} tint="light" className="p-4 flex-1">
                    {children}
                </BlurView>
            )}
        </View>
    );
};
