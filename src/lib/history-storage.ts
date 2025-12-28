/**
 * History Storage Utilities
 * Handles saving and retrieving user activity history in Firestore
 */

import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
    deleteDoc
} from 'firebase/firestore';

const COLLECTION_NAME = 'history';

export interface HistoryItem {
    id: string;
    action: string;
    portfolio?: string;
    timestamp: string;
    type: 'create' | 'edit' | 'view' | 'profile';
}

/**
 * Get history items from Firestore
 */
export const getHistory = async (): Promise<HistoryItem[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy('timestamp', 'desc'),
            limit(50)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as HistoryItem));
    } catch (error) {
        console.error('Error reading history from storage:', error);
        return [];
    }
};

/**
 * Add a new history item to Firestore
 */
export const addHistoryItem = async (
    action: string,
    type: HistoryItem['type'],
    portfolioName?: string
) => {
    const newItem = {
        action,
        type,
        portfolio: portfolioName,
        timestamp: new Date().toISOString(),
    };

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), newItem);
        return {
            id: docRef.id,
            ...newItem
        } as HistoryItem;
    } catch (error) {
        console.error("Error adding history item:", error);
        return null;
    }
};

/**
 * Clear all history (Optional: strictly might be expensive to delete all documents one by one in client SDK)
 * For now we will just log a warning or arguably implement batch delete if needed.
 */
export const clearHistory = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME));
        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error clearing history:", error);
    }
};
