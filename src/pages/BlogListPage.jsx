import React from 'react';
import { Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts.json';
import HexagonBackground from '../components/HexagonBackground';
import './BlogPage.css';

const BlogListPage = () => {
    return (
        <div className="blog-page">
            <HexagonBackground opacity={0.05} />

            <section className="blog-hero">
                <div className="container">
                    <span className="blog-hero-badge">Insights & Updates</span>
                    <h1 className="blog-hero-title">
                        Grow Your Business with <span>Expert Advice</span>
                    </h1>
                    <p className="blog-hero-subtitle">
                        Stay informed with the latest financial strategies, loan market trends, and growth tips tailored for Indian businesses.
                    </p>
                </div>
            </section>

            <div className="blog-grid">
                {blogPosts.map(post => (
                    <div key={post.id} className="blog-card">
                        <div className="blog-card-meta">
                            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>&bull;</span>
                            <span className="author">{post.author}</span>
                        </div>
                        <h3 className="blog-card-title">{post.title}</h3>
                        <p className="blog-card-excerpt">{post.excerpt}</p>
                        <Link to={`/blog/${post.slug}`} className="blog-card-btn">
                            Read Article
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogListPage;
