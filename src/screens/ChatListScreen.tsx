import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { GradientBackground } from '../components/GradientBackground';
import { Ionicons } from '@expo/vector-icons';

const CHATS = [
    { id: '1', name: 'Ali Khan', message: 'Thanks for the help!', time: '2m', unread: 2, avatar: null },
    { id: '2', name: 'Sara Ahmed', message: 'Can we schedule a call?', time: '1h', unread: 0, avatar: null },
    { id: '3', name: 'Study Group A', message: 'Bilal: Notes uploaded.', time: '3h', unread: 5, avatar: null },
];

export const ChatListScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { theme } = useTheme();

    const renderItem = ({ item }: { item: typeof CHATS[0] }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: item.id, name: item.name })} className="items-center w-full">
            <View
                style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.lg,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.04)',
                    ...theme.shadows.sm,
                    shadowOpacity: 0.05,
                    maxWidth: 600
                }}
                className="w-full mx-6 mb-3 p-4 flex-row items-center"
            >
                <View style={{ backgroundColor: theme.colors.primary + '15' }} className="w-12 h-12 rounded-full justify-center items-center mr-4">
                    <Text style={{ color: theme.colors.primary }} className="font-bold text-lg">{item.name[0]}</Text>
                </View>
                <View className="flex-1">
                    <View className="flex-row justify-between mb-1">
                        <Text style={{ color: theme.colors.text.primary }} className="font-bold text-base">{item.name}</Text>
                        <Text style={{ color: theme.colors.text.muted }} className="text-xs">{item.time}</Text>
                    </View>
                    <Text style={{ color: theme.colors.text.secondary }} className="text-sm" numberOfLines={1}>{item.message}</Text>
                </View>
                {item.unread > 0 && (
                    <View style={{ backgroundColor: theme.colors.primary }} className="w-6 h-6 rounded-full justify-center items-center ml-2">
                        <Text className="text-white text-[10px] font-bold">{item.unread}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <GradientBackground variant="header" particleCount={6}>
            <View className="items-center w-full">
                <View
                    style={{ paddingTop: insets.top + 25 }}
                    className="w-full max-w-[600px] px-6 pb-6 flex-row justify-between items-center"
                >
                    <View>
                        <Text style={{ color: theme.colors.text.inverse }} className="text-3xl font-poppins font-bold">ChatSync</Text>
                        <Text style={{ color: theme.colors.text.inverse, opacity: 0.8 }} className="font-inter mt-0.5 text-sm">Active Discussions</Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 8 }}>
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flex: 1, marginTop: 10 }}>
                <FlatList
                    data={CHATS}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </View>
        </GradientBackground>
    );
};
