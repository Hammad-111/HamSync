import React from 'react';
import { View, Text, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { AdvancedHeader } from '../components/AdvancedHeader';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const AboutScreen = () => {
    const { theme } = useTheme();

    const handleEmailPress = () => {
        Linking.openURL('mailto:connect2hammadjaveed@gmail.com');
    };

    const handlePhonePress = () => {
        Linking.openURL('tel:+923017891391');
    };

    return (
        <GradientBackground variant="header">
            <AdvancedHeader title="About HamSync" />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Brand Section */}
                <View style={{ alignItems: 'center', marginBottom: 40, marginTop: 20 }}>
                    <View style={{
                        width: 100,
                        height: 100,
                        backgroundColor: 'white',
                        borderRadius: 24,
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...theme.shadows.lg,
                        marginBottom: 16
                    }}>
                        <Ionicons name="school" size={50} color={theme.colors.primary} />
                    </View>
                    <Text style={{ fontSize: 28, fontWeight: '900', color: theme.colors.text.primary, letterSpacing: -0.5 }}>
                        HamSync
                    </Text>
                    <Text style={{ fontSize: 16, color: theme.colors.text.secondary, fontWeight: '500' }}>
                        Connect. Share. Excel.
                    </Text>
                </View>

                {/* Description */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{ fontSize: 16, color: theme.colors.text.secondary, lineHeight: 24, textAlign: 'center' }}>
                        HamSync is a comprehensive platform designed to bridge the gap between students and academic resources. Connect, share, and excel with a community built for success. We empower students with tools like merit calculators, university guides, and a collaborative library.
                    </Text>
                </View>

                {/* Developer Card */}
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 16, marginLeft: 8 }}>
                    Developer
                </Text>
                <View style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: 24,
                    padding: 24,
                    ...theme.shadows.md,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <View style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: theme.colors.primary + '15',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 16
                        }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.primary }}>H</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 20, fontWeight: '800', color: theme.colors.text.primary }}>
                                Hammad Javed
                            </Text>
                            <Text style={{ fontSize: 14, color: theme.colors.primary, fontWeight: '600' }}>
                                Lead Developer
                            </Text>
                        </View>
                    </View>

                    <View style={{ gap: 12 }}>
                        <TouchableOpacity onPress={handlePhonePress} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: theme.colors.background, borderRadius: 12 }}>
                            <Ionicons name="call" size={20} color={theme.colors.primary} />
                            <Text style={{ marginLeft: 12, fontSize: 15, color: theme.colors.text.primary, fontWeight: '500' }}>
                                +92 301 7891391
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleEmailPress} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: theme.colors.background, borderRadius: 12 }}>
                            <Ionicons name="mail" size={20} color={theme.colors.primary} />
                            <Text style={{ marginLeft: 12, fontSize: 15, color: theme.colors.text.primary, fontWeight: '500' }}>
                                connect2hammadjaveed@gmail.com
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Version Info */}
                <Text style={{ textAlign: 'center', color: theme.colors.text.muted, fontSize: 13, marginTop: 40 }}>
                    Version 1.0.0 (Build 2026.1)
                </Text>
            </ScrollView>
        </GradientBackground>
    );
};
