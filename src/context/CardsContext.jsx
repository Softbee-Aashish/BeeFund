import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialCards from '../data/creditCards.json';
import starterCards from '../data/sampleCreditCardsTemplate.json';

const CardsContext = createContext();

const STORAGE_KEY = 'beefund_credit_cards_v3';
const SHEET_URL_KEY = 'beefund_sheet_url';

export const CardsProvider = ({ children }) => {
    // Initialize cards from localStorage or fallback to initialCards
    const [cards, setCards] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved !== null) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Failed to parse saved credit cards:', e);
        }
        return Array.isArray(initialCards) ? initialCards : [];
    });

    // Google Sheets integration state (shares with BlogContext)
    const [sheetUrl, setSheetUrlState] = useState(() => {
        return localStorage.getItem(SHEET_URL_KEY) || import.meta.env.VITE_GOOGLE_SHEET_URL || '';
    });
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState(null); // { state: 'idle'|'syncing'|'success'|'error', message, time }

    // Persist cards whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
        } catch (e) {
            console.error('Failed to persist credit cards to localStorage:', e);
        }
    }, [cards]);

    const setSheetUrl = useCallback((url) => {
        setSheetUrlState(url);
        try {
            localStorage.setItem(SHEET_URL_KEY, url);
        } catch (e) {
            console.error('Failed to save sheetUrl:', e);
        }
    }, []);

    // Filter active cards for public visitors
    const activeCards = cards.filter(card => card.status === 'active');

    // Create a new credit card
    const createCard = (cardData) => {
        const newCard = {
            id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: cardData.name || 'New Credit Card',
            bank: cardData.bank || 'Partner Bank',
            category: cardData.category || 'Cashback',
            badge: cardData.badge || '',
            imageUrl: cardData.imageUrl || '',
            rating: cardData.rating || '4.8',
            joiningFee: cardData.joiningFee || '₹0',
            annualFee: cardData.annualFee || '₹0',
            tagline: cardData.tagline || '',
            description: cardData.description || '',
            benefits: Array.isArray(cardData.benefits) ? cardData.benefits : [],
            features: Array.isArray(cardData.features) ? cardData.features : [],
            applyLink: cardData.applyLink || 'https://www.beefund.in/apply',
            docUrl: cardData.docUrl || '',
            docName: cardData.docName || '',
            status: cardData.status || 'active',
            updatedAt: new Date().toISOString()
        };

        setCards(prev => [newCard, ...prev]);
        return newCard;
    };

    // Update existing card
    const updateCard = (id, updatedFields) => {
        setCards(prev => prev.map(card => {
            if (card.id === id) {
                return {
                    ...card,
                    ...updatedFields,
                    updatedAt: new Date().toISOString()
                };
            }
            return card;
        }));
    };

    // Delete a card
    const deleteCard = (id) => {
        setCards(prev => prev.filter(card => card.id !== id));
    };

    // Toggle active / inactive
    const toggleCardActive = (id) => {
        setCards(prev => prev.map(card => {
            if (card.id === id) {
                return {
                    ...card,
                    status: card.status === 'active' ? 'inactive' : 'active',
                    updatedAt: new Date().toISOString()
                };
            }
            return card;
        }));
    };

    // Duplicate card for quick templating
    const duplicateCard = (id) => {
        const source = cards.find(c => c.id === id);
        if (!source) return;

        const clone = {
            ...source,
            id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: `${source.name} (Copy)`,
            status: 'inactive',
            updatedAt: new Date().toISOString()
        };

        setCards(prev => [clone, ...prev]);
        return clone;
    };

    // Reset to defaults (empty list)
    const resetCardsToDefaults = () => {
        setCards([]);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        } catch (e) {
            console.error('Failed clearing cards:', e);
        }
    };

    // Load starter sample templates if admin chooses to explore
    const loadStarterTemplates = () => {
        const templates = Array.isArray(starterCards) ? starterCards : [];
        setCards(templates);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        } catch (e) {
            console.error('Failed saving template cards:', e);
        }
    };

    // Export JSON
    const exportCardsJson = () => {
        const jsonStr = JSON.stringify(cards, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `creditCards-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Google Sheets Push / Pull for Cards
    const pushCardsToSheet = useCallback(async (targetUrl = sheetUrl) => {
        const urlToUse = targetUrl || sheetUrl;
        if (!urlToUse) {
            return { success: false, message: 'Google Sheet Web App URL is not configured.' };
        }

        setIsSyncing(true);
        setSyncStatus({ state: 'syncing', message: 'Syncing credit cards to Google Sheet...', time: new Date() });

        try {
            await fetch(urlToUse, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'syncCards',
                    cards: cards
                })
            });

            setSyncStatus({
                state: 'success',
                message: `Successfully synchronized ${cards.length} credit cards with Google Sheet!`,
                time: new Date()
            });
            return { success: true };
        } catch (err) {
            console.error('Cards Sheet sync error:', err);
            setSyncStatus({
                state: 'error',
                message: `Sync failed: ${err.message}`,
                time: new Date()
            });
            return { success: false, error: err.message };
        } finally {
            setIsSyncing(false);
        }
    }, [sheetUrl, cards]);

    const fetchCardsFromSheet = useCallback(async (targetUrl = sheetUrl) => {
        const urlToUse = targetUrl || sheetUrl;
        if (!urlToUse) {
            return { success: false, message: 'Google Sheet Web App URL is not configured.' };
        }

        setIsSyncing(true);
        setSyncStatus({ state: 'syncing', message: 'Fetching credit cards from Google Sheet...', time: new Date() });

        try {
            const res = await fetch(`${urlToUse}?action=get_cards`, { method: 'GET' });
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data = await res.json();

            if (data && data.success && Array.isArray(data.cards) && data.cards.length > 0) {
                setCards(data.cards);
                setSyncStatus({
                    state: 'success',
                    message: `Loaded ${data.cards.length} cards from Google Sheet!`,
                    time: new Date()
                });
                return { success: true, count: data.cards.length };
            } else {
                throw new Error(data?.error || 'No cards array returned from sheet');
            }
        } catch (err) {
            console.error('Fetch cards error:', err);
            setSyncStatus({
                state: 'error',
                message: `Failed to fetch cards: ${err.message}`,
                time: new Date()
            });
            return { success: false, error: err.message };
        } finally {
            setIsSyncing(false);
        }
    }, [sheetUrl]);

    return (
        <CardsContext.Provider value={{
            cards,
            activeCards,
            createCard,
            updateCard,
            deleteCard,
            toggleCardActive,
            duplicateCard,
            resetCardsToDefaults,
            loadStarterTemplates,
            exportCardsJson,
            sheetUrl,
            setSheetUrl,
            isSyncing,
            syncStatus,
            pushCardsToSheet,
            fetchCardsFromSheet
        }}>
            {children}
        </CardsContext.Provider>
    );
};

export const useCards = () => {
    const context = useContext(CardsContext);
    if (!context) {
        throw new Error('useCards must be used within a CardsProvider');
    }
    return context;
};
