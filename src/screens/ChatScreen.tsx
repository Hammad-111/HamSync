import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { GradientBackground } from '../components/GradientBackground';
import { Icons8Icon } from '../components/Icons8Icon';

const MESSAGES = [
    { id: '1', text: 'Hey, are you free to help with Physics?', sender: 'them', time: '10:00 AM' },
    { id: '2', text: 'Yes, sure! What topic?', sender: 'me', time: '10:05 AM' },
    { id: '3', text: 'Quantum Mechanics, specifically wave functions.', sender: 'them', time: '10:06 AM' },
];

export const ChatScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { theme } = useTheme();
    const { name } = route.params || { name: 'Chat' };
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState(MESSAGES);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'me', time: 'Now' }]);
        setInput('');
    };

    const renderItem = ({ item }: { item: typeof MESSAGES[0] }) => {
        const isMe = item.sender === 'me';
        return (
            <View className={`mb-4 max-w-[80%] ${isMe ? 'self-end' : 'self-start'}`}>
                <View
                    style={{
                        backgroundColor: isMe ? theme.colors.primary : theme.colors.surface,
                        borderRadius: theme.borderRadius.lg,
                        borderBottomRightRadius: isMe ? 4 : theme.borderRadius.lg,
                        borderBottomLeftRadius: !isMe ? 4 : theme.borderRadius.lg,
                        borderWidth: isMe ? 0 : 1.5, // Increased
                        borderColor: 'rgba(0,0,0,0.12)', // Increased from 0.05
                        ...theme.shadows.sm,
                        padding: 12,
                    }}
                >
                    <Text style={{ color: isMe ? 'white' : theme.colors.text.primary }} className="font-inter text-[15px]">{item.text}</Text>
                </View>
                <Text style={{ color: theme.colors.text.muted }} className={`text-[10px] mt-1 ${isMe ? 'text-right' : 'text-left'}`}>{item.time}</Text>
            </View>
        );
    };

    return (
        <GradientBackground variant="header" particleCount={4}>
            {/* Header */}
            <View className="items-center w-full">
                <View
                    style={{ paddingTop: insets.top + 30 }}
                    className="w-full max-w-[600px] flex-row items-center px-6 pb-6"
                >
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                        <Icons8Icon name="back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} className="w-10 h-10 rounded-full justify-center items-center mr-3">
                        <Text style={{ color: 'white' }} className="font-bold">{name[0]}</Text>
                    </View>
                    <View>
                        <Text style={{ color: 'white' }} className="font-bold text-lg">{name}</Text>
                        <Text className="text-green-300 text-[10px] font-semibold">Online</Text>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1, backgroundColor: theme.colors.background }} className="rounded-t-[30px] -mt-4 overflow-hidden">
                <View className="flex-1 items-center w-full pt-6">
                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        className="w-full max-w-[600px] flex-1 px-6"
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                >
                    <View style={{ backgroundColor: theme.colors.surface, borderTopColor: 'rgba(0,0,0,0.05)' }} className="items-center border-t py-4">
                        <View className="w-full max-w-[600px] flex-row items-center px-4">
                            <View
                                style={{
                                    backgroundColor: theme.colors.background,
                                    borderRadius: 25,
                                    borderWidth: 1.5, // Increased
                                    borderColor: 'rgba(0,0,0,0.15)', // Increased from 0.05
                                }}
                                className="flex-1 flex-row items-center px-4 mr-3"
                            >
                                <TextInput
                                    style={{ color: theme.colors.text.primary, height: 45 }}
                                    className="flex-1 font-inter"
                                    placeholder="Type a message..."
                                    placeholderTextColor={theme.colors.text.muted}
                                    value={input}
                                    onChangeText={setInput}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={sendMessage}
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    width: 45,
                                    height: 45,
                                    borderRadius: 22.5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    ...theme.shadows.md,
                                }}
                            >
                                <Icons8Icon name="send" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </GradientBackground>
    );
};
