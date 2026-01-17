import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, ThemeType, AppTheme } from '../constants/theme';

const THEME_STORAGE_KEY = '@hamsync_theme';

interface ThemeContextType {
    theme: AppTheme;
    currentThemeId: ThemeType;
    setTheme: (themeId: ThemeType) => void;
    availableThemes: { id: ThemeType; name: string }[];
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    initialTheme = 'midnight'
}) => {
    const [currentThemeId, setCurrentThemeId] = useState<ThemeType>(initialTheme);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved theme on mount
    useEffect(() => {
        loadSavedTheme();
    }, []);

    const loadSavedTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && themes[savedTheme as ThemeType]) {
                setCurrentThemeId(savedTheme as ThemeType);
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const availableThemes = Object.values(themes).map(t => ({
        id: t.id,
        name: t.name
    }));

    const setTheme = async (themeId: ThemeType) => {
        try {
            setCurrentThemeId(themeId);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, themeId);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const value: ThemeContextType = {
        theme: themes[currentThemeId],
        currentThemeId,
        setTheme,
        availableThemes,
        isLoading,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
