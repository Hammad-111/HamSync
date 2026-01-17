import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeType } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const ThemeSelector: React.FC = () => {
    const { theme, currentThemeId, setTheme, availableThemes } = useTheme();

    return (
        <View style={styles.container}>
            {/* Horizontal Scroll of Compact Theme Pills */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {availableThemes.map((t) => {
                    const isSelected = t.id === currentThemeId;

                    // We need to access the specific theme's colors to render its preview correctly
                    // Since availableThemes only has ID and Name, we'll import the themes object locally or use a helper
                    // tailored for this. For now, we will rely on a lookup or just use the current theme if needed, 
                    // BUT for the preview to be accurate, we really should have access to the specific theme colors.
                    // However, to keep it simple and performant, we can use the theme ID to determine styles 
                    // if we don't want to import the heavy themes object here. 
                    // ACTUALLY, let's just use the gradients defined in the theme context if available, 
                    // or better yet, Import themes to get the gradients.

                    return (
                        <ThemePill
                            key={t.id}
                            themeId={t.id}
                            name={t.name}
                            isSelected={isSelected}
                            onSelect={() => setTheme(t.id as ThemeType)}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
};

// Separate component for optimization and cleaner code
import { themes } from '../constants/theme';

const ThemePill = ({ themeId, name, isSelected, onSelect }: any) => {
    const targetTheme = themes[themeId as ThemeType];
    const gradientColors = targetTheme.colors.gradient.primary;

    return (
        <TouchableOpacity
            onPress={onSelect}
            activeOpacity={0.8}
            style={styles.pillContainer}
        >
            <View style={[
                styles.gradientWrapper,
                isSelected && styles.selectedWrapper,
                { borderColor: isSelected ? targetTheme.colors.primary : 'transparent' }
            ]}>
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientCircle}
                />
            </View>
            <Text style={[
                styles.pillLabel,
                isSelected && styles.selectedLabel,
                { color: isSelected ? targetTheme.colors.primary : '#94A3B8' }
            ]}>
                {name.split(' ')[0]} {/* Show only first name for compactness */}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    scrollContent: {
        paddingHorizontal: 8, // Less padding for edge-to-edge feel
        gap: 16, // Space between items
    },
    pillContainer: {
        alignItems: 'center',
        width: 60,
    },
    gradientWrapper: {
        width: 52,
        height: 52,
        borderRadius: 26,
        padding: 3, // Space for the border ring
        borderWidth: 2,
        borderColor: 'transparent',
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedWrapper: {
        // Border color handled inline
    },
    gradientCircle: {
        width: '100%',
        height: '100%',
        borderRadius: 999,
    },
    pillLabel: {
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
        color: '#94A3B8',
    },
    selectedLabel: {
        fontWeight: '700',
    },
    title: {
        // Removed as title is now handled by the parent screen for cleaner layout
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
});
