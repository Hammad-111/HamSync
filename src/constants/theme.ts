/**
 * Premium Theme System for HamSync
 * Modern, stunning color palettes with glassmorphic design
 */

export type ThemeType = 'crimson' | 'emerald' | 'midnight' | 'cyber' | 'ocean' | 'sunset' | 'royal' | 'aurora' | 'golden' | 'galactic';

const baseTheme = {
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 20,
        xl: 30,
        full: 9999,
    },
    blur: {
        intensity: 30,
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
    }
};

export interface AppTheme {
    id: ThemeType;
    name: string;
    colors: {
        background: string;           // Main background
        backgroundSecondary: string;  // Secondary background
        headerBackground: string;     // Header solid color
        headerGradient: string[];     // Header gradient (supports 2+ colors)
        surface: string;              // Card surfaces
        surfaceElevated: string;      // Hover/Active surfaces
        primary: string;              // Primary brand color
        primaryLight: string;
        primaryDark: string;
        secondary: string;            // Secondary brand color
        accent: string;               // Accent/Call to action
        accentGlow: string;           // Accent glow color
        text: {
            primary: string;          // Main text
            secondary: string;        // Secondary/Less important
            muted: string;            // Muted/Hint text
            inverse: string;          // Text on primary background
            accent: string;           // Accent flavored text
        };
        glass: {
            background: string;       // Glass background
            border: string;           // Glass border
            shadow: string;           // Glass shadow
        };
        gradient: {
            primary: string[];        // Primary gradient
            secondary: string[];      // Secondary gradient
            accent: string[];         // Accent gradient
        };
        success: string;
        warning: string;
        error: string;
        info: string;
        border: string;               // Standard border color
    };
    spacing: typeof baseTheme.spacing;
    borderRadius: typeof baseTheme.borderRadius;
    blur: typeof baseTheme.blur;
    shadows: typeof baseTheme.shadows;
}

