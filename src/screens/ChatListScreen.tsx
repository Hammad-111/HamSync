import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from '../components/GlassView';
import { useNavigation } from '@react-navigation/native';

const CHATS = [
    { id: '1', name: 'Ali Khan', message: 'Thanks for the help!', time: '2m', unread: 2, avatar: null },
    { id: '2', name: 'Sara Ahmed', message: 'Can we schedule a call?', time: '1h', unread: 0, avatar: null },
    { id: '3', name: 'Study Group A', message: 'Bilal: Notes uploaded.', time: '3h', unread: 5, avatar: null },
];

export const ChatListScreen = () => {
    const navigation = useNavigation<any>();

    const renderItem = ({ item }: { item: typeof CHATS[0] }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: item.id, name: item.name })}>
            <GlassView className="mb-3 p-4 flex-row items-center cursor-pointer">
                <View className="w-12 h-12 rounded-full bg-gray-500 justify-center items-center mr-4">
                    <Text className="text-white font-bold text-lg">{item.name[0]}</Text>
                </View>
                <View className="flex-1">
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-white font-bold text-base">{item.name}</Text>
                        <Text className="text-gray-400 text-xs">{item.time}</Text>
                    </View>
                    <Text className="text-gray-300 text-sm" numberOfLines={1}>{item.message}</Text>
                </View>
                {item.unread > 0 && (
                    <View className="w-6 h-6 bg-accent rounded-full justify-center items-center ml-2">
                        <Text className="text-white text-xs font-bold">{item.unread}</Text>
                    </View>
                )}
            </GlassView>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-primary px-6" edges={['top']}>
            <View className="mb-6 mt-4 flex-row justify-between items-center">
                <Text className="text-white text-3xl font-poppins font-bold">ChatSync</Text>
                <TouchableOpacity>
                    <Text className="text-accent text-lg">+</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={CHATS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};
