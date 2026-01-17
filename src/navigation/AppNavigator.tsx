import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { UniGuideScreen } from '../screens/UniGuideScreen';
import { SyncLibraryScreen } from '../screens/SyncLibraryScreen';

import { ChatListScreen } from '../screens/ChatListScreen';

import { ProfileScreen } from '../screens/ProfileScreen';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

import { CustomTabBar } from './CustomTabBar';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="UniGuide" component={UniGuideScreen} />
            <Tab.Screen name="SyncLibrary" component={SyncLibraryScreen} />
            <Tab.Screen name="ChatSync" component={ChatListScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};
