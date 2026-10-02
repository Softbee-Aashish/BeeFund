import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePartnerLMS } from './PartnerLMSAuthContext';
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

const PartnerLMSDashboard = () => {
    const navigate = useNavigate();
    const {
        isAuthenticated,
        partnerProfile,
        walletBalance,
        walletLedger,
        cases,
        logout,
        topUpWallet
    } = usePartnerLMS();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState(500);

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

    return (
        <div className="lms-dashboard-root">
            {/* Top Navigation Bar */}
            <header className="lms-dash-nav">
                <div className="lms-dash-nav-inner">
                    <div className="lms-nav-left">
                        <Link to="/partnerLMS" className="lms-logo-group">
                            <span className="logo-badge-inst">INSTITUTIONAL GRADE</span>
                            <span className="logo-txt-main">BEEFUND <strong>PARTNER LMS</strong></span>
                        </Link>
                        <div className="facilitator-pill">
                            <span>Facilitator ID: <strong>{partnerProfile.facilitatorId}</strong></span>
                            <span className="pill-dot">•</span>
                            <span>{partnerProfile.name}</span>
                        </div>
                    </div>

                    <div className="lms-nav-right">
                        {/* Light / Dark Mode Toggle */}
                        <PartnerThemeToggle />

                        {/* Wallet Balance Widget */}
                        <div className="wallet-widget" onClick={() => setIsWalletModalOpen(true)}>
                            <div className="wallet-icon-box">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                            </div>
                            <div className="wallet-meta">
                                <span className="wallet-title">PILOT WALLET</span>
                                <span className="wallet-amount">₹{walletBalance.toLocaleString()}</span>
                            </div>
                            <button type="button" className="btn-wallet-topup">+</button>
                        </div>

                        {/* Logout */}
                        <button type="button" onClick={logout} className="btn-lms-logout" title="Sign Out">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="lms-dash-content">
                {/* Metric Summary Cards */}
                <div className="lms-stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Logged Cases</div>
                        <div className="stat-value">{cases.length}</div>
                        <div className="stat-hint">{cases.filter(c => c.status === 'SANCTIONED').length} Sanctioned • {cases.filter(c => c.status === 'UNDER_REVIEW').length} In Review</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Portfolio Sizing Volume</div>
                        <div className="stat-value">{partnerProfile.disbursedVolume}</div>
                        <div className="stat-hint text-green">Avg Ticket: ₹3.5 Cr (MSME)</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Underwriting Approval Ratio</div>
                        <div className="stat-value text-gold">{partnerProfile.sanctionRatio}</div>
                        <div className="stat-hint">Across 25+ Commercial & Nationalized Banks</div>
                    </div>

                    <div className="stat-card stat-action-card">
                        <button type="button" onClick={() => navigate('/partnerLMS/case/new')} className="btn-new-case">
                            <span className="plus-sym">+</span>
                            <span>Create New Credit Case</span>
                        </button>
                        <div className="stat-hint">Universal KYC & Dynamic Sizing Wizard</div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="lms-table-controls">
                    <div className="lms-search-input-wrap">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input
                            type="text"
                            placeholder="Search by Enterprise Name, Application ID, PAN, or Bank..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="lms-filter-actions">
                        <select
                            className="lms-select-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Underwriting Statuses ({cases.length})</option>
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
                                <th>Project Cost</th>
                                <th>Target Lender</th>
                                <th>Score</th>
                                <th>Case Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCases.map(c => {
                                const statusCfg = STATUS_BADGES[c.status] || STATUS_BADGES.DRAFT;
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
                                            <div className="project-cost-txt">{c.projectCostFormatted || 'N/A'}</div>
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
                                            <Link to={`/partnerLMS/case/${c.id}`} className="btn-open-command">
                                                <span>Command Center →</span>
                                            </Link>
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
            </main>

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
