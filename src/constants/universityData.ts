export interface MeritEntry {
    dept: string;
    merit: string;
    lastYear?: string;
}

export interface TestPattern {
    subject: string;
    percentage: number;
    weight?: string;
}

export interface UniversityData {
    name: string;
    fullMeritList: MeritEntry[];
    testPattern: TestPattern[];
    testInfo: {
        testName: string;
        duration: string;
        totalMarks: number;
        negativeMarking: boolean;
        description: string;
    };
}

export const UNIVERSITY_DATA: Record<string, UniversityData> = {
    NUST: {
        name: 'NUST',
        fullMeritList: [
            { dept: 'BS Computer Science', merit: '78.5%' },
            { dept: 'BS Software Engineering', merit: '77.8%' },
            { dept: 'BS Data Science', merit: '76.5%' },
            { dept: 'BS Artificial Intelligence', merit: '76.2%' },
            { dept: 'BE Electrical Engineering', merit: '68.5%' },
            { dept: 'BE Mechanical Engineering', merit: '66.2%' },
            { dept: 'BE Civil Engineering', merit: '64.8%' },
            { dept: 'BE Mechatronics', merit: '67.0%' },
            { dept: 'BS Physics', merit: '62.5%' },
            { dept: 'BS Mathematics', merit: '60.0%' },
            { dept: 'BBA', merit: '74.5%' },
            { dept: 'BS Accounting & Finance', merit: '72.0%' },
            { dept: 'B.Architecture', merit: '71.5%' },
            { dept: 'B.Industrial Design', merit: '69.0%' },
        ],
        testPattern: [
            { subject: 'Mathematics', percentage: 40 },
            { subject: 'Physics', percentage: 30 },
            { subject: 'Chemistry', percentage: 15 },
            { subject: 'English', percentage: 10 },
            { subject: 'Intelligence', percentage: 5 }
        ],
        testInfo: {
            testName: 'NET (NUST Entrance Test)',
            duration: '3 Hours',
            totalMarks: 200,
            negativeMarking: false,
            description: 'The NUST Entrance Test (NET) is a computer-based test. Focus on Engineering Mathematics and Physics as they carry 70% weight.'
        }
    },
    COMSATS: {
        name: 'COMSATS',
        fullMeritList: [
            { dept: 'BS Computer Science (ISB)', merit: '89.2%' },
            { dept: 'BS Software Engineering (ISB)', merit: '87.5%' },
            { dept: 'BS Computer Science (LHR)', merit: '88.0%' },
            { dept: 'BS Software Engineering (LHR)', merit: '86.2%' },
            { dept: 'BS Cyber Security (ISB)', merit: '86.5%' },
            { dept: 'BS Artificial Intelligence (ISB)', merit: '86.0%' },
            { dept: 'BS Data Science (ISB)', merit: '85.5%' },
            { dept: 'BE Electrical Engineering', merit: '78.5%' },
            { dept: 'BS Business Administration', merit: '75.0%' },
            { dept: 'BS Accounting & Finance', merit: '72.5%' },
        ],
        testPattern: [
            { subject: 'Verbal / English', percentage: 25 },
            { subject: 'Analytical', percentage: 25 },
            { subject: 'Quantitative (Math)', percentage: 25 },
            { subject: 'Subject Knowledge', percentage: 25 }
        ],
        testInfo: {
            testName: 'NTS NAT-I',
            duration: '90 Minutes',
            totalMarks: 100,
            negativeMarking: false,
            description: 'NTS NAT-I (for Undergraduate) is required. It consists of multiple-choice questions across four main sections.'
        }
    },
    UET: {
        name: 'UET',
        fullMeritList: [
            { dept: 'BS Computer Science', merit: '84.5%' },
            { dept: 'BS Software Engineering', merit: '82.2%' },
            { dept: 'BE Electrical Engineering', merit: '75.5%' },
            { dept: 'BE Mechanical Engineering', merit: '74.0%' },
            { dept: 'BE Civil Engineering', merit: '72.5%' },
            { dept: 'BE Chemical Engineering', merit: '68.0%' },
            { dept: 'BE Mechatronics', merit: '71.5%' },
            { dept: 'BE Petroleum & Gas', merit: '70.5%' },
            { dept: 'B.Architecture', merit: '76.0%' },
        ],
        testPattern: [
            { subject: 'Mathematics', percentage: 30 },
            { subject: 'Physics', percentage: 30 },
            { subject: 'Chemistry / CS', percentage: 30 },
            { subject: 'English', percentage: 10 }
        ],
        testInfo: {
            testName: 'ECAT (Engineering College Admission Test)',
            duration: '100 Minutes',
            totalMarks: 400,
            negativeMarking: true,
            description: 'ECAT is mandatory for Punjab domicile students. Each correct answer gives 4 marks, while -1 is deducted for each wrong answer.'
        }
    },
    FAST: {
        name: 'FAST',
        fullMeritList: [
            { dept: 'BS Computer Science (ISB)', merit: '78%' },
            { dept: 'BS Software Engineering (ISB)', merit: '75%' },
            { dept: 'BS Artificial Intelligence (ISB)', merit: '74%' },
            { dept: 'BS Computer Science (LHR)', merit: '76%' },
            { dept: 'BS Software Engineering (LHR)', merit: '74%' },
            { dept: 'BS Cyber Security', merit: '72%' },
            { dept: 'BS Data Science', merit: '70%' },
        ],
        testPattern: [
            { subject: 'Basic Math', percentage: 20 },
            { subject: 'Adv Math', percentage: 50 },
            { subject: 'Analytical/IQ', percentage: 20 },
            { subject: 'English', percentage: 10 }
        ],
        testInfo: {
            testName: 'FAST-NU Entrance Test',
            duration: '2 Hours',
            totalMarks: 100,
            negativeMarking: true,
            description: 'FAST Entrance Test is known for being difficult. It has a significant weight on Advanced Mathematics.'
        }
    }
};
