import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Linking, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassView } from '../components/GlassView';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as DocumentPicker from 'expo-document-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, updateDoc, doc, increment, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, storage, auth } from '../services/firebaseConfig';
import { useToast } from '../contexts/ToastContext';

import { useTheme } from '../contexts/ThemeContext';
import { GradientBackground } from '../components/GradientBackground';

interface Resource {
    id: string;
    title: string;
    type: string;
    author: string;
    authorId: string;
    upvotes: number;
    date: string;
    url: string;
    category: string;
    timestamp: any;
}

const CATEGORIES = ['All', 'Engineering', 'Medical', 'CS', 'Arts'];

export const SyncLibraryScreen = () => {
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();
    const { theme } = useTheme();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'resources'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedResources = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Resource[];
            setResources(fetchedResources);
            setLoading(false);
        }, (error) => {
            console.error('Firestore Snapshot Error:', error);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleUpvote = async (resource: Resource) => {
        try {
            const resourceRef = doc(db, 'resources', resource.id);
            const authorRef = doc(db, 'users', resource.authorId);
            await updateDoc(resourceRef, { upvotes: increment(1) });
            await updateDoc(authorRef, { karma: increment(5) });
        } catch (error) {
            console.error('Error upvoting:', error);
            showToast('Error', 'Failed to upvote resource.', 'error');
        }
    };

    const handleUpload = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                showToast('Error', 'You must be logged in to upload resources.', 'error');
                return;
            }

            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            setUploading(true);
            const file = result.assets[0];
            const response = await fetch(file.uri);
            const blob = await response.blob();

            const storageRef = ref(storage, `SyncLibrary/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(storageRef);

            await addDoc(collection(db, 'resources'), {
                title: file.name,
                type: file.mimeType?.includes('pdf') ? 'PDF' : 'IMG',
                author: user.displayName || 'Anonymous',
                authorId: user.uid,
                upvotes: 0,
                date: 'Just now',
                url: downloadUrl,
                category: activeCategory === 'All' ? 'Engineering' : activeCategory,
                timestamp: new Date(),
            });

            showToast('Success', 'Resource uploaded successfully!', 'success');
        } catch (error) {
            console.error('Error uploading:', error);
            showToast('Error', 'Failed to upload resource.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleResourcePress = (url: string) => {
        setPreviewUrl(url);
        setShowPreview(true);
    };

    const renderItem = ({ item }: { item: Resource }) => (
        <TouchableOpacity onPress={() => handleResourcePress(item.url)} activeOpacity={0.7} className="items-center w-full">
            <View
                style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.lg,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.05)',
                    ...theme.shadows.sm,
                    shadowOpacity: 0.05,
                    maxWidth: 600
                }}
                className="w-full mx-6 mb-3 flex-row items-center justify-between p-3"
            >
                <View className="flex-row items-center flex-1">
                    <View style={{ backgroundColor: item.type === 'PDF' ? theme.colors.error + '15' : theme.colors.primary + '15' }} className="w-10 h-10 rounded-xl justify-center items-center mr-3">
                        <Ionicons
                            name={item.type === 'PDF' ? 'document-text-outline' : 'image-outline'}
                            size={20}
                            color={item.type === 'PDF' ? theme.colors.error : theme.colors.primary}
                        />
                    </View>
                    <View className="flex-1">
                        <Text style={{ color: theme.colors.text.primary }} className="font-bold text-sm mb-0.5" numberOfLines={1}>{item.title}</Text>
                        <Text style={{ color: theme.colors.text.muted }} className="text-[10px]">by {item.author} • {item.date}</Text>
                    </View>
                </View>
                <View className="flex-row items-center ml-2">
                    <View className="items-center mr-4">
                        <TouchableOpacity className="items-center mb-0.5" onPress={() => handleUpvote(item)}>
                            <Ionicons name="arrow-up" size={16} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.colors.text.primary }} className="font-bold text-[10px]">{item.upvotes}</Text>
                    </View>
                    <TouchableOpacity
                        style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                        className="p-2 rounded-lg"
                        onPress={() => Linking.openURL(item.url)}
                    >
                        <Ionicons name="download-outline" size={16} color={theme.colors.text.muted} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <GradientBackground variant="header" particleCount={6}>
            <View className="items-center w-full">
                <View
                    style={{ paddingTop: insets.top + 30 }}
                    className="w-full max-w-[600px] px-6 pb-6"
                >
                    <Text style={{ color: theme.colors.text.inverse }} className="text-3xl font-poppins font-bold">SyncLibrary</Text>
                    <Text style={{ color: theme.colors.text.inverse, opacity: 0.8 }} className="font-inter mt-0.5 text-sm">Shared notes & resources</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View className="items-center w-full mb-4 z-10">
                <View style={{
                    backgroundColor: theme.colors.surface,
                    ...theme.shadows.lg,
                    borderRadius: theme.borderRadius.xl,
                    borderWidth: 1.5,
                    borderColor: 'rgba(0,0,0,0.03)',
                    maxWidth: 600
                }} className="w-full mx-6 flex-row items-center px-5 py-0.5">
                    <Ionicons name="search-outline" size={20} color={theme.colors.text.muted} />
                    <TextInput
                        placeholder="Search resources..."
                        placeholderTextColor={theme.colors.text.muted}
                        style={{ color: theme.colors.text.primary, height: 50 }}
                        className="flex-1 ml-3 font-inter font-medium"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* Categories */}
            <View className="mb-4 h-12 items-center w-full">
                <View className="w-full max-w-[600px]">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                style={{
                                    backgroundColor: activeCategory === cat ? theme.colors.primary : theme.colors.surface,
                                    borderColor: activeCategory === cat ? theme.colors.primary : 'rgba(0,0,0,0.05)',
                                    ...theme.shadows.sm,
                                }}
                                className={`mr-3 px-5 py-2 rounded-full border self-center`}
                            >
                                <Text style={{ color: activeCategory === cat ? 'white' : theme.colors.text.muted }} className="font-bold text-xs">{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            <FlatList
                data={filteredResources}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <View className="flex-1 justify-center items-center mt-20">
                        {loading ? (
                            <ActivityIndicator color={theme.colors.primary} size="large" />
                        ) : (
                            <Text style={{ color: theme.colors.text.muted }} className="font-inter">No resources found.</Text>
                        )}
                    </View>
                )}
            />

            {/* FAB for Upload */}
            <TouchableOpacity
                onPress={handleUpload}
                disabled={uploading}
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
                {uploading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Ionicons name="cloud-upload-outline" size={28} color="white" />
                )}
            </TouchableOpacity>

            {/* Preview Modal */}
            <Modal visible={showPreview} animationType="slide" transparent={false} onRequestClose={() => setShowPreview(false)}>
                <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
                    <View style={{ borderBottomColor: 'rgba(0,0,0,0.05)' }} className="flex-row items-center justify-between px-6 py-4 border-b">
                        <View className="flex-1 mr-4">
                            <Text style={{ color: theme.colors.text.primary }} className="font-bold text-lg" numberOfLines={1}>Preview Resource</Text>
                        </View>
                        <TouchableOpacity onPress={() => setShowPreview(false)}>
                            <Ionicons name="close-outline" size={32} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        {previewUrl && (
                            <WebView
                                source={{ uri: previewUrl }}
                                style={{ flex: 1, backgroundColor: 'transparent' }}
                                startInLoadingState={true}
                                renderLoading={() => (
                                    <View style={{ backgroundColor: theme.colors.background }} className="absolute inset-0 justify-center items-center">
                                        <ActivityIndicator size="large" color={theme.colors.primary} />
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </SafeAreaView>
            </Modal>
        </GradientBackground>
    );
};
