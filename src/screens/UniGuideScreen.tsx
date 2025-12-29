import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from '../components/GlassView';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../contexts/ToastContext';

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
    const [search, setSearch] = useState('');

    const filteredUnis = UNIVERSITIES.filter(uni =>
        uni.name.toLowerCase().includes(search.toLowerCase()) ||
        uni.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-primary px-6" edges={['top']}>
            <View className="flex-row justify-between items-center mb-6 mt-4">
                <Text className="text-white text-3xl font-poppins font-bold">UniGuide</Text>
            </View>

            {/* Search Bar matching Home Screen */}
            <View className="mb-4">
                <View className="bg-white/10 rounded-xl border border-white/10 flex-row items-center px-4">
                    <Text className="text-gray-400 mr-2">🔍</Text>
                    <TextInput
                        placeholder="Search universities..."
                        placeholderTextColor="#9ca3af"
                        className="flex-1 text-white py-3 font-inter"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                {filteredUnis.map(uni => (
                    <GlassView key={uni.id} className="mb-3 px-3 py-3 flex-row justify-between items-center">
                        <View className="flex-1">
                            <Text className="text-white font-bold text-base mb-0.5">{uni.name}</Text>
                            <Text className="text-gray-400 text-[11px] mb-2">{uni.location} • {uni.type}.</Text>

                            {/* Entrance Test Badge - User ko foran pata chalay ga konsa test dena ha */}
                            <View className="flex-row items-center bg-accent/20 self-start px-2 py-0.5 rounded-md">
                                <Ionicons name="school-outline" size={10} color="#00C8FF" />
                                <Text className="text-accent text-[9px] font-bold ml-1 uppercase">{uni.test}</Text>
                            </View>
                        </View>

                        <View className="items-end">
                            <Text className="text-accent font-bold text-sm mb-1">{uni.merit}</Text>

                            {/* Ratio Display - Formula details k liye */}
                            <Text className="text-gray-500 text-[9px] mb-2 font-medium">Ratio: {uni.formula}</Text>

                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    className="flex-row items-center bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 active:bg-white/20"
                                    onPress={() => {
                                        if (['NUST', 'UET', 'COMSATS'].includes(uni.name)) {
                                            navigation.navigate('MeritCalculator', { university: uni.name });
                                        } else {
                                            showToast('Coming Soon', 'Calculator for this university is coming soon!', 'info');
                                        }
                                    }}
                                >
                                    <Ionicons name="calculator-outline" size={14} color="white" />
                                    <Text className="text-white text-[12px] font-semibold ml-1.5">Calculate</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </GlassView>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};
