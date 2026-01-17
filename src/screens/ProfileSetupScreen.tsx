import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Animated, Easing, Image, Modal, FlatList, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { saveUserProfile, calculateProfileScore } from '../services/userService';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { GradientBackground } from '../components/GradientBackground';
import { ThemedInput } from '../components/ThemedInput';

// --- Types & Data ---

type Category = 'Web' | 'Mobile' | 'Academic' | 'Other';

interface SkillOption {
    id: string;
    name: string;
    category: Category;
}

const EDUCATION_LEVELS = [
    "Class 9",
    "Class 10",
    "Class 11 (First Year)",
    "Class 12 (Second Year)",
    "Undergraduate",
    "Graduate",
    "Post-Graduate",
    "Diploma / Certification"
];

// Base Static Skills (Web/Mobile)
const TECH_SKILLS: SkillOption[] = [
    // Web
    { id: 'html', name: 'HTML/CSS', category: 'Web' },
    { id: 'js', name: 'JavaScript', category: 'Web' },
    { id: 'react', name: 'React.js', category: 'Web' },
    { id: 'next', name: 'Next.js', category: 'Web' },
    { id: 'node', name: 'Node.js', category: 'Web' },
    // Mobile
    { id: 'rn', name: 'React Native', category: 'Mobile' },
    { id: 'expo', name: 'Expo', category: 'Mobile' },
    { id: 'flutter', name: 'Flutter', category: 'Mobile' },
    { id: 'swift', name: 'Swift (iOS)', category: 'Mobile' },
];

const ACADEMIC_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"];

const MAJORS = [
    "Computer Science", "Software Engineering", "Information Technology",
    "Physics", "Mathematics", "Chemistry", "English", "Psychology", "Business Administration",
    "Economics", "Law", "Medical"
];

const DIPLOMAS = [
    "Mechanical Technology",
    "Electrical Technology",
    "Civil Technology",
    "Computer Information Technology (CIT)"
];

const { width } = Dimensions.get('window');

