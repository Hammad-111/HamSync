import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

// Icon mapping for Icons8 assets
const ICONS8_MAP: Record<string, any> = {
    // Navigation
    'home': require('../../assets/icons/navigation/home_24.png'),
    'home-32': require('../../assets/icons/navigation/home_32.png'),
    'school': require('../../assets/icons/navigation/school_24.png'),
    'school-32': require('../../assets/icons/navigation/school_32.png'),
    'library': require('../../assets/icons/navigation/library_24.png'),
    'library-32': require('../../assets/icons/navigation/library_32.png'),
    'user': require('../../assets/icons/navigation/user_24.png'),
    'user-32': require('../../assets/icons/navigation/user_32.png'),

    // Actions
    'plus': require('../../assets/icons/actions/plus_24.png'),
    'back': require('../../assets/icons/actions/back_24.png'),
    'help-circle': require('../../assets/icons/actions/help_32.png'),
    'rocket': require('../../assets/icons/actions/rocket_24.png'),
    'external-link': require('../../assets/icons/actions/external-link_20.png'),

    // Profile
    'camera': require('../../assets/icons/profile/camera_32.png'),
    'trophy': require('../../assets/icons/profile/trophy_32.png'),
    'trophy-48': require('../../assets/icons/profile/trophy_48.png'),
    'bookmark': require('../../assets/icons/profile/bookmark_32.png'),
    'settings': require('../../assets/icons/profile/settings_24.png'),
    'info': require('../../assets/icons/profile/info_24.png'),
    'help': require('../../assets/icons/profile/help_24.png'),
    'privacy': require('../../assets/icons/profile/privacy_24.png'),
    'document': require('../../assets/icons/profile/document_24.png'),
    'edit': require('../../assets/icons/profile/edit_20.png'),

    // Education
    'university-64': require('../../assets/icons/education/university_64.png'),
    'university-96': require('../../assets/icons/education/university_96.png'),
    'calculator-96': require('../../assets/icons/education/calculator_96.png'),
    'bar-chart': require('../../assets/icons/education/bar-chart_32.png'),
    'book': require('../../assets/icons/education/book_24.png'),
    'book-48': require('../../assets/icons/education/book_48.png'),
    'calendar': require('../../assets/icons/education/calendar_24.png'),
    'checklist': require('../../assets/icons/education/checklist_32.png'),
    'medal': require('../../assets/icons/education/medal_32.png'),

    // Files
    'pdf-32': require('../../assets/icons/files/pdf_32.png'),
    'pdf-48': require('../../assets/icons/files/pdf_48.png'),
    'download': require('../../assets/icons/files/download_20.png'),
    'search': require('../../assets/icons/files/search_24.png'),
    'filter': require('../../assets/icons/files/filter_24.png'),
    'up-arrow': require('../../assets/icons/files/up-arrow_20.png'),

    // Social
    'send': require('../../assets/icons/social/send_24.png'),
    'attach': require('../../assets/icons/social/attach_24.png'),

    // UI
    'bell': require('../../assets/icons/ui/bell_24.png'),
    'chevron-right': require('../../assets/icons/ui/chevron-right_20.png'),
    'chevron-left': require('../../assets/icons/ui/chevron-left_20.png'),
    'refresh': require('../../assets/icons/ui/refresh_24.png'),
    'share': require('../../assets/icons/ui/share_24.png'),

    // Decorative
    'lightning': require('../../assets/icons/decorative/lightning-bolt_24.png'),
    'confetti-48': require('../../assets/icons/decorative/confetti_48.png'),
};

// Fallback mapping to Ionicons for missing Icons8 icons
const IONICONS_FALLBACK: Record<string, keyof typeof Ionicons.glyphMap> = {
    'chat-bubble': 'chatbubble',
    'hand': 'hand-right',
    'star': 'star',
    'fire': 'flame',
    'logout': 'log-out',
    'verified-badge': 'checkmark-circle',
    'emoji': 'happy',
    'group': 'people',
    'notification': 'notifications',
    'cloud-upload': 'cloud-upload',
    'image': 'image',
    'folder': 'folder',
    'location': 'location',
    'menu': 'menu',
    'close': 'close',
    'heart': 'heart',
    'crown': 'trophy',
};

interface Icons8IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<ImageStyle>;
}

export const Icons8Icon: React.FC<Icons8IconProps> = ({
    name,
    size = 24,
    color,
    style
}) => {
    const { theme } = useTheme();
    const iconColor = color || theme.colors.text.primary;

    // Check if Icons8 version exists
    const icons8Source = ICONS8_MAP[name];

    if (icons8Source) {
        // Use Icons8 icon
        return (
            <Image
                source={icons8Source}
                style={[
                    {
                        width: size,
                        height: size,
                        tintColor: iconColor,
                    },
                    style,
                ]}
                resizeMode="contain"
            />
        );
    }

    // Fallback to Ionicons
    const ioniconName = IONICONS_FALLBACK[name];
    if (ioniconName) {
        return <Ionicons name={ioniconName} size={size} color={iconColor} style={style} />;
    }

    // Ultimate fallback - try as Ionicon directly
    return <Ionicons name={name as any} size={size} color={iconColor} style={style} />;
};
