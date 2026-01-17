import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes based on standard mobile device (e.g. iPhone 11)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Returns true if the device is a tablet based on screen width
 */
export const isTablet = SCREEN_WIDTH >= 768;

/**
 * Returns true if the app is running on Web
 */
export const isWeb = Platform.OS === 'web';

/**
 * Returns true if the device is a desktop browser
 */
export const isDesktop = isWeb && SCREEN_WIDTH >= 1024;

/**
 * helper to return platform-specific value
 */
export const select = <T,>(options: { mobile?: T, tablet?: T, web?: T, default: T }): T => {
    if (isWeb && options.web !== undefined) return options.web;
    if (isTablet && options.tablet !== undefined) return options.tablet;
    if (options.mobile !== undefined) return options.mobile;
    return options.default;
};

/**
 * Returns a responsive width percentage
 */
export const wp = (percentage: number) => {
    return (percentage * SCREEN_WIDTH) / 100;
};

/**
 * Returns a responsive height percentage
 */
export const hp = (percentage: number) => {
    return (percentage * SCREEN_HEIGHT) / 100;
};
