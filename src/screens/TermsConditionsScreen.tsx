import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { AdvancedHeader } from '../components/AdvancedHeader';
import { useTheme } from '../contexts/ThemeContext';

export const TermsConditionsScreen = () => {
    const { theme } = useTheme();

    return (
        <GradientBackground variant="header">
            <AdvancedHeader title="Terms & Conditions" />
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
                    <Text style={{ fontSize: 15, color: theme.colors.text.secondary, marginBottom: 24, lineHeight: 22 }}>
                        Welcome to HamSync. By accessing or using our mobile application, you agree to be bound by these terms and conditions.
                    </Text>

                    <Section
                        title="1. User Conduct"
                        content="You agree to use HamSync only for lawful purposes and in accordance with these Terms. You agree not to post content that is offensive, harmful, or violates the rights of others."
                        theme={theme}
                    />
                    <Section
                        title="2. Intellectual Property"
                        content="The content, features, and functionality of HamSync are owned by us and are protected by international copyright, trademark, and other intellectual property laws."
                        theme={theme}
                    />
                    <Section
                        title="3. User Content"
                        content="You retain ownership of the content you post on HamSync. However, by posting content, you grant us a license to use, reproduce, and display such content in connection with the service."
                        theme={theme}
                    />
                    <Section
                        title="4. Termination"
                        content="We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users."
                        theme={theme}
                    />
                    <Section
                        title="5. Changes to Terms"
                        content="We modify these terms at any time. We will notify users of any significant changes. Your continued use of the app constitutes acceptance of the new terms."
                        theme={theme}
                    />
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
