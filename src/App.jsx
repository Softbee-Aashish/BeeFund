import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import BeeSwarm from './components/BeeSwarm';
import WhatsAppWidget from './components/WhatsAppWidget';
import DarkModeToggle from './components/DarkModeToggle';
import PamphletModal from './components/PamphletModal';
import CookieConsent from './components/CookieConsent';
import AdminLoginModal from './components/admin/AdminLoginModal';
import BeeLoader from './components/BeeLoader';
import { ThemeProvider } from './context/ThemeContext';
import { EnquireModalProvider } from './context/EnquireModalContext';
import { BlogProvider } from './context/BlogContext';
import { CardsProvider } from './context/CardsContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';

// Pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoanProductsPage = React.lazy(() => import('./pages/LoanProductsPage'));
const CreditCardsPage = React.lazy(() => import('./pages/CreditCardsPage'));
const BlogListPage = React.lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const ApplyPage = React.lazy(() => import('./pages/ApplyPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ThankYouPage = React.lazy(() => import('./pages/ThankYouPage'));
const CreditReportPage = React.lazy(() => import('./pages/CreditReportPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const AdminStudioPage = React.lazy(() => import('./pages/admin/AdminStudioPage'));
const ArticleEditorPage = React.lazy(() => import('./pages/admin/ArticleEditorPage'));

// Tools
const ToolsHome = React.lazy(() => import('./pages/tools/ToolsHome'));
const EMICalculatorPage = React.lazy(() => import('./pages/EMICalculatorPage'));
const EligibilityCalculator = React.lazy(() => import('./pages/tools/EligibilityCalculator'));
const LoanComparison = React.lazy(() => import('./pages/tools/LoanComparison'));
const GSTCalculator = React.lazy(() => import('./pages/tools/GSTCalculator'));
const TaxBenefitCalculator = React.lazy(() => import('./pages/tools/TaxBenefitCalculator'));
const InflationCalculator = React.lazy(() => import('./pages/tools/InflationCalculator'));
const AffordabilityCalculator = React.lazy(() => import('./pages/tools/AffordabilityCalculator'));
const ROICalculator = React.lazy(() => import('./pages/tools/ROICalculator'));
const FixedVsFloating = React.lazy(() => import('./pages/tools/FixedVsFloating'));
const ODCCCalculator = React.lazy(() => import('./pages/tools/ODCCCalculator'));
const RepaymentScheduleGenerator = React.lazy(() => import('./pages/tools/RepaymentScheduleGenerator'));

import './styles/global.css';

// Stealth Admin Gate keyboard shortcut listener: strictly active ONLY on the /about page
const AdminShortcutListener = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useAdminAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Secret triggers: Ctrl + Shift + A  OR  Alt + B
      const isTriggerKey = 
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'B' || e.key === 'b'));

      if (!isTriggerKey) return;

      // Gate: strictly ONLY active on the /about page
      if (location.pathname !== '/about') {
        return;
      }

      e.preventDefault();

      // If already logged in / in admin dashboard, never prompt to log in again
      if (isAuthenticated) {
        navigate('/admin-studio');
        return;
      }

      // Otherwise, open the passkey login modal
      openLoginModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, isAuthenticated, navigate, openLoginModal]);

  return null;
};

// Main inner layout that conditionally handles the admin workspace
const AppContent = () => {
  const location = useLocation();
  const isAdminStudio = location.pathname.startsWith('/admin-studio');
  const [isPageLoading, setIsPageLoading] = useState(true);

  // BeeLoaderFallback: visible during Suspense; signals loading state via callbacks
  const BeeLoaderFallback = () => {
    useEffect(() => {
      setIsPageLoading(true);
      return () => {
        // Suspense fallback unmounts when page finishes loading
        setIsPageLoading(false);
      };
    }, []);
    return <BeeLoader message="Fast-tracking your loan options..." />;
  };

  return (
    <div className={`app-container ${isAdminStudio ? 'studio-view-active' : ''}`}>
      <AdminShortcutListener />
      <AdminLoginModal />

      {!isAdminStudio && (
        <>
          <BeeSwarm />
          <Header />
        </>
      )}

      <main className="main-content">
        <React.Suspense fallback={<BeeLoaderFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<LoanProductsPage />} />
            <Route path="/loans" element={<LoanProductsPage />} />
            <Route path="/tools" element={<ToolsHome />} />
            <Route path="/tools/emi-calculator" element={<EMICalculatorPage />} />
            <Route path="/tools/eligibility" element={<EligibilityCalculator />} />
            <Route path="/tools/loan-comparison" element={<LoanComparison />} />
            <Route path="/tools/gst-calculator" element={<GSTCalculator />} />
            <Route path="/tools/tax-benefit" element={<TaxBenefitCalculator />} />
            <Route path="/tools/inflation-impact" element={<InflationCalculator />} />
            <Route path="/tools/affordability" element={<AffordabilityCalculator />} />
            <Route path="/tools/roi-calculator" element={<ROICalculator />} />
            <Route path="/tools/fixed-vs-floating" element={<FixedVsFloating />} />
            <Route path="/tools/od-cc-calculator" element={<ODCCCalculator />} />
            <Route path="/tools/repayment-schedule" element={<RepaymentScheduleGenerator />} />
            
            {/* Keep aliases for direct access */}
            <Route path="/od-cc-calculator" element={<ODCCCalculator />} />
            <Route path="/repayment-schedule" element={<RepaymentScheduleGenerator />} />
            <Route path="/emi-calculator" element={<EMICalculatorPage />} />
            
            {/* Blog Pages */}
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            
            {/* Dedicated Credit Cards Showcase */}
            <Route path="/credit-cards" element={<CreditCardsPage />} />
            <Route path="/cards" element={<CreditCardsPage />} />
            
            {/* Company & Support */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/credit-report" element={<CreditReportPage />} />
            <Route path="/credit-score" element={<CreditReportPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/disclaimer" element={<TermsPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />

            {/* Stealth Admin Studio Route */}
            <Route path="/admin-studio" element={<AdminStudioPage />} />
            <Route path="/admin-studio/editor" element={<ArticleEditorPage />} />
            <Route path="/admin-studio/editor/:id" element={<ArticleEditorPage />} />

            {/* Silent decoy redirect: visiting /admin redirects to / to prevent URL sniffing */}
            <Route path="/admin" element={<Navigate to="/" replace />} />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </React.Suspense>
      </main>

      {/* Footer and bottom widgets are hidden while a page is loading to prevent transparent bleed-through */}
      {!isAdminStudio && !isPageLoading && (
        <>
          <Footer />
          <WhatsAppWidget />
          <DarkModeToggle />
          <BottomNav />
          <PamphletModal />
          <CookieConsent />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BlogProvider>
        <CardsProvider>
          <AdminAuthProvider>
            <EnquireModalProvider>
              <Router>
                <AppContent />
              </Router>
            </EnquireModalProvider>
          </AdminAuthProvider>
        </CardsProvider>
      </BlogProvider>
    </ThemeProvider>
  );
}

export default App;
