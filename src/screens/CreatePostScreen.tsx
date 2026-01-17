import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { getUserProfile } from '../services/userService';
import { GradientBackground } from '../components/GradientBackground';
import { ThemedInput } from '../components/ThemedInput';

export const CreatePostScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const { theme } = useTheme();
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
    useEffect(() => {
        const fetchUserProfile = async () => {
            const user = auth.currentUser;
            if (user) {
                setUserAvatar(user.photoURL || null);
                try {
                    const profile = await getUserProfile(user.uid);
                    if (profile) {
                        setUserUniversity(profile.university || '');
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
                    university: userUniversity || 'HamSync User'
                },
                type,
                subject: subject.trim(),
                title: title.trim(),
                description: description.trim(),
                createdAt: serverTimestamp(),
                timestamp: new Date().toISOString()
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
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <GradientBackground variant="header" particleCount={4} />

            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="items-center w-full">
                    <View className="w-full max-w-[600px] flex-row items-center px-6 pb-6 pt-2">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 bg-white/10 rounded-full justify-center items-center border border-white/20"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-2xl font-poppins font-bold ml-4">Create Post</Text>
                    </View>
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 items-center px-6 pt-6">
                        <View className="w-full max-w-[600px]">

                            {/* Post Type Selector */}
                            <Text style={{ color: theme.colors.text.muted }} className="text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">What's your goal?</Text>
                            <View style={{ backgroundColor: theme.colors.surface, ...theme.shadows.sm }} className="flex-row p-1.5 rounded-2xl mb-8 border border-black/5">
                                <TouchableOpacity
                                    onPress={() => setType('ASKING')}
                                    style={{
                                        backgroundColor: type === 'ASKING' ? theme.colors.error + '20' : 'transparent',
                                        borderColor: type === 'ASKING' ? theme.colors.error : 'transparent'
                                    }}
                                    className={`flex-1 py-3 rounded-xl border items-center justify-center`}
                                >
                                    <Text style={{ color: type === 'ASKING' ? theme.colors.error : theme.colors.text.muted }} className="font-bold text-xs">I Need Help</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setType('OFFERING')}
                                    style={{
                                        backgroundColor: type === 'OFFERING' ? theme.colors.success + '20' : 'transparent',
                                        borderColor: type === 'OFFERING' ? theme.colors.success : 'transparent'
                                    }}
                                    className={`flex-1 py-3 rounded-xl border items-center justify-center`}
                                >
                                    <Text style={{ color: type === 'OFFERING' ? theme.colors.success : theme.colors.text.muted }} className="font-bold text-xs">I Can Help</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Inputs */}
                            <View style={{ backgroundColor: theme.colors.surface, ...theme.shadows.sm }} className="p-6 rounded-3xl border border-black/5 mb-8">
                                <ThemedInput
                                    label="Subject"
                                    placeholder="e.g. Calculus II, Physics"
                                    value={subject}
                                    onChangeText={setSubject}
                                    leftIcon="book-outline"
                                />

                                <ThemedInput
                                    label="Title"
                                    placeholder="Briefly summarize..."
                                    value={title}
                                    onChangeText={setTitle}
                                    leftIcon="pencil-outline"
                                />

                                <Text style={{ color: theme.colors.text.muted }} className="text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Detail</Text>
                                <TextInput
                                    placeholder="Explain the details here..."
                                    placeholderTextColor={theme.colors.text.muted}
                                    style={{
                                        backgroundColor: theme.colors.background,
                                        color: theme.colors.text.primary,
                                        minHeight: 150,
                                        textAlignVertical: 'top'
                                    }}
                                    className="px-4 py-4 rounded-xl border border-black/5 font-inter text-base"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                />
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleCreatePost}
                                disabled={loading}
                                style={{
                                    backgroundColor: type === 'ASKING' ? theme.colors.error : theme.colors.success,
                                    ...theme.shadows.md,
                                    opacity: loading ? 0.7 : 1
                                }}
                                className="py-4 rounded-2xl items-center"
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">
                                        {type === 'ASKING' ? 'Post Request 🚀' : 'Post Offer ✨'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};
