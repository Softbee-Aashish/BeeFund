import React, { useState, useRef, useEffect } from 'react';

const CARD_CATEGORIES = [
    'Cashback',
    'Airport Lounge & Travel',
    'Lifetime Free',
    'Rewards & Shopping',
    'Fuel & Utilities',
    'Premium Metal',
    'Business & Corporate',
    'Student & Starter'
];

const POPULAR_BANKS = [
    'HDFC Bank',
    'SBI Card',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'AU Small Finance Bank',
    'IDFC FIRST Bank',
    'IndusInd Bank',
    'RBL Bank',
    'Yes Bank',
    'American Express',
    'Standard Chartered',
    'Federal Bank',
    'Bank of Baroda',
    'Punjab National Bank',
    'HSBC Bank'
];

const BENEFIT_THEMES = [
    { label: '✈️ Airport Lounge & Travel', value: 'travel' },
    { label: '💰 Direct Cashback', value: 'cashback' },
    { label: '🎁 Reward Points & Gifts', value: 'rewards' },
    { label: '⛽ Fuel & Gas Savings', value: 'fuel' },
    { label: '🛡️ Insurance & Fraud Cover', value: 'protection' },
    { label: '⭐ VIP Concierge & Milestones', value: 'vip' },
    { label: '🛍️ Shopping & Dining Deals', value: 'shopping' },
    { label: '📱 OTT & Subscriptions', value: 'entertainment' }
];

