import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { AdvancedHeader } from '../components/AdvancedHeader';
import { useTheme } from '../contexts/ThemeContext';

export const PrivacyPolicyScreen = () => {
    const { theme } = useTheme();

    return (
        <GradientBackground variant="header">
            <AdvancedHeader title="Privacy Policy" />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: 24,
                    padding: 24,
                    ...theme.shadows.md,
                    marginTop: 10
                }}>
                    <Section
                        title="1. Information We Collect"
                        content="We collect information you provide directly to us, such as your name, email address, university details, and any content you post or share within HamSync."
                        theme={theme}
                    />
                    <Section
                        title="2. How We Use Your Information"
                        content="We use your information to provide, maintain, and improve our services, facilitate connections between students, and personalize your experience on the platform."
                        theme={theme}
                    />
                    <Section
                        title="3. Data Security"
                        content="We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
                        theme={theme}
                    />
                    <Section
                        title="4. Sharing of Information"
                        content="We do not sell your personal information. We may share your information only with your consent or as required by law to protect our rights and safety."
                        theme={theme}
                    />
                    <Section
                        title="5. Your Choices"
                        content="You can manage your account settings and privacy preferences at any time. You may also request to delete your account and associated data by contacting support."
                        theme={theme}
                    />
                    <Text style={{ color: theme.colors.text.muted, fontSize: 13, marginTop: 20, textAlign: 'center', fontStyle: 'italic' }}>
                        Last Updated: January 15, 2026
                    </Text>
                </View>
            </ScrollView>
        </GradientBackground>
    );
};

const Section = ({ title, content, theme }: { title: string, content: string, theme: any }) => (
    <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 8 }}>
            {title}
        </Text>
        <Text style={{ fontSize: 15, color: theme.colors.text.secondary, lineHeight: 22 }}>
            {content}
        </Text>
    </View>
);