export const ProfileSetupScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const { theme } = useTheme();

    // Form State
    const [educationLevel, setEducationLevel] = useState('');
    const [university, setUniversity] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [currentScore, setCurrentScore] = useState(100);

    // UI State
    const [showEduDropdown, setShowEduDropdown] = useState(false);
    const [activeCategory, setActiveCategory] = useState<Category>('Web');
    const [isLoading, setIsLoading] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scoreAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        // Entrance Animation
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
        ]).start();
    }, []);

    // Update real-time score
    useEffect(() => {
        const newScore = calculateProfileScore(educationLevel, university, skills);

        Animated.timing(scoreAnim, {
            toValue: newScore,
            duration: 500,
            useNativeDriver: false
        }).start();

        setCurrentScore(newScore);
    }, [educationLevel, university, skills]);

    const getDynamicSkills = (): SkillOption[] => {
        if (activeCategory === 'Web' || activeCategory === 'Mobile') {
            return TECH_SKILLS.filter(s => s.category === activeCategory);
        }

        if (activeCategory === 'Academic') {
            if (!educationLevel) return [];

            if (educationLevel.includes("Class")) {
                return ACADEMIC_SUBJECTS.map(s => ({ id: `school_${s}`, name: s, category: 'Academic' }));
            }
            if (educationLevel.includes("Undergraduate") || educationLevel.includes("Graduate")) {
                return MAJORS.map(s => ({ id: `uni_${s}`, name: s, category: 'Academic' }));
            }
            if (educationLevel.includes("Diploma")) {
                return DIPLOMAS.map(s => ({ id: `dip_${s}`, name: s, category: 'Academic' }));
            }
        }

        return [];
    };

    const toggleSkill = (skillName: string) => {
        if (skills.includes(skillName)) {
            setSkills(skills.filter(s => s !== skillName));
        } else {
            setSkills([...skills, skillName]);
        }
    };

    const handleSaveProfile = async () => {
        if (!educationLevel || !university) {
            showToast('Missing Details', 'Please select your education level and institute.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await saveUserProfile({
                educationLevel,
                university,
                skills
            });
            showToast('Profile Verified!', `You've earned ${currentScore} points!`, 'success');
            setTimeout(() => navigation.replace('App'), 1000);
        } catch (error) {
            showToast('Error', 'Failed to save profile. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const displaySkills = getDynamicSkills();

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <GradientBackground variant="header" particleCount={4} />

            <View className="flex-1">
                {/* Header Section */}
                <View className="items-center w-full">
                    <View className="w-full max-w-[600px] px-8 pb-6 pt-2 flex-row justify-between items-center">
                        <View>
                            <Text className="text-white text-3xl font-poppins font-bold">Build Profile</Text>
                            <Text className="text-white/80 font-inter text-xs">Let's personalize your experience</Text>
                        </View>

                        {/* Score Badge */}
                        <View
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', ...theme.shadows.md }}
                            className="items-center justify-center w-16 h-16 rounded-2xl border border-white/30"
                        >
                            <Text className="text-white font-bold text-xl">{currentScore}</Text>
                            <Text className="text-white/80 text-[8px] font-bold uppercase tracking-tighter">Points</Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 items-center px-6 pt-6">
                        <View className="w-full max-w-[600px]">
                            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                                {/* Education Section */}
                                <View
                                    style={{
                                        backgroundColor: theme.colors.surface,
                                        ...theme.shadows.sm,
                                        padding: 24,
                                        borderRadius: 30,
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.05)',
                                        marginBottom: 24
                                    }}
                                >
                                    <Text style={{ color: theme.colors.text.primary }} className="text-xl font-poppins font-bold mb-6">Education</Text>

                                    <TouchableOpacity
                                        onPress={() => setShowEduDropdown(true)}
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: theme.colors.background,
                                            borderColor: theme.colors.border,
                                            borderRadius: 16,
                                            padding: 16,
                                            borderWidth: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 16
                                        }}
                                    >
                                        <View className="flex-1 flex-row items-center">
                                            <Ionicons name="school-outline" size={20} color={theme.colors.primary} style={{ marginRight: 12 }} />
                                            <Text style={{ color: educationLevel ? theme.colors.text.primary : theme.colors.text.muted }} className="font-inter">
                                                {educationLevel || "Education Level"}
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-down" size={20} color={theme.colors.text.muted} />
                                    </TouchableOpacity>

                                    <ThemedInput
                                        placeholder="Institute Name"
                                        value={university}
                                        onChangeText={setUniversity}
                                        leftIcon="business-outline"
                                    />
                                </View>

                                {/* Skills Section */}
                                <View
                                    style={{
                                        backgroundColor: theme.colors.surface,
                                        ...theme.shadows.sm,
                                        padding: 24,
                                        borderRadius: 30,
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Text style={{ color: theme.colors.text.primary }} className="text-xl font-poppins font-bold mb-6">Skills & Expertise</Text>

                                    {/* Category Tabs */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                                        {(['Web', 'Mobile', 'Academic'] as Category[]).map((cat) => (
                                            <TouchableOpacity
                                                key={cat}
                                                onPress={() => setActiveCategory(cat)}
                                                style={{
                                                    backgroundColor: activeCategory === cat ? theme.colors.primary : theme.colors.background,
                                                    borderColor: activeCategory === cat ? theme.colors.primary : theme.colors.border
                                                }}
                                                className="mr-3 px-6 py-2.5 rounded-full border"
                                            >
                                                <Text className={`font-inter font-semibold text-xs ${activeCategory === cat ? 'text-white' : 'text-gray-500'}`}>
                                                    {cat} {cat === 'Academic' ? 'Subjects' : 'Dev'}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>

                                    {/* Skills Grid */}
                                    <View className="flex-row flex-wrap gap-2.5">
                                        {activeCategory === 'Academic' && !educationLevel ? (
                                            <View className="py-4 items-center w-full">
                                                <Text style={{ color: theme.colors.text.muted }} className="font-inter italic text-xs">Select education level first</Text>
                                            </View>
                                        ) : (
                                            displaySkills.map((skill) => {
                                                const isSelected = skills.includes(skill.name);
                                                return (
                                                    <TouchableOpacity
                                                        key={skill.id}
                                                        onPress={() => toggleSkill(skill.name)}
                                                        activeOpacity={0.7}
                                                        style={{
                                                            backgroundColor: isSelected ? theme.colors.primary + '15' : 'transparent',
                                                            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                                                            paddingHorizontal: 16,
                                                            paddingVertical: 10,
                                                            borderRadius: 12,
                                                            borderWidth: 1
                                                        }}
                                                    >
                                                        <Text style={{ color: isSelected ? theme.colors.primary : theme.colors.text.secondary }} className="font-inter text-xs font-semibold">
                                                            {skill.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })
                                        )}
                                    </View>
                                </View>
                            </Animated.View>
                        </View>
                    </View>
                </ScrollView>

                {/* Save Button */}
                <View className="absolute bottom-10 left-0 right-0 items-center">
                    <View className="w-full max-w-[600px] px-8">
                        <TouchableOpacity
                            onPress={handleSaveProfile}
                            disabled={isLoading}
                            activeOpacity={0.9}
                            style={{
                                backgroundColor: theme.colors.primary,
                                ...theme.shadows.lg,
                                opacity: isLoading ? 0.7 : 1
                            }}
                            className="py-4 rounded-2xl flex-row justify-center items-center"
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text className="text-white font-bold font-poppins text-lg mr-2">
                                        Complete Profile
                                    </Text>
                                    <Ionicons name="checkmark-circle-outline" size={22} color="white" />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Education Dropdown Modal */}
                <Modal
                    visible={showEduDropdown}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowEduDropdown(false)}
                >
                    <TouchableOpacity
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        className="flex-1 justify-center items-center px-8"
                        activeOpacity={1}
                        onPress={() => setShowEduDropdown(false)}
                    >
                        <View style={{ backgroundColor: theme.colors.surface }} className="w-full max-w-[500px] rounded-[30px] overflow-hidden border border-black/5 max-h-[60%] shadow-2xl">
                            <View style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border }} className="p-5 items-center">
                                <Text style={{ color: theme.colors.text.primary }} className="font-poppins font-bold text-lg">Select Level</Text>
                            </View>
                            <FlatList
                                data={EDUCATION_LEVELS}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={{ borderBottomWidth: 0.5, borderBottomColor: theme.colors.border }}
                                        className="p-5 active:bg-black/5"
                                        onPress={() => {
                                            setEducationLevel(item);
                                            setShowEduDropdown(false);
                                        }}
                                    >
                                        <Text style={{
                                            color: educationLevel === item ? theme.colors.primary : theme.colors.text.primary,
                                            fontWeight: educationLevel === item ? 'bold' : 'normal'
                                        }} className="font-inter text-base text-center">
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </View>
    );
};
