import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePartnerLMS } from './PartnerLMSAuthContext';
import { useTheme } from '../../context/ThemeContext';
import LeadCategoryModal from './LeadCategoryModal';
import PartnerThemeToggle from './components/PartnerThemeToggle';
import './PartnerLMSDashboard.css';

const STATUS_BADGES = {
    DRAFT: { label: 'Draft / Incomplete', color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' },
    SUBMITTED: { label: 'Proposal Submitted', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    UNDER_REVIEW: { label: 'Underwriting Review', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    SANCTIONED: { label: 'Sanction Letter Issued', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    DISBURSED: { label: 'Disbursed', color: '#059669', bg: 'rgba(5, 150, 105, 0.15)' },
    QUERIED: { label: 'Bank Query Raised', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' }
};

const DEFAULT_EMPANELED_BANKS = [
    {
        id: 'pol-sbi',
        name: 'State Bank of India',
        code: 'SBI',
        type: 'PSU Bank',
        maxTicket: '₹100 Cr',
        minCibil: '700+',
        avgSLA: '4-6 Days',
        rating: 'AAA',
        interestRate: '8.35% – 10.25%',
        products: 'MSME Term Loan, OD/CC, Capex, LAP, CGTMSE, Green Finance',
        keyPolicies: 'DSCR ≥ 1.25x • TOL/TNW ≤ 4.0x • LTV up to 75% • CGTMSE up to ₹5 Cr without collateral',
        bestFor: 'Large Capex, Greenfield Project Funding & Subsidized MSME Schemes',
        contactDesk: 'National MSME Committee Desk'
    },
    {
        id: 'pol-hdfc',
        name: 'HDFC Bank',
        code: 'HDFC',
        type: 'Private Commercial',
        maxTicket: '₹50 Cr',
        minCibil: '720+',
        avgSLA: '3-5 Days',
        rating: 'AAA',
        interestRate: '8.75% – 11.50%',
        products: 'Working Capital, Business Loan, Bill Discounting, Home Loan, LAP',
        keyPolicies: '12M GST Banking Regularity • FOIR up to 65% • Multi-account BSA automated rule pass',
        bestFor: 'Supply Chain Cash Flows, Fast Working Capital & Salaried High-Ticket Mortgages',
        contactDesk: 'Corporate & Wholesale SME Cell'
    },
    {
        id: 'pol-icici',
        name: 'ICICI Bank',
        code: 'ICICI',
        type: 'Private Commercial',
        maxTicket: '₹75 Cr',
        minCibil: '710+',
        avgSLA: '3-4 Days',
        rating: 'AAA',
        interestRate: '8.85% – 11.75%',
        products: 'Supply Chain, Term Loan, Machinery Loan, Cash Credit, Export Finance',
        keyPolicies: 'DSCR ≥ 1.30x • Equipment Hypothecation • LTV 65-70% on Commercial Real Estate',
        bestFor: 'Machinery Procurement, Import/Export Trade Finance & Fast-Track BL',
        contactDesk: 'Zonal SME Credit Desk'
    },
    {
        id: 'pol-bob',
        name: 'Bank of Baroda',
        code: 'BOB',
        type: 'PSU Bank',
        maxTicket: '₹60 Cr',
        minCibil: '700+',
        avgSLA: '5-7 Days',
        rating: 'AA+',
        interestRate: '8.45% – 10.50%',
        products: 'MSME Project Finance, CGTMSE, Mortgage LAP, Rupee Term Loan',
        keyPolicies: 'TEV / DPR Clearance for Project Loans • Nayak Committee MPBF Method II for OD/CC',
        bestFor: 'MSME Cluster Projects, Industrial Sheds & Government Subsidies',
        contactDesk: 'MSME Hub Credit Operations'
    },
    {
        id: 'pol-pnb',
        name: 'Punjab National Bank',
        code: 'PNB',
        type: 'PSU Bank',
        maxTicket: '₹50 Cr',
        minCibil: '690+',
        avgSLA: '5-7 Days',
        rating: 'AA+',
        interestRate: '8.50% – 10.60%',
        products: 'Working Capital, Capex Term Loan, Food Processing & Agro MSME',
        keyPolicies: 'TOL/TNW ≤ 4.5x • Stock & Book Debts Hypothecation with 25% margin',
        bestFor: 'Agro-processing, Traders & Traditional Manufacturing Units',
        contactDesk: 'Zonal Commercial Credit Hub'
    },
    {
        id: 'pol-sidbi',
        name: 'SIDBI (Direct MSME Desk)',
        code: 'SIDBI',
        type: 'Specialized Institutional / DFI',
        maxTicket: '₹35 Cr',
        minCibil: '680+',
        avgSLA: '3-5 Days',
        rating: 'AAA',
        interestRate: '7.80% – 9.90%',
        products: 'Machinery Hypothecation, Energy Efficiency Capex, 4E Scheme, MSME Term',
        keyPolicies: 'Direct OEM invoice financing • Subsidized interest for Green Energy & Women Promoters',
        bestFor: 'Machinery Acquisition, Solar Rooftop Capex & 100% EOU MSMEs',
        contactDesk: 'Direct Credit Vertical • Green MSME Window'
    },
    {
        id: 'pol-kotak',
        name: 'Kotak Mahindra Bank',
        code: 'KOTAK',
        type: 'Private Commercial',
        maxTicket: '₹40 Cr',
        minCibil: '730+',
        avgSLA: '2-4 Days',
        rating: 'AAA',
        interestRate: '9.25% – 12.00%',
        products: 'Doctor/CA Loans, LAP, Unsecured Business, Commercial Real Estate',
        keyPolicies: 'No formal financials required for Doctor/CA SURGE program • LTV up to 70%',
        bestFor: 'Self-Employed Professionals (Doctors, CAs, Architects) & Fast-track LAP',
        contactDesk: 'Emerging Business Division'
    },
    {
        id: 'pol-axis',
        name: 'Axis Bank',
        code: 'AXIS',
        type: 'Private Commercial',
        maxTicket: '₹45 Cr',
        minCibil: '715+',
        avgSLA: '3-5 Days',
        rating: 'AA+',
        interestRate: '8.90% – 11.80%',
        products: 'Commercial Real Estate, Working Capital, Unsecured MSME, Home Loan',
        keyPolicies: 'FOIR 60-65% • 12M Banking ABB Multiplier • SARFAESI enforceable title only',
        bestFor: 'Commercial Mortgages, Retail Mortgages & Revolving Credit Lines',
        contactDesk: 'Commercial Banking Operations'
    },
    {
        id: 'pol-tata',
        name: 'Tata Capital Financial Services',
        code: 'TATA',
        type: 'NBFC (Upper Layer)',
        maxTicket: '₹30 Cr',
        minCibil: '700+',
        avgSLA: '2-3 Days',
        rating: 'AAA',
        interestRate: '9.50% – 13.00%',
        products: 'Machinery Hypothecation, LAP, Bill Sizing, Unsecured Growth Loans',
        keyPolicies: 'Instant In-principle Sanction in 24h • Flexible repayment moratorium on machinery',
        bestFor: 'High-speed Machinery Lease/Loans & Short-term Capex Expansion',
        contactDesk: 'Corporate Lending Desk'
    },
    {
        id: 'pol-bajaj',
        name: 'Bajaj Finserv Ltd',
        code: 'BAJAJ',
        type: 'NBFC (Upper Layer)',
        maxTicket: '₹25 Cr',
        minCibil: '720+',
        avgSLA: '24-48 Hrs',
        rating: 'AAA',
        interestRate: '10.00% – 14.50%',
        products: 'Instant Professional Loans, MSME Fast-track, Dropline OD, Working Capital',
        keyPolicies: 'Digital API Ingestion • Zero physical visit for soft sanction • Quick Disbursal SLA',
        bestFor: 'Urgent Liquidity Needs, Working Capital Dropline OD & SENP Unsecured',
        contactDesk: 'Digital Enterprise Lending Group'
    },
    {
        id: 'pol-piramal',
        name: 'Piramal Capital & Housing Finance',
        code: 'PIRAMAL',
        type: 'NBFC (Upper Layer)',
        maxTicket: '₹20 Cr',
        minCibil: '680+',
        avgSLA: '3-4 Days',
        rating: 'AA',
        interestRate: '9.75% – 13.50%',
        products: 'Affordable Housing, LAP, Small Business Loans, Construction Finance',
        keyPolicies: 'Flexible income surrogate assessment • Cash flow & surrogate GSTR estimation',
        bestFor: 'Tier 2/3 MSMEs, Non-standard Income Surrogates & LAP',
        contactDesk: 'Retail & MSME Lending Desk'
    },
    {
        id: 'pol-hero',
        name: 'Hero FinCorp',
        code: 'HERO',
        type: 'NBFC (Upper Layer)',
        maxTicket: '₹15 Cr',
        minCibil: '690+',
        avgSLA: '2-3 Days',
        rating: 'AA+',
        interestRate: '10.25% – 14.00%',
        products: 'Used/New Commercial Vehicle, Auto Fleet, MSME LAP, Equipment',
        keyPolicies: 'RTO Hypothecation • Fleet operator income assessment • Quick asset verification',
        bestFor: 'Commercial Fleet Operators, Logistics MSMEs & Used Equipment Finance',
        contactDesk: 'Commercial Vehicle & MSME Desk'
    }
];

const PartnerLMSDashboard = () => {
    const navigate = useNavigate();
    const {
        isAuthenticated,
        partnerProfile,
        walletBalance,
        walletLedger,
        cases,
        logout,
        topUpWallet,
        deleteCase
    } = usePartnerLMS();

    const { isDark } = useTheme();

    const [activeNav, setActiveNav] = useState('cases'); // 'cases' | 'analytics' | 'lenders'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState(500);
    const [caseToDelete, setCaseToDelete] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    // Bank Credit Policy Management State
    const [lenderPolicies, setLenderPolicies] = useState(() => {
        try {
            const saved = localStorage.getItem('beefund_partner_lms_lender_policies');
            if (saved) return JSON.parse(saved);
        } catch { }
        return DEFAULT_EMPANELED_BANKS;
    });

    const [lenderCategoryFilter, setLenderCategoryFilter] = useState('ALL'); // ALL | PSU | PRIVATE | NBFC | DFI
    const [lenderProductFilter, setLenderProductFilter] = useState('ALL');
    const [lenderSearchTerm, setLenderSearchTerm] = useState('');
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [policyModalMode, setPolicyModalMode] = useState('CREATE'); // 'CREATE' | 'EDIT'
    const [policyFormData, setPolicyFormData] = useState({
        id: '',
        name: '',
        code: '',
        type: 'PSU Bank',
        maxTicket: '₹50 Cr',
        minCibil: '700+',
        avgSLA: '3-5 Days',
        rating: 'AAA',
        interestRate: '8.50% – 10.75%',
        products: '',
        keyPolicies: '',
        bestFor: '',
        contactDesk: ''
    });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        try {
            return localStorage.getItem('beefund_lms_sidebar_collapsed') === 'true';
        } catch {
            return false;
        }
    });

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => {
            const next = !prev;
            try {
                localStorage.setItem('beefund_lms_sidebar_collapsed', String(next));
            } catch (e) { }
            return next;
        });
    };

    // Open Policy Modal for Add
    const handleOpenCreatePolicy = () => {
        setPolicyModalMode('CREATE');
        setPolicyFormData({
            id: `pol-custom-${Date.now().toString().slice(-4)}`,
            name: '',
            code: '',
            type: 'PSU Bank',
            maxTicket: '₹50 Cr',
            minCibil: '700+',
            avgSLA: '3-5 Days',
            rating: 'AAA',
            interestRate: '8.50% – 10.75%',
            products: 'MSME Term Loan, OD/CC, Capex, LAP',
            keyPolicies: 'DSCR ≥ 1.25x • TOL/TNW ≤ 4.0x • LTV up to 70%',
            bestFor: 'Manufacturing & Commercial MSMEs',
            contactDesk: 'Zonal Credit Processing Cell'
        });
        setIsPolicyModalOpen(true);
    };

    // Open Policy Modal for Edit
    const handleOpenEditPolicy = (policy) => {
        setPolicyModalMode('EDIT');
        setPolicyFormData({ ...policy });
        setIsPolicyModalOpen(true);
    };

    // Save Policy (Create or Update)
    const handleSavePolicy = (e) => {
        e.preventDefault();
        if (!policyFormData.name.trim() || !policyFormData.code.trim()) {
            alert('Please provide Bank/Institution Name and Code.');
            return;
        }

        let updatedList;
        if (policyModalMode === 'CREATE') {
            const newPolicy = {
                ...policyFormData,
                id: policyFormData.id || `pol-custom-${Date.now()}`
            };
            updatedList = [newPolicy, ...lenderPolicies];
            setToastMessage(`Credit policy for ${newPolicy.name} added successfully.`);
        } else {
            updatedList = lenderPolicies.map(p => p.id === policyFormData.id ? { ...policyFormData } : p);
            setToastMessage(`Credit policy for ${policyFormData.name} updated successfully.`);
        }

        setLenderPolicies(updatedList);
        try {
            localStorage.setItem('beefund_partner_lms_lender_policies', JSON.stringify(updatedList));
        } catch { }

        setIsPolicyModalOpen(false);
        setTimeout(() => setToastMessage(''), 4000);
    };

    // Delete Policy
    const handleDeletePolicy = (policyId, policyName) => {
        if (window.confirm(`Are you sure you want to remove the credit policy for "${policyName}"?`)) {
            const updated = lenderPolicies.filter(p => p.id !== policyId);
            setLenderPolicies(updated);
            try {
                localStorage.setItem('beefund_partner_lms_lender_policies', JSON.stringify(updated));
            } catch { }
            setToastMessage(`Policy for ${policyName} removed.`);
            setTimeout(() => setToastMessage(''), 4000);
        }
    };

    // Reset to Default Policies
    const handleResetDefaultPolicies = () => {
        if (window.confirm('Reset all bank credit policies to institutional factory defaults? Any custom added policies will be reset.')) {
            setLenderPolicies(DEFAULT_EMPANELED_BANKS);
            try {
                localStorage.setItem('beefund_partner_lms_lender_policies', JSON.stringify(DEFAULT_EMPANELED_BANKS));
            } catch { }
            setToastMessage('Bank credit policies reset to institutional defaults.');
            setTimeout(() => setToastMessage(''), 4000);
        }
    };

    // Route a new case directly with this bank
    const handleRouteCaseToBank = (bank) => {
        setIsLeadModalOpen(false);
        navigate('/partnerLMS/case/new', {
            state: {
                targetLender: `${bank.name} (${bank.code})`,
                loanProduct: 'BL',
                loanType: 'Business Loan (BL)',
                entityType: 'PROPRIETORSHIP',
                borrowerNiche: 'SENP',
                loanAmountLakhs: 50.0
            }
        });
    };

    // Filtered Lender Policies
    const filteredLenderPolicies = useMemo(() => {
        return lenderPolicies.filter(p => {
            // Category Segment filter
            let matchesCategory = true;
            if (lenderCategoryFilter === 'PSU') {
                matchesCategory = p.type.includes('PSU');
            } else if (lenderCategoryFilter === 'PRIVATE') {
                matchesCategory = p.type.includes('Private');
            } else if (lenderCategoryFilter === 'NBFC') {
                matchesCategory = p.type.includes('NBFC');
            } else if (lenderCategoryFilter === 'DFI') {
                matchesCategory = p.type.includes('Specialized') || p.type.includes('DFI');
            }

            // Product filter
            let matchesProduct = true;
            if (lenderProductFilter !== 'ALL') {
                const prodStr = (p.products || '').toUpperCase();
                matchesProduct = prodStr.includes(lenderProductFilter.toUpperCase());
            }

            // Search filter
            let matchesSearch = true;
            if (lenderSearchTerm.trim()) {
                const q = lenderSearchTerm.toLowerCase();
                matchesSearch =
                    p.name.toLowerCase().includes(q) ||
                    p.code.toLowerCase().includes(q) ||
                    (p.products && p.products.toLowerCase().includes(q)) ||
                    (p.keyPolicies && p.keyPolicies.toLowerCase().includes(q)) ||
                    (p.bestFor && p.bestFor.toLowerCase().includes(q));
            }

            return matchesCategory && matchesProduct && matchesSearch;
        });
    }, [lenderPolicies, lenderCategoryFilter, lenderProductFilter, lenderSearchTerm]);

    // Filter cases
    const filteredCases = useMemo(() => {
        return cases.filter(c => {
            const matchesSearch =
                c.enterpriseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.id.includes(searchTerm) ||
                c.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.targetLender && c.targetLender.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [cases, searchTerm, statusFilter]);

    if (!isAuthenticated) {
        navigate('/partnerLMS/login');
        return null;
    }

    const handleTopUp = () => {
        topUpWallet(Number(topUpAmount), `Institutional Wallet Allocation - ₹${topUpAmount}`);
        setIsWalletModalOpen(false);
    };

    const handleLaunchNewCase = (config) => {
        setIsLeadModalOpen(false);
        navigate('/partnerLMS/case/new', { state: config });
    };

    const handleConfirmDelete = () => {
        if (caseToDelete) {
            deleteCase(caseToDelete.id);
            setToastMessage(`Case ${caseToDelete.enterpriseName} (ID: ${caseToDelete.id}) deleted successfully.`);
            setCaseToDelete(null);
            setTimeout(() => setToastMessage(''), 4000);
        }
    };

    const sanctionedCount = cases.filter(c => c.status === 'SANCTIONED').length;
    const underReviewCount = cases.filter(c => c.status === 'UNDER_REVIEW').length;
    const disbursedCount = cases.filter(c => c.status === 'DISBURSED').length;

    // Portfolio Analytics Interactive Drilldown States
    const [analyticsFilter, setAnalyticsFilter] = useState('ALL'); // 'ALL' | 'UNDER_REVIEW' | 'SANCTIONED' | 'DISBURSED' | 'QUERIED' | 'DRAFT'
    const [analyticsSearch, setAnalyticsSearch] = useState('');
    const [selectedAnalyticsProduct, setSelectedAnalyticsProduct] = useState('ALL');

    // Pipeline Analytics Computations
    const pipelineMetrics = useMemo(() => {
        const totalCases = cases.length;
        const totalLakhs = cases.reduce((acc, c) => acc + (Number(c.loanAmountLakhs) || 50), 0);

        // 1. In Credit Valuation & Underwriting Desk (UNDER_REVIEW + SUBMITTED)
        const inValuationCases = cases.filter(c => c.status === 'UNDER_REVIEW' || c.status === 'SUBMITTED');
        const inValuationLakhs = inValuationCases.reduce((acc, c) => acc + (Number(c.loanAmountLakhs) || 50), 0);

        // 2. Sanction Ready & Letter Issued (SANCTIONED)
        const sanctionedCases = cases.filter(c => c.status === 'SANCTIONED');
        const sanctionedLakhs = sanctionedCases.reduce((acc, c) => acc + (Number(c.loanAmountLakhs) || 50), 0);

        // 3. Disbursed & Completed (DISBURSED)
        const disbursedCases = cases.filter(c => c.status === 'DISBURSED');
        const disbursedLakhs = disbursedCases.reduce((acc, c) => acc + (Number(c.loanAmountLakhs) || 50), 0);

        // 4. Queries / Action Required (QUERIED + DRAFT)
        const actionRequiredCases = cases.filter(c => c.status === 'QUERIED' || c.status === 'DRAFT');
        const actionRequiredLakhs = actionRequiredCases.reduce((acc, c) => acc + (Number(c.loanAmountLakhs) || 50), 0);

        const formatAmt = (lakhs) => {
            if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
            return `₹${lakhs.toFixed(2)} Lakhs`;
        };

        // Disbursal conversion rate
        const conversionRate = totalCases > 0 ? Math.round(((sanctionedCases.length + disbursedCases.length) / totalCases) * 100) : 0;
        // Estimated commission pipeline (~1.0% avg)
        const estCommissionLakhs = (sanctionedLakhs + disbursedLakhs) * 0.01;

        return {
            totalCases,
            totalFormatted: formatAmt(totalLakhs),
            inValuationCount: inValuationCases.length,
            inValuationFormatted: formatAmt(inValuationLakhs),
            sanctionedCount: sanctionedCases.length,
            sanctionedFormatted: formatAmt(sanctionedLakhs),
            disbursedCount: disbursedCases.length,
            disbursedFormatted: formatAmt(disbursedLakhs),
            actionRequiredCount: actionRequiredCases.length,
            actionRequiredFormatted: formatAmt(actionRequiredLakhs),
            avgTicketFormatted: formatAmt(totalCases > 0 ? totalLakhs / totalCases : 0),
            conversionRate: `${conversionRate}%`,
            estCommissionFormatted: formatAmt(estCommissionLakhs)
        };
    }, [cases]);

    // Filtered cases for Portfolio Analytics Drilldown view
    const analyticsFilteredCases = useMemo(() => {
        return cases.filter(c => {
            // Status Stage filter
            let matchesStage = true;
            if (analyticsFilter === 'UNDER_REVIEW') {
                matchesStage = c.status === 'UNDER_REVIEW' || c.status === 'SUBMITTED';
            } else if (analyticsFilter === 'SANCTIONED') {
                matchesStage = c.status === 'SANCTIONED';
            } else if (analyticsFilter === 'DISBURSED') {
                matchesStage = c.status === 'DISBURSED';
            } else if (analyticsFilter === 'QUERIED') {
                matchesStage = c.status === 'QUERIED' || c.status === 'DRAFT';
            }

            // Product category filter
            let matchesProduct = true;
            if (selectedAnalyticsProduct !== 'ALL') {
                const p = (c.loanProduct || c.loanType || '').toUpperCase();
                matchesProduct = p.includes(selectedAnalyticsProduct.toUpperCase());
            }

            // Search query
            let matchesSearch = true;
            if (analyticsSearch.trim()) {
                const q = analyticsSearch.toLowerCase();
                matchesSearch =
                    c.enterpriseName.toLowerCase().includes(q) ||
                    (c.applicantName && c.applicantName.toLowerCase().includes(q)) ||
                    c.id.includes(q) ||
                    (c.targetLender && c.targetLender.toLowerCase().includes(q)) ||
                    (c.loanType && c.loanType.toLowerCase().includes(q));
            }

            return matchesStage && matchesProduct && matchesSearch;
        });
    }, [cases, analyticsFilter, selectedAnalyticsProduct, analyticsSearch]);

    // Full Screen Pilot Wallet Tab States
    const [walletMonthFilter, setWalletMonthFilter] = useState('ALL'); // 'ALL' | '2026-10' | '2026-09' | etc.
    const [walletTypeFilter, setWalletTypeFilter] = useState('ALL'); // 'ALL' | 'DEBIT' | 'CREDIT'
    const [walletCategoryFilter, setWalletCategoryFilter] = useState('ALL'); // 'ALL' | 'CIBIL' | 'BSA' | 'GST' | 'RECHARGE'
    const [walletSearchQuery, setWalletSearchQuery] = useState('');
    const [customRechargeInput, setCustomRechargeInput] = useState('1000');

    // Extract available distinct months from walletLedger
    const availableWalletMonths = useMemo(() => {
        const monthMap = new Map();
        walletLedger.forEach(entry => {
            const dateStr = entry.date || '';
            const match = dateStr.match(/(\d{4})[/-](\d{2})/);
            if (match) {
                const key = `${match[1]}-${match[2]}`;
                const dateObj = new Date(`${match[1]}-${match[2]}-01T00:00:00`);
                const label = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                if (!monthMap.has(key)) {
                    monthMap.set(key, { key, label });
                }
            }
        });
        return Array.from(monthMap.values());
    }, [walletLedger]);

    // Wallet Aggregated Analytics & KPI Metrics
    const walletMetrics = useMemo(() => {
        const listToAggregate = walletMonthFilter === 'ALL'
            ? walletLedger
            : walletLedger.filter(e => (e.date || '').includes(walletMonthFilter));

        const totalCredits = listToAggregate
            .filter(e => e.type === 'CREDIT')
            .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

        const totalDebits = listToAggregate
            .filter(e => e.type === 'DEBIT')
            .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

        const cibilPulls = listToAggregate.filter(e => e.category === 'CIBIL' || (e.description && e.description.toLowerCase().includes('cibil')));
        const bsaSpreads = listToAggregate.filter(e => e.category === 'BSA' || (e.description && (e.description.toLowerCase().includes('bsa') || e.description.toLowerCase().includes('bank statement'))));
        const gstRecons = listToAggregate.filter(e => e.category === 'GST' || (e.description && e.description.toLowerCase().includes('gst')));

        return {
            totalCredits,
            totalDebits,
            netBalanceChange: totalCredits - totalDebits,
            totalOperationsCount: listToAggregate.filter(e => e.type === 'DEBIT').length,
            cibilCount: cibilPulls.length,
            cibilSpend: cibilPulls.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
            bsaCount: bsaSpreads.length,
            bsaSpend: bsaSpreads.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
            gstCount: gstRecons.length,
            gstSpend: gstRecons.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
        };
    }, [walletLedger, walletMonthFilter]);

    // Filtered Wallet Transactions
    const filteredWalletLedger = useMemo(() => {
        return walletLedger.filter(entry => {
            // Month Filter
            let matchesMonth = true;
            if (walletMonthFilter !== 'ALL') {
                matchesMonth = (entry.date || '').includes(walletMonthFilter);
            }

            // Type Filter
            let matchesType = true;
            if (walletTypeFilter !== 'ALL') {
                matchesType = entry.type === walletTypeFilter;
            }

            // Category Filter
            let matchesCategory = true;
            if (walletCategoryFilter !== 'ALL') {
                if (walletCategoryFilter === 'RECHARGE') {
                    matchesCategory = entry.type === 'CREDIT';
                } else if (walletCategoryFilter === 'CIBIL') {
                    matchesCategory = entry.category === 'CIBIL' || (entry.description && entry.description.toLowerCase().includes('cibil'));
                } else if (walletCategoryFilter === 'BSA') {
                    matchesCategory = entry.category === 'BSA' || (entry.description && (entry.description.toLowerCase().includes('bsa') || entry.description.toLowerCase().includes('bank statement')));
                } else if (walletCategoryFilter === 'GST') {
                    matchesCategory = entry.category === 'GST' || (entry.description && entry.description.toLowerCase().includes('gst'));
                }
            }

            // Search Filter
            let matchesSearch = true;
            if (walletSearchQuery.trim()) {
                const q = walletSearchQuery.toLowerCase();
                matchesSearch =
                    (entry.description && entry.description.toLowerCase().includes(q)) ||
                    (entry.id && entry.id.toLowerCase().includes(q)) ||
                    (entry.caseId && entry.caseId.toLowerCase().includes(q)) ||
                    (entry.date && entry.date.toLowerCase().includes(q)) ||
                    String(entry.amount).includes(q);
            }

            return matchesMonth && matchesType && matchesCategory && matchesSearch;
        });
    }, [walletLedger, walletMonthFilter, walletTypeFilter, walletCategoryFilter, walletSearchQuery]);

    // Handler for instant quick recharge
    const handleQuickRecharge = (amount) => {
        const parsedAmt = Number(amount);
        if (!parsedAmt || parsedAmt < 50) {
            alert('Please enter a valid top-up amount (minimum ₹50).');
            return;
        }
        topUpWallet(parsedAmt, `Pilot Instant Recharge - ₹${parsedAmt.toLocaleString()}`);
        setToastMessage(`₹${parsedAmt.toLocaleString()} successfully credited to Facilitator Pilot Wallet!`);
        setTimeout(() => setToastMessage(''), 4000);
    };

    // Handler for downloading statement as CSV
    const handleExportWalletCSV = () => {
        const headers = ['Transaction ID', 'Date & Time', 'Type', 'Amount (INR)', 'Balance After (INR)', 'Category / Service', 'Description', 'Linked Proposal ID'];
        const rows = filteredWalletLedger.map(e => [
            e.id,
            `"${e.date || ''}"`,
            e.type,
            e.amount,
            e.balanceAfter,
            e.category || (e.type === 'CREDIT' ? 'RECHARGE' : 'VERIFICATION'),
            `"${(e.description || '').replace(/"/g, '""')}"`,
            e.caseId || 'N/A'
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `BeeFund_Partner_Wallet_Statement_${walletMonthFilter}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className={`lms-dashboard-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isDark ? 'dark-mode' : 'light-mode'}`}
            data-theme={isDark ? 'dark' : 'light'}
        >
            {/* STICKY LEFT SIDEBAR MENU BAR (Never scrolls with site) */}
            <aside className={`lms-sticky-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-inner-wrap">
                    {/* Brand Logo Header */}
                    <div className="lms-sidebar-brand">
                        <Link to="/partnerLMS" className="sidebar-logo-link">
                            <span className="sidebar-badge-inst">INSTITUTIONAL</span>
                            <div className="sidebar-logo-text">
                                BEEFUND <strong>PARTNER LMS</strong>
                            </div>
                        </Link>
                    </div>

                    {/* Channel Facilitator Profile Card */}
                    <div className="lms-facilitator-badge-card">
                        <div className="fac-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div className="fac-details">
                            <div className="fac-name">{partnerProfile.name}</div>
                            <div className="fac-id-row">
                                <span className="fac-id-lbl">ID: <strong>{partnerProfile.facilitatorId}</strong></span>
                                <span className="fac-status-dot" title="Verified Active Facilitator">● Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <div className="lms-sidebar-nav-section">
                        <div className="nav-section-title">COMMAND MENU</div>
                        <nav className="lms-sidebar-nav-menu">
                            <button
                                type="button"
                                className={`lms-sidebar-nav-btn ${activeNav === 'cases' ? 'active' : ''}`}
                                onClick={() => setActiveNav('cases')}
                            >
                                <span className="nav-btn-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                </span>
                                <span className="nav-btn-text">Command Center (Cases)</span>
                                <span className="nav-btn-badge">{cases.length}</span>
                            </button>

                            <button
                                type="button"
                                className={`lms-sidebar-nav-btn ${activeNav === 'analytics' ? 'active' : ''}`}
                                onClick={() => setActiveNav('analytics')}
                            >
                                <span className="nav-btn-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                </span>
                                <span className="nav-btn-text">Portfolio Analytics</span>
                                <span className="nav-btn-badge badge-gold">{partnerProfile.sanctionRatio}</span>
                            </button>

                            <button
                                type="button"
                                className={`lms-sidebar-nav-btn ${activeNav === 'lenders' ? 'active' : ''}`}
                                onClick={() => setActiveNav('lenders')}
                            >
                                <span className="nav-btn-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"></path><path d="M3 10h18"></path><path d="M5 6l7-3 7 3"></path><path d="M4 10v11"></path><path d="M20 10v11"></path><path d="M8 14v4"></path><path d="M12 14v4"></path><path d="M16 14v4"></path></svg>
                                </span>
                                <span className="nav-btn-text">Empaneled Banks</span>
                                <span className="nav-btn-badge">25+</span>
                            </button>

                            <button
                                type="button"
                                className={`lms-sidebar-nav-btn ${activeNav === 'wallet' ? 'active' : ''}`}
                                onClick={() => setActiveNav('wallet')}
                            >
                                <span className="nav-btn-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                </span>
                                <span className="nav-btn-text">Pilot Wallet</span>
                                <span className="nav-btn-badge badge-cyan">₹{walletBalance.toLocaleString()}</span>
                            </button>
                        </nav>
                    </div>

                    {/* Sidebar Bottom Utilities */}
                    <div className="lms-sidebar-bottom">
                        {/* Theme Switcher */}
                        <div className="sidebar-theme-row">
                            <span className="theme-row-label">Workspace Theme</span>
                            <PartnerThemeToggle />
                        </div>

                        {/* Sign Out Button */}
                        <button type="button" onClick={logout} className="lms-sidebar-logout-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            <span>Sign Out Portal</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT CANVAS (Scrolls smoothly beside sticky sidebar) */}
            <main className="lms-dashboard-main">
                {/* Top Header Bar */}
                <header className="lms-main-topbar">
                    <div className="topbar-left-wrap">
                        <button
                            type="button"
                            className="btn-toggle-lms-sidebar"
                            onClick={toggleSidebar}
                            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Hide Sidebar'}
                            aria-label="Toggle Sidebar"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                        <div className="topbar-left">
                            <h1 className="topbar-title">
                                {activeNav === 'cases' && 'Institutional Credit Proposals'}
                                {activeNav === 'analytics' && 'Underwriting Volume & Sanction Metrics'}
                                {activeNav === 'lenders' && 'Empaneled Banking & Institutional Partners'}
                                {activeNav === 'wallet' && 'Facilitator Pilot Wallet & Operational Ledger'}
                            </h1>
                            <p className="topbar-subtitle">
                                {activeNav === 'cases' && 'Manage borrower cases, underwriting scorecards, CAM dossiers, and multi-bank sanction tracking.'}
                                {activeNav === 'analytics' && 'Real-time sanction ratio, disbursed volume, and loan sizing distribution.'}
                                {activeNav === 'lenders' && 'Pre-aligned credit policy parameters, turnaround SLAs, and maximum exposure limits across 25+ lenders.'}
                                {activeNav === 'wallet' && 'Instant funds replenishment, automated unit verification cost audit, and month-wise deduction analysis.'}
                            </p>
                        </div>
                    </div>

                    <div className="topbar-right">
                        {/* Pilot Wallet Widget */}
                        <div
                            className={`wallet-widget ${activeNav === 'wallet' ? 'active-widget' : ''}`}
                            onClick={() => setActiveNav('wallet')}
                            title="Click to open Pilot Wallet & Deduction Ledger"
                        >
                            <div className="wallet-icon-box">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                            </div>
                            <div className="wallet-meta">
                                <span className="wallet-title">PILOT WALLET</span>
                                <span className="wallet-amount">₹{walletBalance.toLocaleString()}</span>
                            </div>
                            <span className="btn-wallet-topup" title="Open Wallet Command Center">+</span>
                        </div>

                        {/* Fast CTA */}
                        <button type="button" onClick={() => setIsLeadModalOpen(true)} className="btn-topbar-new-case">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            <span>Create New Case</span>
                        </button>
                    </div>
                </header>

                <div className="lms-main-inner-content">
                    {toastMessage && (
                        <div className="lms-toast-success-banner">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>{toastMessage}</span>
                        </div>
                    )}

                    {/* CASE LIST VIEW */}
                    {activeNav === 'cases' && (
                        <>
                            {/* Summary Metric Stats Grid */}
                            <div className="lms-stats-grid">
                                <div className="stat-card">
                                    <div className="stat-label">Total Logged Cases</div>
                                    <div className="stat-value">{cases.length}</div>
                                    <div className="stat-hint">{sanctionedCount} Sanctioned • {underReviewCount} In Review • {disbursedCount} Disbursed</div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-label">Portfolio Sizing Volume</div>
                                    <div className="stat-value">{partnerProfile.disbursedVolume}</div>
                                    <div className="stat-hint text-green">Avg Ticket: ₹3.5 Cr (MSME & Commercial)</div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-label">Underwriting Approval Ratio</div>
                                    <div className="stat-value text-gold">{partnerProfile.sanctionRatio}</div>
                                    <div className="stat-hint">Across 25+ Commercial & Nationalized Banks</div>
                                </div>

                                <div className="stat-card stat-action-card">
                                    <button type="button" onClick={() => setIsLeadModalOpen(true)} className="btn-new-case">
                                        <span className="plus-sym">+</span>
                                        <span>Create New Credit Case</span>
                                    </button>
                                    <div className="stat-hint">Universal KYC & Dynamic Sizing Wizard (9 Products)</div>
                                </div>
                            </div>

                            {/* Filter & Search Bar */}
                            <div className="lms-table-controls">
                                <div className="lms-search-input-wrap">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <input
                                        type="text"
                                        placeholder="Search by Enterprise Name, Application ID, PAN, or Target Bank..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button type="button" className="btn-clear-search" onClick={() => setSearchTerm('')}>×</button>
                                    )}
                                </div>

                                <div className="lms-filter-actions">
                                    <select
                                        className="lms-select-filter"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="ALL">All Statuses ({cases.length})</option>
                                        {Object.entries(STATUS_BADGES).map(([k, v]) => (
                                            <option key={k} value={k}>{v.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Case Proposals Table */}
                            <div className="lms-cases-table-wrap">
                                <table className="lms-cases-table">
                                    <thead>
                                        <tr>
                                            <th>App ID / Ack No</th>
                                            <th>Applicant Enterprise</th>
                                            <th>Facility & Sizing</th>
                                            <th>Key Asset / Sizing Metric</th>
                                            <th>Target Lender</th>
                                            <th>Score</th>
                                            <th>Case Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCases.map(c => {
                                            const statusCfg = STATUS_BADGES[c.status] || STATUS_BADGES.DRAFT;
                                            const pCode = (c.loanProduct || c.loanType || '').toUpperCase();
                                            let metricLabel = c.projectCostFormatted;
                                            if (pCode.includes('HL') || pCode.includes('LAP') || pCode.includes('HOME') || pCode.includes('PROPERTY')) {
                                                metricLabel = c.propertyValueFormatted || 'Property Mortgage';
                                            } else if (pCode.includes('PL') || pCode.includes('PERSONAL')) {
                                                metricLabel = c.monthlySalaryFormatted ? `In-Hand: ${c.monthlySalaryFormatted}` : 'Salaried Net Pay';
                                            } else if (pCode.includes('AL') || pCode.includes('AUTO') || pCode.includes('VEHICLE')) {
                                                metricLabel = c.vehicleValuationFormatted ? `Fleet: ${c.vehicleValuationFormatted}` : 'Vehicle Invoices';
                                            } else if (pCode.includes('OD') || pCode.includes('CC') || pCode.includes('WORKING')) {
                                                metricLabel = c.mpbfFormatted ? `MPBF: ${c.mpbfFormatted}` : (c.turnoverFormatted || 'Working Capital');
                                            } else if (pCode.includes('BILL') || pCode.includes('DISCOUNTING')) {
                                                metricLabel = c.eligibleInvoicesFormatted ? `Invoices: ${c.eligibleInvoicesFormatted}` : 'Supply Chain';
                                            } else if (pCode.includes('ML') || pCode.includes('MACHINERY')) {
                                                metricLabel = c.capexCostFormatted ? `Capex: ${c.capexCostFormatted}` : (c.projectCostFormatted || 'Equipment');
                                            } else if (pCode.includes('BL') || pCode.includes('BUSINESS')) {
                                                metricLabel = c.turnoverFormatted ? `Sales: ${c.turnoverFormatted}` : 'Operating Cash Flow';
                                            }

                                            return (
                                                <tr key={c.id}>
                                                    <td>
                                                        <div className="case-id-txt">ID: {c.id}</div>
                                                        <div className="case-ack-txt">{c.ackNo}</div>
                                                    </td>
                                                    <td>
                                                        <div className="enterprise-name-txt">{c.enterpriseName}</div>
                                                        <div className="enterprise-meta-txt">
                                                            <span>PAN: {c.pan}</span> • <span>{c.constitution}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="loan-amount-txt">{c.loanAmountFormatted}</div>
                                                        <div className="loan-type-sub">{c.loanType}</div>
                                                    </td>
                                                    <td>
                                                        <div className="project-cost-txt">{metricLabel || 'Assessed'}</div>
                                                        <div className="industry-sub">{c.industry}</div>
                                                    </td>
                                                    <td>
                                                        <div className="lender-name-txt">{c.targetLender || 'All Empaneled Banks'}</div>
                                                        <div className="date-sub">Submitted: {c.submissionDate}</div>
                                                    </td>
                                                    <td>
                                                        <span className="case-scorecard-pill">
                                                            {c.scorecard ? `${c.scorecard}/100` : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className="status-pill-badge"
                                                            style={{ color: statusCfg.color, background: statusCfg.bg }}
                                                        >
                                                            {statusCfg.label}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="table-actions-group">
                                                            <Link to={`/partnerLMS/case/${c.id}`} className="btn-open-command" title="Open Case Command Center">
                                                                <span>Command Center</span>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                                </svg>
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                className="btn-delete-case-row"
                                                                onClick={() => setCaseToDelete(c)}
                                                                title="Delete this Credit Proposal"
                                                                aria-label={`Delete proposal ${c.enterpriseName}`}
                                                            >
                                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredCases.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="empty-table-msg">
                                                    No credit proposals found matching your filter criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* ANALYTICS VIEW — INTERACTIVE PORTFOLIO & LIVE CASE DRILLDOWN */}
                    {activeNav === 'analytics' && (
                        <div className="lms-analytics-panel">
                            {/* 1. PIPELINE STAGES FUNNEL (CLICKABLE & OPENABLE) */}
                            <div className="analytics-section-title-row">
                                <div>
                                    <h2 className="analytics-section-heading">Underwriting & Disbursal Conversion Funnel</h2>
                                    <p className="analytics-section-sub">Click any pipeline stage card to filter and open all running cases in that credit milestone.</p>
                                </div>
                                <span className="analytics-live-tag">● LIVE PIPELINE DATA</span>
                            </div>

                            <div className="analytics-funnel-grid">
                                {/* Funnel Card 1: Total Logged */}
                                <div
                                    className={`funnel-stage-card ${analyticsFilter === 'ALL' ? 'active' : ''}`}
                                    onClick={() => setAnalyticsFilter('ALL')}
                                    title="Click to view all logged cases"
                                >
                                    <div className="stage-top">
                                        <span className="stage-number">01</span>
                                        <span className="stage-pill pill-slate">Total Logged</span>
                                    </div>
                                    <div className="stage-count">{pipelineMetrics.totalCases} <span className="lbl-cases">Cases</span></div>
                                    <div className="stage-volume text-gold">{pipelineMetrics.totalFormatted}</div>
                                    <div className="stage-footer">
                                        <span>Click to open all proposals</span>
                                        <span className="arrow-sym">→</span>
                                    </div>
                                </div>

                                {/* Funnel Card 2: In Underwriting & Credit Valuation */}
                                <div
                                    className={`funnel-stage-card ${analyticsFilter === 'UNDER_REVIEW' ? 'active' : ''}`}
                                    onClick={() => setAnalyticsFilter('UNDER_REVIEW')}
                                    title="Click to view cases undergoing credit valuation"
                                >
                                    <div className="stage-top">
                                        <span className="stage-number">02</span>
                                        <span className="stage-pill pill-amber">In Credit Valuation</span>
                                    </div>
                                    <div className="stage-count">{pipelineMetrics.inValuationCount} <span className="lbl-cases">Cases</span></div>
                                    <div className="stage-volume text-amber">{pipelineMetrics.inValuationFormatted}</div>
                                    <div className="stage-footer">
                                        <span>Underwriting desk review</span>
                                        <span className="arrow-sym">→</span>
                                    </div>
                                </div>

                                {/* Funnel Card 3: Sanction Letter Issued */}
                                <div
                                    className={`funnel-stage-card ${analyticsFilter === 'SANCTIONED' ? 'active' : ''}`}
                                    onClick={() => setAnalyticsFilter('SANCTIONED')}
                                    title="Click to view cases with issued bank sanction letters"
                                >
                                    <div className="stage-top">
                                        <span className="stage-number">03</span>
                                        <span className="stage-pill pill-emerald">Sanction Letter Issued</span>
                                    </div>
                                    <div className="stage-count">{pipelineMetrics.sanctionedCount} <span className="lbl-cases">Cases</span></div>
                                    <div className="stage-volume text-green">{pipelineMetrics.sanctionedFormatted}</div>
                                    <div className="stage-footer">
                                        <span>Ready for acceptance</span>
                                        <span className="arrow-sym">→</span>
                                    </div>
                                </div>

                                {/* Funnel Card 4: Disbursed & Active */}
                                <div
                                    className={`funnel-stage-card ${analyticsFilter === 'DISBURSED' ? 'active' : ''}`}
                                    onClick={() => setAnalyticsFilter('DISBURSED')}
                                    title="Click to view disbursed capital proposals"
                                >
                                    <div className="stage-top">
                                        <span className="stage-number">04</span>
                                        <span className="stage-pill pill-cyan">Disbursed Capital</span>
                                    </div>
                                    <div className="stage-count">{pipelineMetrics.disbursedCount} <span className="lbl-cases">Cases</span></div>
                                    <div className="stage-volume text-cyan">{pipelineMetrics.disbursedFormatted}</div>
                                    <div className="stage-footer">
                                        <span>Completed disbursements</span>
                                        <span className="arrow-sym">→</span>
                                    </div>
                                </div>

                                {/* Funnel Card 5: Bank Queries & Drafts */}
                                <div
                                    className={`funnel-stage-card ${analyticsFilter === 'QUERIED' ? 'active' : ''}`}
                                    onClick={() => setAnalyticsFilter('QUERIED')}
                                    title="Click to view queries and pending documentation"
                                >
                                    <div className="stage-top">
                                        <span className="stage-number">05</span>
                                        <span className="stage-pill pill-red">Queries / Incomplete</span>
                                    </div>
                                    <div className="stage-count">{pipelineMetrics.actionRequiredCount} <span className="lbl-cases">Cases</span></div>
                                    <div className="stage-volume text-red">{pipelineMetrics.actionRequiredFormatted}</div>
                                    <div className="stage-footer">
                                        <span>Action required cases</span>
                                        <span className="arrow-sym">→</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. PORTFOLIO KEY METRICS STRIP */}
                            <div className="analytics-metrics-row">
                                <div className="stat-card">
                                    <div className="stat-label">Sanction Clearance Ratio</div>
                                    <div className="stat-value text-green">{partnerProfile.sanctionRatio}</div>
                                    <div className="stat-hint">Top decile institutional underwriting benchmark</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">Average Facility Sizing</div>
                                    <div className="stat-value text-gold">{pipelineMetrics.avgTicketFormatted}</div>
                                    <div className="stat-hint">Commercial, MSME & Retail portfolio average</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">Disbursal Conversion Rate</div>
                                    <div className="stat-value text-cyan">{pipelineMetrics.conversionRate}</div>
                                    <div className="stat-hint">{pipelineMetrics.sanctionedCount + pipelineMetrics.disbursedCount} of {pipelineMetrics.totalCases} cases sanctioned/disbursed</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">Est. Channel Payout Pipeline</div>
                                    <div className="stat-value text-emerald">{pipelineMetrics.estCommissionFormatted}</div>
                                    <div className="stat-hint">Calculated @ ~1.00% on approved & disbursed volume</div>
                                </div>
                            </div>

                            {/* 3. INTERACTIVE LIVE CASE DRILLDOWN TABLE & COMMAND CENTER */}
                            <div className="analytics-drilldown-card">
                                <div className="drilldown-header-wrap">
                                    <div className="drilldown-title-left">
                                        <div className="drilldown-title-row">
                                            <h3>
                                                {analyticsFilter === 'ALL' && 'All Ingested Pipeline Proposals'}
                                                {analyticsFilter === 'UNDER_REVIEW' && 'Cases in Credit Valuation & Desk Review'}
                                                {analyticsFilter === 'SANCTIONED' && 'Cases with Bank Sanction Letters Issued'}
                                                {analyticsFilter === 'DISBURSED' && 'Disbursed Cases & Closed Facilities'}
                                                {analyticsFilter === 'QUERIED' && 'Cases with Bank Queries & Action Items'}
                                            </h3>
                                            <span className="drilldown-counter-badge">
                                                {analyticsFilteredCases.length} Proposals
                                            </span>
                                        </div>
                                        <p className="drilldown-desc">
                                            Click on any proposal row or the <strong>Open Command Center</strong> button to immediately enter the case room, inspect financial spreading, stress tests, CAM dossiers, and multi-bank sanction matrices.
                                        </p>
                                    </div>

                                    {/* Filter Pill Switcher */}
                                    <div className="analytics-filter-pills">
                                        <button
                                            type="button"
                                            className={`pill-btn ${analyticsFilter === 'ALL' ? 'active' : ''}`}
                                            onClick={() => setAnalyticsFilter('ALL')}
                                        >
                                            All ({pipelineMetrics.totalCases})
                                        </button>
                                        <button
                                            type="button"
                                            className={`pill-btn ${analyticsFilter === 'UNDER_REVIEW' ? 'active' : ''}`}
                                            onClick={() => setAnalyticsFilter('UNDER_REVIEW')}
                                        >
                                            In Valuation ({pipelineMetrics.inValuationCount})
                                        </button>
                                        <button
                                            type="button"
                                            className={`pill-btn ${analyticsFilter === 'SANCTIONED' ? 'active' : ''}`}
                                            onClick={() => setAnalyticsFilter('SANCTIONED')}
                                        >
                                            Sanction Ready ({pipelineMetrics.sanctionedCount})
                                        </button>
                                        <button
                                            type="button"
                                            className={`pill-btn ${analyticsFilter === 'DISBURSED' ? 'active' : ''}`}
                                            onClick={() => setAnalyticsFilter('DISBURSED')}
                                        >
                                            Disbursed ({pipelineMetrics.disbursedCount})
                                        </button>
                                        <button
                                            type="button"
                                            className={`pill-btn ${analyticsFilter === 'QUERIED' ? 'active' : ''}`}
                                            onClick={() => setAnalyticsFilter('QUERIED')}
                                        >
                                            Queries ({pipelineMetrics.actionRequiredCount})
                                        </button>
                                    </div>
                                </div>

                                {/* Search & Category Filter Toolbar */}
                                <div className="drilldown-toolbar">
                                    <div className="search-input-wrap">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        <input
                                            type="text"
                                            placeholder="Search enterprise, applicant, App ID, or bank..."
                                            value={analyticsSearch}
                                            onChange={(e) => setAnalyticsSearch(e.target.value)}
                                            className="drilldown-search-input"
                                        />
                                        {analyticsSearch && (
                                            <button type="button" onClick={() => setAnalyticsSearch('')} className="btn-clear-search">✕</button>
                                        )}
                                    </div>

                                    <div className="category-select-wrap">
                                        <label>Product Filter:</label>
                                        <select
                                            value={selectedAnalyticsProduct}
                                            onChange={(e) => setSelectedAnalyticsProduct(e.target.value)}
                                            className="drilldown-category-select"
                                        >
                                            <option value="ALL">All 9 Loan Products</option>
                                            <option value="HL">Home Loan (HL)</option>
                                            <option value="LAP">Loan Against Property (LAP)</option>
                                            <option value="ML">Machinery / Equipment (ML)</option>
                                            <option value="BL">Business Loan (BL)</option>
                                            <option value="PL">Personal Loan (PL)</option>
                                            <option value="AL">Auto Loan (AL)</option>
                                            <option value="PROJECT">Project Funding</option>
                                            <option value="OD_CC">Overdraft / Cash Credit (OD/CC)</option>
                                            <option value="BILL">Bill / Invoice Discounting</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Drilldown Cases Table */}
                                <div className="lms-table-container">
                                    <table className="lms-cases-table">
                                        <thead>
                                            <tr>
                                                <th>Enterprise / Applicant Legal Name</th>
                                                <th>App ID & Date</th>
                                                <th>Product Category</th>
                                                <th>Facility Sizing</th>
                                                <th>Target Lender</th>
                                                <th>Underwriting Status</th>
                                                <th>Bankability Score</th>
                                                <th>Disbursal Readiness</th>
                                                <th style={{ textAlign: 'right' }}>Open Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analyticsFilteredCases.map((c) => {
                                                const badge = STATUS_BADGES[c.status] || STATUS_BADGES.UNDER_REVIEW;
                                                const readinessPercent =
                                                    c.status === 'DISBURSED' ? 100 :
                                                    c.status === 'SANCTIONED' ? 100 :
                                                    c.status === 'UNDER_REVIEW' ? 80 :
                                                    c.status === 'SUBMITTED' ? 65 :
                                                    c.status === 'QUERIED' ? 45 : 30;

                                                const readinessColor =
                                                    readinessPercent === 100 ? '#10b981' :
                                                    readinessPercent >= 70 ? '#38bdf8' :
                                                    readinessPercent >= 50 ? '#f59e0b' : '#ef4444';

                                                return (
                                                    <tr
                                                        key={c.id}
                                                        className="clickable-case-row"
                                                        onClick={() => navigate(`/partnerLMS/case/${c.id}`)}
                                                        title="Click to open case assessment room"
                                                    >
                                                        <td>
                                                            <div className="case-name-cell">
                                                                <strong className="enterprise-title">{c.enterpriseName || c.applicantName || 'Credit Case'}</strong>
                                                                <span className="case-pan-sub">PAN: <strong>{c.pan}</strong> • {c.constitution}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="case-id-cell">
                                                                <span className="case-id-badge">{c.id}</span>
                                                                <span className="case-date-sub">{c.submissionDate || 'Recently Logged'}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="product-category-pill">
                                                                {c.loanType || c.loanProduct || 'MSME Loan'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <strong className="loan-amt-val">
                                                                {c.loanAmountFormatted || (c.loanAmountLakhs ? `₹${c.loanAmountLakhs.toFixed(2)} L` : '₹50.00 L')}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <span className="lender-chip">
                                                                {c.targetLender ? c.targetLender.split('(')[0].trim() : 'State Bank of India'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span
                                                                className="lms-status-pill"
                                                                style={{ color: badge.color, backgroundColor: badge.bg, border: `1px solid ${badge.color}40` }}
                                                            >
                                                                {badge.label}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="scorecard-chip" title="Underwriting Scorecard Bankability Grade">
                                                                ★ {c.scorecard || 88}/100
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="readiness-bar-wrap" title={`Disbursal Readiness: ${readinessPercent}%`}>
                                                                <div className="readiness-bar-track">
                                                                    <div
                                                                        className="readiness-bar-fill"
                                                                        style={{ width: `${readinessPercent}%`, backgroundColor: readinessColor }}
                                                                    ></div>
                                                                </div>
                                                                <span className="readiness-val" style={{ color: readinessColor }}>
                                                                    {readinessPercent}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                                                            <button
                                                                type="button"
                                                                className="btn-open-command-center"
                                                                onClick={() => navigate(`/partnerLMS/case/${c.id}`)}
                                                                title="Open Case Command Center"
                                                            >
                                                                <span>Command Center</span>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {analyticsFilteredCases.length === 0 && (
                                                <tr>
                                                    <td colSpan="9" className="empty-table-msg">
                                                        No cases found in this pipeline filter. <button type="button" onClick={() => { setAnalyticsFilter('ALL'); setSelectedAnalyticsProduct('ALL'); setAnalyticsSearch(''); }} className="btn-reset-filters">Reset all filters</button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 4. PRODUCT BREAKDOWN & DISBURSAL PERFORMANCE MATRIX */}
                            <div className="analytics-details-card">
                                <div className="card-header-row">
                                    <div>
                                        <h3>Product Facility Breakdown & Underwriting Multipliers</h3>
                                        <p className="card-sub-info">Click any product row below to filter live cases for that category above.</p>
                                    </div>
                                    <span className="badge-stat-right">9 Master Categories</span>
                                </div>

                                <table className="lms-cases-table" style={{ marginTop: '1rem' }}>
                                    <thead>
                                        <tr>
                                            <th>Loan Category</th>
                                            <th>Ticket Size Range</th>
                                            <th>Active Cases In Pipeline</th>
                                            <th>Key Underwriting Multiplier</th>
                                            <th>Partner Commission Band</th>
                                            <th style={{ textAlign: 'right' }}>Quick Filter</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { name: 'MSME Project & Term Loans', code: 'PROJECT', range: '₹50 L – ₹100 Cr', count: cases.filter(c => (c.loanProduct || c.loanType || '').toUpperCase().includes('PROJECT') || (c.loanProduct || c.loanType || '').toUpperCase().includes('TERM')).length, mult: 'DSCR ≥ 1.35x • TOL/TNW ≤ 3.5x', comm: '0.75% – 1.50%' },
                                            { name: 'Working Capital (OD / CC Limits)', code: 'OD_CC', range: '₹25 L – ₹50 Cr', count: cases.filter(c => (c.loanProduct || c.loanType || '').toUpperCase().includes('OD') || (c.loanProduct || c.loanType || '').toUpperCase().includes('CC') || (c.loanProduct || c.loanType || '').toUpperCase().includes('WORKING')).length, mult: 'Nayak Committee / Tandon MPBF', comm: '0.50% – 1.00%' },
                                            { name: 'Machinery & Capex Financing', code: 'ML', range: '₹20 L – ₹30 Cr', count: cases.filter(c => (c.loanProduct || c.loanType || '').toUpperCase().includes('ML') || (c.loanProduct || c.loanType || '').toUpperCase().includes('MACHINERY')).length, mult: 'Equipment Quotations & Hypothecation', comm: '0.80% – 1.25%' },
                                            { name: 'Loan Against Property (LAP)', code: 'LAP', range: '₹30 L – ₹25 Cr', count: cases.filter(c => (c.loanProduct || c.loanType || '').toUpperCase().includes('LAP') || (c.loanProduct || c.loanType || '').toUpperCase().includes('PROPERTY')).length, mult: 'LTV ≤ 65% • SARFAESI Clear Title', comm: '0.60% – 1.10%' },
                                            { name: 'Home Loans (HL Retail Mortgages)', code: 'HL', range: '₹15 L – ₹10 Cr', count: cases.filter(c => (c.loanProduct || c.loanType || '').toUpperCase().includes('HL') || (c.loanProduct || c.loanType || '').toUpperCase().includes('HOME')).length, mult: 'FOIR ≤ 60% • 70-80% LTV', comm: '0.40% – 0.80%' },
                                            { name: 'Unsecured Business Loans (BL)', code: 'BL', range: '₹10 L – ₹5 Cr', count: cases.filter(c => (c.loanProduct || c.loanType || '').toUpperCase().includes('BL') || (c.loanProduct || c.loanType || '').toUpperCase().includes('BUSINESS')).length, mult: '12M Banking & GST Inflow Track', comm: '1.20% – 2.00%' },
                                            { name: 'Bill & Invoice Discounting', code: 'BILL', range: '₹15 L – ₹20 Cr', count: cases.filter(c => (c.loanProduct || c.loanType || '').toUpperCase().includes('BILL') || (c.loanProduct || c.loanType || '').toUpperCase().includes('INVOICE')).length, mult: 'Accepted Commercial Invoices & POD', comm: '0.50% – 0.90%' }
                                        ].map((prod, idx) => (
                                            <tr
                                                key={idx}
                                                className="clickable-table-row"
                                                onClick={() => {
                                                    setSelectedAnalyticsProduct(prod.code);
                                                    setAnalyticsFilter('ALL');
                                                }}
                                                title={`Click to filter cases by ${prod.name}`}
                                            >
                                                <td><strong>{prod.name}</strong></td>
                                                <td>{prod.range}</td>
                                                <td>
                                                    <span className="active-cases-count-badge">
                                                        {prod.count} {prod.count === 1 ? 'Proposal' : 'Proposals'}
                                                    </span>
                                                </td>
                                                <td>{prod.mult}</td>
                                                <td><span className="badge-commission">{prod.comm}</span></td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button
                                                        type="button"
                                                        className="btn-filter-category-action"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedAnalyticsProduct(prod.code);
                                                            setAnalyticsFilter('ALL');
                                                        }}
                                                    >
                                                        Filter Cases →
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* EMPANELED LENDERS & CREDIT POLICY HUB */}
                    {activeNav === 'lenders' && (
                        <div className="lms-lenders-panel">
                            {/* Policy Hub Header & Control Bar */}
                            <div className="lenders-panel-header">
                                <div className="lenders-header-title-box">
                                    <div className="lenders-header-badge">INSTITUTIONAL UNDERWRITING MATRIX</div>
                                    <h2 className="lenders-header-title">Empaneled Banking & Institutional Credit Policies</h2>
                                    <p className="lenders-header-sub">
                                        Compare bank credit criteria, ticket sizing cutoffs, CIBIL thresholds, SLA turnaround, and policy underwriting rules to match proposals with the best-fit lending network.
                                    </p>
                                </div>
                                <div className="lenders-header-actions">
                                    <button
                                        type="button"
                                        className="btn-lender-reset-defaults"
                                        onClick={handleResetDefaultPolicies}
                                        title="Reset policies back to institutional factory defaults"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="1 4 1 10 7 10"></polyline>
                                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                                        </svg>
                                        Reset Defaults
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-lender-add-policy"
                                        onClick={handleOpenCreatePolicy}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        + Add Bank Policy
                                    </button>
                                </div>
                            </div>

                            {/* Category Filter Segments */}
                            <div className="lenders-category-tabs">
                                {[
                                    { id: 'ALL', label: 'All Institutions', count: lenderPolicies.length },
                                    { id: 'PSU', label: 'PSU Commercial Banks', count: lenderPolicies.filter(p => p.type.includes('PSU')).length },
                                    { id: 'PRIVATE', label: 'Private Commercial', count: lenderPolicies.filter(p => p.type.includes('Private')).length },
                                    { id: 'NBFC', label: 'Upper-Layer NBFCs', count: lenderPolicies.filter(p => p.type.includes('NBFC')).length },
                                    { id: 'DFI', label: 'Specialized & DFI', count: lenderPolicies.filter(p => p.type.includes('Specialized') || p.type.includes('DFI')).length }
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        className={`lenders-tab-btn ${lenderCategoryFilter === cat.id ? 'active' : ''}`}
                                        onClick={() => setLenderCategoryFilter(cat.id)}
                                    >
                                        <span>{cat.label}</span>
                                        <span className="tab-pill-count">{cat.count}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Secondary Filter & Search Toolbar */}
                            <div className="lenders-toolbar-strip">
                                <div className="lenders-search-box">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search by institution, code, policy rules, products, or best-fit niche..."
                                        value={lenderSearchTerm}
                                        onChange={(e) => setLenderSearchTerm(e.target.value)}
                                    />
                                    {lenderSearchTerm && (
                                        <button
                                            type="button"
                                            className="btn-clear-lender-search"
                                            onClick={() => setLenderSearchTerm('')}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>

                                <div className="lenders-product-pills">
                                    <span className="pills-label">Product Filter:</span>
                                    {[
                                        { id: 'ALL', label: 'All Products' },
                                        { id: 'HL', label: 'HL' },
                                        { id: 'LAP', label: 'LAP' },
                                        { id: 'BL', label: 'BL' },
                                        { id: 'ML', label: 'ML' },
                                        { id: 'OD', label: 'OD / CC' },
                                        { id: 'Project', label: 'Project Finance' },
                                        { id: 'Bill', label: 'Bill Discounting' }
                                    ].map(prod => (
                                        <button
                                            key={prod.id}
                                            type="button"
                                            className={`lenders-pill-btn ${lenderProductFilter === prod.id ? 'active' : ''}`}
                                            onClick={() => setLenderProductFilter(prod.id)}
                                        >
                                            {prod.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Policies Count Summary */}
                            <div className="lenders-count-bar">
                                <span>Showing <strong>{filteredLenderPolicies.length}</strong> of {lenderPolicies.length} Banking & NBFC Policies</span>
                                {(lenderCategoryFilter !== 'ALL' || lenderProductFilter !== 'ALL' || lenderSearchTerm) && (
                                    <button
                                        type="button"
                                        className="btn-reset-filters-inline"
                                        onClick={() => {
                                            setLenderCategoryFilter('ALL');
                                            setLenderProductFilter('ALL');
                                            setLenderSearchTerm('');
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>

                            {/* Policy Cards Grid */}
                            <div className="lenders-policy-grid">
                                {filteredLenderPolicies.length === 0 ? (
                                    <div className="lenders-empty-state">
                                        <div className="empty-icon">🏦</div>
                                        <h3>No Bank Policies Match Your Filters</h3>
                                        <p>Try searching for a different keyword or resetting your category/product filters.</p>
                                        <button
                                            type="button"
                                            className="btn-lender-add-policy"
                                            onClick={handleOpenCreatePolicy}
                                        >
                                            + Add New Bank Policy
                                        </button>
                                    </div>
                                ) : (
                                    filteredLenderPolicies.map((bank) => (
                                        <div key={bank.id} className="lender-policy-card">
                                            {/* Card Top Header */}
                                            <div className="policy-card-topbar">
                                                <div className="policy-code-badge">{bank.code}</div>
                                                <span className="policy-type-tag">{bank.type}</span>
                                                <div className="policy-roi-badge" title="Indicative Interest Rate Range">
                                                    🏷️ {bank.interestRate || '8.40% - 13.50%'}
                                                </div>
                                            </div>

                                            {/* Bank Title & Rating */}
                                            <div className="policy-card-title-row">
                                                <h3 className="policy-bank-name">{bank.name}</h3>
                                                <div className="policy-rating-pill" title="Lender Institutional Tier">
                                                    ⭐ {bank.rating}
                                                </div>
                                            </div>

                                            {/* Key Sizing & SLAs Metric Matrix */}
                                            <div className="policy-metrics-matrix">
                                                <div className="policy-metric-col">
                                                    <span className="p-lbl">Max Ticket</span>
                                                    <strong className="p-val text-gold">{bank.maxTicket}</strong>
                                                </div>
                                                <div className="policy-metric-col">
                                                    <span className="p-lbl">Min CIBIL</span>
                                                    <strong className="p-val text-cyan">{bank.minCIBIL || '675+'}</strong>
                                                </div>
                                                <div className="policy-metric-col">
                                                    <span className="p-lbl">Avg SLA</span>
                                                    <strong className="p-val text-green">{bank.avgSLA}</strong>
                                                </div>
                                            </div>

                                            {/* Credit Policy & Underwriting Rules Box */}
                                            <div className="policy-underwriting-box">
                                                <div className="policy-box-header">
                                                    <span className="box-title">📋 Credit Policy & Sizing Matrix:</span>
                                                </div>
                                                <p className="policy-box-content">{bank.keyPolicies}</p>
                                            </div>

                                            {/* Best Suited For Segment */}
                                            <div className="policy-sweetspot-box">
                                                <span className="sweetspot-lbl">🎯 Ideal Segment:</span>
                                                <span className="sweetspot-val">{bank.bestFor}</span>
                                            </div>

                                            {/* Products List */}
                                            <div className="policy-products-row">
                                                <span className="products-lbl">Facilities:</span>
                                                <div className="products-tags-wrap">
                                                    {bank.products.split(',').map((p, pIdx) => (
                                                        <span key={pIdx} className="product-mini-tag">{p.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="policy-card-footer">
                                                <div className="policy-manage-btns">
                                                    <button
                                                        type="button"
                                                        className="btn-edit-policy"
                                                        onClick={() => handleOpenEditPolicy(bank)}
                                                        title="Edit this bank credit policy"
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                        Edit Policy
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn-delete-policy"
                                                        onClick={() => handleDeletePolicy(bank.id, bank.name)}
                                                        title="Delete this policy"
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-route-case-here"
                                                    onClick={() => handleRouteCaseToBank(bank)}
                                                    title={`Route a new loan case directly to ${bank.name}`}
                                                >
                                                    Route Case →
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* FULL SCREEN PILOT WALLET & DEDUCTION HISTORY HUB */}
                    {activeNav === 'wallet' && (
                        <div className="lms-wallet-fullscreen-panel">
                            {/* Hero Balance & Instant Add Funds Card */}
                            <div className="wallet-hero-card">
                                <div className="wallet-hero-left">
                                    <div className="wallet-hero-badge">
                                        <span>INSTITUTIONAL PILOT ESCROW</span>
                                        <span className="live-pulse-dot">● Live Balance</span>
                                    </div>
                                    <div className="wallet-hero-balance-row">
                                        <div className="balance-symbol">₹</div>
                                        <h2 className="balance-number">{walletBalance.toLocaleString()}</h2>
                                    </div>
                                    <div className="wallet-hero-subtext">
                                        Available pilot balance automatically drawn for CIBIL Soft-CIR (₹50), BSA Multi-Account Spreading (₹45), and MCA/GST Verifications (₹35-₹40).
                                    </div>
                                    <div className="wallet-account-details-strip">
                                        <div className="detail-item">
                                            <span className="lbl">Facilitator ID:</span>
                                            <strong>{partnerProfile.facilitatorId}</strong>
                                        </div>
                                        <div className="detail-item">
                                            <span className="lbl">Escrow Tier:</span>
                                            <span className="tag-gold">{partnerProfile.tier}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="lbl">Linked Enterprise:</span>
                                            <span>{partnerProfile.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="wallet-hero-right">
                                    <div className="add-funds-box">
                                        <div className="add-funds-header">
                                            <div className="add-funds-title">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                                </svg>
                                                <strong>Add Funds to Wallet</strong>
                                            </div>
                                            <span className="instant-badge">⚡ Instant Credit</span>
                                        </div>

                                        {/* Quick Recharge Amount Preset Pills */}
                                        <div className="quick-recharge-pills">
                                            {[500, 1000, 2500, 5000, 10000].map(amt => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    className={`btn-quick-amt ${Number(customRechargeInput) === amt ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setCustomRechargeInput(String(amt));
                                                        handleQuickRecharge(amt);
                                                    }}
                                                >
                                                    +₹{amt.toLocaleString()}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Custom Amount Input Row */}
                                        <div className="custom-recharge-flex">
                                            <div className="input-currency-wrapper">
                                                <span className="curr-sym">₹</span>
                                                <input
                                                    type="number"
                                                    value={customRechargeInput}
                                                    onChange={(e) => setCustomRechargeInput(e.target.value)}
                                                    placeholder="Enter amount"
                                                    min="50"
                                                    step="50"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-submit-add-funds"
                                                onClick={() => handleQuickRecharge(customRechargeInput)}
                                            >
                                                + Add Funds Now
                                            </button>
                                        </div>
                                        <span className="recharge-safe-note">🔒 Institutional test allocation sandbox • Instant ledger credit</span>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Aggregate KPIs & Unit Deduction Metrics */}
                            <div className="wallet-kpi-grid">
                                <div className="wallet-kpi-card kpi-credit">
                                    <div className="kpi-icon-wrap">📥</div>
                                    <div className="kpi-content">
                                        <span className="kpi-label">
                                            {walletMonthFilter === 'ALL' ? 'Total Funds Inflow' : 'Funds Added (Selected Period)'}
                                        </span>
                                        <h3 className="kpi-val text-green">+₹{walletMetrics.totalCredits.toLocaleString()}</h3>
                                        <span className="kpi-sub">Total credit replenishments</span>
                                    </div>
                                </div>

                                <div className="wallet-kpi-card kpi-debit">
                                    <div className="kpi-icon-wrap">📤</div>
                                    <div className="kpi-content">
                                        <span className="kpi-label">
                                            {walletMonthFilter === 'ALL' ? 'Total Deductions' : 'Deductions (Selected Period)'}
                                        </span>
                                        <h3 className="kpi-val text-red">-₹{walletMetrics.totalDebits.toLocaleString()}</h3>
                                        <span className="kpi-sub">{walletMetrics.totalOperationsCount} verification operations</span>
                                    </div>
                                </div>

                                <div className="wallet-kpi-card">
                                    <div className="kpi-icon-wrap">📊</div>
                                    <div className="kpi-content">
                                        <span className="kpi-label">CIBIL Soft-Pulls Done</span>
                                        <h3 className="kpi-val text-cyan">{walletMetrics.cibilCount} CIR Reports</h3>
                                        <span className="kpi-sub">₹{walletMetrics.cibilSpend.toLocaleString()} total Bureau spend</span>
                                    </div>
                                </div>

                                <div className="wallet-kpi-card">
                                    <div className="kpi-icon-wrap">📑</div>
                                    <div className="kpi-content">
                                        <span className="kpi-label">Multi-Bank BSA Analyzed</span>
                                        <h3 className="kpi-val text-gold">{walletMetrics.bsaCount} Accounts</h3>
                                        <span className="kpi-sub">₹{walletMetrics.bsaSpend.toLocaleString()} automated BSA parsing</span>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Unit Pricing Matrix Bar */}
                            <div className="wallet-pricing-rate-strip">
                                <div className="rate-strip-title">
                                    <span>⚙️ Unit Verification Pricing:</span>
                                </div>
                                <div className="rate-cards-list">
                                    <div className="rate-pill">
                                        <span className="rate-name">CIBIL CIR Pull</span>
                                        <strong className="rate-cost">₹50 / report</strong>
                                    </div>
                                    <div className="rate-pill">
                                        <span className="rate-name">BSA 12M Spreading</span>
                                        <strong className="rate-cost">₹45 / account</strong>
                                    </div>
                                    <div className="rate-pill">
                                        <span className="rate-name">BSA 6M Spreading</span>
                                        <strong className="rate-cost">₹30 / account</strong>
                                    </div>
                                    <div className="rate-pill">
                                        <span className="rate-name">GST 12M Turnover Audit</span>
                                        <strong className="rate-cost">₹40 / filing</strong>
                                    </div>
                                    <div className="rate-pill">
                                        <span className="rate-name">Scorecard & CAM Dossier</span>
                                        <strong className="rate-cost text-green">₹0 Included</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Month-Wise Deduction History Section */}
                            <div className="wallet-history-section">
                                <div className="wallet-history-header">
                                    <div className="history-title-group">
                                        <h3>Month-Wise Deduction History & Statement</h3>
                                        <p>Audit unit debits, linked applicant proposals, CIBIL/BSA usage, and closing ledger balance.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-export-statement"
                                        onClick={handleExportWalletCSV}
                                        title="Export filtered transactions as a CSV spreadsheet"
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Export Statement (.CSV)
                                    </button>
                                </div>

                                {/* Month Selection Tabs */}
                                <div className="wallet-month-tabs">
                                    <button
                                        type="button"
                                        className={`month-tab-btn ${walletMonthFilter === 'ALL' ? 'active' : ''}`}
                                        onClick={() => setWalletMonthFilter('ALL')}
                                    >
                                        <span>All Time History</span>
                                        <span className="month-count-pill">{walletLedger.length}</span>
                                    </button>
                                    {availableWalletMonths.map(m => {
                                        const count = walletLedger.filter(e => (e.date || '').includes(m.key)).length;
                                        return (
                                            <button
                                                key={m.key}
                                                type="button"
                                                className={`month-tab-btn ${walletMonthFilter === m.key ? 'active' : ''}`}
                                                onClick={() => setWalletMonthFilter(m.key)}
                                            >
                                                <span>🗓️ {m.label}</span>
                                                <span className="month-count-pill">{count}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Toolbar: Search & Category / Type Filters */}
                                <div className="wallet-toolbar-strip">
                                    <div className="wallet-search-box">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search by proposal ID, enterprise name, transaction ID or service..."
                                            value={walletSearchQuery}
                                            onChange={(e) => setWalletSearchQuery(e.target.value)}
                                        />
                                        {walletSearchQuery && (
                                            <button
                                                type="button"
                                                className="btn-clear-wallet-search"
                                                onClick={() => setWalletSearchQuery('')}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>

                                    {/* Type Filter Buttons */}
                                    <div className="wallet-type-filter-group">
                                        <button
                                            type="button"
                                            className={`wallet-type-btn ${walletTypeFilter === 'ALL' ? 'active' : ''}`}
                                            onClick={() => setWalletTypeFilter('ALL')}
                                        >
                                            All Types
                                        </button>
                                        <button
                                            type="button"
                                            className={`wallet-type-btn ${walletTypeFilter === 'DEBIT' ? 'active debit-active' : ''}`}
                                            onClick={() => setWalletTypeFilter('DEBIT')}
                                        >
                                            Deductions (Debits)
                                        </button>
                                        <button
                                            type="button"
                                            className={`wallet-type-btn ${walletTypeFilter === 'CREDIT' ? 'active credit-active' : ''}`}
                                            onClick={() => setWalletTypeFilter('CREDIT')}
                                        >
                                            Recharges (Credits)
                                        </button>
                                    </div>

                                    {/* Category Filter Pills */}
                                    <div className="wallet-category-pills">
                                        <select
                                            value={walletCategoryFilter}
                                            onChange={(e) => setWalletCategoryFilter(e.target.value)}
                                            className="wallet-category-select"
                                        >
                                            <option value="ALL">All Service Categories</option>
                                            <option value="CIBIL">CIBIL Bureau Pulls</option>
                                            <option value="BSA">Bank Statement Analysis</option>
                                            <option value="GST">GST Reconciliation</option>
                                            <option value="RECHARGE">Fund Recharges</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Detailed Ledger Transactions Table */}
                                <div className="wallet-ledger-table-container">
                                    {filteredWalletLedger.length === 0 ? (
                                        <div className="wallet-empty-state">
                                            <div className="empty-icon">💳</div>
                                            <h4>No Transactions Found</h4>
                                            <p>No transactions match the selected month and search filters.</p>
                                            <button
                                                type="button"
                                                className="btn-clear-filters-inline"
                                                onClick={() => {
                                                    setWalletMonthFilter('ALL');
                                                    setWalletTypeFilter('ALL');
                                                    setWalletCategoryFilter('ALL');
                                                    setWalletSearchQuery('');
                                                }}
                                            >
                                                Reset All Filters
                                            </button>
                                        </div>
                                    ) : (
                                        <table className="wallet-ledger-table">
                                            <thead>
                                                <tr>
                                                    <th>Date & Time</th>
                                                    <th>Txn ID</th>
                                                    <th>Service / Category</th>
                                                    <th>Description & Proposal Link</th>
                                                    <th>Amount</th>
                                                    <th>Balance After</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredWalletLedger.map((txn) => {
                                                    const isCredit = txn.type === 'CREDIT';
                                                    const category = txn.category || (isCredit ? 'RECHARGE' : 'CIBIL');
                                                    return (
                                                        <tr key={txn.id} className={`wallet-table-row ${isCredit ? 'row-credit' : 'row-debit'}`}>
                                                            <td className="cell-date">
                                                                <span className="mono-date">{txn.date}</span>
                                                            </td>
                                                            <td className="cell-txnid">
                                                                <span className="mono-badge">{txn.id}</span>
                                                            </td>
                                                            <td className="cell-category">
                                                                {category === 'CIBIL' && (
                                                                    <span className="service-tag tag-cibil">🔵 CIBIL CIR</span>
                                                                )}
                                                                {category === 'BSA' && (
                                                                    <span className="service-tag tag-bsa">🟣 BSA Spreading</span>
                                                                )}
                                                                {category === 'GST' && (
                                                                    <span className="service-tag tag-gst">🟡 GST Audit</span>
                                                                )}
                                                                {category === 'RECHARGE' && (
                                                                    <span className="service-tag tag-recharge">🟢 Recharge</span>
                                                                )}
                                                                {category === 'OTHER' && (
                                                                    <span className="service-tag tag-other">⚪ Verification</span>
                                                                )}
                                                            </td>
                                                            <td className="cell-description">
                                                                <div className="txn-desc-text">{txn.description}</div>
                                                                {txn.caseId && (
                                                                    <button
                                                                        type="button"
                                                                        className="txn-linked-case-btn"
                                                                        onClick={() => navigate(`/partnerLMS/case/${txn.caseId}`)}
                                                                    >
                                                                        View Linked Proposal #{txn.caseId} →
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td className="cell-amount">
                                                                <strong className={`txn-amount-val ${isCredit ? 'val-credit' : 'val-debit'}`}>
                                                                    {isCredit ? `+₹${txn.amount.toLocaleString()}` : `-₹${txn.amount.toLocaleString()}`}
                                                                </strong>
                                                            </td>
                                                            <td className="cell-balance">
                                                                <span className="balance-after-val">₹{txn.balanceAfter ? txn.balanceAfter.toLocaleString() : '---'}</span>
                                                            </td>
                                                            <td className="cell-status">
                                                                <span className="status-confirmed-pill">● Settled</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Bank Policy Add / Edit Modal */}
            {isPolicyModalOpen && (
                <div className="lms-modal-backdrop" onClick={() => setIsPolicyModalOpen(false)}>
                    <div className="lms-modal-card lms-policy-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="policy-modal-title-wrap">
                                <div className="policy-modal-icon">🏦</div>
                                <div>
                                    <h3>{policyModalMode === 'CREATE' ? 'Add Institutional Bank Policy' : `Edit Credit Policy: ${policyFormData.name}`}</h3>
                                    <p className="modal-subtitle">Configure bank lending rules, underwriting sizing parameters, SLA, and ticket limits.</p>
                                </div>
                            </div>
                            <button type="button" className="btn-close-modal" onClick={() => setIsPolicyModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="policy-form-grid">
                                <div className="form-group-p">
                                    <label>Institution / Bank Name <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        value={policyFormData.name}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, name: e.target.value })}
                                        placeholder="e.g., State Bank of India, HDFC Bank, Tata Capital"
                                    />
                                </div>
                                <div className="form-group-p">
                                    <label>Bank Code / Acronym <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        value={policyFormData.code}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, code: e.target.value.toUpperCase() })}
                                        placeholder="e.g., SBI, HDFC, KOTAK, SIDBI"
                                    />
                                </div>
                                <div className="form-group-p">
                                    <label>Institution Category</label>
                                    <select
                                        value={policyFormData.type}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, type: e.target.value })}
                                    >
                                        <option value="PSU Commercial Bank">PSU Commercial Bank</option>
                                        <option value="Private Commercial Bank">Private Commercial Bank</option>
                                        <option value="Upper-Layer NBFC">Upper-Layer NBFC</option>
                                        <option value="Specialized DFI">Specialized DFI</option>
                                        <option value="Small Finance Bank">Small Finance Bank</option>
                                    </select>
                                </div>
                                <div className="form-group-p">
                                    <label>Max Ticket Size</label>
                                    <input
                                        type="text"
                                        value={policyFormData.maxTicket}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, maxTicket: e.target.value })}
                                        placeholder="e.g., ₹500 Cr, ₹75 Cr, ₹15 Cr"
                                    />
                                </div>
                                <div className="form-group-p">
                                    <label>Min CIBIL Threshold</label>
                                    <input
                                        type="text"
                                        value={policyFormData.minCIBIL}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, minCIBIL: e.target.value })}
                                        placeholder="e.g., 675+, 700+, 650 (Co-app backed)"
                                    />
                                </div>
                                <div className="form-group-p">
                                    <label>Indicative ROI / Interest Rate</label>
                                    <input
                                        type="text"
                                        value={policyFormData.interestRate}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, interestRate: e.target.value })}
                                        placeholder="e.g., 8.40% - 10.25% p.a."
                                    />
                                </div>
                                <div className="form-group-p">
                                    <label>Average Turnaround SLA</label>
                                    <input
                                        type="text"
                                        value={policyFormData.avgSLA}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, avgSLA: e.target.value })}
                                        placeholder="e.g., 5 - 7 Days, 48 - 72 Hours"
                                    />
                                </div>
                                <div className="form-group-p">
                                    <label>Institutional Rating</label>
                                    <input
                                        type="text"
                                        value={policyFormData.rating}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, rating: e.target.value })}
                                        placeholder="e.g., AAA / Tier-1, AA+ / Tier-1"
                                    />
                                </div>
                                <div className="form-group-p full-width">
                                    <label>Empaneled Facilities / Products (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={policyFormData.products}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, products: e.target.value })}
                                        placeholder="e.g., HL, LAP, BL, OD/CC, Project Funding, Bill Discounting"
                                    />
                                </div>
                                <div className="form-group-p full-width">
                                    <label>Credit Policy & Sizing Rules (DSCR, LTV, Collateral, Financial Audits)</label>
                                    <textarea
                                        rows={3}
                                        value={policyFormData.keyPolicies}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, keyPolicies: e.target.value })}
                                        placeholder="e.g., DSCR ≥ 1.25x, Min 3Y audited financials, LTV up to 75% for industrial property, collateral mandatory > ₹5 Cr."
                                    />
                                </div>
                                <div className="form-group-p full-width">
                                    <label>Sweet Spot / Ideal Borrower Profile</label>
                                    <input
                                        type="text"
                                        value={policyFormData.bestFor}
                                        onChange={(e) => setPolicyFormData({ ...policyFormData, bestFor: e.target.value })}
                                        placeholder="e.g., Manufacturing MSMEs, Mid-market corporates, Fast-growing D2C firms"
                                    />
                                </div>
                            </div>
                            <div className="policy-modal-actions">
                                <button
                                    type="button"
                                    className="btn-cancel-policy"
                                    onClick={() => setIsPolicyModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn-save-policy"
                                    onClick={handleSavePolicy}
                                >
                                    {policyModalMode === 'CREATE' ? 'Add Bank Policy' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Wallet Management Modal */}
            {isWalletModalOpen && (
                <div className="lms-modal-backdrop" onClick={() => setIsWalletModalOpen(false)}>
                    <div className="lms-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Facilitator Pilot Wallet & Ledger</h3>
                            <button type="button" className="btn-close-modal" onClick={() => setIsWalletModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="wallet-balance-banner">
                                <span>Current Available Balance</span>
                                <h2>₹{walletBalance.toLocaleString()}</h2>
                                <p>Used for automated CIBIL soft-pulls (₹50) and BSA multi-account parsing (₹30-₹45).</p>
                            </div>

                            <div className="topup-box">
                                <label>Allocate Pilot Test Balance (₹):</label>
                                <div className="topup-input-flex">
                                    <input
                                        type="number"
                                        value={topUpAmount}
                                        onChange={(e) => setTopUpAmount(e.target.value)}
                                        min="100"
                                        step="100"
                                    />
                                    <button type="button" onClick={handleTopUp} className="btn-apply-topup">
                                        + Credit Wallet
                                    </button>
                                </div>
                            </div>

                            <div className="ledger-history-section">
                                <h4>Recent Transaction Ledger</h4>
                                <div className="ledger-items-list">
                                    {walletLedger.map(entry => (
                                        <div key={entry.id} className="ledger-item-row">
                                            <div className="ledger-item-info">
                                                <div className="ledger-desc">{entry.description}</div>
                                                <div className="ledger-date">{entry.date} • ID: {entry.id}</div>
                                            </div>
                                            <div className={`ledger-amt ${entry.type === 'CREDIT' ? 'amt-cr' : 'amt-dr'}`}>
                                                {entry.type === 'CREDIT' ? `+₹${entry.amount}` : `-₹${entry.amount}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Case Confirmation Modal */}
            {caseToDelete && (
                <div className="lms-modal-backdrop" onClick={() => setCaseToDelete(null)}>
                    <div className="lms-modal-card lms-delete-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header delete-modal-header">
                            <div className="delete-modal-title-group">
                                <div className="delete-warning-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </div>
                                <h3>Delete Credit Proposal</h3>
                            </div>
                            <button type="button" className="btn-close-modal" onClick={() => setCaseToDelete(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p className="delete-confirm-prompt">
                                Are you sure you want to permanently delete this credit case from your LMS portfolio?
                            </p>
                            <div className="delete-case-summary-box">
                                <div className="delete-summary-row">
                                    <span className="lbl">Enterprise Name:</span>
                                    <strong>{caseToDelete.enterpriseName}</strong>
                                </div>
                                <div className="delete-summary-row">
                                    <span className="lbl">Application ID:</span>
                                    <span className="mono-val">{caseToDelete.id} ({caseToDelete.ackNo})</span>
                                </div>
                                <div className="delete-summary-row">
                                    <span className="lbl">Facility & Sizing:</span>
                                    <span className="cyan-val">{caseToDelete.loanAmountFormatted} • {caseToDelete.loanType}</span>
                                </div>
                                <div className="delete-summary-row">
                                    <span className="lbl">Target Lender:</span>
                                    <span>{caseToDelete.targetLender || 'All Empaneled Banks'}</span>
                                </div>
                            </div>
                            <div className="delete-warning-note">
                                ⚠️ <strong>Notice:</strong> This action permanently deletes the case records, uploaded files, financial spreading ratios, and scorecard assessment.
                            </div>
                            <div className="delete-modal-actions">
                                <button type="button" className="btn-cancel-delete" onClick={() => setCaseToDelete(null)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn-confirm-delete" onClick={handleConfirmDelete}>
                                    Yes, Delete Case
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lead Category & Niche Selection Modal */}
            <LeadCategoryModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                onSelectCategory={handleLaunchNewCase}
            />
        </div>
    );
};

export default PartnerLMSDashboard;
