import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { MusicProvider } from './context/MusicContext.tsx';
import { publicApi } from './services/api.ts';
import {
  GalleryImage,
  TimelineEvent,
  PersonalCardItem,
  LoveLetterItem,
  FutureGoalItem,
  SiteSettings
} from './types/index.ts';

import { Navbar } from './components/Navbar.tsx';
import { FloatingParticles } from './components/FloatingParticles.tsx';
import { MusicPlayer } from './components/MusicPlayer.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { ChukkuPage } from './pages/ChukkuPage.tsx';
import { HyphaePage } from './pages/HyphaePage.tsx';
import { GalleryPage } from './pages/GalleryPage.tsx';
import { TimelinePage } from './pages/TimelinePage.tsx';
import { LoveLetterPage } from './pages/LoveLetterPage.tsx';
import { FuturePage } from './pages/FuturePage.tsx';
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { AdminLayout } from './admin/AdminLayout.tsx';

import { Heart, Lock } from 'lucide-react';

const defaultSettings: SiteSettings = {
  heroHeadline: 'Welcome to our little universe.',
  heroSubtitle: 'A tiny corner of the internet that belongs to us.',
  heroButtonText: 'Enter our story →',
  featuredImageUrl: 'WhatsApp Image 2026-10-08 at 4.22.33 PM.jpeg',
  chukkuIntro: 'The sweetest chaos, the warmest laugh, and the girl who turned my whole world upside down in the best way possible.',
  hyphaeIntro: 'The boy who looks at you like you are the only constellation in the sky. Coding late into the night just to make you smile.',
  finalSurpriseTitle: 'One Last Thing…',
  finalSurpriseMessage: 'Thank you for being my home, my favorite adventure, and my safest harbor. Every second with you is a gift I will treasure for the rest of my days.',
  finalSurpriseImage: 'WhatsApp Image 2026-10-08 at 4.25.31 PM (3).jpeg',
  finalSurpriseIsPrivate: false,
  musicEnabled: true,
  musicTrackTitle: 'Our Soft Melody',
  musicTrackArtist: 'Hyphae for Chukku',
  musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  volume: 0.5
};

