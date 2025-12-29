import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Create User
export const createUserWithEmailOnly = async (email: string, pass: string, name: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        if (user) {
            // 1. Update Auth Profile
            await updateProfile(user, { displayName: name });

            // 2. Create User Document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: name,
                points: 100, // Initial points
                createdAt: serverTimestamp(),
                profileCompleted: false
            });
        }
        return user;
    } catch (error) {
        console.log("Signup Error Log:", (error as any).message);
        throw error;
    }
};

// Login User
export const loginWithEmail = async (email: string, pass: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return userCredential.user;
    } catch (error) {
        console.log("Login Error Log:", (error as any).message);
        throw error;
    }
};

// Logout
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.log("Logout Error Log:", (error as any).message);
        throw error;
    }
};
