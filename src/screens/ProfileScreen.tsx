import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, Image, ActivityIndicator } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { auth, db } from '../services/firebaseConfig';
import { updateProfile } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSelector } from '../components/ThemeSelector';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../components/GradientBackground';
import { AdvancedHeader } from '../components/AdvancedHeader';

export const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const [uploading, setUploading] = useState(false);
    const [userStats, setUserStats] = useState({
        karmaPoints: 0,
        contributions: 0,
        upvotes: 0,
    });

    React.useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setUserStats({
                    karmaPoints: data.karma || 0,
                    contributions: data.postsCount || 0,
                    upvotes: data.totalUpvotes || 0
                });
            }
        });

        return () => unsubscribe();
    }, []);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                await uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const uploadImage = async (uri: string) => {
        if (!auth.currentUser) return;
        setUploading(true);

        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storage = getStorage();
            const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);

            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            await updateProfile(auth.currentUser, { photoURL: downloadURL });
            await updateDoc(doc(db, 'users', auth.currentUser.uid), { photoURL: downloadURL });

            Alert.alert('Success', 'Profile picture updated!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                })
                            );
                        } catch (error) {
                            console.error('Logout failed:', error);
                        }
                    },
                },
            ]
        );
    };

    const handleLinkPress = (url: string, title: string) => {
        Alert.alert(
            title,
            `This will open ${title} in your browser.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open',
                    onPress: () => {
                        Linking.openURL(url).catch(err =>
                            console.error('Failed to open URL:', err)
                        );
                    },
                },
            ]
        );
    };

    return (
        <GradientBackground variant="header" particleCount={10}>
            <AdvancedHeader
                title="Profile"
                subtitle="Manage your presence"
                rightAction={{
                    icon: 'log-out-outline',
                    onPress: handleLogout
                }}
            />

            {/* User Avatar Section - Below Curve */}
            <View className="items-center w-full">
                <View className="w-full max-w-[600px] px-8 paddingTop-4 pb-12">
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                            <View style={{
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                backgroundColor: theme.colors.surface,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 12,
                                borderWidth: 4,
                                borderColor: 'rgba(255,255,255,0.2)',
                                ...theme.shadows.lg,
                                position: 'relative'
                            }}>
                                {auth.currentUser?.photoURL ? (
                                    <Image
                                        source={{ uri: auth.currentUser.photoURL }}
                                        style={{ width: 112, height: 112, borderRadius: 56 }}
                                    />
                                ) : (
                                    <Text style={{
                                        fontSize: 48,
                                        fontWeight: 'bold',
                                        color: theme.colors.primary,
                                    }}>
                                        {auth.currentUser?.displayName?.charAt(0) || 'U'}
                                    </Text>
                                )}

                                {/* Camera Icon Overlay */}
                                <View style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    backgroundColor: theme.colors.primary,
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 3,
                                    borderColor: theme.colors.surface
                                }}>
                                    {uploading ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Ionicons name="camera" size={18} color="white" />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: '700',
                            color: theme.colors.text.inverse,
                        }}>
                            {auth.currentUser?.displayName || 'User Name'}
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: theme.colors.text.inverse,
                            opacity: 0.8,
                            marginTop: 4,
                        }}>
                            {auth.currentUser?.email || 'user@example.com'}
                        </Text>

                        {/* Karma Badge */}
                        <View style={{
                            marginTop: 16,
                            paddingHorizontal: 18,
                            paddingVertical: 10,
                            borderRadius: 16,
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Ionicons name="ribbon-outline" size={18} color="#FBBF24" />
                            <Text style={{
                                marginLeft: 10,
                                fontSize: 16,
                                fontWeight: '800',
                                color: 'white',
                            }}>
                                {userStats.karmaPoints} Reputation
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 20 }}
            >
                <View className="flex-1 items-center w-full">
                    <View className="w-full max-w-[600px]">
                        {/* Stats Section */}
                        <View style={{ paddingHorizontal: 24 }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '700',
                                color: theme.colors.text.primary,
                                marginBottom: 16,
                            }}>
                                Your Stats
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                gap: 12,
                                marginBottom: 32,
                            }}>
                                <StatCard icon="ribbon-outline" label="Reputation" value={userStats.karmaPoints.toString()} theme={theme} />
                                <StatCard icon="document-text-outline" label="Posts" value={userStats.contributions.toString()} theme={theme} />
                                <StatCard icon="heart-outline" label="Upvotes" value={userStats.upvotes.toString()} theme={theme} />
                            </View>
                        </View>

                        {/* Theme Section */}
                        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                <Ionicons name="color-palette-outline" size={22} color={theme.colors.primary} />
                                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text.primary, marginLeft: 10 }}>
                                    Appearance
                                </Text>
                            </View>
                            <ThemeSelector />
                        </View>

                        {/* Settings Section */}
                        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                <Ionicons name="settings-outline" size={22} color={theme.colors.primary} />
                                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text.primary, marginLeft: 10 }}>
                                    Settings
                                </Text>
                            </View>

                            <View style={{
                                backgroundColor: theme.colors.surface,
                                borderRadius: 20,
                                overflow: 'hidden',
                                borderWidth: 1,
                                borderColor: 'rgba(0,0,0,0.05)',
                                ...theme.shadows.sm,
                            }}>
                                <SettingsItem icon="shield-checkmark-outline" label="Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicy')} theme={theme} />
                                <Divider theme={theme} />
                                <SettingsItem icon="document-text-outline" label="Terms & Conditions" onPress={() => navigation.navigate('TermsConditions')} theme={theme} />
                                <Divider theme={theme} />
                                <SettingsItem icon="help-circle-outline" label="Help & Support" onPress={() => navigation.navigate('HelpSupport')} theme={theme} />
                                <Divider theme={theme} />
                                <SettingsItem icon="information-circle-outline" label="About HamSync" onPress={() => navigation.navigate('About')} theme={theme} showChevron={true} />
                            </View>
                        </View>

                        {/* Logout Button */}
                        <View style={{ paddingHorizontal: 24 }}>
                            <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
                                <View style={{
                                    padding: 16,
                                    borderRadius: 16,
                                    backgroundColor: theme.colors.error + '10',
                                    borderWidth: 1.5,
                                    borderColor: theme.colors.error + '20',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
                                    <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '700', color: theme.colors.error }}>
                                        Logout Account
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </GradientBackground>
    );
};

// Auxiliary Components
const StatCard = ({ icon, label, value, theme }: any) => (
    <View style={{
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 12, // Reduced padding
        alignItems: 'center',
        ...theme.shadows.sm,
    }}>
        <View style={{
            width: 38, // Smaller icon container
            height: 38,
            borderRadius: 12, // Squircle shape
            backgroundColor: theme.colors.primary + '10',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
        }}>
            <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>
        <Text style={{ fontSize: 18, fontWeight: '800', color: theme.colors.text.primary }}>{value}</Text>
        <Text style={{ fontSize: 11, fontWeight: '600', color: theme.colors.text.muted, marginTop: 2 }}>{label}</Text>
    </View>
);

const SettingsItem = ({ icon, label, onPress, theme, showChevron = true }: any) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{ flexDirection: 'row', alignItems: 'center', padding: 18 }}
    >
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.primary + '08', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>
        <Text style={{ flex: 1, marginLeft: 14, fontSize: 16, fontWeight: '600', color: theme.colors.text.primary }}>{label}</Text>
        {showChevron && <Ionicons name="chevron-forward" size={18} color={theme.colors.text.muted} />}
    </TouchableOpacity>
);

const Divider = ({ theme }: any) => (
    <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginHorizontal: 16 }} />
);