function MainApp() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Navigation route state based on window path or tab
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [galleryCategory, setGalleryCategory] = useState<string>('All');

  // Public datasets
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [chukkuCards, setChukkuCards] = useState<PersonalCardItem[]>([]);
  const [hyphaeCards, setHyphaeCards] = useState<PersonalCardItem[]>([]);
  const [loveLetter, setLoveLetter] = useState<LoveLetterItem | null>(null);
  const [futureGoals, setFutureGoals] = useState<FutureGoalItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync route with window pathname on initial load and popstate
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin/login') setCurrentRoute('admin-login');
      else if (path.startsWith('/admin')) setCurrentRoute('admin');
      else if (path === '/chukku') setCurrentRoute('chukku');
      else if (path === '/hyphae') setCurrentRoute('hyphae');
      else if (path === '/gallery') setCurrentRoute('gallery');
      else if (path === '/timeline') setCurrentRoute('timeline');
      else if (path === '/love-letter') setCurrentRoute('love-letter');
      else if (path === '/future') setCurrentRoute('future');
      else setCurrentRoute('home');
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  // Fetch all public data
  const fetchPublicData = async () => {
    setLoading(true);
    try {
      const [setRes, galRes, timeRes, chkRes, hypRes, letRes, futRes] = await Promise.all([
        publicApi.getSettings(),
        publicApi.getGallery(),
        publicApi.getTimeline(),
        publicApi.getCards('chukku'),
        publicApi.getCards('hyphae'),
        publicApi.getLoveLetter(),
        publicApi.getFuture()
      ]);

      if (setRes.success && setRes.data) setSettings(setRes.data);
      if (galRes.success && galRes.data) setGallery(galRes.data);
      if (timeRes.success && timeRes.data) setTimeline(timeRes.data);
      if (chkRes.success && chkRes.data) setChukkuCards(chkRes.data);
      if (hypRes.success && hypRes.data) setHyphaeCards(hypRes.data);
      if (letRes.success && letRes.data) setLoveLetter(letRes.data);
      if (futRes.success && futRes.data) setFutureGoals(futRes.data);
    } catch (err) {
      console.warn('Using local fallback state for romantic elements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    let path = '/';
    if (route === 'admin-login') path = '/admin/login';
    else if (route === 'admin') path = '/admin';
    else if (route !== 'home') path = `/${route}`;

    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route guarding: if trying to view admin without authentication, show login
  if (currentRoute === 'admin' && !isAuthenticated) {
    return (
      <AdminLoginPage
        onSuccess={() => navigateTo('admin')}
        onBackToPublic={() => navigateTo('home')}
      />
    );
  }

  // Admin login route
  if (currentRoute === 'admin-login') {
    return (
      <AdminLoginPage
        onSuccess={() => navigateTo('admin')}
        onBackToPublic={() => navigateTo('home')}
      />
    );
  }

  // Admin CMS / Vault route
  if (currentRoute === 'admin') {
    return (
      <AdminLayout
        onBackToPublic={() => {
          navigateTo('home');
          fetchPublicData(); // refresh in case privacy changed
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2420] relative flex flex-col justify-between font-sans selection:bg-[#E8C4B8] selection:text-[#3B1E19]">
      <FloatingParticles />

      {/* Public Navbar (strictly no Admin/Vault links) */}
      <Navbar
        currentTab={currentRoute}
        onNavigate={navigateTo}
      />

      {/* Main Public Content */}
      <main className="flex-1 relative z-10">
        {currentRoute === 'home' && (
          <HomePage
            settings={settings}
            galleryImages={gallery}
            timelineEvents={timeline}
            onNavigate={navigateTo}
            selectedCategory={galleryCategory}
            onSelectCategory={setGalleryCategory}
          />
        )}

        {currentRoute === 'chukku' && (
          <ChukkuPage
            cards={chukkuCards}
            settings={settings}
          />
        )}

        {currentRoute === 'hyphae' && (
          <HyphaePage
            cards={hyphaeCards}
            settings={settings}
          />
        )}

        {currentRoute === 'gallery' && (
          <GalleryPage
            images={gallery}
            selectedCategory={galleryCategory}
            onSelectCategory={setGalleryCategory}
          />
        )}

        {currentRoute === 'timeline' && (
          <TimelinePage
            events={timeline}
          />
        )}

        {currentRoute === 'love-letter' && (
          <LoveLetterPage
            letter={loveLetter}
          />
        )}

        {currentRoute === 'future' && (
          <FuturePage
            goals={futureGoals}
          />
        )}
      </main>

      {/* Soft Romantic Footer with Tasteful Admin Login Access */}
      <footer className="relative z-10 border-t border-[#EAE0D6] py-12 px-6 bg-[#FAF7F2]/80 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#8F7266]">
          {/* Brand & Dedication */}
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#A84B3D] fill-[#A84B3D]" />
            <span className="font-serif text-sm font-medium text-[#3D251E]">CHUKKU × HYPHAE</span>
            <span aria-hidden="true">·</span>
            <span>Made with all my love</span>
          </div>

          {/* Romantic Handwritten Motto */}
          <div className="text-center">
            <span className="font-handwriting text-lg text-[#7D5A4F]">
              “I made a little world for you.”
            </span>
          </div>

          {/* Tasteful, Elegant Admin Login Button */}
          <div className="flex items-center">
            <button
              onClick={() => navigateTo(isAuthenticated ? 'admin' : 'admin-login')}
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DFD0C3] bg-[#FAF5EE]/70 hover:bg-[#FFFDF9] hover:border-[#C4A999] text-[#70564D] hover:text-[#3D251E] text-[11px] font-sans tracking-widest uppercase transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer focus-visible:outline-hidden"
              title={isAuthenticated ? 'Open Admin Dashboard' : 'Open Admin Login'}
            >
              <Lock className="w-3 h-3 text-[#A88B82] group-hover:text-[#A84B3D] transition-colors" />
              <span className="font-medium">
                {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
              </span>
              {isAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Music Player */}
      <MusicPlayer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <MainApp />
      </MusicProvider>
    </AuthProvider>
  );
}
