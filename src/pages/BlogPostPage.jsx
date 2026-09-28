import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useEnquiryModal } from '../context/EnquireModalContext';
import HexagonBackground from '../components/HexagonBackground';
import AdSenseSlot from '../components/AdSenseSlot';
import './BlogPage.css';

const BlogPostPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { getPostBySlug, publishedPosts } = useBlogs();
    const { isAuthenticated } = useAdminAuth();
    const { openEnquiryModal } = useEnquiryModal();

    // Scroll reading progress
    const [readingProgress, setReadingProgress] = useState(0);
    // Copy link toast notification
    const [copiedToast, setCopiedToast] = useState(false);
    // Table of contents active item
    const [activeSection, setActiveSection] = useState('');
    // Feed Tab Filter: 'related' | 'latest' | 'older' | 'all'
    const [feedTab, setFeedTab] = useState('related');

    // If logged in as admin, allow viewing draft posts
    const post = getPostBySlug(slug, isAuthenticated);

    // Dynamic SEO Meta & JSON-LD Article Schema
    useEffect(() => {
        if (!post) return;

        const originalTitle = document.title;
        document.title = `${post.title} | BeeFund Financial Blog`;

        let metaDesc = document.querySelector('meta[name="description"]');
        const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';
        if (metaDesc && post.summary) {
            metaDesc.setAttribute('content', post.summary);
        }

        const scriptId = 'blog-post-article-schema';
        let script = document.getElementById(scriptId);
        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }

        const articleSchema = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': post.title,
            'description': post.summary || post.title,
            'image': post.image ? [post.image] : ['https://beefund.in/logo.png'],
            'datePublished': post.date || new Date().toISOString().split('T')[0],
            'dateModified': post.updatedAt || post.date || new Date().toISOString().split('T')[0],
            'author': {
                '@type': 'Person',
                'name': post.author || 'BeeFund Research Team'
            },
            'publisher': {
                '@type': 'Organization',
                'name': 'BeeFund Financial Services',
                'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://beefund.in/logo.png'
                }
            },
            'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': `https://beefund.in/blog/${post.slug}`
            }
        };

        script.text = JSON.stringify(articleSchema);

        return () => {
            document.title = originalTitle;
            if (metaDesc && originalDesc) {
                metaDesc.setAttribute('content', originalDesc);
            }
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, [post]);

    // Track scroll reading progress
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const currentProgress = (window.scrollY / totalHeight) * 100;
                setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Estimated reading time and word count
    const readingStats = useMemo(() => {
        if (!post?.content) return { words: 0, minutes: 1 };
        const text = post.content.replace(/<[^>]*>/g, ' ').trim();
        const words = text ? text.split(/\s+/).length : 0;
        const minutes = Math.max(1, Math.ceil(words / 200));
        return { words, minutes };
    }, [post?.content]);

    // Parse H2 headings for dynamic Table of Contents
    const { processedContent, tocList } = useMemo(() => {
        if (!post?.content) return { processedContent: '', tocList: [] };

        const list = [];
        let counter = 0;

        // Replace <h2> with <h2 id="...">
        const html = post.content.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, text) => {
            const cleanText = text.replace(/<[^>]*>/g, '').trim();
            const id = `heading-${counter++}-${cleanText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}`;
            list.push({ id, text: cleanText });
            return `<h2 id="${id}" class="blog-section-heading"${attrs}>${text}</h2>`;
        });

        return { processedContent: html, tocList: list };
    }, [post?.content]);

    // Split processed content to insert In-Article Native Ad naturally
    const { firstHalfContent, secondHalfContent, hasSplit } = useMemo(() => {
        if (!processedContent) return { firstHalfContent: '', secondHalfContent: '', hasSplit: false };

        const paragraphs = processedContent.split('</p>');
        if (paragraphs.length >= 4) {
            const mid = Math.floor(paragraphs.length / 2);
            return {
                firstHalfContent: paragraphs.slice(0, mid).join('</p>') + '</p>',
                secondHalfContent: paragraphs.slice(mid).join('</p>'),
                hasSplit: true
            };
        }
        return { firstHalfContent: processedContent, secondHalfContent: '', hasSplit: false };
    }, [processedContent]);

    // Adjacent Previous and Next Posts
    const { prevPost, nextPost } = useMemo(() => {
        if (!post || !publishedPosts || publishedPosts.length === 0) {
            return { prevPost: null, nextPost: null };
        }
        const idx = publishedPosts.findIndex(p => p.id === post.id);
        const prev = idx > 0 ? publishedPosts[idx - 1] : null;
        const next = idx >= 0 && idx < publishedPosts.length - 1 ? publishedPosts[idx + 1] : null;
        return { prevPost: prev, nextPost: next };
    }, [post, publishedPosts]);

    // Feed articles based on active tab
    const feedArticles = useMemo(() => {
        if (!post || !publishedPosts) return [];
        const others = publishedPosts.filter(p => p.id !== post.id);

        if (feedTab === 'related') {
            const matching = others.filter(p => p.category === post.category);
            return matching.length > 0 ? matching : others.slice(0, 6);
        }
        if (feedTab === 'latest') {
            return [...others].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
        }
        if (feedTab === 'older') {
            return [...others].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 6);
        }
        // all
        return others.slice(0, 9);
    }, [post, publishedPosts, feedTab]);

    // Copy current link
    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopiedToast(true);
            setTimeout(() => setCopiedToast(false), 2500);
        }
    };

    // Smooth scroll to heading
    const scrollToHeading = (id) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        if (el) {
            const topOffset = 90;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - topOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (!post) {
        return (
            <div className="blog-post-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
                <div>
                    <h1 className="blog-hero-title mb-4">Post Not Found</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>The article you are looking for does not exist or is currently in draft.</p>
                    <button
                        type="button"
                        onClick={() => navigate('/blog')}
                        className="blog-cta-btn"
                    >
                        &larr; Back to All Insights
                    </button>
                </div>
            </div>
        );
    }

    const isDraft = post.status === 'draft';
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    const updatedDate = post.updatedAt ? new Date(post.updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) : formattedDate;

    return (
        <article className="blog-post-page">
            {/* Reading Progress Indicator */}
            <div
                className="blog-reading-progress"
                style={{ width: `${readingProgress}%` }}
                aria-hidden="true"
            />

            <HexagonBackground opacity={0.03} />

            <div className="blog-post-shell">
                {/* Draft Status Banner */}
                {isDraft && (
                    <div className="blog-draft-warning">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <span><strong>Draft Mode:</strong> This article is unpublished and only visible to authorized administrators.</span>
                    </div>
                )}

                {/* Top Navigation Bar: Prominent Back Button + Breadcrumbs */}
                <div className="blog-top-nav-bar">
                    <button
                        type="button"
                        className="blog-back-btn"
                        onClick={() => {
                            if (window.history.length > 2) {
                                navigate(-1);
                            } else {
                                navigate('/blog');
                            }
                        }}
                        title="Go back to previous page or all insights"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <span>Back</span>
                    </button>

                    {/* SEO Breadcrumb Navigation */}
                    <nav className="blog-breadcrumbs" aria-label="Breadcrumbs">
                        <Link to="/">Home</Link>
                        <span className="crumb-sep">/</span>
                        <Link to="/blog">Insights & Guides</Link>
                        <span className="crumb-sep">/</span>
                        {post.category && (
                            <>
                                <span className="crumb-category">{post.category}</span>
                                <span className="crumb-sep">/</span>
                            </>
                        )}
                        <span className="crumb-current">{post.title}</span>
                    </nav>
                </div>

                {/* Article Header */}
                <header className="blog-editorial-header">
                    <div className="blog-editorial-badge-row">
                        <span className="editorial-tag">{post.category || 'Financial Planning'}</span>
                        <span className="editorial-verified-badge" title="Underwritten by BeeFund Advisory Desk">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                            Verified Editorial
                        </span>
                    </div>

                    <h1 className="blog-editorial-title">{post.title}</h1>

                    {post.excerpt && (
                        <p className="blog-editorial-lead">{post.excerpt}</p>
                    )}

                    {/* Author, Date & Reading Meta Bar */}
                    <div className="blog-editorial-meta-bar">
                        <div className="author-info-group">
                            <div className="author-avatar-badge">
                                <img src="/logo.png" alt="BeeFund Desk" className="author-avatar-img" />
                            </div>
                            <div className="author-text-meta">
                                <span className="author-name">{post.author || 'BeeFund Financial Editorial Team'}</span>
                                <div className="date-time-strip">
                                    <span>Published {formattedDate}</span>
                                    {updatedDate !== formattedDate && (
                                        <>
                                            <span className="dot-sep">&bull;</span>
                                            <span>Updated {updatedDate}</span>
                                        </>
                                    )}
                                    <span className="dot-sep">&bull;</span>
                                    <span className="editorial-readtime-badge">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span>{readingStats.minutes} min read</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Social Share Strip */}
                        <div className="social-share-strip">
                            <span className="share-label">Share:</span>
                            <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-icon-btn whatsapp"
                                title="Share on WhatsApp"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.277-.1-.478-.15-.678.15-.2.3-.778.98-.954 1.18-.175.2-.351.226-.652.075s-1.27-.468-2.42-1.493c-.894-.799-1.498-1.786-1.674-2.087-.176-.3-.019-.462.132-.612.136-.135.301-.351.452-.527.15-.175.2-.3.301-.501.1-.2.05-.376-.025-.526s-.678-1.634-.929-2.238c-.244-.589-.493-.509-.678-.519l-.578-.01c-.2 0-.527.075-.802.376s-1.054 1.03-1.054 2.511 1.08 2.912 1.23 3.113c.15.201 2.124 3.243 5.146 4.55.719.311 1.28.497 1.718.636.722.23 1.378.197 1.9.12.581-.087 1.78-.727 2.03-1.43.251-.703.251-1.306.176-1.431-.076-.125-.276-.201-.577-.351z"/>
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.942.553 3.754 1.512 5.289L2 22l4.856-1.472C8.324 21.49 10.108 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.63 0-3.15-.472-4.437-1.286l-.318-.199-2.879.873.882-2.806-.213-.341C4.168 15.11 3.6 13.61 3.6 12c0-4.632 3.768-8.4 8.4-8.4s8.4 3.768 8.4 8.4-3.768 8.4-8.4 8.4z"/>
                                </svg>
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-icon-btn linkedin"
                                title="Share on LinkedIn"
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                </svg>
                            </a>
                            <button
                                type="button"
                                className="share-icon-btn copy"
                                onClick={handleCopyLink}
                                title="Copy link to clipboard"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            </button>
                            {copiedToast && <span className="copied-pill">Link Copied!</span>}
                        </div>
                    </div>
                </header>

                {/* Google AdSense Slot 1: Top Leaderboard (renders only if active) */}
                <AdSenseSlot slotType="top-leaderboard" />

                {/* 2-Column Responsive Editorial Layout (70% Article / 30% Sidebar) */}
                <div className="blog-layout-grid">
                    {/* MAIN COLUMN (Article Content) */}
                    <main className="blog-main-content">
                        {/* Table of Contents Box (If H2 headings exist) */}
                        {tocList.length > 0 && (
                            <nav className="blog-toc-card" aria-label="Table of Contents">
                                <div className="toc-header">
                                    <span className="toc-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                    </span>
                                    <h3 className="toc-title">Table of Contents</h3>
                                </div>
                                <ol className="toc-list">
                                    {tocList.map((item, idx) => (
                                        <li key={item.id} className="toc-item">
                                            <button
                                                type="button"
                                                onClick={() => scrollToHeading(item.id)}
                                                className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
                                            >
                                                <span className="toc-number">{idx + 1}.</span>
                                                <span className="toc-text">{item.text}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        )}

                        {/* Article Content with In-Article Native Ad */}
                        <div className="blog-rich-prose">
                            {hasSplit ? (
                                <>
                                    <div dangerouslySetInnerHTML={{ __html: firstHalfContent }} />

                                    {/* Google AdSense Slot 2: In-Article Native Ad (renders only if active) */}
                                    <AdSenseSlot slotType="in-article" />

                                    <div dangerouslySetInnerHTML={{ __html: secondHalfContent }} />
                                </>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                            )}
                        </div>

                        {/* Author E-E-A-T Bio Box */}
                        <div className="blog-author-bio-card">
                            <div className="bio-avatar">
                                <img src="/logo.png" alt="BeeFund Editorial" className="bio-avatar-img" />
                            </div>
                            <div className="bio-details">
                                <div className="bio-header">
                                    <h4 className="bio-name">{post.author || 'BeeFund Financial Editorial Team'}</h4>
                                    <span className="bio-role">Senior Credit & Debt Advisory Desk</span>
                                </div>
                                <p className="bio-desc">
                                    Authored by institutional lending experts at BeeFund. We research, compare, and simplify credit instruments across 25+ empaneled PSU and private banking partners in India.
                                </p>
                            </div>
                        </div>

                        {/* Financial Regulatory Compliance Disclaimer */}
                        <div className="blog-compliance-disclaimer">
                            <span className="disclaimer-badge">Financial Advisory Notice</span>
                            <p>
                                <strong>Disclaimer:</strong> Information published on BeeFund is intended for general financial awareness and comparative analysis. Loan interest rates, LTV norms, and processing fees are subject to applicant eligibility, credit score, and lender policies. BeeFund charges zero upfront fees to applicants.
                            </p>
                        </div>

                        {/* Compact Working Loan Assistance Strip */}
                        <div className="blog-compact-assistance-strip">
                            <div className="compact-strip-left">
                                <div className="compact-strip-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                </div>
                                <div className="compact-strip-info">
                                    <span className="compact-strip-badge">Zero Brokerage Advisory</span>
                                    <h4 className="compact-strip-title">Looking for tailored loan solutions?</h4>
                                    <p className="compact-strip-desc">Compare interest rates across 25+ partner banks and NBFCs.</p>
                                </div>
                            </div>
                            <div className="compact-strip-actions">
                                <button
                                    type="button"
                                    className="compact-strip-btn-primary"
                                    onClick={() => openEnquiryModal({ defaultLoanType: 'BL', source: `Article: ${post.title}` })}
                                >
                                    Quick Enquiry &rarr;
                                </button>
                                <Link to="/apply" className="compact-strip-btn-secondary">
                                    Apply Now
                                </Link>
                            </div>
                        </div>

                        {/* Google AdSense Slot 3: Bottom Banner (renders only if active) */}
                        <AdSenseSlot slotType="bottom-banner" />

                        {/* Previous & Next Post Jump Navigation */}
                        {(prevPost || nextPost) && (
                            <nav className="blog-adjacent-nav" aria-label="Adjacent Articles">
                                {prevPost ? (
                                    <Link to={`/blog/${prevPost.slug}`} className="adjacent-card prev">
                                        <span className="adjacent-dir">&larr; Previous Article</span>
                                        <span className="adjacent-title">{prevPost.title}</span>
                                        <span className="adjacent-cat">{prevPost.category}</span>
                                    </Link>
                                ) : (
                                    <div className="adjacent-card-placeholder" />
                                )}

                                {nextPost ? (
                                    <Link to={`/blog/${nextPost.slug}`} className="adjacent-card next">
                                        <span className="adjacent-dir">Next Article &rarr;</span>
                                        <span className="adjacent-title">{nextPost.title}</span>
                                        <span className="adjacent-cat">{nextPost.category}</span>
                                    </Link>
                                ) : (
                                    <div className="adjacent-card-placeholder" />
                                )}
                            </nav>
                        )}
                    </main>

                    {/* SIDEBAR COLUMN (Sticky Ads, Calculator Teaser, Trending Posts) */}
                    <aside className="blog-sidebar">
                        {/* Google AdSense Slot 4: Sidebar Rectangle (renders only if active) */}
                        <AdSenseSlot slotType="sidebar-rectangle" />

                        {/* Quick EMI Calculator Widget Card */}
                        <div className="sidebar-widget-card loan-calc-widget">
                            <div className="widget-header">
                                <span className="widget-badge">Free Interactive Tool</span>
                                <h4 className="widget-title">Calculate Monthly EMI</h4>
                            </div>
                            <p className="widget-desc">
                                Planning a Business Loan, Home Loan, or LAP? Check your exact monthly EMI and total interest outgo.
                            </p>
                            <Link to="/tools/emi-calculator" className="widget-action-btn">
                                Open EMI Calculator &rarr;
                            </Link>
                        </div>

                        {/* Trending Articles List in Sidebar */}
                        {publishedPosts.length > 1 && (
                            <div className="sidebar-widget-card trending-widget">
                                <div className="widget-header">
                                    <h4 className="widget-title">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: '6px' }} aria-hidden="true">
                                            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z" />
                                        </svg>
                                        Fast Jump Guides
                                    </h4>
                                </div>
                                <div className="trending-list">
                                    {publishedPosts.filter(p => p.id !== post.id).slice(0, 4).map((rp, i) => (
                                        <Link key={rp.id} to={`/blog/${rp.slug}`} className="trending-item">
                                            <span className="trending-rank">0{i + 1}</span>
                                            <div className="trending-info">
                                                <span className="trending-title">{rp.title}</span>
                                                <span className="trending-date">
                                                    {new Date(rp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Google AdSense Slot 5: Sticky Half-Page (renders only if active) */}
                        <AdSenseSlot slotType="sidebar-halfpage" />
                    </aside>
                </div>

                {/* ========================================================
                    INTERACTIVE ARTICLE FEED & DISCOVERY DESK
                    Allows readers to jump to related, latest, or older articles
                    ======================================================== */}
                {publishedPosts.length > 1 && (
                    <section className="blog-feed-discovery-section">
                        <div className="feed-discovery-header">
                            <div className="feed-header-left">
                                <span className="feed-badge">Continuous Feed</span>
                                <h3 className="feed-title">Explore Financial Guides & Insights</h3>
                                <p className="feed-subtitle">
                                    Jump directly into latest market trends, category deep-dives, or timeless financial strategies.
                                </p>
                            </div>

                            {/* Tab Controls: Related, Latest, Older, All */}
                            <div className="feed-tabs-row">
                                <button
                                    type="button"
                                    className={`feed-tab-btn ${feedTab === 'related' ? 'active' : ''}`}
                                    onClick={() => setFeedTab('related')}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" />
                                        <circle cx="12" cy="12" r="6" />
                                        <circle cx="12" cy="12" r="2" />
                                    </svg>
                                    <span>Related Topic</span>
                                </button>
                                <button
                                    type="button"
                                    className={`feed-tab-btn ${feedTab === 'latest' ? 'active' : ''}`}
                                    onClick={() => setFeedTab('latest')}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z" />
                                    </svg>
                                    <span>Latest</span>
                                </button>
                                <button
                                    type="button"
                                    className={`feed-tab-btn ${feedTab === 'older' ? 'active' : ''}`}
                                    onClick={() => setFeedTab('older')}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 8 14" />
                                    </svg>
                                    <span>Older Classics</span>
                                </button>
                                <button
                                    type="button"
                                    className={`feed-tab-btn ${feedTab === 'all' ? 'active' : ''}`}
                                    onClick={() => setFeedTab('all')}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    </svg>
                                    <span>All Articles ({publishedPosts.length - 1})</span>
                                </button>
                            </div>
                        </div>

                        {/* Feed Articles Cards Grid */}
                        <div className="feed-articles-grid">
                            {feedArticles.map(art => {
                                const artDate = new Date(art.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                });
                                const wordCount = (art.content || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
                                const readTime = Math.max(1, Math.ceil(wordCount / 200));

                                return (
                                    <article key={art.id} className="feed-article-card">
                                        <div className="feed-card-header">
                                            <span className="feed-card-tag">{art.category || 'Financial Planning'}</span>
                                            <span className="feed-card-time">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                <span>{readTime} min read</span>
                                            </span>
                                        </div>

                                        <h4 className="feed-card-title">
                                            <Link to={`/blog/${art.slug}`}>{art.title}</Link>
                                        </h4>

                                        <p className="feed-card-excerpt">
                                            {art.excerpt || 'Essential insights on commercial financing and growth strategies.'}
                                        </p>

                                        <div className="feed-card-footer">
                                            <span className="feed-card-date">{artDate}</span>
                                            <Link to={`/blog/${art.slug}`} className="feed-card-jump-btn">
                                                <span>Read Article</span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                    <polyline points="12 5 19 12 12 19" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </article>
    );
};

export default BlogPostPage;
