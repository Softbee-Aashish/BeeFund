import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    PARTNER_LMS_CREDENTIALS,
    DEFAULT_PARTNER_PROFILE,
    INITIAL_LMS_CASES,
    LMS_PRICING_MATRIX
} from './lmsData';

const PartnerLMSAuthContext = createContext(null);

const STORAGE_SESSION_KEY = 'beefund_partner_lms_session';
const STORAGE_CASES_KEY = 'beefund_partner_lms_cases';
const STORAGE_WALLET_KEY = 'beefund_partner_lms_wallet_ledger';

export const PartnerLMSAuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [partnerProfile, setPartnerProfile] = useState(DEFAULT_PARTNER_PROFILE);
    const [walletBalance, setWalletBalance] = useState(DEFAULT_PARTNER_PROFILE.walletBalance);
    const [walletLedger, setWalletLedger] = useState([
        {
            id: 'TXN-001',
            type: 'CREDIT',
            amount: 10000,
            description: 'Initial Institutional Grant & Pilot Allocation',
            date: '2026-09-01 10:00 AM',
            balanceAfter: 10000
        },
        {
            id: 'TXN-002',
            type: 'DEBIT',
            amount: 50,
            description: 'CIBIL Bureau Pull - Ambesten Packagings',
            date: '2026-09-29 02:15 PM',
            balanceAfter: 9950
        },
        {
            id: 'TXN-003',
            type: 'DEBIT',
            amount: 90,
            description: 'Bank Statement Analysis (2 Accounts, 12M) - Ambesten',
            date: '2026-09-29 02:20 PM',
            balanceAfter: 9860
        }
    ]);
    const [cases, setCases] = useState(INITIAL_LMS_CASES);
    const [authError, setAuthError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Hydrate from localStorage
    useEffect(() => {
        try {
            const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
            if (savedSession) {
                const parsed = JSON.parse(savedSession);
                if (parsed.authenticated) {
                    setIsAuthenticated(true);
                    if (parsed.profile) setPartnerProfile(parsed.profile);
                    if (parsed.balance !== undefined) setWalletBalance(parsed.balance);
                }
            }

            const savedCases = localStorage.getItem(STORAGE_CASES_KEY);
            if (savedCases) {
                setCases(JSON.parse(savedCases));
            }

            const savedLedger = localStorage.getItem(STORAGE_WALLET_KEY);
            if (savedLedger) {
                setWalletLedger(JSON.parse(savedLedger));
            }
        } catch (e) {
            console.error('Failed to parse partner LMS storage', e);
        }
    }, []);

    // Save state changes
    const persistCases = (updatedCases) => {
        setCases(updatedCases);
        try {
            localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(updatedCases));
        } catch (e) { }
    };

    const persistWallet = (newBalance, newLedger) => {
        setWalletBalance(newBalance);
        setWalletLedger(newLedger);
        try {
            localStorage.setItem(STORAGE_WALLET_KEY, JSON.stringify(newLedger));
            const session = JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY) || '{}');
            session.balance = newBalance;
            localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
        } catch (e) { }
    };

    // Authentication Login
    const login = async (email, password) => {
        setIsLoading(true);
        setAuthError('');
        await new Promise(r => setTimeout(r, 600));

        const userNormalized = (email || '').trim().toLowerCase();
        const passNormalized = (password || '').trim();

        if (
            (userNormalized === PARTNER_LMS_CREDENTIALS.email.toLowerCase() && passNormalized === PARTNER_LMS_CREDENTIALS.password) ||
            (userNormalized === 'dsa@beefund.in' && passNormalized.length >= 6)
        ) {
            setIsAuthenticated(true);
            const sess = {
                authenticated: true,
                profile: DEFAULT_PARTNER_PROFILE,
                balance: walletBalance
            };
            localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sess));
            setIsLoading(false);
            return { success: true };
        } else {
            setAuthError('Invalid Partner ID / Email or Password. Use demo credentials.');
            setIsLoading(false);
            return { success: false };
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem(STORAGE_SESSION_KEY);
    };

    // Wallet Deductions
    const deductWallet = (amount, description) => {
        if (walletBalance < amount) {
            return { success: false, message: `Insufficient wallet balance. Required: ₹${amount}, Available: ₹${walletBalance}` };
        }
        const newBalance = walletBalance - amount;
        const newEntry = {
            id: `TXN-${Date.now().toString().slice(-6)}`,
            type: 'DEBIT',
            amount,
            description,
            date: new Date().toLocaleString(),
            balanceAfter: newBalance
        };
        const updatedLedger = [newEntry, ...walletLedger];
        persistWallet(newBalance, updatedLedger);
        return { success: true, newBalance };
    };

    const topUpWallet = (amount, note = 'Admin Top-Up Allocation') => {
        const newBalance = walletBalance + amount;
        const newEntry = {
            id: `TXN-${Date.now().toString().slice(-6)}`,
            type: 'CREDIT',
            amount,
            description: note,
            date: new Date().toLocaleString(),
            balanceAfter: newBalance
        };
        const updatedLedger = [newEntry, ...walletLedger];
        persistWallet(newBalance, updatedLedger);
        return { success: true, newBalance };
    };

    // Case operations
    const getCaseById = (id) => {
        return cases.find(c => c.id === id || c.id === String(id)) || null;
    };

    const createCase = (newCaseData) => {
        const generatedId = Date.now().toString().slice(-7);
        const fullCase = {
            id: generatedId,
            ackNo: `ACKNO2026${Date.now().toString().slice(-8)}`,
            submissionDate: new Date().toLocaleDateString('en-GB'),
            status: 'SUBMITTED',
            scorecard: 82,
            cibilScore: 740,
            ...newCaseData
        };
        const updated = [fullCase, ...cases];
        persistCases(updated);
        return fullCase;
    };

    const updateCase = (id, updatedFields) => {
        const updated = cases.map(c => c.id === id ? { ...c, ...updatedFields, updatedAt: new Date().toISOString() } : c);
        persistCases(updated);
        return updated.find(c => c.id === id);
    };

    return (
        <PartnerLMSAuthContext.Provider value={{
            isAuthenticated,
            partnerProfile,
            walletBalance,
            walletLedger,
            cases,
            authError,
            isLoading,
            pricingMatrix: LMS_PRICING_MATRIX,
            login,
            logout,
            deductWallet,
            topUpWallet,
            getCaseById,
            createCase,
            updateCase
        }}>
            {children}
        </PartnerLMSAuthContext.Provider>
    );
};

export const usePartnerLMS = () => {
    const ctx = useContext(PartnerLMSAuthContext);
    if (!ctx) throw new Error('usePartnerLMS must be used within PartnerLMSAuthProvider');
    return ctx;
};
