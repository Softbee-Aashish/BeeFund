import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './BeePosterCarrier.css';

/* ---- Small Carrier Bee SVG ---- */
const BeeSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="wing-l" d="M12 10C12 10 10 2 6 2C2.5 2 2 6 6 8C8 9 12 10 12 10Z"
            fill="rgba(255,255,255,0.85)" stroke="#fbbf24" strokeWidth="0.8" />
        <path className="wing-r" d="M12 10C12 10 14 2 18 2C21.5 2 22 6 18 8C16 9 12 10 12 10Z"
            fill="rgba(255,255,255,0.85)" stroke="#fbbf24" strokeWidth="0.8" />
        <ellipse cx="12" cy="14" rx="6" ry="8" fill="#f59e0b" />
        <path d="M6.5 13C6.5 13 12 15 17.5 13" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M7 16.5C7 16.5 12 18 17 16.5" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="8" r="3.5" fill="#1f2937" />
        <path d="M10.5 5.5L9 3" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13.5 5.5L15 3" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 22L12 24" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

/* ---- SVG Icons ---- */
const ICONS = {
    briefcase: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /><path d="M12 12v.01" /></svg>),
    factory: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20" /><path d="M5 20V8l5 4V8l5 4V4h4a1 1 0 011 1v15" /><path d="M9 20v-2h4v2" /></svg>),
    home: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>),
    building: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 6h1M14 6h1M9 10h1M14 10h1M9 14h1M14 14h1M9 18h6" /></svg>),
    car: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 01-2-2v-2l2-5h14l2 5v2a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zM19 17a2 2 0 100 4 2 2 0 000-4z" /></svg>),
    gear: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>),
    shield: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>),
    chart: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>),
    users: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>),
    graduation: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10l-10-5L2 10l10 5 10-5z" /><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" /><path d="M22 10v6" /></svg>),
    truck: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>),
    star: (<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>),
};

/* ---- Helpers ---- */
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutBack = (t) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const cubicBez = (p0, p1, p2, p3, t) => { const u = 1 - t; return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3; };

const getStart = (dir) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    switch (dir) {
        case 'left': return { x: -(380), y: 0 };
        case 'right': return { x: vw + 100, y: 0 };
        case 'bottom': return { x: 0, y: 400 };
        default: return { x: -(380), y: 0 };
    }
};


