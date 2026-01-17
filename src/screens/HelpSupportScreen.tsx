import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { AdvancedHeader } from '../components/AdvancedHeader';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const HelpSupportScreen = () => {
    const { theme } = useTheme();

    const handleContactSupport = () => {
        Linking.openURL('mailto:connect2hammadjaveed@gmail.com');
    };

    return (
        <GradientBackground variant="header">
            <AdvancedHeader title="Help & Support" />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Contact Support Card */}
                <View style={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: 24,
                    padding: 24,
                    marginBottom: 24,
                    ...theme.shadows.md,
                    alignItems: 'center'
                }}>
                    <Ionicons name="headset" size={48} color="white" style={{ marginBottom: 12 }} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
                        Need Assistance?
                    </Text>
                    <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 20 }}>
                        Our dedicated support team is here to help you with any issues or questions.
                    </Text>
                    <TouchableOpacity
                        onPress={handleContactSupport}
                        style={{
                            backgroundColor: 'white',
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            borderRadius: 12,
                        }}
                    >
                        <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 16 }}>
                            Contact Support
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* FAQ Section */}
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 16, marginLeft: 8 }}>
                    Frequently Asked Questions
                </Text>

                <View style={{ gap: 16 }}>
                    <FAQItem
                        question="How do I reset my password?"
                        answer="You can reset your password by going to the login screen and tapping on 'Forgot Password'. Follow the instructions sent to your email."
                        theme={theme}
                    />
                    <FAQItem
                        question="How can I calculate my merit?"
                        answer="Navigate to the Merit Calculator from the main menu. Select your university and program, enter your marks, and the app will calculate your aggregate."
                        theme={theme}
                    />
                    <FAQItem
                        question="Is HamSync free to use?"
                        answer="Yes, HamSync is completely free for students to access university guides, merit calculators, and community features."
                        theme={theme}
                    />
                    <FAQItem
                        question="How do I edit my profile?"
                        answer="Go to your Profile tab and tap on the 'Edit Profile' button to update your information and avatar."
                        theme={theme}
                    />
                </View>
            </ScrollView>
        </GradientBackground>
    );
};

const FAQItem = ({ question, answer, theme }: { question: string, answer: string, theme: any }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 16,
                padding: 16,
                ...theme.shadows.sm
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text.primary, flex: 1 }}>
                    {question}
                </Text>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={theme.colors.text.muted} />
            </View>
            {expanded && (
                <Text style={{ marginTop: 12, fontSize: 14, color: theme.colors.text.secondary, lineHeight: 20 }}>
                    {answer}
                </Text>
            )}
        </TouchableOpacity>
    );
};
