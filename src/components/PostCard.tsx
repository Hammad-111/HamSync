import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { GlassView } from './GlassView';

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
    if (!highlight || !highlight.trim()) {
        return <>{text}</>;
    }

    const regex = new RegExp(`(${highlight.trim()})`, 'gi');
    const parts = text.split(regex);

    return (
        <Text>
            {parts.map((part, i) => (
                regex.test(part) ? (
                    <Text key={i} style={{ backgroundColor: 'rgba(250, 204, 21, 0.4)', color: '#FFFFFF' }}>{part}</Text>
                ) : (
                    <Text key={i}>{part}</Text>
                )
            ))}
        </Text>
    );
};

export const PostCard: React.FC<PostCardProps> = ({ post, onPress, searchQuery }) => {
    const isAsking = post.type === 'ASKING';

    return (
        <GlassView className="mb-4">
            <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-gray-300 mr-3 justify-center items-center">
                    {post.author.avatar ? (
                        <Image source={{ uri: post.author.avatar }} className="w-full h-full rounded-full" />
                    ) : (
                        <Text className="text-primary font-bold">{post.author.name[0]}</Text>
                    )}
                </View>
                <View className="flex-1">
                    <Text className="text-white font-poppins font-semibold">{post.author.name}</Text>
                    <Text className="text-gray-300 text-xs font-inter">{post.author.university}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${isAsking ? 'bg-red-500/20 border-red-500/50' : 'bg-green-500/20 border-green-500/50'} border`}>
                    <Text className={`text-xs font-bold ${isAsking ? 'text-red-300' : 'text-green-300'}`}>
                        {isAsking ? 'Needs Help' : 'Can Help'}
                    </Text>
                </View>
            </View>

            <Text className="text-accent text-xs font-bold mb-1 uppercase tracking-wider">
                <HighlightText text={post.subject} highlight={searchQuery} />
            </Text>
            <Text className="text-white text-lg font-poppins font-bold mb-2">
                <HighlightText text={post.title} highlight={searchQuery} />
            </Text>
            <Text className="text-gray-200 font-inter text-sm mb-4 line-clamp-3">
                <HighlightText text={post.description} highlight={searchQuery} />
            </Text>

            <TouchableOpacity onPress={onPress} className="bg-white/10 py-2 rounded-lg border border-white/20 active:bg-white/20">
                <Text className="text-center text-white font-semibold">Chat Now</Text>
            </TouchableOpacity>
        </GlassView>
    );
};
