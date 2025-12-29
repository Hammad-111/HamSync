import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Animated, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from '../components/GlassView';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '../contexts/ToastContext';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const MeritCalculatorScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { showToast } = useToast();
    const universityParam = route.params?.university || 'NUST';
    const initialType = route.params?.type || 'standard';
    const isUET = universityParam === 'UET';
    const isCOMSATS = universityParam === 'COMSATS';

    const [calcType, setCalcType] = useState(initialType || (isCOMSATS ? 'cs' : 'standard')); // 'standard', 'architecture', 'international', 'cs', 'business'
    const [mode, setMode] = useState<'calc' | 'target'>('calc');
    const [testType, setTestType] = useState('NTS NAT-1'); // for COMSATS

    // Colors
    const themeColor = '#06B6D4'; // Reverted to Cyan for both universities
    const secondaryColor = '#06B6D4';

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
    const [showEquivalence, setShowEquivalence] = useState(false);
    const [showPattern, setShowPattern] = useState(false);
    const [patternMode, setPatternMode] = useState<'Engineering' | 'Medical'>('Engineering');

    // Eligibility Warnings
    const [matricWarning, setMatricWarning] = useState(false);
    const [fscWarning, setFscWarning] = useState(false);

    // Animation for circular progress
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Advanced Animation Refs
    const scanLineAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const lineLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(scanLineAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
            ])
        );
        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        );
        lineLoop.start();
        pulseLoop.start();
        return () => {
            lineLoop.stop();
            pulseLoop.stop();
        };
    }, []);

    useEffect(() => {
        loadSavedAggregates();
    }, []);

    useEffect(() => {
        if (fscAwaited) {
            setFscTotal('550');
        } else {
            setFscTotal('1100');
        }
    }, [fscAwaited]);

    // Real-time Auto-Calculation
    useEffect(() => {
        if (mode === 'calc') {
            calculateMerit();
        } else {
            calculateTarget();
        }
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
                type: calcType === 'standard' ? 'Standard' : calcType === 'architecture' ? 'Architecture' : 'International',
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

        // Eligibility Alerts
        setMatricWarning(mObt / mTotal < 0.6);
        if (calcType !== 'international' && !isNaN(fObt) && !isNaN(fTotal)) {
            setFscWarning(fObt / fTotal < 0.6);
        } else {
            setFscWarning(false);
        }

        let finalAggregate = 0;

        if (isUET) {
            // UET Formula: (Matric 25%) + (Inter 45%) + (ECAT 30%)
            const matricWeight = (mObt / mTotal) * 25;
            const fscWeight = !isNaN(fObt) && !isNaN(fTotal) ? (fObt / fTotal) * 45 : 0;
            const netWeight = !isNaN(net) ? (net / 400) * 30 : 0;
            finalAggregate = matricWeight + fscWeight + netWeight;
        } else if (isCOMSATS) {
            // COMSATS Formula: (Matric 10%) + (Inter 40%) + (NTS 50%)
            const matricWeight = (mObt / mTotal) * 10;
            const fscWeight = !isNaN(fObt) && !isNaN(fTotal) ? (fObt / fTotal) * 40 : 0;
            const netWeight = !isNaN(net) ? (net / 100) * 50 : 0;
            finalAggregate = matricWeight + fscWeight + netWeight;

            // Simple Eligibility Check for COMSATS
            const perc = (fObt / fTotal);
            if (calcType === 'cs' || calcType === 'standard') {
                setFscWarning(perc < 0.6);
            } else {
                setFscWarning(perc < 0.5);
            }
        } else {
            // NUST Formula
            const matricWeight = (mObt / mTotal) * (calcType === 'international' ? 25 : 10);
            let fscWeight = 0;
            if (calcType !== 'international' && !isNaN(fObt) && !isNaN(fTotal)) {
                fscWeight = (fObt / fTotal) * 15;
            }
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
            // Target Formula UET: (Matric 25%) + (Inter 45%) + (ECAT 30%)
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

            let req = ((target - matricWeight - fscWeight) / weightForNet) * 200;

            if (calcType === 'architecture') {
                const dObt = parseFloat(drawingObt);
                const dTotal = parseFloat(drawingTotal);
                const drawingWeight = !isNaN(dObt) && !isNaN(dTotal) ? (dObt / dTotal) * 50 : 0;
                req = ((target - matricWeight - fscWeight - drawingWeight) / 25) * 200;
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
        <SafeAreaView className="flex-1 bg-primary px-6" edges={['top']}>
            <View className="flex-row items-center justify-between mb-2 mt-2">
                <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
                    <Ionicons name="arrow-back" size={20} color="#9ca3af" />
                    <Text className="text-gray-400 ml-1.5 font-inter text-sm">Back</Text>
                </TouchableOpacity>
                <View className="flex-row gap-4">
                    <TouchableOpacity onPress={() => setShowPattern(true)}>
                        <Ionicons name="document-text-outline" size={20} color={themeColor} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowEquivalence(true)}>
                        <Ionicons name="information-circle-outline" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                <View className="mb-4">
                    <Text className="text-white text-2xl font-poppins font-bold">{universityParam} {isUET || isCOMSATS ? '2025-26' : ''}</Text>

                    {/* Mode Selector Tabs */}
                    <View className="flex-row mt-3 bg-white/5 p-1 rounded-xl">
                        <TouchableOpacity onPress={() => setMode('calc')} className={`flex-1 py-1.5 rounded-lg ${mode === 'calc' ? '' : ''}`} style={mode === 'calc' ? { backgroundColor: themeColor } : {}}>
                            <Text className={`text-center font-bold text-[10px] uppercase tracking-widest ${mode === 'calc' ? 'text-white' : 'text-gray-500'}`}>Calculator</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setMode('target')} className={`flex-1 py-1.5 rounded-lg ${mode === 'target' ? '' : ''}`} style={mode === 'target' ? { backgroundColor: themeColor } : {}}>
                            <Text className={`text-center font-bold text-[10px] uppercase tracking-widest ${mode === 'target' ? 'text-white' : 'text-gray-500'}`}>Target Score</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Program Type Tabs - Hide for UET as it's singular for now */}
                    {!isUET && (
                        <View className="flex-row mt-2 gap-2">
                            {(isCOMSATS ? ['cs', 'engineering', 'business'] : ['standard', 'architecture', 'international']).map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    onPress={() => setCalcType(t)}
                                    className={`flex-1 py-1.5 rounded-lg border ${calcType === t ? 'bg-white/10' : 'border-white/5 bg-white/5'}`}
                                    style={calcType === t ? { borderColor: themeColor } : {}}
                                >
                                    <Text className={`text-center text-[9px] font-bold uppercase tracking-wider ${calcType === t ? '' : 'text-gray-500'}`} style={calcType === t ? { color: themeColor } : {}}>
                                        {t}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Campus Selector for UET / COMSATS */}
                    {(isUET || isCOMSATS) && (
                        <View className="mt-3">
                            <Text className="text-gray-500 font-bold uppercase text-[8px] tracking-widest mb-1.5 ml-1">Select Campus</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {(isCOMSATS
                                    ? ['Islamabad (Main)', 'Lahore Campus', 'Abbottabad / Wah', 'Sahiwal / Vehari / Attock']
                                    : ['Main Campus (Lahore)', 'KSK Campus', 'Faisalabad Campus', 'Narowal Campus']
                                ).map(c => (
                                    <TouchableOpacity
                                        key={c}
                                        onPress={() => setSelectedCampus(c)}
                                        className={`px-3 py-1.5 rounded-lg border ${selectedCampus === c ? 'bg-white/10' : 'bg-white/5 border-white/5'}`}
                                        style={selectedCampus === c ? { borderColor: themeColor } : {}}
                                    >
                                        <Text className={`text-[9px] font-bold ${selectedCampus === c ? 'text-white' : 'text-gray-500'}`}>{c.split(' (')[0].split(' /')[0]}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Test Type for COMSATS */}
                    {isCOMSATS && (
                        <View className="flex-row mt-3 bg-white/5 p-1 rounded-xl">
                            {['NTS NAT-1', 'CUI Special Test'].map(t => (
                                <TouchableOpacity key={t} onPress={() => setTestType(t)} className={`flex-1 py-1.5 rounded-lg ${testType === t ? '' : ''}`} style={testType === t ? { backgroundColor: themeColor } : {}}>
                                    <Text className={`text-center font-bold text-[10px] uppercase tracking-widest ${testType === t ? 'text-white' : 'text-gray-500'}`}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Display Area - BALANCED RECTANGLE */}
                {mode === 'calc' ? (
                    aggregate !== null && (
                        <GlassView className="w-full mb-4 border border-white/10 overflow-hidden">
                            <View className="flex-row items-center p-4">
                                {/* Left Section: Suggestion */}
                                <View className="flex-1 pr-2">
                                    <Text className="text-gray-500 font-bold uppercase text-[7px] tracking-widest mb-1">Status</Text>
                                    <View className="h-[45px] justify-center">
                                        <Text className="text-white/60 font-inter text-[9px] leading-3" numberOfLines={3}>
                                            {getSuggestion()}
                                        </Text>
                                    </View>
                                </View>

                                {/* Center Section: Centered Circle */}
                                <View className="relative w-[110px] items-center justify-center">
                                    <Svg width={100} height={100} viewBox="0 0 120 120">
                                        <Circle
                                            cx="60" cy="60" r={RADIUS}
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth="8" fill="none"
                                        />
                                        <AnimatedCircle
                                            cx="60" cy="60" r={RADIUS}
                                            stroke={themeColor} strokeWidth="10"
                                            fill="none"
                                            strokeDasharray={CIRCUMFERENCE}
                                            strokeDashoffset={strokeDashoffset}
                                            strokeLinecap="round"
                                            transform="rotate(-90 60 60)"
                                        />
                                    </Svg>
                                    <View className="absolute flex-col items-center justify-center">
                                        <Text className="text-white font-bold text-xl">{Math.floor(aggregate)}</Text>
                                        <View className="flex-row items-center -mt-1">
                                            <Text className="font-bold text-[10px]" style={{ color: themeColor }}>.{Math.round((aggregate % 1) * 100)}</Text>
                                            <Text className="font-bold text-[8px] ml-0.5" style={{ color: themeColor }}>%</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Right Section: Advanced Scanning Animation */}
                                <View className="flex-1 items-end pl-2">
                                    <Text className="text-gray-500 font-bold uppercase text-[7px] tracking-widest mb-1">Scanning</Text>
                                    <View className="w-[60px] h-[45px] bg-white/5 rounded-lg border border-white/5 overflow-hidden justify-center items-center">
                                        {/* Grid background */}
                                        <View className="absolute inset-0 flex-row justify-around opacity-20">
                                            {[1, 2, 3].map(i => <View key={i} className="w-[1px] h-full bg-accent" />)}
                                        </View>
                                        <View className="absolute inset-0 flex-col justify-around opacity-20">
                                            {[1, 2].map(i => <View key={i} className="h-[1px] w-full bg-accent" />)}
                                        </View>

                                        {/* Scanning Line */}
                                        <Animated.View
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 2,
                                                backgroundColor: themeColor,
                                                shadowColor: themeColor,
                                                shadowOpacity: 0.8,
                                                shadowRadius: 4,
                                                transform: [{
                                                    translateY: scanLineAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 45]
                                                    })
                                                }]
                                            }}
                                        />

                                        {/* Pulsing Core */}
                                        <Animated.View
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: themeColor,
                                                opacity: pulseAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.3, 1]
                                                })
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Bottom: BIG SAVE BUTTON */}
                            <TouchableOpacity
                                onPress={saveAggregate}
                                className="bg-white/5 border-t border-white/10 py-3 items-center flex-row justify-center active:bg-white/10"
                            >
                                <Ionicons name="bookmark" size={14} color={themeColor} />
                                <Text className="font-bold text-[10px] uppercase tracking-widest ml-2" style={{ color: themeColor }}>Save This Result</Text>
                            </TouchableOpacity>
                        </GlassView>
                    )
                ) : (
                    requiredNet !== null && (
                        <GlassView className="w-full p-4 mb-4 flex-row items-center border border-white/10">
                            <View className="w-[100px] h-[70px] bg-white/5 rounded-2xl items-center justify-center border border-white/5">
                                <Text className="text-gray-500 font-bold uppercase text-[7px] tracking-widest mb-1">Required Score</Text>
                                <Text className={`font-bold text-2xl ${(requiredNet > (isUET ? 400 : (isCOMSATS ? 100 : 200)) || requiredNet < 0) ? 'text-red-500' : ''}`} style={!(requiredNet > (isUET ? 400 : (isCOMSATS ? 100 : 200)) || requiredNet < 0) ? { color: themeColor } : {}}>
                                    {requiredNet > (isUET ? 400 : (isCOMSATS ? 100 : 200)) ? '✗' : requiredNet < 0 ? '✓' : Math.ceil(requiredNet)}
                                </Text>
                            </View>
                            <View className="flex-1 ml-4 py-1">
                                <Text className="font-bold uppercase text-[8px] tracking-widest mb-1" style={{ color: themeColor }}>Target Insight</Text>
                                <Text className="text-gray-300 text-[10px] leading-4 italic">
                                    {requiredNet > (isUET ? 400 : (isCOMSATS ? 100 : 200))
                                        ? `Target is unrealistic. Scores only go to ${isUET ? 400 : (isCOMSATS ? 100 : 200)}.`
                                        : requiredNet < 0 ? "Target reached! ✨" : `Aim for ${Math.ceil(requiredNet)} in ${isUET ? 'ECAT' : (isCOMSATS ? 'NTS' : 'NET')}.`}
                                </Text>
                            </View>
                        </GlassView>
                    )
                )}

                <GlassView className="w-full p-4 mb-4">
                    {/* Matric */}
                    <View className="flex-row justify-between items-center mb-1.5">
                        <Text className="text-white/80 font-bold text-xs">Matric / O-Levels</Text>
                        {matricWarning && <Text className="text-red-500 text-[9px] font-bold tracking-tighter">⚠️ Below 60% eligibility</Text>}
                    </View>
                    <View className="flex-row gap-2 mb-3">
                        <TextInput
                            placeholder="Obtained" placeholderTextColor="#9ca3af" keyboardType="numeric"
                            className="bg-white/5 text-white p-3.5 px-4 rounded-xl flex-1 border border-white/5 text-base"
                            value={matricObt} onChangeText={setMatricObt}
                        />
                        <TextInput
                            placeholder="Total" placeholderTextColor="#9ca3af" keyboardType="numeric"
                            className="bg-white/5 text-white p-3.5 px-4 rounded-xl flex-1 border border-white/5 text-base"
                            value={matricTotal} onChangeText={setMatricTotal}
                        />
                    </View>

                    {/* FSc */}
                    {calcType !== 'international' && (
                        <>
                            <View className="flex-row justify-between items-center mb-1.5">
                                <View className="flex-row items-center">
                                    <Text className="text-white/80 font-bold text-xs">FSc / A-Levels</Text>
                                    {fscWarning && <Text className="text-red-500 text-[9px] font-bold ml-1.5 tracking-tighter">⚠️ Below 60%</Text>}
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="text-gray-500 text-[9px] mr-1.5 italic">Is Part-1?</Text>
                                    <Switch
                                        value={fscAwaited}
                                        onValueChange={setFscAwaited}
                                        trackColor={{ false: '#1f2937', true: themeColor }}
                                        thumbColor="#fff"
                                        style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                                    />
                                </View>
                            </View>
                            <View className="flex-row gap-2 mb-3">
                                <TextInput
                                    placeholder="Obtained" placeholderTextColor="#9ca3af" keyboardType="numeric"
                                    className="bg-white/5 text-white p-3.5 px-4 rounded-xl flex-1 border border-white/5 text-base"
                                    value={fscObt} onChangeText={setFscObt}
                                />
                                <TextInput
                                    placeholder="Total" placeholderTextColor="#9ca3af" keyboardType="numeric"
                                    className="bg-white/5 text-white p-3.5 px-4 rounded-xl flex-1 border border-white/5 text-base"
                                    value={fscTotal} onChangeText={setFscTotal}
                                />
                            </View>
                        </>
                    )}

                    {/* Dynamic Field based on Mode */}
                    {mode === 'calc' ? (
                        <>
                            <Text className="text-white/80 font-bold mb-1.5 text-xs">
                                {isUET ? 'ECAT Score (Out of 400)' : (isCOMSATS ? `${testType} Score (Out of 100)` : 'NET / Entry Test Score')}
                            </Text>
                            <TextInput
                                placeholder={isUET ? "Marks out of 400" : (isCOMSATS ? "Marks out of 100" : "Marks out of 200")} placeholderTextColor="#9ca3af" keyboardType="numeric"
                                className="bg-white/5 text-white p-3.5 px-4 rounded-xl mb-3 border border-white/5 text-base"
                                value={netScore} onChangeText={setNetScore}
                            />
                        </>
                    ) : (
                        <>
                            <Text className="text-white/80 font-bold mb-1.5 text-xs">Target Aggregate Goal (%)</Text>
                            <TextInput
                                placeholder="e.g. 78.5" placeholderTextColor="#9ca3af" keyboardType="numeric"
                                className="bg-white/5 text-white p-3.5 px-4 rounded-xl mb-3 border border-white/5 text-base"
                                value={targetAggregate} onChangeText={setTargetAggregate}
                            />
                        </>
                    )}

                    {calcType === 'architecture' && (
                        <>
                            <Text className="text-white/80 font-bold mb-1.5 text-xs">Drawing Test Marks</Text>
                            <View className="flex-row gap-2 mb-2">
                                <TextInput
                                    placeholder="Obtained" placeholderTextColor="#9ca3af" keyboardType="numeric"
                                    className="bg-white/5 text-white p-3.5 px-4 rounded-xl flex-1 border border-white/5 text-base"
                                    value={drawingObt} onChangeText={setDrawingObt}
                                />
                                <TextInput
                                    placeholder="Total" placeholderTextColor="#9ca3af" keyboardType="numeric"
                                    className="bg-white/5 text-white p-3.5 px-4 rounded-xl flex-1 border border-white/5 text-base"
                                    value={drawingTotal} onChangeText={setDrawingTotal}
                                />
                            </View>
                        </>
                    )}
                </GlassView>

                {/* Additional Actions */}
                <View className="flex-row gap-2 mb-4">
                    <TouchableOpacity onPress={() => setShowMeritTable(true)} className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 items-center justify-center">
                        <Ionicons name="list" size={16} color={themeColor} />
                        <Text className="text-gray-300 font-bold text-[9px] mt-1.5 uppercase tracking-widest text-center">{isUET ? 'UET Merit List' : (isCOMSATS ? 'CUI Merits' : 'Closing List')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowPattern(true)} className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 items-center justify-center">
                        <Ionicons name="notifications" size={16} color={secondaryColor} />
                        <Text className="text-gray-300 font-bold text-[9px] mt-1.5 uppercase tracking-widest text-center">{isUET ? 'Admission Alert' : (isCOMSATS ? 'CUI Timeline' : 'NET Pattern')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Eligibility Notice */}
                {(matricWarning || fscWarning) && (
                    <View className="bg-red-500/10 border border-red-500/10 p-4 rounded-xl mb-4">
                        <View className="flex-row items-center mb-1">
                            <Ionicons name="alert-circle" size={14} color="#ef4444" />
                            <Text className="text-red-500 font-bold text-[10px] ml-1.5 uppercase">Eligibility Alert</Text>
                        </View>
                        <Text className="text-gray-400 text-[9px] leading-4">
                            {isUET ? "Sorry, you must have at least 60% in F.Sc to apply for UET." : (isCOMSATS ? `Eligibility: At least ${calcType === 'business' ? '50%' : '60%'} marks in Inter required.` : "Minimum 60% required in Matric and FSc for NUST admissions.")}
                        </Text>
                    </View>
                )}

                {/* Saved Aggregates List */}
                {savedAggregates.length > 0 && (
                    <View className="mt-2 mb-10">
                        <View className="flex-row items-center justify-between mb-3 px-1">
                            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Recent Saves</Text>
                            <TouchableOpacity onPress={async () => {
                                await AsyncStorage.removeItem('saved_aggregates');
                                setSavedAggregates([]);
                            }}>
                                <Text className="text-red-500/60 text-[8px] font-bold uppercase">Clear All</Text>
                            </TouchableOpacity>
                        </View>
                        {savedAggregates.slice(0, 3).map((item, idx) => (
                            <GlassView key={idx} className="flex-row items-center justify-between p-3 mb-2 border border-white/5">
                                <View>
                                    <Text className="text-white font-bold text-xs">{item.aggregate}%</Text>
                                    <Text className="text-gray-500 text-[8px]">{universityParam} • {item.date}</Text>
                                </View>
                                <Ionicons name="checkmark-circle" size={16} color={themeColor} />
                            </GlassView>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Merit Table Modal */}
            <Modal visible={showMeritTable} transparent animationType="slide">
                <View className="flex-1 bg-black/80 justify-end">
                    <View className="bg-primary rounded-t-3xl p-6 h-[70%] border-t border-white/10">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white font-bold text-xl">{isCOMSATS ? `CUI ${selectedCampus} Merits` : (isUET ? 'UET Closing Merits (2025)' : 'Expected Merits (2025)')}</Text>
                            <TouchableOpacity onPress={() => setShowMeritTable(false)}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {(isCOMSATS ? [
                                { dept: 'BS Computer Science', merit: selectedCampus === 'Islamabad (Main)' ? '89.5%' : (selectedCampus.includes('Lahore') ? '88.0%' : '78.5%') },
                                { dept: 'BS Software Engineering', merit: selectedCampus === 'Islamabad (Main)' ? '88.2%' : (selectedCampus.includes('Lahore') ? '86.8%' : '76.0%') },
                                { dept: 'BS AI / Data Science', merit: selectedCampus === 'Islamabad (Main)' ? '86.5%' : (selectedCampus.includes('Lahore') ? '85.0%' : '73.5%') },
                                { dept: 'Electrical Engineering', merit: selectedCampus === 'Islamabad (Main)' ? '72.5%' : (selectedCampus.includes('Lahore') ? '68.0%' : '62.0%') },
                                { dept: 'BBA / Psychology', merit: selectedCampus === 'Islamabad (Main)' ? '78.0%' : (selectedCampus.includes('Lahore') ? '75.0%' : '65.0%') },
                            ] : (isUET ? [
                                { dept: 'Computer Science', merit: '85.5%' },
                                { dept: 'Software Engineering', merit: '84.8%' },
                                { dept: 'Data Science', merit: '81.2%' },
                                { dept: 'Cyber Security', merit: '80.5%' },
                                { dept: 'Electrical Engineering', merit: '78.0%' },
                                { dept: 'Mechanical Engineering', merit: '77.5%' },
                                { dept: 'Civil Engineering', merit: '73.0%' },
                                { dept: 'Chemical Engineering', merit: '72.5%' },
                            ] : [
                                { dept: 'Software Engineering', merit: '78.8%' },
                                { dept: 'Computer Science', merit: '77.5%' },
                                { dept: 'Artificial Intelligence', merit: '78.2%' },
                                { dept: 'Data Science', merit: '77.0%' },
                                { dept: 'Mechanical Eng.', merit: '74.5%' },
                                { dept: 'Electrical Eng.', merit: '72.0%' },
                                { dept: 'BBA / Business', merit: '76.5%' },
                                { dept: 'SADA Architecture', merit: '71.0%' },
                            ])).map((item, idx) => (
                                <View key={idx} className="flex-row justify-between py-4 border-b border-white/5">
                                    <Text className="text-gray-300 font-inter text-sm">{item.dept}</Text>
                                    <Text className="font-bold" style={{ color: themeColor }}>{item.merit}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Pattern Modal */}
            <Modal visible={showPattern} transparent animationType="slide">
                <View className="flex-1 bg-black/80 justify-center px-6">
                    <GlassView className="w-full p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white font-bold text-xl">
                                {isCOMSATS ? 'CUI Admission Timeline' : (isUET ? 'ECAT Pattern' : 'NET Pattern')}
                            </Text>
                            <TouchableOpacity onPress={() => setShowPattern(false)}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Pattern Selector / Timeline for COMSATS */}
                        {isCOMSATS ? (
                            <View className="py-4">
                                <View className="bg-white/5 p-4 rounded-xl border border-white/5 mb-4">
                                    <Text className="text-accent font-bold text-xs uppercase mb-2">Spring Intake</Text>
                                    <Text className="text-gray-400 text-[10px] leading-4">Admissions open in October/November. Classes start in February.</Text>
                                </View>
                                <View className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <Text className="text-accent font-bold text-xs uppercase mb-2">Fall Intake</Text>
                                    <Text className="text-gray-400 text-[10px] leading-4">Admissions open in June/July. Classes start in September.</Text>
                                </View>
                                <View className="mt-6 bg-accent/10 p-3 rounded-xl border border-accent/20 items-center">
                                    <Text className="text-accent font-bold text-[10px]">🔔 GET READY FOR 2026 INTAKE</Text>
                                </View>
                            </View>
                        ) : (
                            <>
                                <View className="flex-row bg-white/5 rounded-xl p-1 mb-6">
                                    {(isUET ? ['ECAT - Standard'] : ['Engineering', 'Medical']).map(p => (
                                        <TouchableOpacity key={p} onPress={() => setPatternMode(p as any)} className={`flex-1 py-1.5 rounded-lg ${patternMode === p || isUET ? '' : ''}`} style={patternMode === p || isUET ? { backgroundColor: themeColor } : {}}>
                                            <Text className={`text-center text-[10px] font-bold ${patternMode === p || isUET ? 'text-white' : 'text-gray-500'}`}>{p}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {(isUET ? [
                                    { name: 'Physics', marks: '30%' },
                                    { name: 'Mathematics', marks: '30%' },
                                    { name: 'Chemistry / CS', marks: '30%' },
                                    { name: 'English', marks: '10%' },
                                ] : [
                                    { name: patternMode === 'Engineering' ? 'Mathematics' : 'Biology', marks: '80' },
                                    { name: 'Physics', marks: '60' },
                                    { name: 'Chemistry / CS', marks: '30' },
                                    { name: 'English', marks: '20' },
                                    { name: 'Intelligence', marks: '10' },
                                ]).map((item, idx) => (
                                    <View key={idx} className="flex-row justify-between py-2.5 border-b border-white/5">
                                        <Text className="text-gray-300 text-sm">{item.name}</Text>
                                        <Text className="font-bold text-sm" style={{ color: themeColor }}>{item.marks} {isUET ? '' : 'MCQs'}</Text>
                                    </View>
                                ))}
                                <View className="mt-6 bg-green-500/10 p-3 rounded-xl border border-green-500/20 items-center">
                                    <Text className="text-green-500 font-bold text-[10px]">✓ NO NEGATIVE MARKING ({isUET ? 'ECAT' : '2025'})</Text>
                                </View>
                            </>
                        )}
                    </GlassView>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
