import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { GradientBackground } from '../components/GradientBackground';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '../contexts/ToastContext';
import { AdvancedHeader } from '../components/AdvancedHeader';
import { Icons8Icon } from '../components/Icons8Icon';

const UNIVERSITIES = [
    {
        id: '1',
        name: 'NUST',
        location: 'Islamabad',
        type: 'Engineering, IT & Applied Sciences',
        merit: '78% - 82%',
        test: 'NET',
        formula: '75:15:10'
    },
    {
        id: '2',
        name: 'COMSATS',
        location: 'Islamabad/Lahore',
        type: 'IT, Software & Management',
        merit: '86% - 89%',
        test: 'NTS-NAT',
        formula: '50:40:10'
    },
    {
        id: '3',
        name: 'UET',
        location: 'Lahore',
        type: 'Engineering & Technology',
        merit: '75% - 84%',
        test: 'ECAT',
        formula: '30:45:25'
    },
    { id: '4', name: 'FAST', location: 'Multiple', type: 'CS', merit: '60%' },
    { id: '5', name: 'GIKI', location: 'Topi', type: 'Engineering', merit: 'Entrance Test' },
];

export const UniGuideScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const { theme } = useTheme();
    const [search, setSearch] = useState('');

    const filteredUnis = UNIVERSITIES.filter(uni =>
        uni.name.toLowerCase().includes(search.toLowerCase()) ||
        uni.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <GradientBackground variant="header" particleCount={6}>
            <AdvancedHeader
                title="UniGuide"
                subtitle="Explore top universities"
                showBack={false}
                rightAction={{
                    icon: 'search-outline',
                    onPress: () => { } // Focus search
                }}
            />

            {/* Search Bar matching Home Screen */}
            <View className="items-center w-full mb-6 z-10">
                <View style={{
                    backgroundColor: theme.colors.surface,
                    ...theme.shadows.lg,
                    borderRadius: theme.borderRadius.xl,
                    borderWidth: 2,
                    borderColor: 'rgba(0,0,0,0.12)', // Increased from 0.03
                    maxWidth: 800
                }} className="w-full mx-6 flex-row items-center px-5 py-0.5">
                    <Icons8Icon name="search" size={22} color={theme.colors.text.muted} />
                    <TextInput
                        placeholder="Search universities..."
                        placeholderTextColor={theme.colors.text.muted}
                        style={{ color: theme.colors.text.primary, height: 50 }}
                        className="flex-1 ml-3 font-inter font-medium"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 10 }}>
                <View className="flex-1 items-center px-6">
                    <View className="w-full max-w-[800px] flex-row flex-wrap justify-between">
                        {filteredUnis.map(uni => (
                            <View key={uni.id} className="w-full md:w-[48%] lg:w-[31%] mb-4">
                                <View
                                    style={{
                                        backgroundColor: theme.colors.surface,
                                        borderRadius: theme.borderRadius.lg,
                                        borderWidth: 1.5, // Increased
                                        borderColor: 'rgba(0,0,0,0.12)', // Increased from 0.05
                                        ...theme.shadows.md,
                                    }}
                                    className="p-4 flex-row justify-between items-center min-h-[80px]"
                                >
                                    <View className="flex-1">
                                        <Text style={{ color: theme.colors.text.primary }} className="font-bold text-base mb-0.5">{uni.name}</Text>
                                        <Text style={{ color: theme.colors.text.muted }} className="text-[11px] mb-2">{uni.location} • {uni.type}.</Text>

                                        <View style={{ backgroundColor: theme.colors.primary + '25', borderColor: theme.colors.primary + '40' }} className="flex-row items-center self-start px-2 py-0.5 rounded-md border">
                                            <Icons8Icon name="school" size={12} color={theme.colors.primary} />
                                            <Text style={{ color: theme.colors.primary }} className="text-[9px] font-bold ml-1 uppercase">{uni.test}</Text>
                                        </View>
                                    </View>

                                    <View className="items-end">
                                        <Text style={{ color: theme.colors.primary }} className="font-bold text-sm mb-1">{uni.merit}</Text>
                                        <Text style={{ color: theme.colors.text.muted }} className="text-[9px] mb-2 font-medium">Ratio: {uni.formula}</Text>

                                        <TouchableOpacity
                                            style={{ backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary + '30' }} // Increased from 10/20
                                            className="flex-row items-center px-3 py-1.5 rounded-lg border active:opacity-70"
                                            onPress={() => {
                                                if (['NUST', 'UET', 'COMSATS'].includes(uni.name)) {
                                                    navigation.navigate('MeritCalculator', { university: uni.name });
                                                } else {
                                                    showToast('Coming Soon', 'Calculator for this university is coming soon!', 'info');
                                                }
                                            }}
                                        >
                                            <Icons8Icon name="calculator-96" size={16} color={theme.colors.primary} />
                                            <Text style={{ color: theme.colors.primary }} className="text-[12px] font-semibold ml-1.5">Calculate</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </GradientBackground>
    );
};
