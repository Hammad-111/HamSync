import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface GlassViewProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}

export const GlassView: React.FC<GlassViewProps> = ({ children, className = "" }) => {
    const { theme } = useTheme();

    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.05)',
                ...theme.shadows.sm,
            }}
            className={`overflow-hidden p-4 ${className}`}
        >
            {children}
        </View>
    );
};
