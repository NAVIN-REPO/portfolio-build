/**
 * Portfolio Storage Utilities
 * Handles saving, loading, and managing portfolios in Firestore
 */

import { SavedPortfolio } from '@/data/templates';
import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  increment
} from 'firebase/firestore';

const COLLECTION_NAME = 'portfolios';

/**
 * Generate a unique ID for portfolios and share links
 * Similar to YouTube video IDs (11 chars, alphanumeric)
 * Note: Firestore generates its own IDs, but we can still use this for shareLinks 
 * or just use the Firestore ID. For now, we'll keep it for the shareLink.
 */
export const generateUniqueId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate a shareable link for a portfolio
 */
export const generateShareLink = (portfolioId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/portfolio/${portfolioId}`;
};

/**
 * Get all saved portfolios from Firestore
 */
export const getSavedPortfolios = async (): Promise<SavedPortfolio[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SavedPortfolio));
  } catch (error) {
    console.error('Error reading portfolios from storage:', error);
    return [];
  }
};

/**
 * Save a portfolio to Firestore
 */
export const savePortfolio = async (portfolio: Omit<SavedPortfolio, 'id' | 'createdAt' | 'shareLink' | 'isPublic' | 'views' | 'visitors'>): Promise<SavedPortfolio> => {
  const shareId = generateUniqueId();

  const newPortfolioData = {
    ...portfolio,
    createdAt: new Date().toISOString(),
    shareLink: generateShareLink(shareId), // Temporarily use shareId, strictly we might want to use doc.id later
    isPublic: false,
    views: 0,
    visitors: 0,
    shareId: shareId // Store the share ID explicitly if needed
  };

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newPortfolioData);

    // If we want the shareLink to use the Firestore ID, we would update it here, 
    // but effectively we can use the shareId we generated.

    return {
      id: docRef.id,
      ...newPortfolioData
    } as SavedPortfolio;
  } catch (error) {
    console.error("Error saving portfolio: ", error);
    throw error;
  }
};

/**
 * Update an existing portfolio
 */
export const updatePortfolio = async (id: string, updates: Partial<SavedPortfolio>): Promise<void> => {
  try {
    const portfolioRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(portfolioRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating portfolio: ", error);
    throw error;
  }
};

/**
 * Get a single portfolio by ID
 */
export const getPortfolioById = async (id: string): Promise<SavedPortfolio | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SavedPortfolio;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting portfolio:", error);
    return null;
  }
};

/**
 * Delete a portfolio
 */
export const deletePortfolio = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    throw error;
  }
};

/**
 * Increment view count for a portfolio
 */
export const incrementPortfolioView = async (id: string): Promise<void> => {
  try {
    const portfolioRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(portfolioRef, {
      views: increment(1),
      visitors: increment(1) // Simple tracking
    });
  } catch (error) {
    console.error("Error incrementing view:", error);
  }
};

