import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminAuthContext = createContext(null);

const AUTH_SESSION_KEY = 'beefund_admin_auth_v1';
const FAILED_ATTEMPTS_KEY = 'beefund_admin_failed_attempts';
const LOCKOUT_UNTIL_KEY = 'beefund_admin_lockout_until';

const MASTER_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || 'beefund@admin2026';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

export const AdminAuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        try {
            const raw = sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
            if (raw) {
                const session = JSON.parse(raw);
                if (session && session.auth && Date.now() - session.timestamp < SESSION_DURATION_MS) {
                    return true;
                }
            }
        } catch (e) {
            console.error('Failed reading admin session:', e);
        }
        return false;
    });

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(() => {
        return parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10);
    });
    const [lockoutUntil, setLockoutUntil] = useState(() => {
        return parseInt(localStorage.getItem(LOCKOUT_UNTIL_KEY) || '0', 10);
    });
    const [secondsLeftInLockout, setSecondsLeftInLockout] = useState(0);

    // Lockout countdown timer
    useEffect(() => {
        const updateLockout = () => {
            const now = Date.now();
            if (lockoutUntil > now) {
                setSecondsLeftInLockout(Math.ceil((lockoutUntil - now) / 1000));
            } else {
                setSecondsLeftInLockout(0);
                if (lockoutUntil > 0) {
                    // Lockout has just expired
                    localStorage.removeItem(LOCKOUT_UNTIL_KEY);
                    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
                    setLockoutUntil(0);
                    setFailedAttempts(0);
                }
            }
        };

        updateLockout();
        const interval = setInterval(updateLockout, 1000);
        return () => clearInterval(interval);
    }, [lockoutUntil]);

    const openLoginModal = useCallback(() => {
        setIsLoginModalOpen(true);
    }, []);

    const closeLoginModal = useCallback(() => {
        setIsLoginModalOpen(false);
    }, []);

    // Login action with honeypot and brute-force protection
    const login = useCallback((inputPasskey, honeypotField = '') => {
        const now = Date.now();

        // 1. Check if currently locked out
        if (lockoutUntil > now) {
            const minutesLeft = Math.ceil((lockoutUntil - now) / 60000);
            return {
                success: false,
                error: `Security lockout active due to multiple failed attempts. Try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
                isLocked: true
            };
        }

        // 2. Anti-bot honeypot trap: if a bot filled the hidden input, fail immediately
        if (honeypotField && honeypotField.trim().length > 0) {
            console.warn('[Security] Honeypot triggered by automated bot script.');
            return {
                success: false,
                error: 'Invalid authentication request.',
                isLocked: false
            };
        }

        // 3. Verify passkey
        if (inputPasskey === MASTER_PASSKEY) {
            // Success: clear failed counter and set session
            localStorage.removeItem(FAILED_ATTEMPTS_KEY);
            localStorage.removeItem(LOCKOUT_UNTIL_KEY);
            setFailedAttempts(0);
            setLockoutUntil(0);

            const sessionData = {
                auth: true,
                timestamp: now,
                role: 'admin'
            };
            const sessionStr = JSON.stringify(sessionData);
            sessionStorage.setItem(AUTH_SESSION_KEY, sessionStr);
            try {
                localStorage.setItem(AUTH_SESSION_KEY, sessionStr);
            } catch (e) {
                console.warn('Could not save auth session to localStorage', e);
            }
            setIsAuthenticated(true);
            setIsLoginModalOpen(false);

            return { success: true };
        } else {
            // Failure: increment failed count
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            localStorage.setItem(FAILED_ATTEMPTS_KEY, newAttempts.toString());

            if (newAttempts >= MAX_ATTEMPTS) {
                const lockTime = now + LOCKOUT_MS;
                setLockoutUntil(lockTime);
                localStorage.setItem(LOCKOUT_UNTIL_KEY, lockTime.toString());
                return {
                    success: false,
                    error: `Too many failed attempts! Access locked for 15 minutes to prevent unauthorized entry.`,
                    isLocked: true
                };
            }

            const remaining = MAX_ATTEMPTS - newAttempts;
            return {
                success: false,
                error: `Incorrect security passkey. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before 15-min lockout.`,
                remainingAttempts: remaining,
                isLocked: false
            };
        }
    }, [failedAttempts, lockoutUntil]);

    const logout = useCallback(() => {
        sessionStorage.removeItem(AUTH_SESSION_KEY);
        try {
            localStorage.removeItem(AUTH_SESSION_KEY);
        } catch (e) {
            console.warn('Could not remove auth session from localStorage', e);
        }
        setIsAuthenticated(false);
    }, []);

    return (
        <AdminAuthContext.Provider value={{
            isAuthenticated,
            isLoginModalOpen,
            openLoginModal,
            closeLoginModal,
            login,
            logout,
            isLocked: lockoutUntil > Date.now(),
            secondsLeftInLockout,
            failedAttempts,
            maxAttempts: MAX_ATTEMPTS
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};
