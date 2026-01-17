import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { GlassView } from './GlassView';

import { useTheme } from '../contexts/ThemeContext';

export interface Post {
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

interface PostCardProps {
    post: Post;
    onPress: () => void;
    searchQuery?: string;
}

const HighlightText = ({ text, highlight }: { text: string; highlight?: string }) => {
    const { theme } = useTheme();
    if (!highlight || !highlight.trim()) {
        return <Text style={{ color: theme.colors.text.primary }}>{text}</Text>;
    }

    const regex = new RegExp(`(${highlight.trim()})`, 'gi');
    const parts = text.split(regex);

    return (
        <Text style={{ color: theme.colors.text.primary }}>
            {parts.map((part, i) => (
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <Text key={i} style={{ backgroundColor: theme.colors.primary + '45', color: theme.colors.primary, fontWeight: '800' }}>{part}</Text>
                ) : (
                    <Text key={i}>{part}</Text>
                )
            ))}
        </Text>
    );
};

export const PostCard: React.FC<PostCardProps> = ({ post, onPress, searchQuery }) => {
    const { theme } = useTheme();
    const isAsking = post.type === 'ASKING';

    return (
        <View style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1.5,
            borderColor: 'rgba(0,0,0,0.15)', // Increased from 0.08
            ...theme.shadows.md,
            shadowOpacity: 0.1, // Increased from 0.08
        }}>
            <View className="flex-row items-center mb-3">
                <View style={{ backgroundColor: theme.colors.surfaceElevated }} className="w-10 h-10 rounded-full mr-3 justify-center items-center">
                    {post.author.avatar ? (
                        <Image source={{ uri: post.author.avatar }} className="w-full h-full rounded-full" />
                    ) : (
                        <Text style={{ color: theme.colors.primary }} className="font-bold">{post.author.name[0]}</Text>
                    )}
                </View>
                <View className="flex-1">
                    <Text style={{ color: theme.colors.text.primary }} className="font-poppins font-semibold">{post.author.name}</Text>
                    <Text style={{ color: theme.colors.text.muted }} className="text-xs font-inter">{post.author.university}</Text>
                </View>
                <View style={{
                    backgroundColor: isAsking ? theme.colors.error + '15' : theme.colors.success + '15',
                    borderColor: isAsking ? theme.colors.error + '40' : theme.colors.success + '40',
                    borderRadius: theme.borderRadius.sm,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderWidth: 1,
                }}>
                    <Text style={{ color: isAsking ? theme.colors.error : theme.colors.success }} className="text-xs font-bold">
                        {isAsking ? 'Needs Help' : 'Can Help'}
                    </Text>
                </View>
            </View>

            <Text style={{ color: theme.colors.primary }} className="text-xs font-bold mb-1 uppercase tracking-wider">
                <HighlightText text={post.subject} highlight={searchQuery} />
            </Text>
            <Text style={{ color: theme.colors.text.primary }} className="text-lg font-poppins font-bold mb-2">
                <HighlightText text={post.title} highlight={searchQuery} />
            </Text>
            <Text style={{ color: theme.colors.text.secondary }} className="font-inter text-sm mb-4">
                <HighlightText text={post.description} highlight={searchQuery} />
            </Text>

            <TouchableOpacity
                onPress={onPress}
                style={{ backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary + '30' }}
                className="py-2.5 rounded-xl border active:opacity-70"
            >
                <Text style={{ color: theme.colors.primary }} className="text-center font-bold">Chat Now</Text>
            </TouchableOpacity>
        </View>
    );
};
