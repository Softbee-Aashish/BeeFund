import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import BeeSwarm from './components/BeeSwarm';
import WhatsAppWidget from './components/WhatsAppWidget';
import DarkModeToggle from './components/DarkModeToggle';
import { ThemeProvider } from './context/ThemeContext';

// Pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoanProductsPage = React.lazy(() => import('./pages/LoanProductsPage'));
const BlogListPage = React.lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const ApplyPage = React.lazy(() => import('./pages/ApplyPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ThankYouPage = React.lazy(() => import('./pages/ThankYouPage'));

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

import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <BeeSwarm />
          <Header />
          <main className="main-content">
            <React.Suspense fallback={<div className="loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--primary-color)' }}>Loading...</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
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
                {/* Keep old route as redirect */}
                <Route path="/emi-calculator" element={<EMICalculatorPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/apply" element={<ApplyPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
              </Routes>
            </React.Suspense>
          </main>
          <WhatsAppWidget />
          <DarkModeToggle />
          <BottomNav />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
