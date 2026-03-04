import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const BEE_COUNT = 8;
const random = (min, max) => Math.random() * (max - min) + min;

// Track displaced elements so bees can "grab" text
const displacedElements = new Map(); // element -> { dx, dy, rot, beeIndex }

const displaceElement = (el, beeIndex) => {
    if (!el || el.closest('.bee-card, .bee-card-wrapper, .card-bee, header, nav')) return;
    if (displacedElements.has(el)) return; // already displaced
    const dx = random(-3, 3);
    const dy = random(-2, 3);
    const rot = random(-1.5, 1.5);
    el.style.transition = 'transform 0.3s ease-out';
    el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
    el.style.transformOrigin = 'center center';
    displacedElements.set(el, { dx, dy, rot, beeIndex });
};

const restoreElement = (el) => {
    if (!el || !displacedElements.has(el)) return;
    el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.transform = '';
    setTimeout(() => {
        if (el) { el.style.transition = ''; el.style.transform = ''; }
    }, 700);
    displacedElements.delete(el);
};

// Each bee has its OWN independent schedule
const createBee = (i) => ({
    x: window.innerWidth / 2 + random(-150, 150),
    y: random(80, 300),
    vx: random(-1, 1),
    vy: random(-1, 1),
    rotation: random(0, 360),
    opacity: 0,
    scale: random(0.75, 1.15),
    state: 'FLYING',
    targetX: null,
    targetY: null,
    // STAGGERED initial schedules so bees never all stop at once
    nextLandTime: performance.now() + random(500, 3000) + i * 400,
    takeoffTime: null,
    wanderAngle: random(0, Math.PI * 2),
    personalSpeed: random(1.2, 2.2), // Each bee has its own speed personality
    landedElement: null // track which element this bee is displacing
});

// Find a random landing target for ONE bee
const findLandingTarget = () => {
    const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, button, .card, img, label, a'));
    const w = window.innerWidth;
    const h = window.innerHeight;
    const validRects = [];

    for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 10 && rect.height > 10 &&
            rect.top < h && rect.bottom > 0 &&
            rect.left < w && rect.right > 0) {
            validRects.push(rect);
        }
    }

    // 50% chance element, 50% random spot
    if (validRects.length > 0 && Math.random() < 0.5) {
        const rect = validRects[Math.floor(Math.random() * validRects.length)];
        return {
            x: random(rect.left + 5, rect.right - 5),
            y: random(rect.top - 10, rect.top + 10)
        };
    }
    return {
        x: random(60, w - 60),
        y: random(60, h - 80)
    };
};

