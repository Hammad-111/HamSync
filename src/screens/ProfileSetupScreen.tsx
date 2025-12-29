import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Animated, Easing, Image, Modal, FlatList, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { saveUserProfile, calculateProfileScore } from '../services/userService';
import { useToast } from '../contexts/ToastContext';

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

    // Clear skills when education level changes significantly (optional UX choice, keeping simpler for now)
    // But we might want to ensure 'selected' skills remain valid? 
    // For now, let's keep it simple. If they switch from 'Class 9' to 'Undergrad', the 'Physics' skill might still be relevant or we can clear specific academic ones.
    // To match user request "scroll thora kum", we are dynamically showing.

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
        <LinearGradient
            colors={['#1E0A3C', '#2E1065', '#3B1A8C', '#2E1065']}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                {/* Floating particles background */}
                {[...Array(6)].map((_, index) => (
                    <FloatingParticle key={index} delay={index * 400} index={index} />
                ))}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header with Score */}
                    <Animated.View
                        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
                        className="px-6 pt-6 mb-8"
                    >
                        <View className="flex-row justify-between items-start">
                            <View>
                                <Text className="text-white text-3xl font-poppins font-bold shadow-lg shadow-cyan-500/50">
                                    Build Profile
                                </Text>
                                <Text className="text-gray-300 font-inter mt-2">
                                    Let's personalize your experience.
                                </Text>
                            </View>
                            {/* Score Points Badge */}
                            <View className="items-center">
                                <LinearGradient
                                    colors={['#F59E0B', '#D97706']}
                                    className="px-4 py-2 rounded-2xl items-center shadow-lg shadow-amber-500/30"
                                >
                                    <Text className="text-white font-bold text-lg">{currentScore}</Text>
                                    <Text className="text-white/80 text-[10px] font-bold">POINTS</Text>
                                </LinearGradient>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Education Section */}
                    <Animated.View
                        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
                        className="px-6 mb-8"
                    >
                        <Text className="text-gray-300 font-poppins font-semibold mb-3 ml-1">
                            Current Education
                        </Text>

                        {/* Custom Dropdown Trigger */}
                        <TouchableOpacity
                            onPress={() => setShowEduDropdown(true)}
                            activeOpacity={0.8}
                            className="rounded-2xl overflow-hidden mb-4 border border-white/10"
                        >
                            <View className="bg-white/5 backdrop-blur-md p-4 flex-row justify-between items-center">
                                <Text className={educationLevel ? "text-white font-inter" : "text-gray-400 font-inter"}>
                                    {educationLevel || "Select Level (e.g., Class 10, Undergrad)"}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>

                        {/* Institute Input */}
                        <View className="rounded-2xl overflow-hidden border border-white/10">
                            <View className="bg-white/5 backdrop-blur-md p-4">
                                <TextInput
                                    placeholder="Institute Name (School / College / Uni)"
                                    placeholderTextColor="#6b7280"
                                    className="text-white font-inter"
                                    value={university}
                                    onChangeText={setUniversity}
                                />
                            </View>
                        </View>
                    </Animated.View>

                    {/* Skills Section */}
                    <Animated.View
                        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
                        className="px-6"
                    >
                        <Text className="text-gray-300 font-poppins font-semibold mb-3 ml-1">
                            Skills & Expertise
                        </Text>

                        {/* Category Tabs */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                            {(['Web', 'Mobile', 'Academic'] as Category[]).map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setActiveCategory(cat)}
                                    className={`mr-3 px-6 py-3 rounded-full border ${activeCategory === cat
                                        ? 'bg-[#8B5CF6] border-[#8B5CF6]'
                                        : 'bg-white/5 border-white/10'
                                        }`}
                                >
                                    <Text className={`font-inter font-medium ${activeCategory === cat ? 'text-white' : 'text-gray-400'}`}>
                                        {cat} Dev
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Skills Grid */}
                        <View className="flex-row flex-wrap gap-3 min-h-[100px]">
                            {activeCategory === 'Academic' && !educationLevel ? (
                                <Text className="text-gray-500 font-inter italic ml-2">Select Education Level first to see relevant subjects.</Text>
                            ) : (
                                displaySkills.map((skill) => {
                                    const isSelected = skills.includes(skill.name);
                                    return (
                                        <TouchableOpacity
                                            key={skill.id}
                                            onPress={() => toggleSkill(skill.name)}
                                            activeOpacity={0.7}
                                        >
                                            <LinearGradient
                                                colors={isSelected
                                                    ? ['#8B5CF6', '#EC4899']
                                                    : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                className="px-4 py-3 rounded-xl border"
                                                style={{
                                                    borderColor: isSelected ? 'transparent' : 'rgba(255,255,255,0.1)'
                                                }}
                                            >
                                                <Text className={`font-inter text-sm ${isSelected ? 'text-white font-semibold' : 'text-gray-400'}`}>
                                                    {skill.name}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </View>
                    </Animated.View>
                </ScrollView>

                {/* Floating Action Button */}
                <View className="absolute bottom-8 left-6 right-6">
                    <TouchableOpacity
                        onPress={handleSaveProfile}
                        disabled={isLoading}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#06B6D4', '#3B82F6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-cyan-500/30"
                        >
                            <Text className="text-white font-bold font-poppins text-lg mr-2">
                                {isLoading ? "Saving..." : "Complete Profile"}
                            </Text>
                            {!isLoading && <Ionicons name="arrow-forward" size={20} color="white" />}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Education Dropdown Modal */}
                <Modal
                    visible={showEduDropdown}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowEduDropdown(false)}
                >
                    <TouchableOpacity
                        className="flex-1 bg-black/80 backdrop-blur-sm justify-center px-6"
                        activeOpacity={1}
                        onPress={() => setShowEduDropdown(false)}
                    >
                        <View className="bg-[#1E1E2E] rounded-3xl overflow-hidden border border-white/10 max-h-[60%] shadow-2xl shadow-black">
                            <View className="p-4 border-b border-white/10 bg-white/5">
                                <Text className="text-white font-poppins font-bold text-center">Select Level</Text>
                            </View>
                            <FlatList
                                data={EDUCATION_LEVELS}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className="p-4 border-b border-white/5 active:bg-white/10"
                                        onPress={() => {
                                            setEducationLevel(item);
                                            setShowEduDropdown(false);
                                        }}
                                    >
                                        <Text className={`font-inter text-base ${educationLevel === item ? 'text-cyan-400 font-bold' : 'text-gray-300'}`}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
};

// Floating particle component (Duplicated from LoginScreen for isolated consistency)
const FloatingParticle = ({ delay, index }: { delay: number; index: number }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(translateY, {
                            toValue: -60,
                            duration: 3500 + index * 200,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateY, {
                            toValue: 0,
                            duration: 3500 + index * 200,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(translateX, {
                            toValue: index % 2 === 0 ? 30 : -30,
                            duration: 2500 + index * 150,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateX, {
                            toValue: 0,
                            duration: 2500 + index * 150,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(opacity, {
                            toValue: 0.6,
                            duration: 1500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0.2,
                            duration: 1500,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            ).start();
        }, delay);
    }, []);

    const positions = [
        { top: 100, left: 40 },
        { top: 180, right: 50 },
        { top: 300, left: 30 },
        { bottom: 200, right: 60 },
        { bottom: 300, left: 50 },
        { top: 240, right: 30 },
    ];

    const colors = ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];

    return (
        <Animated.View
            style={{
                position: 'absolute',
                ...positions[index],
                transform: [{ translateY }, { translateX }],
                opacity,
                zIndex: 0,
            }}
        >
            <View
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors[index % colors.length],
                    shadowColor: colors[index % colors.length],
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 6,
                }}
            />
        </Animated.View>
    );
};