const BeePosterCarrier = ({
    direction = 'left',
    icon = 'briefcase',
    name = 'Loan Product',
    description = '',
    tags = [],
    ctaText = 'Apply Now',
    ctaLink = '/apply',
    delay = 0,
}) => {
    const wrapperRef = useRef(null);
    const cardRef = useRef(null);
    const rafRef = useRef(null);
    const gravityRaf = useRef(null);
    const scrollTimer = useRef(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const [triggered, setTriggered] = useState(false);
    const [settled, setSettled] = useState(false);
    const [struggling, setStruggling] = useState(false);
    const [visible, setVisible] = useState(true); // scroll visibility
    const gravState = useRef({ vel: 0, offset: 0, phase: 0 });
    const entryDone = useRef(false);
    const isInView = useRef(true);

    // Mouse tracking for bee reaction
    useEffect(() => {
        const onMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    // Mouse proximity check — makes bees react when pointer is near
    useEffect(() => {
        if (!settled || !cardRef.current) return;
        let mouseRaf;
        const checkMouse = () => {
            const card = cardRef.current;
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = mouseRef.current.x - cx;
            const dy = mouseRef.current.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 180) {
                // Mouse is close — push card slightly away
                const force = Math.max(0, (180 - dist) / 180);
                const pushX = -(dx / dist) * force * 8;
                const pushY = -(dy / dist) * force * 6;
                const tilt = (dx / dist) * force * 3;
                card.style.transform = `translate(${pushX}px, ${pushY}px) rotate(${tilt}deg)`;
                setStruggling(true);
            } else if (dist < 250 && struggling) {
                // Easing back zone
                setStruggling(false);
                card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
                card.style.transform = 'translate(0,0)';
                setTimeout(() => { if (card) card.style.transition = ''; }, 500);
            }
            mouseRaf = requestAnimationFrame(checkMouse);
        };
        mouseRaf = requestAnimationFrame(checkMouse);
        return () => cancelAnimationFrame(mouseRaf);
    }, [settled, struggling]);

    // IntersectionObserver — trigger entry + track visibility
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting && !triggered) {
                    setTriggered(true);
                }
                isInView.current = e.isIntersecting;
            },
            { threshold: 0.1, rootMargin: '60px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [triggered]);

    // Scroll direction fade — cards fade out when scrolled past top, fade back when scrolled up
    useEffect(() => {
        if (!entryDone.current) return;
        let lastY = window.scrollY;
        let fadeTick;

        const onScroll = () => {
            cancelAnimationFrame(fadeTick);
            fadeTick = requestAnimationFrame(() => {
                const el = wrapperRef.current;
                const card = cardRef.current;
                if (!el || !card) return;
                const rect = el.getBoundingClientRect();
                const nowY = window.scrollY;
                const scrollingDown = nowY > lastY;
                lastY = nowY;

                // Card is above viewport — fade out (bees carrying away)
                if (rect.bottom < -20) {
                    if (visible) {
                        setVisible(false);
                        card.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
                        card.style.opacity = '0';
                        card.style.transform = `translateY(-40px) scale(0.9) rotate(${direction === 'left' ? -5 : 5}deg)`;
                    }
                }
                // Card is back in view — fade in (bees bring it back)
                else if (rect.top < window.innerHeight && rect.bottom > 0) {
                    if (!visible) {
                        setVisible(true);
                        card.style.transition = 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translate(0,0)';
                        setStruggling(true);
                        setTimeout(() => { setStruggling(false); if (card) card.style.transition = ''; }, 800);
                    }
                }
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(fadeTick); };
    }, [settled, visible, direction]);

    // Entry animation
    useEffect(() => {
        if (!triggered || !cardRef.current) return;
        const card = cardRef.current;
        const start = getStart(direction);
        let cp1x, cp1y, cp2x, cp2y;
        if (direction === 'left') { cp1x = start.x * 0.4; cp1y = -50; cp2x = -30; cp2y = -15; }
        else if (direction === 'right') { cp1x = start.x * 0.6; cp1y = -50; cp2x = 60; cp2y = -15; }
        else { cp1x = -30; cp1y = start.y * 0.5; cp2x = 15; cp2y = 40; }

        const DUR = 1600;
        let startTime = null;
        card.style.opacity = '0';

        const doAnimate = () => {
            const animate = (ts) => {
                if (!startTime) startTime = ts;
                const elapsed = ts - startTime;
                const rawT = Math.min(elapsed / DUR, 1);
                const t = easeOutBack(rawT);
                const px = cubicBez(start.x, cp1x, cp2x, 0, t);
                const py = cubicBez(start.y, cp1y, cp2y, 0, t);
                const tiltZ = Math.sin(rawT * Math.PI * 3) * (1 - rawT) * 3;
                const rotY = direction === 'left' ? lerp(6, 0, t) : direction === 'right' ? lerp(-6, 0, t) : 0;

                card.style.opacity = String(Math.min(rawT * 4, 1));
                card.style.transform = `translate(${px}px, ${py}px) perspective(600px) rotateY(${rotY}deg) rotate(${tiltZ}deg)`;

                if (rawT < 1) {
                    rafRef.current = requestAnimationFrame(animate);
                } else {
                    card.style.transform = 'translate(0,0)';
                    card.style.transition = '';
                    entryDone.current = true;
                    setSettled(true);
                }
            };
            rafRef.current = requestAnimationFrame(animate);
        };
        const timer = setTimeout(doAnimate, delay);
        return () => { clearTimeout(timer); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [triggered, direction, delay]);

    // Gravity on scroll stop
    const startGravity = useCallback(() => {
        if (!entryDone.current || !cardRef.current || !visible) return;
        const g = gravState.current;
        g.vel = 0; g.offset = 0; g.phase = 0;
        setStruggling(true);
        const tick = () => {
            g.vel += 0.12;
            if (g.offset > 4) { g.vel -= 0.35; g.vel *= 0.9; }
            g.offset += g.vel;
            if (g.offset > 22) { g.offset = 22; g.vel = -g.vel * 0.25; }
            if (g.offset < -1.5) { g.offset = -1.5; g.vel = -g.vel * 0.25; }
            g.phase += 0.1;
            const wobble = Math.sin(g.phase) * (g.offset / 22) * 3;
            if (cardRef.current) {
                cardRef.current.style.transform = `translate(0, ${g.offset}px) rotate(${wobble}deg)`;
            }
            if (Math.abs(g.vel) < 0.05 && Math.abs(g.offset) < 0.5 && g.offset > 0) {
                if (cardRef.current) cardRef.current.style.transform = 'translate(0,0)';
                setStruggling(false);
                return;
            }
            gravityRaf.current = requestAnimationFrame(tick);
        };
        gravityRaf.current = requestAnimationFrame(tick);
    }, [visible]);

    const stopGravity = useCallback(() => {
        if (gravityRaf.current) cancelAnimationFrame(gravityRaf.current);
        gravState.current = { vel: 0, offset: 0, phase: 0 };
        setStruggling(false);
        if (cardRef.current && entryDone.current) {
            cardRef.current.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
            cardRef.current.style.transform = 'translate(0,0)';
            setTimeout(() => { if (cardRef.current) cardRef.current.style.transition = ''; }, 400);
        }
    }, []);

    useEffect(() => {
        if (!settled) return;
        const onScroll = () => {
            stopGravity();
            clearTimeout(scrollTimer.current);
            scrollTimer.current = setTimeout(startGravity, 900);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        scrollTimer.current = setTimeout(startGravity, 3500);
        return () => { window.removeEventListener('scroll', onScroll); clearTimeout(scrollTimer.current); stopGravity(); };
    }, [settled, startGravity, stopGravity]);

    useEffect(() => () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (gravityRaf.current) cancelAnimationFrame(gravityRaf.current);
        clearTimeout(scrollTimer.current);
    }, []);

    const beeClass = `card-bee${struggling ? ' bee-struggle' : ''}`;
    const iconSvg = ICONS[icon] || ICONS.briefcase;

    return (
        <div ref={wrapperRef} className="bee-card-wrapper">
            <div ref={cardRef} className="bee-card" style={{ opacity: 0 }}>
                <div className={`${beeClass} card-bee--1`}><BeeSVG /></div>
                <div className={`${beeClass} card-bee--2`}><BeeSVG /></div>
                <div className={`${beeClass} card-bee--3`}><BeeSVG /></div>
                <div className="card-thread card-thread--1" />
                <div className="card-thread card-thread--2" />
                <div className="card-thread card-thread--3" />
                <div className="bee-card-icon">{iconSvg}</div>
                <div className="bee-card-name">{name}</div>
                <div className="bee-card-desc">{description}</div>
                {tags.length > 0 && (
                    <div className="bee-card-meta">
                        {tags.map((t, i) => <span key={i} className="bee-card-tag">{t}</span>)}
                    </div>
                )}
                <Link to={ctaLink} className="bee-card-btn">{ctaText}</Link>
            </div>
        </div>
    );
};

export default BeePosterCarrier;
