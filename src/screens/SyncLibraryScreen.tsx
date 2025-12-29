import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Linking, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from '../components/GlassView';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as DocumentPicker from 'expo-document-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, updateDoc, doc, increment, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, storage, auth } from '../services/firebaseConfig';
import { useToast } from '../contexts/ToastContext';

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
    const { showToast } = useToast();
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

            // Increment upvotes on resource
            await updateDoc(resourceRef, {
                upvotes: increment(1)
            });

            // Increment karma on author
            await updateDoc(authorRef, {
                karma: increment(5) // 5 points per upvote
            });
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

            // Save to Firestore
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
        <TouchableOpacity onPress={() => handleResourcePress(item.url)} activeOpacity={0.7}>
            <GlassView className="mb-1.5 flex-row items-center justify-between px-3 py-1">
                <View className="flex-row items-center flex-1">
                    <View className={`w-9 h-9 rounded-xl justify-center items-center mr-2.5 ${item.type === 'PDF' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                        <Ionicons
                            name={item.type === 'PDF' ? 'document-text' : 'image'}
                            size={16}
                            color={item.type === 'PDF' ? '#f87171' : '#60a5fa'}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-xs mb-0" numberOfLines={1}>{item.title}</Text>
                        <Text className="text-gray-400 text-[10px]">by {item.author} • {item.date}</Text>
                    </View>
                </View>
                <View className="flex-row items-center ml-2">
                    <View className="items-center mr-3">
                        <TouchableOpacity className="items-center mb-0.5" onPress={() => handleUpvote(item)}>
                            <Ionicons name="arrow-up" size={14} color="#06B6D4" />
                        </TouchableOpacity>
                        <Text className="text-white font-bold text-[9px]">{item.upvotes}</Text>
                    </View>
                    <TouchableOpacity
                        className="bg-white/10 px-2 py-1 rounded-lg"
                        onPress={() => Linking.openURL(item.url)}
                    >
                        <Ionicons name="download-outline" size={14} color="#9ca3af" />
                    </TouchableOpacity>
                </View>
            </GlassView>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-primary px-6" edges={['top']}>
            <View className="mb-4 mt-2">
                <Text className="text-white text-3xl font-poppins font-bold">SyncLibrary</Text>
                <Text className="text-gray-300 font-inter mt-0.5 text-sm">Shared notes & resources.</Text>
            </View>

            <View className="mb-4">
                <View className="bg-white/10 rounded-xl border border-white/10 flex-row items-center px-4">
                    <Ionicons name="search" size={18} color="#9ca3af" className="mr-2" />
                    <TextInput
                        placeholder="Search notes..."
                        placeholderTextColor="#9ca3af"
                        className="flex-1 text-white py-2.5 font-inter"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* Categories */}
            <View className="mb-4 h-10">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setActiveCategory(cat)}
                            className={`mr-2 px-4 py-1.5 rounded-full border self-center ${activeCategory === cat ? 'bg-accent border-accent' : 'bg-transparent border-white/20'}`}
                        >
                            <Text className={`font-bold text-xs ${activeCategory === cat ? 'text-white' : 'text-gray-400'}`}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
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
                            <ActivityIndicator color="#06B6D4" size="large" />
                        ) : (
                            <Text className="text-gray-400 font-inter">No resources found.</Text>
                        )}
                    </View>
                )}
            />

            {/* FAB for Upload */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-accent rounded-full justify-center items-center shadow-lg shadow-black/50"
                onPress={handleUpload}
                disabled={uploading}
            >
                {uploading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Ionicons name="cloud-upload-outline" size={26} color="white" />
                )}
            </TouchableOpacity>

            {/* Preview Modal */}
            <Modal visible={showPreview} animationType="slide" transparent={false} onRequestClose={() => setShowPreview(false)}>
                <SafeAreaView className="flex-1 bg-primary">
                    <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/10">
                        <View className="flex-1 mr-4">
                            <Text className="text-white font-bold text-lg" numberOfLines={1}>Resource Preview</Text>
                        </View>
                        <TouchableOpacity onPress={() => setShowPreview(false)}>
                            <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        {previewUrl && (
                            <WebView
                                source={{ uri: previewUrl }}
                                style={{ flex: 1, backgroundColor: 'transparent' }}
                                startInLoadingState={true}
                                renderLoading={() => (
                                    <View className="absolute inset-0 justify-center items-center bg-primary">
                                        <ActivityIndicator size="large" color="#06B6D4" />
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};
