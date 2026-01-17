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
                regex.test(part) ? (
                    <Text key={i} style={{ backgroundColor: theme.colors.primary + '20', color: theme.colors.primary }}>{part}</Text>
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
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.05)',
            ...theme.shadows.sm,
            shadowOpacity: 0.05,
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
                    backgroundColor: isAsking ? theme.colors.error + '10' : theme.colors.success + '10',
                    borderColor: isAsking ? theme.colors.error + '30' : theme.colors.success + '30',
                }} className="px-3 py-1 rounded-full border">
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
                style={{ backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary + '20' }}
                className="py-2.5 rounded-xl border active:opacity-70"
            >
                <Text style={{ color: theme.colors.primary }} className="text-center font-bold">Chat Now</Text>
            </TouchableOpacity>
        </View>
    );
};
