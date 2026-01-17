/**
 * Premium Theme System for HamSync
 * Modern, stunning color palettes with glassmorphic design
 */

export type ThemeType = 'midnight' | 'cyber' | 'ocean' | 'sunset' | 'royal' | 'emerald' | 'crimson' | 'aurora' | 'golden' | 'galactic';

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
        headerGradient: [string, string]; // Header gradient
        surface: string;              // Card surfaces
        surfaceElevated: string;      // Elevated surfaces
        primary: string;              // Primary brand color
        primaryLight: string;         // Lighter primary
        primaryDark: string;          // Darker primary
        secondary: string;            // Secondary color
        accent: string;               // Accent highlights
        accentGlow: string;           // Glowing accent
        text: {
            primary: string;          // Main text
            secondary: string;        // Secondary text
            muted: string;            // Muted text
            inverse: string;          // Text on dark backgrounds
            accent: string;           // Accent text
        };
        glass: {
            background: string;       // Glassmorphic background
            border: string;           // Glass border
            shadow: string;           // Glass shadow
        };
        gradient: {
            primary: [string, string];    // Primary gradient
            secondary: [string, string];  // Secondary gradient
            accent: [string, string];     // Accent gradient
        };
        success: string;
        warning: string;
        error: string;
        info: string;
        border: string;               // Global border color
    };
    spacing: typeof baseTheme.spacing;
    borderRadius: typeof baseTheme.borderRadius;
    blur: typeof baseTheme.blur;
    shadows: typeof baseTheme.shadows;
}