const BeeSwarm = () => {
    const location = useLocation();
    const beesRef = useRef(Array.from({ length: BEE_COUNT }, (_, i) => createBee(i)));
    const beeNodesRef = useRef([]);
    const animationFrameRef = useRef(null);
    const audioRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const lastScrollY = useRef(0);

    // Audio & Mouse tracking
    useEffect(() => {
        try {
            audioRef.current = new Audio('/buzz.mp3');
            audioRef.current.volume = 0.2;
        } catch (e) { /* */ }

        const clickHandler = (e) => {
            const target = e.target.closest('.btn, .card');
            if (target && audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => { });
            }
        };
        const mouseMoveHandler = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        document.addEventListener('click', clickHandler);
        window.addEventListener('mousemove', mouseMoveHandler);

        // Fade in staggered
        beesRef.current.forEach((b, i) => {
            setTimeout(() => {
                b.opacity = 1;
                if (beeNodesRef.current[i]) {
                    beeNodesRef.current[i].style.opacity = '1';
                }
            }, 300 + i * 150);
        });

        return () => {
            document.removeEventListener('click', clickHandler);
            window.removeEventListener('mousemove', mouseMoveHandler);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    // Main Physics Loop – each bee is independently scheduled
    useEffect(() => {
        let lastTime = performance.now();

        const loop = (time) => {
            let dt = (time - lastTime) / 16.66;
            if (dt > 3) dt = 3;
            lastTime = time;

            const WANDER_STRENGTH = 0.2;
            const MOUSE_REPEL_RADIUS = 150;
            const MOUSE_REPEL_FORCE = 1.5;
            const STEER_FORCE = 0.06;
            const width = window.innerWidth;
            const height = window.innerHeight;

            beesRef.current.forEach((bee, i) => {
                let { x, y, vx, vy, rotation, state, targetX, targetY,
                    takeoffTime, nextLandTime, wanderAngle, personalSpeed } = bee;

                // Mouse repel
                const dxM = x - mouseRef.current.x;
                const dyM = y - mouseRef.current.y;
                const distM = Math.sqrt(dxM * dxM + dyM * dyM);

                if (distM < MOUSE_REPEL_RADIUS && distM > 0) {
                    if (state !== 'FLYING') {
                        state = 'FLYING';
                        // Restore displaced element on mouse scare
                        if (bee.landedElement) {
                            restoreElement(bee.landedElement);
                            bee.landedElement = null;
                        }
                        targetX = null; targetY = null;
                        takeoffTime = null;
                        nextLandTime = time + random(2000, 4000);
                    }
                    const force = (MOUSE_REPEL_RADIUS - distM) / MOUSE_REPEL_RADIUS * MOUSE_REPEL_FORCE;
                    vx += (dxM / distM) * force;
                    vy += (dyM / distM) * force;
                }

                // ---- PER-BEE INDEPENDENT SCHEDULING ----

                // If FLYING and it's time to land, pick a target
                if (state === 'FLYING' && time > nextLandTime) {
                    const t = findLandingTarget();
                    targetX = t.x;
                    targetY = t.y;
                    state = 'LANDING';
                }

                // If LANDED and it's time to take off, go
                if (state === 'LANDED' && time > takeoffTime) {
                    state = 'FLYING';
                    // Restore displaced element when bee leaves
                    if (bee.landedElement) {
                        restoreElement(bee.landedElement);
                        bee.landedElement = null;
                    }
                    targetX = null; targetY = null;
                    takeoffTime = null;
                    vy -= random(1, 3);
                    vx += random(-2, 2);
                    // Schedule next landing independently
                    nextLandTime = time + random(2000, 6000);
                }

                // ---- PHYSICS ----
                let isFlapping = true;

                if (state === 'FLYING') {
                    wanderAngle += random(-0.6, 0.6);
                    vx += Math.cos(wanderAngle) * WANDER_STRENGTH;
                    vy += Math.sin(wanderAngle) * WANDER_STRENGTH;

                    // Soft boundaries
                    if (x < 60) vx += 0.12;
                    if (x > width - 60) vx -= 0.12;
                    if (y < 60) vy += 0.12;
                    if (y > height - 60) vy -= 0.12;

                    const speed = Math.sqrt(vx * vx + vy * vy);
                    if (speed > personalSpeed) {
                        vx = (vx / speed) * personalSpeed;
                        vy = (vy / speed) * personalSpeed;
                    }

                } else if (state === 'LANDING') {
                    const dx = targetX - x;
                    const dy = targetY - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 6) {
                        state = 'LANDED';
                        vx = 0; vy = 0;
                        x = targetX; y = targetY;
                        // Each bee sits for a DIFFERENT random duration
                        takeoffTime = time + random(1200, 5000);
                        rotation = random(-25, 25);
                        isFlapping = false;
                        // Displace nearby text element
                        try {
                            const nearEl = document.elementFromPoint(x, y);
                            if (nearEl && nearEl.closest && !nearEl.closest('header, nav, .bee-card-wrapper')) {
                                const tag = nearEl.tagName;
                                if (['H1', 'H2', 'H3', 'H4', 'P', 'SPAN', 'A', 'LI', 'LABEL'].includes(tag)) {
                                    displaceElement(nearEl, i);
                                    bee.landedElement = nearEl;
                                }
                            }
                        } catch (e) { }
                    } else {
                        const desiredSpeed = Math.min(personalSpeed * 1.5, dist * 0.08);
                        const desiredVx = (dx / dist) * desiredSpeed;
                        const desiredVy = (dy / dist) * desiredSpeed;
                        vx += (desiredVx - vx) * STEER_FORCE;
                        vy += (desiredVy - vy) * STEER_FORCE;
                    }
                } else if (state === 'LANDED') {
                    isFlapping = false;
                }

                // Position update
                if (state !== 'LANDED') {
                    x += vx * dt;
                    y += vy * dt;

                    // Wrap around
                    if (x < -80) x = width + 40;
                    if (x > width + 80) x = -40;
                    if (y < -120) y = height + 80;
                    if (y > height + 120) y = -80;

                    // Smooth rotation
                    if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
                        let tRot = (Math.atan2(vy, vx) * 180) / Math.PI + 90;
                        let diff = tRot - rotation;
                        while (diff < -180) diff += 360;
                        while (diff > 180) diff -= 360;
                        rotation += diff * 0.12 * dt;
                    }
                }

                // Write back
                bee.x = x; bee.y = y; bee.vx = vx; bee.vy = vy;
                bee.rotation = rotation; bee.state = state;
                bee.targetX = targetX; bee.targetY = targetY;
                bee.takeoffTime = takeoffTime; bee.nextLandTime = nextLandTime;
                bee.wanderAngle = wanderAngle;

                // DOM update
                const node = beeNodesRef.current[i];
                if (node) {
                    node.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${bee.scale})`;
                    const w1 = node.querySelector('.wing-1');
                    const w2 = node.querySelector('.wing-2');
                    if (w1 && w2) {
                        if (isFlapping) {
                            const flap = Math.sin(time / 18 + i * 50) * 25;
                            w1.setAttribute('transform', `rotate(${-flap} 12 10)`);
                            w2.setAttribute('transform', `rotate(${flap} 12 10)`);
                        } else {
                            w1.removeAttribute('transform');
                            w2.removeAttribute('transform');
                        }
                    }
                }
            });

            animationFrameRef.current = requestAnimationFrame(loop);
        };

        animationFrameRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, []);

    // Scroll Tracking
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDiff = currentScrollY - lastScrollY.current;
            lastScrollY.current = currentScrollY;

            beesRef.current.forEach(b => {
                b.y -= scrollDiff * 0.5;
                if (b.state === 'LANDED' || b.state === 'LANDING') {
                    b.state = 'FLYING';
                    // Restore displaced element on scroll scatter
                    if (b.landedElement) {
                        restoreElement(b.landedElement);
                        b.landedElement = null;
                    }
                    b.targetX = null; b.targetY = null;
                    b.takeoffTime = null;
                    b.vy += (scrollDiff > 0 ? -1.5 : 1.5);
                    // Re-schedule next landing independently
                    b.nextLandTime = performance.now() + random(1500, 4000);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Route Change
    useEffect(() => {
        beesRef.current.forEach((b, i) => {
            b.state = 'FLYING';
            b.vx += random(-2, 2);
            b.vy += random(-2, 2);
            b.nextLandTime = performance.now() + random(800, 3000) + i * 300;
        });
    }, [location.pathname]);

    return (
        <>
            {beesRef.current.map((bee, i) => (
                <div
                    key={i}
                    ref={(el) => (beeNodesRef.current[i] = el)}
                    style={{
                        position: 'fixed', left: 0, top: 0,
                        width: '32px', height: '32px',
                        pointerEvents: 'none', zIndex: 9999,
                        opacity: 0,
                        transition: 'opacity 0.6s ease',
                        willChange: 'transform'
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="wing-1" d="M12 10C12 10 10 2 6 2C2.5 2 2 6 6 8C8 9 12 10 12 10Z" fill="rgba(255,255,255,0.8)" stroke="#cbd5e1" strokeWidth="1" />
                        <path className="wing-2" d="M12 10C12 10 14 2 18 2C21.5 2 22 6 18 8C16 9 12 10 12 10Z" fill="rgba(255,255,255,0.8)" stroke="#cbd5e1" strokeWidth="1" />
                        <ellipse cx="12" cy="14" rx="6" ry="8" fill="#f59e0b" />
                        <path d="M6.5 13C6.5 13 12 15 17.5 13" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M7 16.5C7 16.5 12 18 17 16.5" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="12" cy="8" r="3.5" fill="#1f2937" />
                        <path d="M10.5 5.5L9 3" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M13.5 5.5L15 3" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M12 22L12 24" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            ))}
        </>
    );
};

export default BeeSwarm;
