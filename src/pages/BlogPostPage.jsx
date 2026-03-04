import React from 'react';
import { useParams, Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts.json';
import HexagonBackground from '../components/HexagonBackground';
import './BlogPage.css';

const BlogPostPage = () => {
    const { slug } = useParams();
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="blog-post-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div>
                    <h1 className="blog-hero-title mb-4">Post Not Found</h1>
                    <Link to="/blog" className="blog-cta-btn">Back to Blog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-post-page">
            <HexagonBackground opacity={0.03} />

            <div className="blog-post-container">
                <Link to="/blog" className="back-link">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to all insights
                </Link>

                <header className="blog-post-header">
                    <h1 className="blog-post-title">{post.title}</h1>
                    <div className="blog-post-meta">
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>&bull;</span>
                        <span className="author">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {post.author}
                        </span>
                    </div>
                </header>

                <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className="blog-cta-box mt-5">
                    <h3>Ready to Fuel Your Growth?</h3>
                    <p>Apply for a working capital or business loan today and take your business to the next level.</p>
                    <Link to="/apply" className="blog-cta-btn">Apply Now — Free</Link>
                </div>
            </div>
        </div>
    );
};

export default BlogPostPage;