export const themes: Record<ThemeType, AppTheme> = {
    midnight: {
        id: 'midnight',
        name: 'Midnight Aurora',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#F8FAFC',
            headerBackground: '#1E1B4B',
            headerGradient: ['#1E1B4B', '#312E81'],
            surface: '#FFFFFF',
            surfaceElevated: '#F1F5F9',
            primary: '#4F46E5',
            primaryLight: '#818CF8',
            primaryDark: '#3730A3',
            secondary: '#7C3AED',
            accent: '#F59E0B',
            accentGlow: '#FCD34D',
            text: {
                primary: '#0F172A',
                secondary: '#475569',
                muted: '#94A3B8',
                inverse: '#FFFFFF',
                accent: '#4F46E5',
            },
            glass: {
                background: '#FFFFFF',
                border: '#E2E8F0',
                shadow: 'rgba(79, 70, 229, 0.1)',
            },
            gradient: {
                primary: ['#4F46E5', '#7C3AED'],
                secondary: ['#7C3AED', '#DB2777'],
                accent: ['#F59E0B', '#EA580C'],
            },
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
            border: '#E2E8F0',
        }
    },
    cyber: {
        id: 'cyber',
        name: 'Cyber Neon',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FAFAFA',
            headerBackground: '#000000',
            headerGradient: ['#000000', '#1A1A1A'],
            surface: '#FFFFFF',
            surfaceElevated: '#F5F5F5',
            primary: '#0891B2',
            primaryLight: '#22D3EE',
            primaryDark: '#155E75',
            secondary: '#D946EF',
            accent: '#10B981',
            accentGlow: '#34D399',
            text: {
                primary: '#000000',
                secondary: '#404040',
                muted: '#737373',
                inverse: '#FFFFFF',
                accent: '#0891B2',
            },
            glass: {
                background: '#FFFFFF',
                border: '#E5E5E5',
                shadow: 'rgba(8, 145, 178, 0.1)',
            },
            gradient: {
                primary: ['#0891B2', '#10B981'],
                secondary: ['#D946EF', '#0891B2'],
                accent: ['#10B981', '#EAB308'],
            },
            success: '#10B981',
            warning: '#EAB308',
            error: '#F43F5E',
            info: '#06B6D4',
            border: '#E5E5E5',
        }
    },
    ocean: {
        id: 'ocean',
        name: 'Ocean Depth',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#F0F9FF',
            headerBackground: '#0369A1',
            headerGradient: ['#0369A1', '#075985'],
            surface: '#FFFFFF',
            surfaceElevated: '#E0F2FE',
            primary: '#0284C7',
            primaryLight: '#38BDF8',
            primaryDark: '#075985',
            secondary: '#0891B2',
            accent: '#F59E0B',
            accentGlow: '#FCD34D',
            text: {
                primary: '#0F172A',
                secondary: '#334155',
                muted: '#94A3B8',
                inverse: '#FFFFFF',
                accent: '#0284C7',
            },
            glass: {
                background: '#FFFFFF',
                border: '#BAE6FD',
                shadow: 'rgba(2, 132, 199, 0.1)',
            },
            gradient: {
                primary: ['#0284C7', '#0891B2'],
                secondary: ['#0891B2', '#0D9488'],
                accent: ['#F59E0B', '#EA580C'],
            },
            success: '#0D9488',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0284C7',
            border: '#BAE6FD',
        }
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset Blaze',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FFF7ED',
            headerBackground: '#9A3412',
            headerGradient: ['#9A3412', '#7C2D12'],
            surface: '#FFFFFF',
            surfaceElevated: '#FFEDD5',
            primary: '#EA580C',
            primaryLight: '#FB923C',
            primaryDark: '#9A3412',
            secondary: '#F59E0B',
            accent: '#DB2777',
            accentGlow: '#F472B6',
            text: {
                primary: '#1C1917',
                secondary: '#44403C',
                muted: '#A8A29E',
                inverse: '#FFFFFF',
                accent: '#EA580C',
            },
            glass: {
                background: '#FFFFFF',
                border: '#FED7AA',
                shadow: 'rgba(234, 88, 12, 0.1)',
            },
            gradient: {
                primary: ['#EA580C', '#DC2626'],
                secondary: ['#F59E0B', '#DB2777'],
                accent: ['#DB2777', '#7C3AED'],
            },
            success: '#16A34A',
            warning: '#F59E0B',
            error: '#DC2626',
            info: '#3B82F6',
            border: '#FED7AA',
        }
    },
    royal: {
        id: 'royal',
        name: 'Royal Purple',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FAF5FF',
            headerBackground: '#581C87',
            headerGradient: ['#581C87', '#4C1D95'],
            surface: '#FFFFFF',
            surfaceElevated: '#F3E8FF',
            primary: '#7C3AED',
            primaryLight: '#A78BFA',
            primaryDark: '#5B21B6',
            secondary: '#DB2777',
            accent: '#F59E0B',
            accentGlow: '#FCD34D',
            text: {
                primary: '#1E1B4B',
                secondary: '#4338CA',
                muted: '#A78BFA',
                inverse: '#FFFFFF',
                accent: '#7C3AED',
            },
            glass: {
                background: '#FFFFFF',
                border: '#E9D5FF',
                shadow: 'rgba(124, 58, 237, 0.1)',
            },
            gradient: {
                primary: ['#7C3AED', '#DB2777'],
                secondary: ['#DB2777', '#E11D48'],
                accent: ['#F59E0B', '#EA580C'],
            },
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
            border: '#E9D5FF',
        }
    },
    emerald: {
        id: 'emerald',
        name: 'Emerald Forest',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#ECFDF5',
            headerBackground: '#064E3B',
            headerGradient: ['#064E3B', '#065F46'],
            surface: '#FFFFFF',
            surfaceElevated: '#D1FAE5',
            primary: '#059669',
            primaryLight: '#34D399',
            primaryDark: '#064E3B',
            secondary: '#0D9488',
            accent: '#F59E0B',
            accentGlow: '#FCD34D',
            text: {
                primary: '#064E3B',
                secondary: '#065F46',
                muted: '#6EE7B7',
                inverse: '#FFFFFF',
                accent: '#059669',
            },
            glass: {
                background: '#FFFFFF',
                border: '#A7F3D0',
                shadow: 'rgba(5, 150, 105, 0.1)',
            },
            gradient: {
                primary: ['#059669', '#0D9488'],
                secondary: ['#0D9488', '#0891B2'],
                accent: ['#F59E0B', '#EA580C'],
            },
            success: '#059669',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#06B6D4',
            border: '#A7F3D0',
        }
    },
    crimson: {
        id: 'crimson',
        name: 'Crimson Blade',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FFF5F5',
            headerBackground: '#7F1D1D',
            headerGradient: ['#7F1D1D', '#991B1B'],
            surface: '#FFFFFF',
            surfaceElevated: '#FEE2E2',
            primary: '#DC2626',
            primaryLight: '#F87171',
            primaryDark: '#991B1B',
            secondary: '#B91C1C',
            accent: '#F59E0B',
            accentGlow: '#FCD34D',
            text: {
                primary: '#450A0A',
                secondary: '#7F1D1D',
                muted: '#FCA5A5',
                inverse: '#FFFFFF',
                accent: '#DC2626',
            },
            glass: {
                background: '#FFFFFF',
                border: '#FECACA',
                shadow: 'rgba(220, 38, 38, 0.1)',
            },
            gradient: {
                primary: ['#DC2626', '#B91C1C'],
                secondary: ['#B91C1C', '#991B1B'],
                accent: ['#F59E0B', '#F59E0B'],
            },
            success: '#059669',
            warning: '#F59E0B',
            error: '#991B1B',
            info: '#06B6D4',
            border: '#FECACA',
        }
    },
    aurora: {
        id: 'aurora',
        name: 'Aurora Borealis',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#F0FDFA',
            headerBackground: '#134E4A',
            headerGradient: ['#134E4A', '#0F766E'],
            surface: '#FFFFFF',
            surfaceElevated: '#CCFBF1',
            primary: '#0D9488',
            primaryLight: '#5EEAD4',
            primaryDark: '#115E59',
            secondary: '#059669',
            accent: '#F472B6',
            accentGlow: '#FBCFE8',
            text: {
                primary: '#134E4A',
                secondary: '#0F766E',
                muted: '#99F6E4',
                inverse: '#FFFFFF',
                accent: '#0D9488',
            },
            glass: {
                background: '#FFFFFF',
                border: '#99F6E4',
                shadow: 'rgba(13, 148, 136, 0.1)',
            },
            gradient: {
                primary: ['#0D9488', '#059669'],
                secondary: ['#059669', '#34D399'],
                accent: ['#F472B6', '#DB2777'],
            },
            success: '#059669',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#06B6D4',
            border: '#99F6E4',
        }
    },
    golden: {
        id: 'golden',
        name: 'Golden Luxury',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#FEFCE8',
            headerBackground: '#713F12',
            headerGradient: ['#713F12', '#854D0E'],
            surface: '#FFFFFF',
            surfaceElevated: '#FEF9C3',
            primary: '#CA8A04',
            primaryLight: '#FACC15',
            primaryDark: '#854D0E',
            secondary: '#A16207',
            accent: '#000000',
            accentGlow: '#4B5563',
            text: {
                primary: '#422006',
                secondary: '#713F12',
                muted: '#CA8A04',
                inverse: '#FFFFFF',
                accent: '#CA8A04',
            },
            glass: {
                background: '#FFFFFF',
                border: '#FEF08A',
                shadow: 'rgba(202, 138, 4, 0.1)',
            },
            gradient: {
                primary: ['#CA8A04', '#A16207'],
                secondary: ['#A16207', '#854D0E'],
                accent: ['#000000', '#1F2937'],
            },
            success: '#059669',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#06B6D4',
            border: '#FEF08A',
        }
    },
    galactic: {
        id: 'galactic',
        name: 'Galactic Void',
        ...baseTheme,
        colors: {
            background: '#FFFFFF',
            backgroundSecondary: '#F5F3FF',
            headerBackground: '#2E1065',
            headerGradient: ['#2E1065', '#1E1B4B'],
            surface: '#FFFFFF',
            surfaceElevated: '#EDE9FE',
            primary: '#7C3AED',
            primaryLight: '#A78BFA',
            primaryDark: '#4C1D95',
            secondary: '#5B21B6',
            accent: '#38BDF8',
            accentGlow: '#7DD3FC',
            text: {
                primary: '#2E1065',
                secondary: '#5B21B6',
                muted: '#A78BFA',
                inverse: '#FFFFFF',
                accent: '#7C3AED',
            },
            glass: {
                background: '#FFFFFF',
                border: '#DDD6FE',
                shadow: 'rgba(124, 58, 237, 0.1)',
            },
            gradient: {
                primary: ['#7C3AED', '#4C1D95'],
                secondary: ['#4C1D95', '#1E1B4B'],
                accent: ['#38BDF8', '#0EA5E9'],
            },
            success: '#059669',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#06B6D4',
            border: '#DDD6FE',
        }
    }
};

// Default theme
export const theme = themes.midnight;
