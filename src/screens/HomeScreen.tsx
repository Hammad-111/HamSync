import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ScrollView, Linking, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from '../components/GlassView';
import { PostCard, Post } from '../components/PostCard';
import { BlurView } from 'expo-blur';
import { auth, db } from '../services/firebaseConfig';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [userName, setUserName] = useState('');
    const [userPoints, setUserPoints] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            // Set initial name from Auth
            setUserName(user.displayName || 'Scholar');

            // Listen to real-time updates for User Data
            const userRef = doc(db, 'users', user.uid);
            const unsubscribeUser = onSnapshot(userRef, (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setUserName(data.displayName || user.displayName || 'Scholar');
                    setUserPoints(data.points || 0);
                }
            });

            // Listen to real-time updates for Posts
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

    const handleChatPress = () => {
        navigation.navigate('ChatSync');
    };

    const handleCreatePost = () => {
        navigation.navigate('CreatePost');
    };

    return (
        <SafeAreaView className="flex-1 bg-primary" edges={['top']}>
            {/* Top Bar */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-accent rounded-full justify-center items-center">
                        <Text className="text-white font-bold text-lg">
                            {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <View className="ml-3">
                        <Text className="text-white font-poppins font-bold text-lg">Hi, {userName.split(' ')[0]}</Text>
                        <Text className="text-gray-300 text-xs">Ready to learn?</Text>
                    </View>
                </View>
                <View className="bg-white/10 px-3 py-1 rounded-full border border-white/20 flex-row items-center">
                    <Text className="text-yellow-400 mr-1">✨</Text>
                    <Text className="text-white font-bold">{userPoints} KP</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View className="mx-6 mb-4">
                <View className="bg-white/10 rounded-xl border border-white/10 flex-row items-center px-4">
                    <Text className="text-gray-400 mr-2">🔍</Text>
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor="#9ca3af"
                        className="flex-1 text-white py-3"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Top Learning Websites */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center px-6 mb-3">
                        <Text className="text-white font-poppins font-bold text-lg">Top Websites</Text>
                        <TouchableOpacity>
                            <Text className="text-accent text-sm">See all</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
                        {LEARNING_WEBSITES.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => Linking.openURL(item.url)}
                                activeOpacity={0.7}
                            >
                                <GlassView className="w-32 h-36 mr-4 justify-center items-center p-3">
                                    <View className="w-20 h-20 mb-2 justify-center items-center">
                                        <Image
                                            source={item.image}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text className="text-white font-bold text-center text-xs" numberOfLines={2}>
                                        {item.name}
                                    </Text>
                                </GlassView>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Feed */}
                <View className="px-6">
                    <Text className="text-white font-poppins font-bold text-lg mb-3">Recent Posts</Text>
                    {loadingPosts ? (
                        <ActivityIndicator size="large" color="#06B6D4" />
                    ) : (
                        posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onPress={handleChatPress}
                                searchQuery={searchQuery}
                            />
                        ))
                    )}
                    {!loadingPosts && posts.length === 0 && (
                        <Text className="text-gray-400 text-center mt-4">No recent posts. Be the first!</Text>
                    )}
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-accent rounded-full justify-center items-center shadow-lg shadow-black/50"
                onPress={handleCreatePost}
            >
                <Text className="text-white text-3xl font-light">+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};
