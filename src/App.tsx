import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { WalletProvider } from './context/WalletContext';
import { AuctionProvider } from './context/AuctionContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WalletModal } from './components/wallet/WalletModal';
import { TransactionStatusModal } from './components/wallet/TransactionStatusModal';
import { ToastContainer } from './components/common/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuctionsPage } from './pages/AuctionsPage';
import { AuctionDetailsPage } from './pages/AuctionDetailsPage';
import { CreateAuctionPage } from './pages/CreateAuctionPage';
import { MyAuctionsPage } from './pages/MyAuctionsPage';
import { MyBidsPage } from './pages/MyBidsPage';
import { AuctionResultPage } from './pages/AuctionResultPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <WalletProvider>
          <AuctionProvider>
            <div className="flex flex-col min-h-screen bg-[#060913] text-slate-100 bg-grid-pattern relative selection:bg-cyan-500/30 selection:text-cyan-200">
              {/* Top Navbar */}
              <Navbar />

              {/* Main Content Viewport */}
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auctions" element={<AuctionsPage />} />
                  <Route path="/auction/:id" element={<AuctionDetailsPage />} />
                  <Route path="/create" element={<CreateAuctionPage />} />
                  <Route path="/my-auctions" element={<MyAuctionsPage />} />
                  <Route path="/my-bids" element={<MyBidsPage />} />
                  <Route path="/results/:id" element={<AuctionResultPage />} />
                  <Route path="/results" element={<AuctionResultPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              {/* Global Modals and Notification Toasts */}
              <WalletModal />
              <TransactionStatusModal />
              <ToastContainer />

              {/* Global Footer */}
              <Footer />
            </div>
          </AuctionProvider>
        </WalletProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