const CardEditorModal = ({ isOpen, onClose, onSave, editingCard }) => {
    const [formData, setFormData] = useState({
        name: '',
        bank: 'HDFC Bank',
        customBank: '',
        category: 'Cashback',
        badge: '',
        imageUrl: '',
        rating: '4.8',
        joiningFee: '₹0 (Lifetime Free)',
        annualFee: '₹0 (Zero Renewal Charges)',
        feeWaiver: '',
        tagline: '',
        description: '',
        benefits: [
            { icon: 'cashback', title: '5% Direct Cashback', desc: 'Earn 5% cashback on all leading merchant transactions with direct statement credit.' },
            { icon: 'travel', title: 'Airport Lounge Access', desc: 'Complimentary access to domestic and international airport lounges every quarter.' }
        ],
        applyLink: '',
        docUrl: '',
        docName: '',
        status: 'active'
    });

    const [bankSelectMode, setBankSelectMode] = useState('select'); // 'select' | 'custom'
    const [errorMsg, setErrorMsg] = useState('');
    const fileInputRef = useRef(null);
    const pdfInputRef = useRef(null);

    // Sync state when editingCard changes
    useEffect(() => {
        if (editingCard) {
            const isKnownBank = POPULAR_BANKS.includes(editingCard.bank);
            setBankSelectMode(isKnownBank ? 'select' : 'custom');
            setFormData({
                name: editingCard.name || '',
                bank: isKnownBank ? editingCard.bank : 'Other',
                customBank: isKnownBank ? '' : (editingCard.bank || ''),
                category: editingCard.category || 'Cashback',
                badge: editingCard.badge || '',
                imageUrl: editingCard.imageUrl || '',
                rating: editingCard.rating || '4.8',
                joiningFee: editingCard.joiningFee || '₹0',
                annualFee: editingCard.annualFee || '₹0',
                feeWaiver: editingCard.feeWaiver || '',
                tagline: editingCard.tagline || '',
                description: editingCard.description || '',
                benefits: Array.isArray(editingCard.benefits) && editingCard.benefits.length > 0
                    ? editingCard.benefits.map(b => ({
                        icon: b.icon || 'rewards',
                        title: b.title || '',
                        desc: b.desc || ''
                    }))
                    : [{ icon: 'rewards', title: '', desc: '' }],
                applyLink: editingCard.applyLink || '',
                docUrl: editingCard.docUrl || '',
                docName: editingCard.docName || '',
                status: editingCard.status || 'active'
            });
        } else {
            setBankSelectMode('select');
            setFormData({
                name: '',
                bank: 'HDFC Bank',
                customBank: '',
                category: 'Cashback',
                badge: '5% Direct Cashback',
                imageUrl: '',
                rating: '4.8',
                joiningFee: '₹0 (Lifetime Free)',
                annualFee: '₹0 (Zero Renewal Charges)',
                feeWaiver: 'Lifetime Free',
                tagline: '',
                description: '',
                benefits: [
                    { icon: 'cashback', title: 'Direct Statement Cashback', desc: 'Accelerated rewards and direct cashback credited every billing cycle.' },
                    { icon: 'travel', title: 'Airport Lounge Access', desc: 'Complimentary airport lounge access across domestic & international terminals.' }
                ],
                applyLink: '',
                docUrl: '',
                docName: '',
                status: 'active'
            });
        }
        setErrorMsg('');
    }, [editingCard, isOpen]);

    if (!isOpen) return null;

    // Handle Image file upload to base64
    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setErrorMsg('Image size should be under 2MB for fast browser loading.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            setFormData(prev => ({ ...prev, imageUrl: uploadEvent.target.result }));
            setErrorMsg('');
        };
        reader.readAsDataURL(file);
    };

    // Handle PDF file upload to base64
    const handlePdfUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (file.size > 6 * 1024 * 1024) {
            setErrorMsg('PDF file size should be under 6MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            setFormData(prev => ({
                ...prev,
                docUrl: uploadEvent.target.result,
                docName: prev.docName || file.name.replace(/\.[^/.]+$/, '') + ' (PDF)'
            }));
            setErrorMsg('');
        };
        reader.readAsDataURL(file);
    };

    // Benefits carousel builder handlers
    const handleAddBenefit = () => {
        setFormData(prev => ({
            ...prev,
            benefits: [...prev.benefits, { icon: 'rewards', title: '', desc: '' }]
        }));
    };

    const handleUpdateBenefit = (index, field, value) => {
        setFormData(prev => {
            const next = [...prev.benefits];
            next[index] = { ...next[index], [field]: value };
            return { ...prev, benefits: next };
        });
    };

    const handleRemoveBenefit = (index) => {
        setFormData(prev => ({
            ...prev,
            benefits: prev.benefits.filter((_, i) => i !== index)
        }));
    };

    // Form submit validation & emission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setErrorMsg('Card Name is required.');
            return;
        }

        const resolvedBank = bankSelectMode === 'custom'
            ? formData.customBank.trim()
            : (formData.bank === 'Other' ? formData.customBank.trim() : formData.bank);

        if (!resolvedBank) {
            setErrorMsg('Please select or specify the issuing bank.');
            return;
        }

        if (!formData.applyLink.trim()) {
            setErrorMsg('Direct Apply Link is required (e.g. https://bank.com/apply...)');
            return;
        }

        // Clean benefits
        const validBenefits = (formData.benefits || []).filter(b => b.title.trim() || b.desc.trim());

        onSave({
            ...formData,
            bank: resolvedBank,
            benefits: validBenefits.length > 0 ? validBenefits : [
                { icon: 'rewards', title: 'Card Rewards', desc: 'Standard rewards on verified point-of-sale and online swipes.' }
            ]
        });
        onClose();
    };

    const currentBankDisplay = bankSelectMode === 'custom' || formData.bank === 'Other'
        ? (formData.customBank || 'Partner Bank')
        : formData.bank;

    return (
        <div className="card-editor-backdrop" onClick={onClose}>
            <div className="card-editor-modal" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="card-editor-header">
                    <div className="editor-title-cluster">
                        <span className="editor-sub-tag">
                            {editingCard ? 'Updating Existing Card' : 'New Credit Card Listing'}
                        </span>
                        <h3 className="editor-main-title">
                            {formData.name || (editingCard ? 'Edit Credit Card' : 'Create Credit Card Listing')}
                        </h3>
                    </div>
                    <button type="button" className="editor-close-btn" onClick={onClose} aria-label="Close Modal">
                        &times;
                    </button>
                </div>

                {errorMsg && (
                    <div className="editor-error-alert">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="card-editor-form">
                    <div className="card-form-grid">

                        {/* SECTION 1: CORE CARD DETAILS */}
                        <div className="card-form-section">
                            <div className="section-header-title">
                                <span className="section-badge-num">1</span>
                                <h4>Card Identity & Bank Issuer</h4>
                            </div>

                            <div className="form-row-2col">
                                <div className="form-group full-width">
                                    <label className="form-label">Card Full Name *</label>
                                    <input
                                        type="text"
                                        className="studio-input"
                                        placeholder="e.g. HDFC Regalia Gold Credit Card"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <span className="form-input-hint">Official commercial name displayed on the card tile.</span>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Issuing Bank *</label>
                                    {bankSelectMode === 'select' ? (
                                        <div className="bank-select-combo">
                                            <select
                                                className="studio-select"
                                                value={formData.bank}
                                                onChange={e => {
                                                    if (e.target.value === 'Other') {
                                                        setBankSelectMode('custom');
                                                        setFormData({ ...formData, bank: 'Other' });
                                                    } else {
                                                        setFormData({ ...formData, bank: e.target.value });
                                                    }
                                                }}
                                            >
                                                {POPULAR_BANKS.map(b => (
                                                    <option key={b} value={b}>{b}</option>
                                                ))}
                                                <option value="Other">+ Other Bank / Custom Issuer</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="custom-bank-entry">
                                            <input
                                                type="text"
                                                className="studio-input"
                                                placeholder="Type Bank Name (e.g. Canara Bank, HSBC)"
                                                value={formData.customBank}
                                                onChange={e => setFormData({ ...formData, customBank: e.target.value })}
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                className="link-switch-btn"
                                                onClick={() => {
                                                    setBankSelectMode('select');
                                                    setFormData({ ...formData, bank: POPULAR_BANKS[0] });
                                                }}
                                            >
                                                Choose from Popular List
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select
                                        className="studio-select"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {CARD_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Highlight Ribbon Tag / Badge</label>
                                    <input
                                        type="text"
                                        className="studio-input"
                                        placeholder="e.g. 5% Online Cashback, 12 Airport Lounge Visits"
                                        value={formData.badge}
                                        onChange={e => setFormData({ ...formData, badge: e.target.value })}
                                    />
                                    <span className="form-input-hint">Gold highlight badge placed at the top of the card.</span>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Rating (out of 5.0)</label>
                                    <input
                                        type="text"
                                        className="studio-input"
                                        placeholder="4.8"
                                        value={formData.rating}
                                        onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: PRICING & FEES */}
                        <div className="card-form-section">
                            <div className="section-header-title">
                                <span className="section-badge-num">2</span>
                                <h4>Joining & Annual Renewal Fees</h4>
                            </div>

                            <div className="form-row-3col">
                                <div className="form-group">
                                    <label className="form-label">Joining Fee</label>
                                    <input
                                        type="text"
                                        className="studio-input"
                                        placeholder="e.g. ₹2,500 + Taxes or ₹0 (Free)"
                                        value={formData.joiningFee}
                                        onChange={e => setFormData({ ...formData, joiningFee: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Annual Renewal Fee</label>
                                    <input
                                        type="text"
                                        className="studio-input"
                                        placeholder="e.g. ₹2,500 or ₹0"
                                        value={formData.annualFee}
                                        onChange={e => setFormData({ ...formData, annualFee: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Renewal Fee Waiver Rule</label>
                                    <input
                                        type="text"
                                        className="studio-input"
                                        placeholder="e.g. Waived on ₹2 Lakh annual spend"
                                        value={formData.feeWaiver}
                                        onChange={e => setFormData({ ...formData, feeWaiver: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: VISUAL ASSET & LIVE PREVIEW */}
                        <div className="card-form-section">
                            <div className="section-header-title">
                                <span className="section-badge-num">3</span>
                                <h4>Card Artwork & Live Visual Preview</h4>
                            </div>

                            <div className="artwork-preview-grid">
                                <div className="artwork-inputs-col">
                                    <label className="form-label">Upload Card Image or Paste URL</label>
                                    <div className="artwork-actions-row">
                                        <button
                                            type="button"
                                            className="studio-btn studio-btn-primary"
                                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                            <span>Upload Image from PC</span>
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleImageUpload}
                                        />
                                    </div>

                                    <div className="or-divider"><span>OR PASTE IMAGE URL</span></div>

                                    <input
                                        type="text"
                                        className="studio-input"
                                        placeholder="https://example.com/card-image.png"
                                        value={formData.imageUrl.startsWith('data:') ? '[Base64 Local Image Loaded]' : formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />

                                    {formData.imageUrl && (
                                        <button
                                            type="button"
                                            className="remove-img-btn mt-2"
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                        >
                                            Remove Artwork &times;
                                        </button>
                                    )}
                                </div>

                                <div className="artwork-card-preview-col">
                                    <span className="preview-label">Live Card Preview:</span>
                                    <div className="mini-card-mockup">
                                        {formData.imageUrl ? (
                                            <img src={formData.imageUrl} alt="Card preview" className="mockup-img" />
                                        ) : (
                                            <div className="mockup-placeholder">
                                                <div className="mockup-chip" />
                                                <span className="mockup-bank">{currentBankDisplay}</span>
                                                <span className="mockup-brand">BEEFUND VIP</span>
                                            </div>
                                        )}
                                        <div className="mockup-meta">
                                            <span className="mockup-title">{formData.name || 'Card Name Preview'}</span>
                                            <span className="mockup-category">{formData.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: VALUE PROPOSITION & EDITORIAL DESCRIPTION */}
                        <div className="card-form-section">
                            <div className="section-header-title">
                                <span className="section-badge-num">4</span>
                                <h4>Customer Value Proposition & Tagline</h4>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Catchy Tagline (Shown right under card title)</label>
                                <input
                                    type="text"
                                    className="studio-input"
                                    placeholder="e.g. Unlimited 5% cashback on all online merchant purchases with zero spend restrictions."
                                    value={formData.tagline}
                                    onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Detailed Description / Who Is This Card For?</label>
                                <textarea
                                    className="studio-textarea"
                                    rows={3}
                                    placeholder="Write a clear 2-3 sentence summary detailing milestone vouchers, reward structures, dining privileges, and why customers should apply..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* SECTION 5: INTERACTIVE BENEFITS CAROUSEL */}
                        <div className="card-form-section">
                            <div className="section-header-bar">
                                <div className="section-header-title">
                                    <span className="section-badge-num">5</span>
                                    <div>
                                        <h4>Interactive Benefits Carousel Builder</h4>
                                        <p className="section-desc">Each slide below rotates in the interactive carousel on the card tile.</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddBenefit}
                                    className="studio-btn studio-btn-primary btn-sm"
                                >
                                    + Add Benefit Slide
                                </button>
                            </div>

                            <div className="benefits-builder-list">
                                {formData.benefits.map((b, idx) => (
                                    <div key={idx} className="benefit-builder-card">
                                        <div className="benefit-card-top">
                                            <span className="benefit-slide-indicator">Slide #{idx + 1}</span>
                                            <select
                                                className="studio-select benefit-theme-select"
                                                value={b.icon || 'rewards'}
                                                onChange={e => handleUpdateBenefit(idx, 'icon', e.target.value)}
                                            >
                                                {BENEFIT_THEMES.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                            {formData.benefits.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="benefit-remove-btn"
                                                    onClick={() => handleRemoveBenefit(idx)}
                                                    title="Delete this slide"
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </div>

                                        <div className="benefit-card-inputs">
                                            <input
                                                type="text"
                                                className="studio-input"
                                                placeholder="Benefit Heading (e.g. Airport Lounge Access)"
                                                value={b.title}
                                                onChange={e => handleUpdateBenefit(idx, 'title', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="studio-input"
                                                placeholder="Short Description (e.g. 12 complimentary lounge visits annually nationwide via Priority Pass)"
                                                value={b.desc}
                                                onChange={e => handleUpdateBenefit(idx, 'desc', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECTION 6: DIRECT APPLY LINK & SANCTION PDF */}
                        <div className="card-form-section">
                            <div className="section-header-title">
                                <span className="section-badge-num">6</span>
                                <h4>Direct Apply Link & Official PDF Document</h4>
                            </div>

                            <div className="form-row-2col">
                                <div className="form-group affiliate-link-group">
                                    <label className="form-label">Official Apply URL * (Opens in New Tab)</label>
                                    <div className="affiliate-apply-input-wrap">
                                        <input
                                            type="url"
                                            className="studio-input"
                                            placeholder="https://apply.bank.com/card-application"
                                            value={formData.applyLink}
                                            onChange={e => setFormData({ ...formData, applyLink: e.target.value })}
                                            required
                                        />
                                        {formData.applyLink && (
                                            <a
                                                href={formData.applyLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="test-link-btn"
                                                title="Open and test link in new tab"
                                            >
                                                Test ↗
                                            </a>
                                        )}
                                    </div>
                                    <span className="form-input-hint">
                                        This is the exact destination visitors will be sent to when clicking "Apply Now" on your website.
                                    </span>
                                </div>

                                <div className="form-group official-doc-group">
                                    <label className="form-label">Official Terms / Sanction PDF (Optional)</label>
                                    <div className="doc-field-inputs">
                                        <input
                                            type="text"
                                            className="studio-input"
                                            placeholder="Doc Name (e.g. HDFC Regalia MITC Schedule PDF)"
                                            value={formData.docName}
                                            onChange={e => setFormData({ ...formData, docName: e.target.value })}
                                        />
                                        <div className="doc-upload-action-row">
                                            <button
                                                type="button"
                                                className="studio-btn studio-btn-secondary"
                                                onClick={() => pdfInputRef.current && pdfInputRef.current.click()}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                    <polyline points="14 2 14 8 20 8"/>
                                                </svg>
                                                <span>Upload PDF from PC</span>
                                            </button>
                                            <input
                                                type="file"
                                                ref={pdfInputRef}
                                                accept=".pdf"
                                                style={{ display: 'none' }}
                                                onChange={handlePdfUpload}
                                            />
                                            {formData.docUrl && (
                                                <span className="doc-status-badge">
                                                    ✓ Attached
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 7: PUBLISHING STATUS */}
                        <div className="card-form-section status-section">
                            <div className="section-header-title">
                                <span className="section-badge-num">7</span>
                                <h4>Website Publishing Visibility</h4>
                            </div>

                            <div className="status-radio-options">
                                <label className={`status-pill-option ${formData.status === 'active' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="active"
                                        checked={formData.status === 'active'}
                                        onChange={() => setFormData({ ...formData, status: 'active' })}
                                    />
                                    <span className="status-dot green" />
                                    <div>
                                        <strong>Active & Live</strong>
                                        <small>Card will be immediately visible on the /credit-cards showcase.</small>
                                    </div>
                                </label>

                                <label className={`status-pill-option ${formData.status === 'inactive' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="inactive"
                                        checked={formData.status === 'inactive'}
                                        onChange={() => setFormData({ ...formData, status: 'inactive' })}
                                    />
                                    <span className="status-dot gray" />
                                    <div>
                                        <strong>Draft / Hidden</strong>
                                        <small>Card is saved in admin studio but hidden from public visitors.</small>
                                    </div>
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="card-editor-footer">
                        <button type="button" className="studio-btn studio-btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="studio-btn studio-btn-primary save-btn">
                            💾 Save & Publish Credit Card
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardEditorModal;

