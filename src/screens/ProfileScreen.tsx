import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from '../components/GlassView';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { auth } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';

export const ProfileScreen = () => {
    const [skills, setSkills] = useState(['Python', 'Physics', 'Mathematics', 'Biology']);
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            );
        } catch (error) {
            console.error("Logout failed: ", error);
            // Could add toast notification here if needed
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-primary px-6" edges={['top']}>
            <View className="items-center mb-6 mt-4">
                <View className="w-24 h-24 bg-gray-400 rounded-full mb-4 justify-center items-center">
                    <Text className="text-4xl text-white font-bold">U</Text>
                </View>
                <Text className="text-white text-2xl font-poppins font-bold">User Name</Text>
                <Text className="text-gray-300 font-inter">Student at NUST</Text>

                <View className="bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/50 mt-3 flex-row items-center">
                    <Text className="text-yellow-400 mr-2">✨</Text>
                    <Text className="text-yellow-200 font-bold">120 Karma Points</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Karma Setup (Mock Graph) */}
                <View className="mb-6">
                    <Text className="text-white font-bold text-lg mb-3">Karma Growth</Text>
                    <GlassView className="h-40 flex-row items-end justify-between px-4 pb-4">
                        {[20, 45, 30, 80, 60, 100, 90].map((h, i) => (
                            <View key={i} className="bg-accent w-8 rounded-t-lg" style={{ height: `${h}%` }} />
                        ))}
                    </GlassView>
                </View>

                {/* Skills */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-white font-bold text-lg">My Skills</Text>
                        <TouchableOpacity>
                            <Text className="text-accent text-sm">Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row flex-wrap gap-2">
                        {skills.map(skill => (
                            <View key={skill} className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                                <Text className="text-white text-sm">{skill}</Text>
                            </View>
                        ))}
                        <TouchableOpacity className="bg-accent/20 px-4 py-2 rounded-full border border-accent/50">
                            <Text className="text-accent text-sm font-bold">+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Contributions */}
                <View className="mb-6">
                    <Text className="text-white font-bold text-lg mb-3">My Contributions</Text>
                    <GlassView className="p-4 mb-3">
                        <Text className="text-white font-bold">Physics Chapter 5 Notes</Text>
                        <Text className="text-gray-300 text-xs">Uploaded 2 days ago • 45 Upvotes</Text>
                    </GlassView>
                    <GlassView className="p-4">
                        <Text className="text-white font-bold">Helping Ali with React</Text>
                        <Text className="text-gray-300 text-xs">Completed 5 days ago • +50 Karma</Text>
                    </GlassView>
                </View>

                <TouchableOpacity
                    className="bg-red-500/20 p-4 rounded-xl border border-red-500/50 mb-4"
                    onPress={handleLogout}
                >
                    <Text className="text-red-300 text-center font-bold">Logout</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};
