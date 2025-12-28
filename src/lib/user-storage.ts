import { db } from './firebase';
import {
    collection,
    doc,
    setDoc,
    getDocs,
    getDoc,
    updateDoc,
    query,
    where,
    Timestamp
} from 'firebase/firestore';

export interface UserData {
    id: string; // Auth UID or Email for now if using custom auth
    name: string;
    email: string;
    plan: 'Free' | 'Platinum' | 'Diamond';
    joinedAt: string;
    status: 'Active' | 'Inactive';
    amountSpent: number;
}

const COLLECTION_NAME = 'users';

/**
 * Save a new user to Firestore
 */
export const saveUser = async (user: Omit<UserData, 'joinedAt' | 'plan' | 'status' | 'amountSpent'>) => {
    try {
        const userRef = doc(db, COLLECTION_NAME, user.id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const newUser: UserData = {
                ...user,
                plan: 'Free',
                status: 'Active',
                amountSpent: 0,
                joinedAt: new Date().toISOString()
            };
            await setDoc(userRef, newUser);
            return newUser;
        }
        return userSnap.data() as UserData;
    } catch (error) {
        console.error("Error saving user:", error);
        throw error;
    }
};

/**
 * Get all users (Admin use)
 */
export const getUsers = async (): Promise<UserData[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as UserData);
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

/**
 * Subscribe a user to a plan
 */
export const subscribeUser = async (userId: string, plan: 'Platinum' | 'Diamond', price: number) => {
    try {
        const userRef = doc(db, COLLECTION_NAME, userId);
        await updateDoc(userRef, {
            plan: plan,
            amountSpent: price // This is a simple total, in a real app you'd increment or have a transactions collection
        });
    } catch (error) {
        console.error("Error subscribing user:", error);
        throw error;
    }
};
