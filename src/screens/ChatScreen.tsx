import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlassView } from '../components/GlassView';

const MESSAGES = [
    { id: '1', text: 'Hey, are you free to help with Physics?', sender: 'them', time: '10:00 AM' },
    { id: '2', text: 'Yes, sure! What topic?', sender: 'me', time: '10:05 AM' },
    { id: '3', text: 'Quantum Mechanics, specifically wave functions.', sender: 'them', time: '10:06 AM' },
];

export const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { name } = route.params || { name: 'Chat' };
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState(MESSAGES);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'me', time: 'Now' }]);
        setInput('');
    };

    const renderItem = ({ item }: { item: typeof MESSAGES[0] }) => (
        <View className={`mb-4 max-w-[80%] ${item.sender === 'me' ? 'self-end' : 'self-start'}`}>
            <View className={`p-4 rounded-2xl ${item.sender === 'me' ? 'bg-accent rounded-tr-none' : 'bg-white/10 rounded-tl-none border border-white/10'}`}>
                <Text className="text-white">{item.text}</Text>
            </View>
            <Text className={`text-gray-400 text-[10px] mt-1 ${item.sender === 'me' ? 'text-right' : 'text-left'}`}>{item.time}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-primary" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-white/10 bg-primary">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Text className="text-white text-lg">←</Text>
                </TouchableOpacity>
                <View className="w-10 h-10 rounded-full bg-gray-500 justify-center items-center mr-3">
                    <Text className="text-white font-bold">{name[0]}</Text>
                </View>
                <View>
                    <Text className="text-white font-bold text-lg">{name}</Text>
                    <Text className="text-green-400 text-xs">Online</Text>
                </View>
            </View>

            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                className="flex-1 px-6 pt-4"
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View className="px-4 py-4 bg-primary border-t border-white/10 flex-row items-center">
                    <TextInput
                        className="flex-1 bg-white/10 text-white rounded-full px-6 py-3 mr-3 border border-white/10"
                        placeholder="Type a message..."
                        placeholderTextColor="#9ca3af"
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity onPress={sendMessage} className="w-12 h-12 bg-accent rounded-full justify-center items-center">
                        <Text className="text-white font-bold">{'>'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
