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
    const DEFAULT_LEDGER_ITEMS = [
        {
            id: 'TXN-9014',
            type: 'DEBIT',
            category: 'CIBIL',
            amount: 50,
            description: 'CIBIL Bureau Pull - Apex Precision Polymers LLP',
            caseId: '1105602',
            date: '2026-10-04 02:15 PM',
            balanceAfter: 8500
        },
        {
            id: 'TXN-9013',
            type: 'DEBIT',
            category: 'BSA',
            amount: 90,
            description: 'Bank Statement Analysis (2 Current A/cs, 12M) - Apex Polymers',
            caseId: '1105602',
            date: '2026-10-04 02:20 PM',
            balanceAfter: 8550
        },
        {
            id: 'TXN-9012',
            type: 'DEBIT',
            category: 'GST',
            amount: 40,
            description: 'GST 3B vs 2A Reconciliation & ITC Verification (12M) - Apex Polymers',
            caseId: '1105602',
            date: '2026-10-03 11:30 AM',
            balanceAfter: 8640
        },
        {
            id: 'TXN-9011',
            type: 'CREDIT',
            category: 'RECHARGE',
            amount: 5000,
            description: 'Instant Wallet Recharge via NetBanking / UPI - Pilot Quota',
            caseId: null,
            date: '2026-10-01 09:00 AM',
            balanceAfter: 8680
        },
        {
            id: 'TXN-8094',
            type: 'DEBIT',
            category: 'CIBIL',
            amount: 50,
            description: 'CIBIL Soft-CIR Consumer Pull - Rohit Sharma (Home Loan)',
            caseId: '1105601',
            date: '2026-09-30 04:10 PM',
            balanceAfter: 3680
        },
        {
            id: 'TXN-8093',
            type: 'DEBIT',
            category: 'BSA',
            amount: 45,
            description: 'Bank Statement Analysis (Salary A/c, 6M) - Rohit Sharma',
            caseId: '1105601',
            date: '2026-09-30 04:15 PM',
            balanceAfter: 3730
        },
        {
            id: 'TXN-8092',
            type: 'DEBIT',
            category: 'BSA',
            amount: 135,
            description: 'Multi-Bank BSA Spreading (3 Accounts, 12M) - Krishna Cold Storage',
            caseId: '1105606',
            date: '2026-09-22 01:45 PM',
            balanceAfter: 3775
        },
        {
            id: 'TXN-8091',
            type: 'DEBIT',
            category: 'CIBIL',
            amount: 50,
            description: 'CIBIL Commercial CIR Pull - Krishna Cold Storage Pvt Ltd',
            caseId: '1105606',
            date: '2026-09-22 01:40 PM',
            balanceAfter: 3910
        },
        {
            id: 'TXN-8090',
            type: 'CREDIT',
            category: 'RECHARGE',
            amount: 2500,
            description: 'Institutional Facilitator Pilot Credit Allocation',
            caseId: null,
            date: '2026-09-15 10:30 AM',
            balanceAfter: 3960
        },
        {
            id: 'TXN-7044',
            type: 'DEBIT',
            category: 'CIBIL',
            amount: 50,
            description: 'CIBIL Bureau Pull - Sterling Auto Components Ltd',
            caseId: '1105608',
            date: '2026-08-28 03:20 PM',
            balanceAfter: 1460
        },
        {
            id: 'TXN-7043',
            type: 'DEBIT',
            category: 'BSA',
            amount: 90,
            description: 'Bank Statement Analysis (2 Accounts, 12M) - Sterling Auto',
            caseId: '1105608',
            date: '2026-08-28 03:25 PM',
            balanceAfter: 1510
        },
        {
            id: 'TXN-7042',
            type: 'DEBIT',
            category: 'GST',
            amount: 60,
            description: 'GST 24M Multi-State Filing Reconciliation - Sterling Auto',
            caseId: '1105608',
            date: '2026-08-27 11:15 AM',
            balanceAfter: 1600
        },
        {
            id: 'TXN-7041',
            type: 'CREDIT',
            category: 'RECHARGE',
            amount: 10000,
            description: 'Initial Institutional Onboarding Grant & Pilot Sandbox Credit',
            caseId: null,
            date: '2026-08-01 10:00 AM',
            balanceAfter: 1660
        }
    ];

    const [walletLedger, setWalletLedger] = useState(DEFAULT_LEDGER_ITEMS);
    const [cases, setCases] = useState(() => {
        try {
            const savedCases = localStorage.getItem(STORAGE_CASES_KEY);
            if (savedCases) {
                const parsed = JSON.parse(savedCases);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) { }
        return INITIAL_LMS_CASES;
    });
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
                const parsed = JSON.parse(savedLedger);
                if (Array.isArray(parsed) && parsed.length >= 6) {
                    setWalletLedger(parsed);
                } else {
                    setWalletLedger(DEFAULT_LEDGER_ITEMS);
                    localStorage.setItem(STORAGE_WALLET_KEY, JSON.stringify(DEFAULT_LEDGER_ITEMS));
                }
            } else {
                localStorage.setItem(STORAGE_WALLET_KEY, JSON.stringify(DEFAULT_LEDGER_ITEMS));
            }
        } catch (e) {
            console.error('Failed to parse partner LMS storage', e);
        }
    }, []);

    // Helper timestamp formatter
    const getFormattedNow = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strHours = String(hours).padStart(2, '0');
        return `${year}-${month}-${day} ${strHours}:${minutes} ${ampm}`;
    };

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
    const deductWallet = (amount, description, category = 'OTHER', caseId = null) => {
        if (walletBalance < amount) {
            return { success: false, message: `Insufficient wallet balance. Required: ₹${amount}, Available: ₹${walletBalance}` };
        }
        const newBalance = walletBalance - amount;
        const newEntry = {
            id: `TXN-${Date.now().toString().slice(-6)}`,
            type: 'DEBIT',
            category,
            amount,
            description,
            caseId,
            date: getFormattedNow(),
            balanceAfter: newBalance
        };
        const updatedLedger = [newEntry, ...walletLedger];
        persistWallet(newBalance, updatedLedger);
        return { success: true, newBalance };
    };

    const topUpWallet = (amount, note = 'Instant Wallet Recharge via NetBanking / UPI') => {
        const newBalance = walletBalance + Number(amount);
        const newEntry = {
            id: `TXN-${Date.now().toString().slice(-6)}`,
            type: 'CREDIT',
            category: 'RECHARGE',
            amount: Number(amount),
            description: note,
            caseId: null,
            date: getFormattedNow(),
            balanceAfter: newBalance
        };
        const updatedLedger = [newEntry, ...walletLedger];
        persistWallet(newBalance, updatedLedger);
        return { success: true, newBalance };
    };

    // Case operations
    const getCaseById = (id) => {
        if (!id) return null;
        const found = cases.find(c => String(c.id) === String(id));
        if (found) return found;

        // Dynamic fallback case generator for custom direct URLs (like #6823530)
        return {
            id: String(id),
            ackNo: `ACKNO2026${String(id)}`,
            submissionDate: '04/10/2026',
            enterpriseName: 'Rajesh Kumar Sharma (Personal Loan)',
            applicantName: 'Rajesh Kumar Sharma',
            constitution: 'Individual (Salaried)',
            entityType: 'INDIVIDUAL_SALARIED',
            borrowerNiche: 'SALARIED',
            pan: 'REAPS3419L',
            yearsOfOperation: 'Salaried (9+ Years)',
            industry: 'IT & Software Services',
            loanProduct: 'PL',
            loanType: 'Instant Unsecured Personal Loan',
            loanAmountLakhs: 25.0,
            loanAmountFormatted: '₹25.00 Lakhs',
            monthlySalaryFormatted: '₹1.55 L/mo',
            monthlyNetSalary: 155000,
            targetLender: 'Axis Bank (Retail Lending Desk)',
            status: 'UNDER_REVIEW',
            scorecard: 82,
            cibilScore: 765,
            contactEmail: 'rajesh.sharma@tcs.com',
            contactMobile: '9811029381',
            registeredOffice: 'Flat 804, Tower B, Supertech Emerald Court, Sector 93A, Noida, UP - 201304',
            foir: 42.8,
            salariedDetails: {
                employerName: 'Tata Consultancy Services Limited',
                employerCategory: 'Category A / Listed Super-Prime MNC',
                designation: 'Lead Solutions Architect',
                totalWorkExperienceYears: 9,
                currentCompanyVintageYears: 4,
                officeAddress: 'TCS Tech Ridge, Sector 135, Expressway, Noida, UP - 201305',
                officialEmail: 'rajesh.sharma@tcs.com',
                monthlyGross: 183000,
                monthlyNet: 155000,
                existingEMIs: 25000,
                proposedEMI: 42000
            },
            bankAccounts: [
                { bankName: 'HDFC Bank Ltd', accountNo: 'XXXXXX9482', type: 'Salary Account', bsaRun: true, abb: '₹1.15 Lakhs', bounces: 0 }
            ],
            promoters: [
                { name: 'Rajesh Kumar Sharma', pan: 'REAPS3419L', designation: 'Primary Applicant', shareholding: 100.0, mobile: '9811029381' }
            ],
            redFlags: []
        };
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

    const deleteCase = (id) => {
        const updated = cases.filter(c => c.id !== id && c.id !== String(id));
        persistCases(updated);
        return true;
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
            updateCase,
            deleteCase,
            setPartnerProfile
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