export const themes: Record<ThemeType, AppTheme> = {
    crimson: {
        id: 'crimson',
        name: 'Royal Maroon',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FFF1F2',
            headerBackground: '#7F1D1D',
            headerGradient: ['#7F1D1D', '#450A0A'], // Deep Maroon analog
            surface: '#FFFFFF',
            surfaceElevated: '#FEF2F2',
            primary: '#7F1D1D',
            primaryLight: '#991B1B',
            primaryDark: '#450A0A',
            secondary: '#991B1B',
            accent: '#D4AF37',
            accentGlow: '#F1C40F',
            text: {
                primary: '#450A0A',
                secondary: '#7F1D1D',
                muted: '#991B1B',
                inverse: '#FFFFFF',
                accent: '#7F1D1D',
            },
            glass: {
                background: '#FFFFFF',
                border: '#FECACA',
                shadow: 'rgba(127, 29, 29, 0.15)',
            },
            gradient: {
                primary: ['#7F1D1D', '#450A0A'],
                secondary: ['#450A0A', '#1A0404'],
                accent: ['#D4AF37', '#9A7B0C'],
            },
            success: '#166534',
            warning: '#D4AF37',
            error: '#991B1B',
            info: '#1E40AF',
            border: '#FCA5A5',
        }
    },
    emerald: {
        id: 'emerald',
        name: 'Crimson Pro',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FFF1F2',
            headerBackground: '#B91C1C',
            headerGradient: ['#B91C1C', '#991B1B'], // Pure Red analog
            surface: '#FFFFFF',
            surfaceElevated: '#FEF2F2',
            primary: '#B91C1C',
            primaryLight: '#DC2626',
            primaryDark: '#7F1D1D',
            secondary: '#DC2626',
            accent: '#000000',
            accentGlow: '#333333',
            text: {
                primary: '#450A0A',
                secondary: '#991B1B',
                muted: '#B91C1C',
                inverse: '#FFFFFF',
                accent: '#B91C1C',
            },
            glass: {
                background: '#FFFFFF',
                border: '#FCA5A5',
                shadow: 'rgba(185, 28, 28, 0.15)',
            },
            gradient: {
                primary: ['#B91C1C', '#991B1B'],
                secondary: ['#991B1B', '#7F1D1D'],
                accent: ['#000000', '#333333'],
            },
            success: '#166534',
            warning: '#B45309',
            error: '#B91C1C',
            info: '#1E40AF',
            border: '#FECDD3',
        }
    },
    midnight: {
        id: 'midnight',
        name: 'Sky Harmony',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#F0F9FF',
            headerBackground: '#0EA5E9',
            headerGradient: ['#0EA5E9', '#2DD4BF'],
            surface: '#FFFFFF',
            surfaceElevated: '#E0F2FE',
            primary: '#0369A1',
            primaryLight: '#38BDF8',
            primaryDark: '#0C4A6E',
            secondary: '#2DD4BF',
            accent: '#0EA5E9',
            accentGlow: '#7DD3FC',
            text: {
                primary: '#0C4A6E',
                secondary: '#0369A1',
                muted: '#0EA5E9',
                inverse: '#FFFFFF',
                accent: '#0369A1',
            },
            glass: {
                background: '#FFFFFF',
                border: '#7DD3FC',
                shadow: 'rgba(14, 165, 233, 0.2)',
            },
            gradient: {
                primary: ['#0EA5E9', '#2DD4BF'],
                secondary: ['#2DD4BF', '#059669'],
                accent: ['#0EA5E9', '#38BDF8'],
            },
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0EA5E9',
            border: '#BAE6FD',
        }
    },
    cyber: {
        id: 'cyber',
        name: 'Sunset Pulse',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FFF1F2',
            headerBackground: '#F43F5E',
            headerGradient: ['#F43F5E', '#F59E0B'],
            surface: '#FFFFFF',
            surfaceElevated: '#FFF1F2',
            primary: '#E11D48',
            primaryLight: '#FB7185',
            primaryDark: '#9F1239',
            secondary: '#F59E0B',
            accent: '#F59E0B',
            accentGlow: '#FBBF24',
            text: {
                primary: '#9F1239',
                secondary: '#E11D48',
                muted: '#F43F5E',
                inverse: '#FFFFFF',
                accent: '#E11D48',
            },
            glass: {
                background: '#FFFFFF',
                border: '#FDA4AF',
                shadow: 'rgba(225, 29, 72, 0.2)',
            },
            gradient: {
                primary: ['#F43F5E', '#F59E0B'],
                secondary: ['#F59E0B', '#D97706'],
                accent: ['#F43F5E', '#FB7185'],
            },
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0EA5E9',
            border: '#FECDD3',
        }
    },
    ocean: {
        id: 'ocean',
        name: 'Cyber Pop',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FDF2FF',
            headerBackground: '#FF00FF',
            headerGradient: ['#FF00FF', '#00FFFF'],
            surface: '#FFFFFF',
            surfaceElevated: '#FAFAFA',
            primary: '#C026D3',
            primaryLight: '#FF00FF',
            primaryDark: '#701A75',
            secondary: '#00FFFF',
            accent: '#FF00FF',
            accentGlow: '#FF77FF',
            text: {
                primary: '#701A75',
                secondary: '#C026D3',
                muted: '#D946EF',
                inverse: '#FFFFFF',
                accent: '#C026D3',
            },
            glass: {
                background: '#FFFFFF',
                border: '#FF77FF',
                shadow: 'rgba(255, 0, 255, 0.25)',
            },
            gradient: {
                primary: ['#FF00FF', '#00FFFF'],
                secondary: ['#00FFFF', '#22D3EE'],
                accent: ['#FF00FF', '#FF77FF'],
            },
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0EA5E9',
            border: '#F5D0FE',
        }
    },
    sunset: {
        id: 'sunset',
        name: 'Deep Atlantic',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#F0FDFA',
            headerBackground: '#0F172A',
            headerGradient: ['#0F172A', '#14B8A6'],
            surface: '#FFFFFF',
            surfaceElevated: '#F0FDFA',
            primary: '#134E4A',
            primaryLight: '#2DD4BF',
            primaryDark: '#042F2E',
            secondary: '#FB7185',
            accent: '#FB7185',
            accentGlow: '#FDA4AF',
            text: {
                primary: '#042F2E',
                secondary: '#134E4A',
                muted: '#14B8A6',
                inverse: '#FFFFFF',
                accent: '#134E4A',
            },
            glass: {
                background: '#FFFFFF',
                border: '#99F6E4',
                shadow: 'rgba(20, 184, 166, 0.2)',
            },
            gradient: {
                primary: ['#0F172A', '#14B8A6'],
                secondary: ['#14B8A6', '#FB7185'],
                accent: ['#FB7185', '#FDA4AF'],
            },
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0EA5E9',
            border: '#99F6E4',
        }
    },
    royal: {
        id: 'royal',
        name: 'Electric Dream',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#F5F3FF',
            headerBackground: '#8B5CF6',
            headerGradient: ['#8B5CF6', '#06B6D4'],
            surface: '#FFFFFF',
            surfaceElevated: '#EDE9FE',
            primary: '#5B21B6',
            primaryLight: '#A78BFA',
            primaryDark: '#2E1065',
            secondary: '#06B6D4',
            accent: '#8B5CF6',
            accentGlow: '#C4B5FD',
            text: {
                primary: '#2E1065',
                secondary: '#5B21B6',
                muted: '#8B5CF6',
                inverse: '#FFFFFF',
                accent: '#5B21B6',
            },
            glass: {
                background: '#FFFFFF',
                border: '#C4B5FD',
                shadow: 'rgba(139, 92, 246, 0.25)',
            },
            gradient: {
                primary: ['#8B5CF6', '#06B6D4'],
                secondary: ['#06B6D4', '#22D3EE'],
                accent: ['#8B5CF6', '#C4B5FD'],
            },
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0EA5E9',
            border: '#DDD6FE',
        }
    },
    aurora: {
        id: 'aurora',
        name: 'Space Candy',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FDF2FF',
            headerBackground: '#4D1D95',
            headerGradient: ['#4D1D95', '#FF00FF', '#00FFFF'],
            surface: '#FFFFFF',
            surfaceElevated: '#F3E8FF',
            primary: '#581C87',
            primaryLight: '#A855F7',
            primaryDark: '#2E1065',
            secondary: '#00FFFF',
            accent: '#FF00FF',
            accentGlow: '#FF77FF',
            text: {
                primary: '#2E1065',
                secondary: '#581C87',
                muted: '#7E22CE',
                inverse: '#FFFFFF',
                accent: '#581C87',
            },
            glass: {
                background: '#FFFFFF',
                border: '#FF77FF',
                shadow: 'rgba(255, 0, 255, 0.25)',
            },
            gradient: {
                primary: ['#4D1D95', '#FF00FF'],
                secondary: ['#FF00FF', '#00FFFF'],
                accent: ['#00FFFF', '#22D3EE'],
            },
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0EA5E9',
            border: '#E9D5FF',
        }
    },
    golden: {
        id: 'golden',
        name: 'Golden Hour',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FFF7ED',
            headerBackground: '#F59E0B',
            headerGradient: ['#F59E0B', '#FB7185'],
            surface: '#FFFFFF',
            surfaceElevated: '#FFEDD5',
            primary: '#B45309',
            primaryLight: '#FBBF24',
            primaryDark: '#78350F',
            secondary: '#FB7185',
            accent: '#F59E0B',
            accentGlow: '#FCD34D',
            text: {
                primary: '#78350F',
                secondary: '#B45309',
                muted: '#D97706',
                inverse: '#FFFFFF',
                accent: '#B45309',
            },
            glass: {
                background: '#FFFFFF',
                border: '#FCD34D',
                shadow: 'rgba(245, 158, 11, 0.2)',
            },
            gradient: {
                primary: ['#F59E0B', '#FB7185'],
                secondary: ['#FB7185', '#E11D48'],
                accent: ['#F59E0B', '#FBBF24'],
            },
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0EA5E9',
            border: '#FDE68A',
        }
    },
    galactic: {
        id: 'galactic',
        name: 'Galactic Glow',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#F5F3FF',
            headerBackground: '#2E1065',
            headerGradient: ['#2E1065', '#9333EA', '#3B82F6'],
            surface: '#FFFFFF',
            surfaceElevated: '#EDE9FE',
            primary: '#3B82F6',
            primaryLight: '#60A5FA',
            primaryDark: '#1E40AF',
            secondary: '#F97316',
            accent: '#9333EA',
            accentGlow: '#A855F7',
            text: {
                primary: '#1E3A8A',
                secondary: '#1E40AF',
                muted: '#3B82F6',
                inverse: '#FFFFFF',
                accent: '#1E40AF',
            },
            glass: {
                background: '#FFFFFF',
                border: '#A855F7',
                shadow: 'rgba(147, 51, 234, 0.25)',
            },
            gradient: {
                primary: ['#2E1065', '#9333EA'],
                secondary: ['#9333EA', '#3B82F6'],
                accent: ['#3B82F6', '#60A5FA'],
            },
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0EA5E9',
            border: '#C4B5FD',
        }
    },
};

// Default theme
export const defaultTheme = themes.midnight;
