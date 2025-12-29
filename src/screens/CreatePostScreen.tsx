import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { GlassView } from '../components/GlassView';
import { useToast } from '../contexts/ToastContext';
import { getUserProfile } from '../services/userService';

export const CreatePostScreen = () => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form State
    const [type, setType] = useState<'ASKING' | 'OFFERING'>('ASKING');
    const [subject, setSubject] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // User Data State
    const [userUniversity, setUserUniversity] = useState('');
    const [userAvatar, setUserAvatar] = useState<string | null>(null);

    // Fetch User Profile on Mount
    React.useEffect(() => {
        const fetchUserProfile = async () => {
            const user = auth.currentUser;
            if (user) {
                // Default from Auth
                setUserAvatar(user.photoURL || null);

                try {
                    // Fetch additional details from Firestore
                    const profile = await getUserProfile(user.uid);
                    if (profile) {
                        setUserUniversity(profile.university || '');
                        // Prefer Firestore avatar if exists (future proofing)
                        // if (profile.avatar) setUserAvatar(profile.avatar); 
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
                }
            }
        };
        fetchUserProfile();
    }, []);

    const handleCreatePost = async () => {
        if (!subject.trim() || !title.trim() || !description.trim()) {
            showToast('Missing Fields', 'Please fill in all fields to create a post.', 'error');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            showToast('Error', 'You must be logged in to create a post.', 'error');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'posts'), {
                author: {
                    uid: user.uid,
                    name: user.displayName || 'Anonymous',
                    avatar: userAvatar,
                    university: userUniversity || 'HamSync User' // Fallback
                },
                type,
                subject: subject.trim(),
                title: title.trim(),
                description: description.trim(),
                createdAt: serverTimestamp(),
                timestamp: new Date().toISOString() // Client-side fallback/sorting
            });

            showToast('Success', 'Post created successfully!', 'success');
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            showToast('Error', 'Failed to create post. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-primary">
            <LinearGradient
                colors={['#1E0A3C', '#2E1065', '#3B1A8C']}
                className="absolute w-full h-full"
            />

            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center px-6 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 bg-white/10 rounded-full justify-center items-center border border-white/20"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">Create Post</Text>
                </View>

                <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* Post Type Selector */}
                    <Text className="text-gray-300 text-sm font-semibold mb-3 ml-1">POST TYPE</Text>
                    <View className="flex-row mb-6">
                        <TouchableOpacity
                            onPress={() => setType('ASKING')}
                            className={`flex-1 py-3 rounded-l-xl border-y border-l border-r items-center justify-center ${type === 'ASKING' ? 'bg-red-500/20 border-red-500 z-10' : 'bg-white/5 border-white/10'}`}
                        >
                            <Text className={`${type === 'ASKING' ? 'text-white font-bold' : 'text-gray-400'}`}>I Need Help</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setType('OFFERING')}
                            className={`flex-1 py-3 rounded-r-xl border -ml-px items-center justify-center ${type === 'OFFERING' ? 'bg-green-500/20 border-green-500 z-10' : 'bg-white/5 border-white/10'}`}
                        >
                            <Text className={`${type === 'OFFERING' ? 'text-white font-bold' : 'text-gray-400'}`}>I Can Help</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Subject */}
                    <Text className="text-gray-300 text-sm font-semibold mb-3 ml-1">SUBJECT</Text>
                    <GlassView className="mb-6 p-0">
                        <TextInput
                            placeholder="e.g. Calculus II, React Native, Physics"
                            placeholderTextColor="#9ca3af"
                            className="text-white px-4 py-2 font-inter"
                            value={subject}
                            onChangeText={setSubject}
                        />
                    </GlassView>

                    {/* Title */}
                    <Text className="text-gray-300 text-sm font-semibold mb-3 ml-1">TITLE</Text>
                    <GlassView className="mb-6 p-0">
                        <TextInput
                            placeholder="Briefly summarize your request/offer..."
                            placeholderTextColor="#9ca3af"
                            className="text-white px-4 py-2 font-inter font-semibold"
                            value={title}
                            onChangeText={setTitle}
                            maxLength={80}
                        />
                    </GlassView>

                    {/* Description */}
                    <Text className="text-gray-300 text-sm font-semibold mb-3 ml-1">DESCRIPTION</Text>
                    <GlassView className="mb-8 p-0">
                        <TextInput
                            placeholder="Explain the details. What exactly do you need help with, or what are you offering?"
                            placeholderTextColor="#9ca3af"
                            className="text-white px-4 py-4 font-inter h-40"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                        />
                    </GlassView>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleCreatePost}
                        disabled={loading}
                        className={`py-4 rounded-xl items-center shadow-lg ${type === 'ASKING' ? 'bg-red-500' : 'bg-green-600'}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                {type === 'ASKING' ? 'Post Request' : 'Post Offer'}
                            </Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
};
