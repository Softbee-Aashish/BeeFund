import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import HexagonBackground from '../components/HexagonBackground';
import AdSenseSlot from '../components/AdSenseSlot';
import './BlogPage.css';

const BlogListPage = () => {
    const { publishedPosts } = useBlogs();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Extract all unique categories
    const categories = useMemo(() => {
        const set = new Set();
        (publishedPosts || []).forEach(p => {
            if (p.category) set.add(p.category);
        });
        return ['all', ...Array.from(set)];
    }, [publishedPosts]);

    // Filtered posts
    const filteredPosts = useMemo(() => {
        return (publishedPosts || []).filter(post => {
            const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
            const query = searchQuery.toLowerCase().trim();
            const matchesQuery = !query || 
                post.title.toLowerCase().includes(query) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
                (post.category && post.category.toLowerCase().includes(query)) ||
                (post.author && post.author.toLowerCase().includes(query));
            return matchesCat && matchesQuery;
        });
    }, [publishedPosts, selectedCategory, searchQuery]);

    return (
        <div className="blog-page">
            <HexagonBackground opacity={0.04} />

            <section className="blog-hero">
                <div className="blog-hero-shell">
                    <span className="blog-hero-badge">BeeFund Financial Editorial Desk</span>
                    <h1 className="blog-hero-title">
                        Expert Business & <span>Lending Insights</span>
                    </h1>
                    <p className="blog-hero-subtitle">
                        Navigate commercial finance with in-depth borrowing strategies, institutional rate benchmarks, and MSME growth guides.
                    </p>

                    {/* Search Bar */}
                    <div className="blog-search-wrap">
                        <div className="blog-search-box">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search financial guides, schemes, OD/CC, tax tips..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="blog-search-clear" onClick={() => setSearchQuery('')}>&times;</button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    {categories.length > 2 && (
                        <div className="blog-category-pills">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`blog-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat === 'all' ? 'All Guides' : cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Google AdSense Leaderboard Slot */}
            <div className="blog-listing-ad-shell">
                <AdSenseSlot slotType="top-leaderboard" />
            </div>

            {/* Articles Grid */}
            <div className="blog-listing-shell">
                {filteredPosts.length === 0 ? (
                    <div className="blog-no-results">
                        <h3>No articles found</h3>
                        <p>No published financial guides matched "{searchQuery}". Try a different keyword or reset filters.</p>
                        <button
                            type="button"
                            className="blog-cta-btn"
                            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                        >
                            Reset Search Filters
                        </button>
                    </div>
                ) : (
                    <div className="blog-grid">
                        {filteredPosts.map(post => {
                            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            });
                            // Reading time
                            const wordCount = (post.content || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
                            const readTime = Math.max(1, Math.ceil(wordCount / 200));

                            return (
                                <article key={post.id} className="blog-card">
                                    <div className="blog-card-header">
                                        <span className="blog-card-category">{post.category || 'Financial Planning'}</span>
                                        <span className="blog-card-readtime">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            <span>{readTime} min read</span>
                                        </span>
                                    </div>

                                    <h3 className="blog-card-title">
                                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h3>

                                    <p className="blog-card-excerpt">
                                        {post.excerpt || 'Read in-depth analysis and practical financial guidance.'}
                                    </p>

                                    <div className="blog-card-footer">
                                        <div className="blog-card-author">
                                            <span className="card-avatar">
                                                <img src="/logo.png" alt="BeeFund Desk" className="card-avatar-img" />
                                            </span>
                                            <span className="card-author-name">{post.author || 'BeeFund Desk'}</span>
                                        </div>
                                        <span className="blog-card-date">{formattedDate}</span>
                                    </div>

                                    <Link to={`/blog/${post.slug}`} className="blog-card-btn">
                                        <span>Read Full Guide</span>
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Bottom In-Feed Ad Banner */}
            <div className="blog-listing-ad-shell">
                <AdSenseSlot slotType="bottom-banner" />
            </div>
        </div>
    );
};

export default BlogListPage;
