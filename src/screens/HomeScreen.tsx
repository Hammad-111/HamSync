import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { GradientBackground } from '../components/GradientBackground';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../services/firebaseConfig';
import { doc, onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { PostCard } from '../components/PostCard';
import { AdvancedHeader } from '../components/AdvancedHeader';

interface Post {
    id: string;
    author: {
        name: string;
        university: string;
        avatar?: string;
    };
    type: 'ASKING' | 'OFFERING';
    subject: string;
    title: string;
    description: string;
    timestamp: string;
}

const LEARNING_WEBSITES = [
    { id: 3, name: 'MDN Web Docs', url: 'https://developer.mozilla.org', image: require('../../assets/MDNWebDocs.png') },
    { id: 4, name: 'Stack Overflow', url: 'https://stackoverflow.com', image: require('../../assets/stackoverflow.png') },
    { id: 2, name: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org', image: require('../../assets/GeeksforGeeks.png') },
    { id: 1, name: 'W3Schools', url: 'https://www.w3schools.com', image: require('../../assets/w3schools.png') },
    { id: 5, name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org', image: require('../../assets/freecodecamp.png') },
    { id: 6, name: 'JavaTpoint', url: 'https://www.javatpoint.com', image: require('../../assets/JavaTpoint.png') },
];

export const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [userName, setUserName] = useState('');
    const [userPoints, setUserPoints] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserName(user.displayName || 'Scholar');
            const userRef = doc(db, 'users', user.uid);
            const unsubscribeUser = onSnapshot(userRef, (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setUserName(data.displayName || user.displayName || 'Scholar');
                    setUserPoints(data.points || 0);
                }
            });

            const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
            const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
                const fetchedPosts: Post[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Post));
                setPosts(fetchedPosts);
                setLoadingPosts(false);
            });

            return () => {
                unsubscribeUser();
                unsubscribePosts();
            };
        }
    }, []);

    const handleChatPress = () => navigation.navigate('ChatSync');
    const handleCreatePost = () => navigation.navigate('CreatePost');

    return (
        <GradientBackground variant="header" particleCount={8}>
            <AdvancedHeader
                title="HamSync"
                subtitle={`Hi, ${userName.split(' ')[0]} 👋`}
                showBack={false}
                customRight={
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderColor: 'rgba(251, 191, 36, 0.5)', // Amber border
                        borderWidth: 1
                    }} className="px-3 py-1.5 rounded-full flex-row items-center backdrop-blur-md">
                        <Ionicons name="ribbon" size={16} color="#FBBF24" style={{ marginRight: 6 }} />
                        <Text style={{ color: '#FBBF24', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 }}>
                            {userPoints} Reputation
                        </Text>
                    </View>
                }
            />

            {/* Search Bar - Floating partially on curve */}
            <View className="items-center w-full mb-6 z-10">
                <View style={{
                    backgroundColor: theme.colors.surface,
                    ...theme.shadows.lg,
                    borderRadius: theme.borderRadius.xl,
                    borderWidth: 1.5,
                    borderColor: 'rgba(0,0,0,0.03)',
                    maxWidth: 800
                }} className="w-full mx-6 flex-row items-center px-5 py-0.5">
                    <Ionicons name="search-outline" size={20} color={theme.colors.text.muted} />
                    <TextInput
                        placeholder="What do you want to learn today?"
                        placeholderTextColor={theme.colors.text.muted}
                        style={{ color: theme.colors.text.primary, height: 50 }}
                        className="flex-1 ml-3 font-inter font-medium"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 10 }}
            >
                <View className="flex-1 items-center">
                    <View className="w-full max-w-[800px]">

                        {/* Top Learning Websites */}
                        <View className="mb-8">
                            <View className="flex-row justify-between items-center px-6 mb-4">
                                <Text style={{ color: theme.colors.text.primary }} className="font-poppins font-bold text-lg">Quick Resources</Text>
                                <TouchableOpacity>
                                    <Text style={{ color: theme.colors.primary }} className="font-semibold text-sm">See all</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
                                {LEARNING_WEBSITES.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => Linking.openURL(item.url)}
                                        activeOpacity={0.7}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: theme.colors.surface,
                                                borderRadius: theme.borderRadius.lg,
                                                ...theme.shadows.md,
                                                width: 120,
                                                height: 140,
                                                marginRight: 16,
                                                padding: 16,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderWidth: 1,
                                                borderColor: 'rgba(0,0,0,0.03)'
                                            }}
                                        >
                                            <View className="w-16 h-16 mb-3 justify-center items-center">
                                                <Image
                                                    source={item.image}
                                                    style={{ width: '100%', height: '100%' }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            <Text style={{ color: theme.colors.text.primary }} className="font-bold text-center text-xs" numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Academic Feed */}
                        <View className="px-6">
                            <Text style={{ color: theme.colors.text.primary }} className="font-poppins font-bold text-lg mb-4">Academic Feed</Text>

                            {loadingPosts ? (
                                <ActivityIndicator size="large" color={theme.colors.primary} className="py-10" />
                            ) : (
                                <View className="flex-row flex-wrap justify-between">
                                    {posts.length === 0 ? (
                                        <View className="w-full items-center py-10 opacity-50">
                                            <Text style={{ color: theme.colors.text.muted }} className="text-center font-inter">
                                                No recent posts. Be the first to share something!
                                            </Text>
                                        </View>
                                    ) : (
                                        posts.map(post => (
                                            <View key={post.id} className="w-full md:w-[48%] lg:w-[31%] mb-4">
                                                <PostCard
                                                    post={post}
                                                    onPress={handleChatPress}
                                                    searchQuery={searchQuery}
                                                />
                                            </View>
                                        ))
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                onPress={handleCreatePost}
                style={{
                    backgroundColor: theme.colors.primary,
                    ...theme.shadows.lg,
                    position: 'absolute',
                    bottom: 24,
                    right: 24,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: theme.colors.primary,
                }}
            >
                <Ionicons name="add-outline" size={32} color="white" />
            </TouchableOpacity>
        </GradientBackground >
    );
};
