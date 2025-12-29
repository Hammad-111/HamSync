import { db, auth } from "./firebaseConfig";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    educationLevel: string;
    university?: string; // or School Name
    skills: string[];
    points: number;
    profileCompleted: boolean;
    createdAt?: any;
    updatedAt?: any;
}

// Calculate Profile Score
export const calculateProfileScore = (educationLevel: string, university: string, skills: string[]): number => {
    let score = 100; // Base score for signing up

    if (educationLevel) score += 50;
    if (university) score += 30;

    // Cap skills score at 500
    const skillsScore = Math.min(skills.length * 10, 500);
    score += skillsScore;

    return score;
};

// Save User Profile
export const saveUserProfile = async (data: Partial<UserProfile>) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found");

    const userRef = doc(db, "users", user.uid);
    const score = calculateProfileScore(
        data.educationLevel || "",
        data.university || "",
        data.skills || []
    );

    const profileData = {
        ...data,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        points: score,
        profileCompleted: true,
        updatedAt: serverTimestamp(),
    };

    try {
        // Use setDoc with merge: true to update or create
        await setDoc(userRef, profileData, { merge: true });
        console.log("Profile saved successfully. Score:", score);
        return score;
    } catch (error: any) {
        console.log("Error saving profile:", error.message);
        throw error;
    }
};

// Get User Profile
export const getUserProfile = async (uid: string) => {
    try {
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error: any) {
        console.log("Error getting document:", error.message);
        return null;
    }
};
