import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSelector } from '../components/ThemeSelector';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GradientBackground } from '../components/GradientBackground';
import { AdvancedHeader } from '../components/AdvancedHeader';

export const SettingsScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<any>();

    return (
        <GradientBackground variant="header" particleCount={4}>
            <AdvancedHeader
                title="Settings"
                subtitle="Customize your experience"
            />

            <ScrollView
                style={styles.container}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 items-center w-full">
                    <View className="w-full max-w-[600px]">
                        {/* Theme Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="color-palette" size={24} color={theme.colors.primary} />
                                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                                    Appearance
                                </Text>
                            </View>
                            <Text style={[styles.sectionDescription, { color: theme.colors.text.secondary }]}>
                                Choose your preferred theme to personalize your experience
                            </Text>
                            <ThemeSelector />
                        </View>

                        {/* App Info Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
                                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                                    About
                                </Text>
                            </View>
                            <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
                                <View style={styles.infoRow}>
                                    <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>
                                        Version
                                    </Text>
                                    <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
                                        1.0.0
                                    </Text>
                                </View>
                                <View style={[styles.divider, { backgroundColor: theme.colors.glass.border }]} />
                                <View style={styles.infoRow}>
                                    <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>
                                        App Name
                                    </Text>
                                    <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
                                        HamSync
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Theme Preview */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="eye" size={24} color={theme.colors.primary} />
                                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                                    Theme Preview
                                </Text>
                            </View>
                            <View className="flex-row flex-wrap gap-3 mt-3">
                                <LinearGradient
                                    colors={theme.colors.gradient.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="flex-1 min-w-[150px] p-6 rounded-2xl items-center justify-center"
                                >
                                    <Text style={[styles.previewTitle, { color: theme.colors.text.inverse }]}>
                                        Primary
                                    </Text>
                                </LinearGradient>

                                <LinearGradient
                                    colors={theme.colors.gradient.secondary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="flex-1 min-w-[150px] p-6 rounded-2xl items-center justify-center"
                                >
                                    <Text style={[styles.previewTitle, { color: theme.colors.text.inverse }]}>
                                        Secondary
                                    </Text>
                                </LinearGradient>

                                <LinearGradient
                                    colors={theme.colors.gradient.accent}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="flex-1 min-w-[150px] p-6 rounded-2xl items-center justify-center"
                                >
                                    <Text style={[styles.previewTitle, { color: theme.colors.text.inverse }]}>
                                        Accent
                                    </Text>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingBottom: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    container: {
        flex: 1,
    },
    section: {
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    sectionDescription: {
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    infoCard: {
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    divider: {
        height: 1,
        opacity: 0.3,
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    previewContainer: {
        gap: 12,
        marginTop: 12,
    },
    previewCard: {
        borderRadius: 16,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
});
