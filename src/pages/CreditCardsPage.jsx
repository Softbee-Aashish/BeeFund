import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '../context/CardsContext';
import HexagonBackground from '../components/HexagonBackground';
import './CreditCardsPage.css';

// Interactive Card Tile with Benefits Carousel
const CreditCardTile = ({ card }) => {
    const [currentBenefitIdx, setCurrentBenefitIdx] = useState(0);

    const benefits = card.benefits && card.benefits.length > 0 ? card.benefits : [
        { title: 'Reward Points', desc: 'Accelerated reward points on everyday dining and retail spends.' },
        { title: 'Digital Approval', desc: '100% paperless verification with quick bank sanction.' }
    ];

    const handleNextBenefit = (e) => {
        e.stopPropagation();
        setCurrentBenefitIdx(prev => (prev + 1) % benefits.length);
    };

    const handlePrevBenefit = (e) => {
        e.stopPropagation();
        setCurrentBenefitIdx(prev => (prev - 1 + benefits.length) % benefits.length);
    };

    return (
        <article className="cc-tile-card">
            {/* Visual Header: Card Artwork & Badges */}
            <div className="cc-tile-top">
                <div className="cc-img-wrap">
                    {card.imageUrl ? (
                        <img 
                            src={card.imageUrl} 
                            alt={card.name} 
                            className="cc-tile-img"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div className="cc-fallback-artwork" style={{ display: card.imageUrl ? 'none' : 'flex' }}>
                        <div className="artwork-chip" />
                        <span className="artwork-bank">{card.bank || 'Credit Card'}</span>
                        <span className="artwork-brand">BEEFUND VIP</span>
                    </div>
                </div>

                <div className="cc-header-badges">
                    <span className="cc-bank-badge">{card.bank || 'Verified Issuer'}</span>
                    {card.badge && (
                        <span className="cc-perk-badge">{card.badge}</span>
                    )}
                    {card.rating && (
                        <span className="cc-rating-badge">★ {card.rating}</span>
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="cc-tile-body">
                <h3 className="cc-tile-title">{card.name}</h3>
                
                {card.tagline && (
                    <p className="cc-tile-tagline">{card.tagline}</p>
                )}

                {/* Fees Grid */}
                <div className="cc-fees-row">
                    <div className="cc-fee-item">
                        <span className="fee-lbl">Joining Fee</span>
                        <span className="fee-val">{card.joiningFee || '₹0'}</span>
                    </div>
                    <div className="cc-fee-sep" />
                    <div className="cc-fee-item">
                        <span className="fee-lbl">Annual Fee</span>
                        <span className="fee-val">{card.annualFee || '₹0'}</span>
                    </div>
                </div>

                {/* Description */}
                {card.description && (
                    <p className="cc-tile-desc">{card.description}</p>
                )}

                {/* Key Benefits Carousel */}
                <div className="cc-benefits-carousel-box">
                    <div className="carousel-box-header">
                        <span className="carousel-title-label">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            Key Benefit ({currentBenefitIdx + 1}/{benefits.length})
                        </span>

                        {benefits.length > 1 && (
                            <div className="carousel-nav-arrows">
                                <button 
                                    type="button" 
                                    onClick={handlePrevBenefit}
                                    className="carousel-arrow-btn"
                                    aria-label="Previous Benefit"
                                >
                                    ‹
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleNextBenefit}
                                    className="carousel-arrow-btn"
                                    aria-label="Next Benefit"
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="carousel-slide-content">
                        <h5 className="slide-benefit-title">{benefits[currentBenefitIdx]?.title}</h5>
                        <p className="slide-benefit-desc">{benefits[currentBenefitIdx]?.desc}</p>
                    </div>

                    {benefits.length > 1 && (
                        <div className="carousel-dots-row">
                            {benefits.map((_, dotIdx) => (
                                <span 
                                    key={dotIdx} 
                                    className={`carousel-dot ${dotIdx === currentBenefitIdx ? 'active' : ''}`}
                                    onClick={() => setCurrentBenefitIdx(dotIdx)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Bar: Direct Affiliate Link (Opens in New Tab) + Doc Link */}
            <div className="cc-tile-footer">
                <div className="cc-cta-group single-apply-cta">
                    <a
                        href={card.applyLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cc-btn-apply cc-btn-apply-full"
                        title="Proceed to official bank application in a new tab"
                    >
                        <span>Apply Now</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                        </svg>
                    </a>
                </div>

                {card.docUrl && (
                    <div className="cc-doc-strip">
                        <a
                            href={card.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cc-doc-link"
                            title="Open official sanction document / PDF schedule"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            <span>{card.docName || 'Official Terms & Tariff Sheet (PDF)'}</span>
                        </a>
                    </div>
                )}
            </div>
        </article>
    );
};

const CreditCardsPage = () => {
    const { activeCards } = useCards();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBank, setSelectedBank] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Extract unique banks
    const banks = useMemo(() => {
        const set = new Set();
        (activeCards || []).forEach(c => {
            if (c.bank) set.add(c.bank);
        });
        return ['all', ...Array.from(set)];
    }, [activeCards]);

    // Extract unique categories
    const categories = useMemo(() => {
        const set = new Set();
        (activeCards || []).forEach(c => {
            if (c.category) set.add(c.category);
        });
        return ['all', ...Array.from(set)];
    }, [activeCards]);

    // Filter cards
    const filteredCards = useMemo(() => {
        return (activeCards || []).filter(c => {
            const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
            const matchesBank = selectedBank === 'all' || c.bank === selectedBank;
            const query = searchQuery.toLowerCase().trim();
            const matchesQuery = !query ||
                (c.name && c.name.toLowerCase().includes(query)) ||
                (c.bank && c.bank.toLowerCase().includes(query)) ||
                (c.category && c.category.toLowerCase().includes(query)) ||
                (c.description && c.description.toLowerCase().includes(query)) ||
                (c.tagline && c.tagline.toLowerCase().includes(query));
            return matchesCategory && matchesBank && matchesQuery;
        });
    }, [activeCards, selectedCategory, selectedBank, searchQuery]);

    return (
        <div className="credit-cards-page">
            <HexagonBackground opacity={0.04} />

            {/* Hero Section */}
            <section className="cc-hero">
                <div className="cc-hero-shell">
                    <span className="cc-hero-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                        Curated Partner Bank Credit Cards
                    </span>

                    <h1 className="cc-hero-title">
                        Best <span>Credit Cards</span> in India — Compare & Apply
                    </h1>

                    <p className="cc-hero-subtitle">
                        Compare top credit cards across leading private and PSU banks. Filter by 5% cashback, complimentary airport lounges, zero annual fees, and instant digital approvals.
                    </p>

                    {/* Search Bar */}
                    <div className="cc-search-wrap">
                        <div className="cc-search-box">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by card name, bank (HDFC, SBI, Axis...), or perk (Lounge, Cashback)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="cc-search-clear" onClick={() => setSearchQuery('')}>&times;</button>
                            )}
                        </div>
                    </div>

                    {/* Bank Filter Tabs */}
                    {banks.length > 2 && (
                        <div className="cc-filter-row bank-row">
                            <span className="filter-row-label">Bank:</span>
                            <div className="filter-pills-list">
                                {banks.map(bank => (
                                    <button
                                        key={bank}
                                        type="button"
                                        className={`cc-pill-btn ${selectedBank === bank ? 'active' : ''}`}
                                        onClick={() => setSelectedBank(bank)}
                                    >
                                        {bank === 'all' ? 'All Banks' : bank}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Category Filter Tabs */}
                    {categories.length > 2 && (
                        <div className="cc-filter-row cat-row">
                            <span className="filter-row-label">Category:</span>
                            <div className="filter-pills-list">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        className={`cc-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Cards Grid */}
            <main className="cc-listing-section">
                <div className="cc-listing-shell">
                    <div className="cc-results-count-bar">
                        <span>Showing <strong>{filteredCards.length}</strong> verified credit card offers</span>
                        {(selectedCategory !== 'all' || selectedBank !== 'all' || searchQuery) && (
                            <button
                                type="button"
                                className="cc-reset-btn"
                                onClick={() => { setSelectedCategory('all'); setSelectedBank('all'); setSearchQuery(''); }}
                            >
                                Reset Filters &times;
                            </button>
                        )}
                    </div>

                    {(activeCards || []).length === 0 ? (
                        <div className="cc-no-results cc-empty-catalog">
                            <div className="no-res-icon-svg">
                                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                    <line x1="2" y1="10" x2="22" y2="10" />
                                    <line x1="6" y1="15" x2="8" y2="15" />
                                    <line x1="11" y1="15" x2="15" y2="15" />
                                </svg>
                            </div>
                            <h3>Partner Credit Cards Coming Soon</h3>
                            <p>We are currently integrating top bank card offerings with leading private and PSU banks. New cards with instant approvals, cashback, and lounge perks will be published here shortly.</p>
                            <div className="cc-empty-action-row">
                                <Link to="/products" className="cc-btn-apply">
                                    Explore Loans & Financing
                                </Link>
                                <Link to="/tools" className="cc-btn-secondary-link">
                                    Financial Calculators
                                </Link>
                            </div>
                        </div>
                    ) : filteredCards.length === 0 ? (
                        <div className="cc-no-results">
                            <div className="no-res-icon-svg">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <h3>No matching credit cards</h3>
                            <p>No cards matched your current filters. Try selecting a different bank or search keyword.</p>
                            <button
                                type="button"
                                className="cc-cta-reset"
                                onClick={() => { setSelectedCategory('all'); setSelectedBank('all'); setSearchQuery(''); }}
                            >
                                View All Available Cards
                            </button>
                        </div>
                    ) : (
                        <div className="cc-tiles-grid">
                            {filteredCards.map(card => (
                                <CreditCardTile key={card.id} card={card} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CreditCardsPage;
