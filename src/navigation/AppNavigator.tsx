import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { UniGuideScreen } from '../screens/UniGuideScreen';
import { SyncLibraryScreen } from '../screens/SyncLibraryScreen';

import { ChatListScreen } from '../screens/ChatListScreen';

import { ProfileScreen } from '../screens/ProfileScreen';

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#2E1065', // Primary
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 85 : 60 + insets.bottom,
                    paddingBottom: Platform.OS === 'ios' ? 30 : insets.bottom + 10,
                    paddingTop: 4,
                },
                tabBarActiveTintColor: '#06B6D4', // Accent
                tabBarInactiveTintColor: '#94a3b8',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'UniGuide') {
                        iconName = focused ? 'school' : 'school-outline';
                    } else if (route.name === 'SyncLibrary') {
                        iconName = focused ? 'library' : 'library-outline';
                    } else if (route.name === 'ChatSync') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="UniGuide" component={UniGuideScreen} />
            <Tab.Screen name="SyncLibrary" component={SyncLibraryScreen} />
            <Tab.Screen name="ChatSync" component={ChatListScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};
