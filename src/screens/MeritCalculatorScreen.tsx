import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Animated, Switch, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { GradientBackground } from '../components/GradientBackground';
import { UNIVERSITY_DATA } from '../constants/universityData';
import Svg, { Circle } from 'react-native-svg';
import { AdvancedHeader } from '../components/AdvancedHeader';

const { width } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const MeritCalculatorScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { theme } = useTheme();
    const { showToast } = useToast();
    const universityParam = route.params?.university || 'NUST';
    const initialType = route.params?.type || 'standard';
    const isUET = universityParam === 'UET';
    const isCOMSATS = universityParam === 'COMSATS';

    const [calcType, setCalcType] = useState(initialType || (isCOMSATS ? 'cs' : 'standard'));
    const [mode, setMode] = useState<'calc' | 'target'>('calc');
    const [testType, setTestType] = useState('NTS NAT-1');

    // Theme values
    const primaryColor = theme.colors.primary;

    // Inputs
    const [matricObt, setMatricObt] = useState('');
    const [matricTotal, setMatricTotal] = useState('1100');
    const [fscObt, setFscObt] = useState('');
    const [fscTotal, setFscTotal] = useState('1100');
    const [fscAwaited, setFscAwaited] = useState(false);
    const [netScore, setNetScore] = useState('');
    const [drawingObt, setDrawingObt] = useState('');
    const [drawingTotal, setDrawingTotal] = useState('100');
    const [targetAggregate, setTargetAggregate] = useState('');
    const [selectedCampus, setSelectedCampus] = useState(isCOMSATS ? 'Islamabad (Main)' : 'Main Campus (Lahore)');

    const [aggregate, setAggregate] = useState<number | null>(null);
    const [requiredNet, setRequiredNet] = useState<number | null>(null);
    const [savedAggregates, setSavedAggregates] = useState<any[]>([]);
    const [showMeritTable, setShowMeritTable] = useState(false);
    const [showPattern, setShowPattern] = useState(false);

    // Eligibility Warnings
    const [matricWarning, setMatricWarning] = useState(false);
    const [fscWarning, setFscWarning] = useState(false);

    // Animation values
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadSavedAggregates();
    }, []);

    useEffect(() => {
        if (fscAwaited) setFscTotal('550');
        else setFscTotal('1100');
    }, [fscAwaited]);

    useEffect(() => {
        if (mode === 'calc') calculateMerit();
        else calculateTarget();
    }, [matricObt, matricTotal, fscObt, fscTotal, netScore, drawingObt, drawingTotal, targetAggregate, calcType, mode, fscAwaited, selectedCampus]);

    useEffect(() => {
        if (aggregate !== null) {
            Animated.spring(progressAnim, {
                toValue: aggregate,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }).start();
        }
    }, [aggregate]);

    const loadSavedAggregates = async () => {
        try {
            const saved = await AsyncStorage.getItem('saved_aggregates');
            if (saved) setSavedAggregates(JSON.parse(saved));
        } catch (e) {
            console.error('Failed to load aggregates');
        }
    };

    const saveAggregate = async () => {
        if (!aggregate) return;
        try {
            const newEntry = {
                id: Date.now().toString(),
                date: new Date().toLocaleDateString(),
                aggregate,
                type: calcType,
            };
            const updated = [newEntry, ...savedAggregates];
            await AsyncStorage.setItem('saved_aggregates', JSON.stringify(updated));
            setSavedAggregates(updated);
            showToast('Success', 'Aggregate saved successfully!', 'success');
        } catch (e) {
            showToast('Error', 'Failed to save aggregate.', 'error');
        }
    };

    const calculateMerit = () => {
        const mObt = parseFloat(matricObt);
        const mTotal = parseFloat(matricTotal);
        const fObt = parseFloat(fscObt);
        const fTotal = parseFloat(fscTotal);
        const net = parseFloat(netScore);

        if (isNaN(mObt) || isNaN(mTotal)) {
            setAggregate(null);
            return;
        }

        setMatricWarning(mObt / mTotal < 0.6);
        if (calcType !== 'international' && !isNaN(fObt) && !isNaN(fTotal)) {
            setFscWarning(fObt / fTotal < 0.6);
        } else {
            setFscWarning(false);
        }

        let finalAggregate = 0;
        if (isUET) {
            const matricWeight = (mObt / mTotal) * 25;
            const fscWeight = !isNaN(fObt) && !isNaN(fTotal) ? (fObt / fTotal) * 45 : 0;
            const netWeight = !isNaN(net) ? (net / 400) * 30 : 0;
            finalAggregate = matricWeight + fscWeight + netWeight;
        } else if (isCOMSATS) {
            const matricWeight = (mObt / mTotal) * 10;
            const fscWeight = !isNaN(fObt) && !isNaN(fTotal) ? (fObt / fTotal) * 40 : 0;
            const netWeight = !isNaN(net) ? (net / 100) * 50 : 0;
            finalAggregate = matricWeight + fscWeight + netWeight;
        } else {
            const matricWeight = (mObt / mTotal) * (calcType === 'international' ? 25 : 10);
            let fscWeight = (calcType !== 'international' && !isNaN(fObt) && !isNaN(fTotal)) ? (fObt / fTotal) * 15 : 0;
            const netWeight = !isNaN(net) ? (net / 200) * (calcType === 'architecture' ? 25 : 75) : 0;

            if (calcType === 'standard' || calcType === 'international') {
                finalAggregate = matricWeight + fscWeight + netWeight;
            } else if (calcType === 'architecture') {
                const dObt = parseFloat(drawingObt);
                const dTotal = parseFloat(drawingTotal);
                const drawingWeight = !isNaN(dObt) && !isNaN(dTotal) ? (dObt / dTotal) * 50 : 0;
                finalAggregate = matricWeight + fscWeight + netWeight + drawingWeight;
            }
        }
        setAggregate(finalAggregate > 0 ? parseFloat(finalAggregate.toFixed(2)) : null);
    };

    const calculateTarget = () => {
        const mObt = parseFloat(matricObt);
        const mTotal = parseFloat(matricTotal);
        const fObt = parseFloat(fscObt);
        const fTotal = parseFloat(fscTotal);
        const target = parseFloat(targetAggregate);

        if (isNaN(mObt) || isNaN(mTotal) || isNaN(target)) {
            setRequiredNet(null);
            return;
        }

        if (isUET) {
            const matricWeight = (mObt / mTotal) * 25;
            const fscWeight = !isNaN(fObt) && !isNaN(fTotal) ? (fObt / fTotal) * 45 : 0;
            const req = ((target - matricWeight - fscWeight) / 30) * 400;
            setRequiredNet(parseFloat(req.toFixed(1)));
        } else if (isCOMSATS) {
            const matricWeight = (mObt / mTotal) * 10;
            const fscWeight = !isNaN(fObt) && !isNaN(fTotal) ? (fObt / fTotal) * 40 : 0;
            const req = ((target - matricWeight - fscWeight) / 50) * 100;
            setRequiredNet(parseFloat(req.toFixed(1)));
        } else {
            const matricWeight = (mObt / mTotal) * (calcType === 'international' ? 25 : 10);
            let fscWeight = (calcType !== 'international' && !isNaN(fObt) && !isNaN(fTotal)) ? (fObt / fTotal) * 15 : 0;
            const weightForNet = calcType === 'architecture' ? 25 : 75;
            let req = 0;
            if (calcType === 'architecture') {
                const dObt = parseFloat(drawingObt);
                const dTotal = parseFloat(drawingTotal);
                const drawingWeight = !isNaN(dObt) && !isNaN(dTotal) ? (dObt / dTotal) * 50 : 0;
                req = ((target - matricWeight - fscWeight - drawingWeight) / 25) * 200;
            } else {
                req = ((target - matricWeight - fscWeight) / weightForNet) * 200;
            }
            setRequiredNet(parseFloat(req.toFixed(1)));
        }
    };

    const getSuggestion = () => {
        if (!aggregate) return '';
        if (isUET) {
            const offset = selectedCampus === 'Main Campus (Lahore)' ? 0 : 6;
            const adjAgg = aggregate + offset;
            if (adjAgg < 65) return "Target score 280+ in ECAT to secure a seat.";
            if (adjAgg < 75) return "Aim for 310+ for core engineering fields.";
            if (adjAgg < 82) return "Good score! CS/SE might be possible in sub-campuses.";
            return "Outstanding! Main Campus CS/SE is likely.";
        } else if (isCOMSATS) {
            if (aggregate < 75) return "COMSATS is highly competitive. Aim for 85+ for CS.";
            if (aggregate < 84) return "You're in the running for most engineering fields.";
            if (aggregate < 88) return "Strong aggregate! Main campus CS is within reach.";
            return "Exceptional! CUI Islamabad/Lahore CS is highly likely.";
        } else {
            if (aggregate < 65) return "Target score 165+ in NET to jump into safe zone!";
            if (aggregate < 72) return "Aim for 155+ to secure most engineering fields.";
            if (aggregate < 78) return "You're in a great spot! Focus on English/IQ to push further.";
            return "Outstanding! You're likely to get into any program you want.";
        }
    };

    const RADIUS = 55;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: [CIRCUMFERENCE, 0],
        extrapolate: 'clamp',
    });

    return (
        <GradientBackground variant="header" particleCount={4}>
            <AdvancedHeader
                title={`${universityParam} Calc`}
                subtitle="Calculate admission aggregate"
                rightAction={{
                    icon: 'document-text-outline',
                    onPress: () => setShowPattern(true)
                }}
            />

            <View style={{ flex: 1, backgroundColor: theme.colors.background }} className="rounded-t-[30px] -mt-4 overflow-hidden">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
                    <View className="flex-1 items-center px-6 pt-6">
                        <View className="w-full max-w-[800px]">
                            <Text style={{ color: theme.colors.text.primary }} className="text-2xl font-poppins font-bold mb-4">{universityParam} Calculator</Text>

                            {/* Mode Selection */}
                            <View style={{ backgroundColor: theme.colors.surface, ...theme.shadows.sm }} className="flex-row p-1.5 rounded-2xl mb-4 border border-black/5">
                                <TouchableOpacity
                                    onPress={() => setMode('calc')}
                                    style={{ backgroundColor: mode === 'calc' ? theme.colors.primary : 'transparent' }}
                                    className="flex-1 py-2.5 rounded-xl items-center"
                                >
                                    <Text style={{ color: mode === 'calc' ? 'white' : theme.colors.text.muted }} className="font-bold text-xs uppercase tracking-widest">Aggregate</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setMode('target')}
                                    style={{ backgroundColor: mode === 'target' ? theme.colors.primary : 'transparent' }}
                                    className="flex-1 py-2.5 rounded-xl items-center"
                                >
                                    <Text style={{ color: mode === 'target' ? 'white' : theme.colors.text.muted }} className="font-bold text-xs uppercase tracking-widest">Target Score</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Program/Type Selection */}
                            {!isUET && (
                                <View className="flex-row gap-2 mb-4">
                                    {(isCOMSATS ? ['cs', 'engineering', 'business'] : ['standard', 'architecture', 'international']).map((t) => (
                                        <TouchableOpacity
                                            key={t}
                                            onPress={() => setCalcType(t)}
                                            style={{
                                                backgroundColor: calcType === t ? theme.colors.primary + '15' : theme.colors.surface,
                                                borderColor: calcType === t ? theme.colors.primary : theme.colors.border,
                                                ...theme.shadows.sm
                                            }}
                                            className="flex-1 py-3 rounded-2xl border"
                                        >
                                            <Text style={{ color: calcType === t ? theme.colors.primary : theme.colors.text.muted }} className="text-center text-[10px] font-bold uppercase tracking-wider">{t}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {/* Result Display Area */}
                            <View className="items-center w-full mb-6">
                                <View className="w-full max-w-[600px]">
                                    {mode === 'calc' ? (
                                        aggregate !== null && (
                                            <View
                                                style={{
                                                    backgroundColor: theme.colors.surface,
                                                    borderRadius: 24,
                                                    borderWidth: 1,
                                                    borderColor: theme.colors.primary + '10',
                                                    padding: 24,
                                                    ...theme.shadows.md
                                                }}
                                            >
                                                <View className="flex-row items-center justify-between mb-6">
                                                    <View className="flex-1 pr-4">
                                                        <Text style={{ color: theme.colors.text.muted }} className="font-bold text-[10px] uppercase tracking-widest mb-2">Aggregated Score</Text>
                                                        <Text style={{ color: theme.colors.text.primary }} className="text-[11px] leading-4 font-inter">{getSuggestion()}</Text>
                                                    </View>
                                                    <View className="relative w-[110px] items-center justify-center">
                                                        <Svg width={100} height={100} viewBox="0 0 120 120">
                                                            <Circle cx="60" cy="60" r={RADIUS} stroke={theme.colors.border} strokeWidth="8" fill="none" />
                                                            <AnimatedCircle
                                                                cx="60" cy="60" r={RADIUS}
                                                                stroke={theme.colors.primary} strokeWidth="10"
                                                                fill="none" strokeDasharray={CIRCUMFERENCE}
                                                                strokeDashoffset={strokeDashoffset}
                                                                strokeLinecap="round" transform="rotate(-90 60 60)"
                                                            />
                                                        </Svg>
                                                        <View className="absolute items-center">
                                                            <Text style={{ color: theme.colors.text.primary }} className="text-2xl font-bold">{Math.floor(aggregate)}</Text>
                                                            <Text style={{ color: theme.colors.primary }} className="text-[10px] font-bold">.{Math.round((aggregate % 1) * 100)}%</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={saveAggregate}
                                                    style={{ backgroundColor: theme.colors.primary }}
                                                    className="py-4 rounded-2xl flex-row justify-center items-center"
                                                >
                                                    <Ionicons name="bookmark" size={18} color="white" />
                                                    <Text className="text-white font-bold text-xs uppercase tracking-widest ml-2">Save Result</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    ) : (
                                        requiredNet !== null && (
                                            <View
                                                style={{
                                                    backgroundColor: theme.colors.surface,
                                                    borderRadius: 24,
                                                    padding: 24,
                                                    ...theme.shadows.md
                                                }}
                                                className="flex-row items-center"
                                            >
                                                <View style={{ backgroundColor: theme.colors.primary + '10' }} className="w-20 h-20 rounded-2xl items-center justify-center">
                                                    <Text style={{ color: theme.colors.primary }} className="font-bold text-2xl">
                                                        {requiredNet > (isUET ? 400 : (isCOMSATS ? 100 : 200)) ? '✗' : requiredNet < 0 ? '✓' : Math.ceil(requiredNet)}
                                                    </Text>
                                                </View>
                                                <View className="flex-1 ml-6">
                                                    <Text style={{ color: theme.colors.primary }} className="font-bold uppercase text-[10px] tracking-widest mb-1">Required Score</Text>
                                                    <Text style={{ color: theme.colors.text.secondary }} className="text-xs font-inter">
                                                        {requiredNet > (isUET ? 400 : (isCOMSATS ? 100 : 200))
                                                            ? `This target requires a score beyond the maximum possible.`
                                                            : requiredNet < 0 ? "You have already achieved this aggregate!" : `Target ${Math.ceil(requiredNet)} in entrance test.`}
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    )}
                                </View>
                            </View>

                            {/* Input Fields Grid */}
                            <View className="flex-row flex-wrap justify-between">
                                {/* Academic Details Card */}
                                <View style={{ backgroundColor: theme.colors.surface, ...theme.shadows.sm }} className="w-full md:w-[65%] p-6 rounded-3xl border border-black/5 mb-6">
                                    <Text style={{ color: theme.colors.text.primary }} className="font-bold text-sm mb-4">Academic Details</Text>

                                    <View className="md:flex-row md:gap-6">
                                        <View className="flex-1 mb-4">
                                            <Text style={{ color: theme.colors.text.muted }} className="text-[10px] font-bold uppercase mb-2">Matriculation</Text>
                                            <View className="flex-row gap-3 flex-wrap">
                                                <TextInput
                                                    placeholder="Obtained" placeholderTextColor={theme.colors.text.muted} keyboardType="numeric"
                                                    style={{ backgroundColor: theme.colors.background, color: theme.colors.text.primary, height: 50 }}
                                                    className="flex-1 min-w-[120px] px-4 rounded-xl border border-black/5"
                                                    value={matricObt} onChangeText={setMatricObt}
                                                />
                                                <TextInput
                                                    placeholder="Total" placeholderTextColor={theme.colors.text.muted} keyboardType="numeric"
                                                    style={{ backgroundColor: theme.colors.background, color: theme.colors.text.primary, height: 50 }}
                                                    className="flex-1 min-w-[120px] px-4 rounded-xl border border-black/5"
                                                    value={matricTotal} onChangeText={setMatricTotal}
                                                />
                                            </View>
                                        </View>

                                        {calcType !== 'international' && (
                                            <View className="flex-1 mb-4">
                                                <View className="flex-row justify-between items-center mb-2">
                                                    <Text style={{ color: theme.colors.text.muted }} className="text-[10px] font-bold uppercase">Intermediate</Text>
                                                    <View className="flex-row items-center">
                                                        <Switch
                                                            value={fscAwaited}
                                                            onValueChange={setFscAwaited}
                                                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                                            thumbColor="white"
                                                            style={{ transform: [{ scale: 0.8 }] }}
                                                        />
                                                    </View>
                                                </View>
                                                <View className="flex-row gap-3 flex-wrap">
                                                    <TextInput
                                                        placeholder="Obtained" placeholderTextColor={theme.colors.text.muted} keyboardType="numeric"
                                                        style={{ backgroundColor: theme.colors.background, color: theme.colors.text.primary, height: 50 }}
                                                        className="flex-1 min-w-[120px] px-4 rounded-xl border border-black/5"
                                                        value={fscObt} onChangeText={setFscObt}
                                                    />
                                                    <TextInput
                                                        placeholder="Total" placeholderTextColor={theme.colors.text.muted} keyboardType="numeric"
                                                        style={{ backgroundColor: theme.colors.background, color: theme.colors.text.primary, height: 50 }}
                                                        className="flex-1 min-w-[120px] px-4 rounded-xl border border-black/5"
                                                        value={fscTotal} onChangeText={setFscTotal}
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    <View className="mt-2">
                                        <Text style={{ color: theme.colors.text.muted }} className="text-[10px] font-bold uppercase mb-2">
                                            {mode === 'calc' ? 'Test Score' : 'Target Aggregate'}
                                        </Text>
                                        <TextInput
                                            placeholder={mode === 'calc' ? "Marks" : "Percentage (e.g. 80)"}
                                            placeholderTextColor={theme.colors.text.muted} keyboardType="numeric"
                                            style={{ backgroundColor: theme.colors.background, color: theme.colors.text.primary, height: 50 }}
                                            className="w-full px-4 rounded-xl border border-black/5"
                                            value={mode === 'calc' ? netScore : targetAggregate}
                                            onChangeText={mode === 'calc' ? setNetScore : setTargetAggregate}
                                        />
                                    </View>
                                </View>

                                {/* Quick Actions Card - Sidebar style on MD+ */}
                                <View className="w-full md:w-[32%] flex-row md:flex-col gap-4 mb-6">
                                    <TouchableOpacity
                                        onPress={() => setShowMeritTable(true)}
                                        style={{ backgroundColor: theme.colors.surface, ...theme.shadows.sm }}
                                        className="flex-1 p-5 rounded-3xl border border-black/5 items-center justify-center h-auto md:h-32"
                                    >
                                        <Ionicons name="list" size={24} color={theme.colors.primary} />
                                        <Text style={{ color: theme.colors.text.primary }} className="font-bold text-[10px] uppercase mt-2">Merit Lists</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setShowPattern(true)}
                                        style={{ backgroundColor: theme.colors.surface, ...theme.shadows.sm }}
                                        className="flex-1 p-5 rounded-3xl border border-black/5 items-center justify-center h-auto md:h-32"
                                    >
                                        <Ionicons name="analytics" size={24} color={theme.colors.secondary} />
                                        <Text style={{ color: theme.colors.text.primary }} className="font-bold text-[10px] uppercase mt-2">Test Info</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Eligibility Warnings */}
                            {(matricWarning || fscWarning) && (
                                <View style={{ backgroundColor: theme.colors.error + '10', borderColor: theme.colors.error + '20' }} className="p-4 rounded-2xl border mb-6 flex-row">
                                    <Ionicons name="warning" size={20} color={theme.colors.error} />
                                    <View className="ml-3 flex-1">
                                        <Text style={{ color: theme.colors.error }} className="font-bold text-xs">Admission Alert</Text>
                                        <Text style={{ color: theme.colors.text.secondary }} className="text-[10px] mt-1">Minimum 60% required in Matric and FSc for admissions.</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>

            {/* Modals */}
            <Modal visible={showMeritTable} transparent animationType="slide">
                <View className="flex-1 bg-black/60 justify-end md:justify-center md:items-center">
                    <View
                        style={{ backgroundColor: theme.colors.surface }}
                        className="rounded-t-[40px] md:rounded-[40px] p-8 h-[80%] w-full md:max-w-[600px] md:h-auto md:max-h-[80%]"
                    >
                        <View className="flex-row justify-between items-center mb-8">
                            <View>
                                <Text style={{ color: theme.colors.text.primary }} className="text-2xl font-bold">{universityParam} Merits</Text>
                                <Text style={{ color: theme.colors.text.muted }} className="text-xs">Closing aggregates from last session</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowMeritTable(false)} style={{ backgroundColor: theme.colors.background }} className="p-2 rounded-full">
                                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {(UNIVERSITY_DATA[universityParam]?.fullMeritList || []).map((item: any, idx: number) => (
                                <View key={idx} style={{ backgroundColor: theme.colors.background }} className="flex-row justify-between p-5 rounded-2xl mb-3 border border-black/5">
                                    <View className="flex-1">
                                        <Text style={{ color: theme.colors.text.primary }} className="font-bold text-sm">{item.dept}</Text>
                                        <Text style={{ color: theme.colors.text.muted }} className="text-[10px] uppercase">Official Closing</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text style={{ color: theme.colors.primary }} className="text-lg font-bold">{item.merit}</Text>
                                        <Text style={{ color: theme.colors.text.muted }} className="text-[10px]">Expected 2026</Text>
                                    </View>
                                </View>
                            ))}
                            {(!UNIVERSITY_DATA[universityParam]?.fullMeritList) && (
                                <Text className="text-center py-10 opacity-50">Detailed data coming soon for this university.</Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal >

            <Modal visible={showPattern} transparent animationType="slide">
                <View className="flex-1 bg-black/60 justify-end md:justify-center md:items-center">
                    <View
                        style={{ backgroundColor: theme.colors.surface }}
                        className="rounded-t-[40px] md:rounded-[40px] p-8 h-[70%] w-full md:max-w-[600px] md:h-auto md:max-h-[80%]"
                    >
                        <View className="flex-row justify-between items-center mb-8">
                            <View>
                                <Text style={{ color: theme.colors.text.primary }} className="text-2xl font-bold">
                                    {UNIVERSITY_DATA[universityParam]?.testInfo.testName?.split(' (')[0] || 'Test'} Info
                                </Text>
                                <Text style={{ color: theme.colors.text.muted }} className="text-xs">
                                    {UNIVERSITY_DATA[universityParam]?.testInfo.testName || 'Entry Test'} Structure
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowPattern(false)} style={{ backgroundColor: theme.colors.background }} className="p-2 rounded-full">
                                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {UNIVERSITY_DATA[universityParam]?.testInfo && (
                                <View style={{ backgroundColor: theme.colors.primary + '05' }} className="p-6 rounded-[30px] mb-8 border border-primary/10">
                                    <Text style={{ color: theme.colors.primary }} className="font-bold mb-2">About the Test</Text>
                                    <Text style={{ color: theme.colors.text.secondary }} className="text-sm leading-6">
                                        {UNIVERSITY_DATA[universityParam].testInfo.description}
                                    </Text>
                                    <View className="flex-row mt-4 gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[10px] uppercase font-bold text-gray-400">Duration</Text>
                                            <Text style={{ color: theme.colors.text.primary }} className="font-bold">{UNIVERSITY_DATA[universityParam].testInfo.duration}</Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[10px] uppercase font-bold text-gray-400">Negative</Text>
                                            <Text style={{ color: theme.colors.text.primary }} className="font-bold">{UNIVERSITY_DATA[universityParam].testInfo.negativeMarking ? 'Yes (-1)' : 'No'}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            <Text style={{ color: theme.colors.text.primary }} className="font-bold text-lg mb-4 ml-2">Weightage Breakdown</Text>
                            {(UNIVERSITY_DATA[universityParam]?.testPattern || []).map((item: any, idx: number) => (
                                <View key={idx} style={{ backgroundColor: theme.colors.background }} className="p-5 rounded-2xl mb-3 border border-black/5">
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text style={{ color: theme.colors.text.primary }} className="font-bold">{item.subject}</Text>
                                        <Text style={{ color: theme.colors.secondary }} className="font-bold">{item.percentage}%</Text>
                                    </View>
                                    <View style={{ backgroundColor: theme.colors.border }} className="h-1.5 rounded-full overflow-hidden">
                                        <View
                                            style={{
                                                backgroundColor: theme.colors.secondary,
                                                width: `${item.percentage}%`
                                            }}
                                            className="h-full"
                                        />
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </GradientBackground >
    );
};
