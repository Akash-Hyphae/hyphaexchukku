import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { adminApi, publicApi } from '../services/api.ts';
import { PrivateVault } from './PrivateVault.tsx';
import { PhotoUploaderModal } from './PhotoUploaderModal.tsx';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Clock,
  Heart,
  BookHeart,
  Feather,
  Compass,
  Sliders,
  Lock,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Music,
  Save,
  Menu,
  X
} from 'lucide-react';
import {
  GalleryImage,
  TimelineEvent,
  PersonalCardItem,
  LoveLetterItem,
  FutureGoalItem,
  SiteSettings
} from '../types/index.ts';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';

interface AdminLayoutProps {
  onBackToPublic: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToPublic }) => {
  const { admin, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [cards, setCards] = useState<PersonalCardItem[]>([]);
  const [letters, setLetters] = useState<LoveLetterItem[]>([]);
  const [future, setFuture] = useState<FutureGoalItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Modal state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const loadData = async () => {
    try {
      const [sRes, gRes, tRes, cRes, lRes, fRes, setRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getGallery(),
        adminApi.getTimeline(),
        adminApi.getCards(),
        adminApi.getLoveLetters(),
        adminApi.getFuture(),
        adminApi.getSettings()
      ]);

      if (sRes.success) setStats(sRes.data);
      if (gRes.success) setGallery(gRes.data);
      if (tRes.success) setTimeline(tRes.data);
      if (cRes.success) setCards(cRes.data);
      if (lRes.success) setLetters(lRes.data);
      if (fRes.success) setFuture(fRes.data);
      if (setRes.success) setSettings(setRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  // Toggle privacy for gallery image (PUBLIC / PRIVATE / DRAFT)
  const setGalleryVisibility = async (img: GalleryImage, status: 'public' | 'private' | 'draft') => {
    const isPrivate = status === 'private';
    const isPublished = status === 'public';
    try {
      const res = await adminApi.updateGalleryImage(img._id, { isPrivate, isPublished });
      if (res.success) {
        setGallery(gallery.map(g => g._id === img._id ? res.data : g));
        triggerSuccess(`Updated status to ${status.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete gallery item
  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      await adminApi.deleteGalleryImage(id);
      setGallery(gallery.filter(g => g._id !== id));
      triggerSuccess('Photo deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // Update Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await adminApi.updateSettings(settings);
      if (res.success) {
        setSettings(res.data);
        triggerSuccess('Settings updated successfully.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1EB] text-[#2C1F1B] flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#1E1414] text-white p-4 flex items-center justify-between border-b border-[#3A2424]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold tracking-wide">CHUKKU × HYPHAE</span>
          <span className="text-[10px] bg-[#E11D48] px-2 py-0.5 rounded-full uppercase">CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded text-[#D4C3B8]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#1A1213] text-[#D8CAC4] flex flex-col justify-between z-40 transition-transform duration-300 border-r border-[#2D1B1E] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 overflow-y-auto">
          {/* Logo / Title */}
          <div className="mb-8">
            <span className="font-serif text-xl font-medium tracking-wide text-white block">
              CHUKKU × HYPHAE
            </span>
            <span className="text-[11px] font-sans text-[#A88B84] tracking-wider uppercase block mt-0.5">
              Admin & Memory CMS
            </span>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-6 text-xs">
            
            {/* Dashboard Overview */}
            <div>
              <button
                onClick={() => { setCurrentSection('dashboard'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  currentSection === 'dashboard'
                    ? 'bg-[#3A1E22] text-[#FCA5A5]'
                    : 'text-[#C7B5AE] hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Dashboard</span>
              </button>
            </div>

            {/* PUBLIC CONTENT */}
            <div>
              <span className="block text-[10px] font-bold text-[#8E6F68] uppercase tracking-widest px-3 mb-2">
                Public Content
              </span>
              <div className="space-y-1">
                {[
                  { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
                  { id: 'timeline', label: 'Timeline Milestones', icon: Clock },
                  { id: 'chukku', label: 'Chukku Page', icon: Heart },
                  { id: 'hyphae', label: 'Hyphae Page', icon: BookHeart },
                  { id: 'love-letter', label: 'Love Letter', icon: Feather },
                  { id: 'future', label: 'Future Bucket List', icon: Compass },
                  { id: 'settings', label: 'Site Settings & Music', icon: Sliders }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentSection(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      currentSection === item.id
                        ? 'bg-[#3A1E22] text-white font-medium'
                        : 'text-[#C7B5AE] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-[#C99C94]" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PRIVATE VAULT (HIGH EMPHASIS) */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold text-[#E11D48] uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>Private Vault</span>
              </span>
              <button
                onClick={() => { setCurrentSection('private-vault'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer border ${
                  currentSection === 'private-vault'
                    ? 'bg-gradient-to-r from-[#881337] to-[#BE123C] text-white font-semibold border-rose-500 shadow-lg'
                    : 'bg-[#220E12] text-[#FCA5A5] border-[#44181F] hover:bg-[#301217]'
                }`}
              >
                <Lock className="w-4 h-4 text-rose-300" />
                <span>Enter Private Vault</span>
              </button>
            </div>

          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-[#2D1B1E] bg-[#140D0E] space-y-2">
          <button
            onClick={onBackToPublic}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#C7B5AE] hover:text-white hover:bg-white/5 rounded-md transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={async () => {
              await logout();
              onBackToPublic();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#F87171] hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main CMS View Area */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        
        {/* Flash Notification Toast */}
        {saveSuccess && (
          <div className="fixed top-6 right-6 z-50 bg-[#166534] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* SECTION: PRIVATE VAULT (Dedicated Dark Secret Space) */}
        {currentSection === 'private-vault' && (
          <PrivateVault />
        )}

        {/* SECTION: DASHBOARD */}
        {currentSection === 'dashboard' && stats && (
          <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#3D251E] font-medium">
                  Welcome, {admin?.name || 'Hyphae'}
                </h1>
                <p className="text-xs sm:text-sm text-[#7D5A4F] mt-1 font-sans">
                  Manage Chukku’s little universe and your private protected memories.
                </p>
              </div>

              <button
                onClick={() => setShowPhotoModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold rounded-lg tracking-wider uppercase shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo Memory</span>
              </button>
            </div>

            {/* Public Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-xl border border-[#E3D3C5] shadow-xs">
                <span className="text-xs text-[#8F7266] uppercase tracking-wider block">Public Photos</span>
                <span className="font-serif text-3xl font-semibold text-[#3D251E] mt-1 block">
                  {stats.public.publicPhotos}
                </span>
                <span className="text-[11px] text-[#A89387]">Visible to all visitors</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E3D3C5] shadow-xs">
                <span className="text-xs text-[#8F7266] uppercase tracking-wider block">Timeline Stories</span>
                <span className="font-serif text-3xl font-semibold text-[#3D251E] mt-1 block">
                  {stats.public.timelineEvents}
                </span>
                <span className="text-[11px] text-[#A89387]">Milestones written</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E3D3C5] shadow-xs">
                <span className="text-xs text-[#8F7266] uppercase tracking-wider block">Chukku Love Cards</span>
                <span className="font-serif text-3xl font-semibold text-[#3D251E] mt-1 block">
                  {stats.public.chukkuCards}
                </span>
                <span className="text-[11px] text-[#A89387]">Things I love about her</span>
              </div>

              <div className="bg-[#1C0D0F] p-5 rounded-xl border border-[#44181F] text-white shadow-md">
                <span className="text-xs text-[#FCA5A5] uppercase tracking-wider block flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>Vault Items</span>
                </span>
                <span className="font-serif text-3xl font-semibold text-white mt-1 block">
                  {stats.privateVault.privatePhotos + stats.privateVault.privateNotes + stats.privateVault.surpriseIdeas}
                </span>
                <span className="text-[11px] text-[#D8A4AC]">Strictly private to you</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3D3C5] shadow-xs">
              <h2 className="font-serif text-2xl text-[#3D251E] font-medium mb-4">Quick Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setCurrentSection('gallery')}
                  className="p-4 rounded-xl border border-[#E8DDD2] hover:border-[#A84B3D] text-left transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5 text-[#A84B3D] mb-2" />
                  <span className="font-serif text-lg text-[#3D251E] block">Photo Album</span>
                  <span className="text-xs text-[#7D5A4F]">Manage {gallery.length} photos</span>
                </button>

                <button
                  onClick={() => setCurrentSection('private-vault')}
                  className="p-4 rounded-xl border border-[#E8DDD2] hover:border-[#A84B3D] text-left transition-colors cursor-pointer bg-[#FFF5F6]"
                >
                  <Lock className="w-5 h-5 text-[#E11D48] mb-2" />
                  <span className="font-serif text-lg text-[#3D251E] block">Private Vault</span>
                  <span className="text-xs text-[#7D5A4F]">Secret notes, surprises & letters</span>
                </button>

                <button
                  onClick={() => setCurrentSection('settings')}
                  className="p-4 rounded-xl border border-[#E8DDD2] hover:border-[#A84B3D] text-left transition-colors cursor-pointer"
                >
                  <Sliders className="w-5 h-5 text-[#A84B3D] mb-2" />
                  <span className="font-serif text-lg text-[#3D251E] block">Site Settings</span>
                  <span className="text-xs text-[#7D5A4F]">Hero copy, intros & music</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: GALLERY MANAGEMENT */}
        {currentSection === 'gallery' && (
          <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl text-[#3D251E] font-medium">Gallery Management</h1>
                <p className="text-xs text-[#7D5A4F] mt-1">
                  Change visibility between PUBLIC, PRIVATE, and DRAFT. Private photos immediately vanish from the public site.
                </p>
              </div>

              <button
                onClick={() => setShowPhotoModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold rounded-lg tracking-wider uppercase shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Memory</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map(img => (
                <div key={img._id} className="bg-white rounded-xl border border-[#E3D3C5] p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#F5ECE3] mb-3 relative">
                      <ImageWithFallback
                        src={img.imageUrl}
                        alt={img.title}
                        title={img.title}
                        className="w-full h-full"
                      />
                      <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        img.isPrivate
                          ? 'bg-[#E11D48] text-white'
                          : img.isPublished
                          ? 'bg-emerald-700 text-white'
                          : 'bg-amber-600 text-white'
                      }`}>
                        {img.isPrivate ? 'PRIVATE' : img.isPublished ? 'PUBLIC' : 'DRAFT'}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-[#3D251E] font-medium leading-snug">{img.title}</h3>
                    <p className="text-xs text-[#7D5A4F] mt-1 line-clamp-2">{img.caption}</p>
                    <div className="mt-2 text-[11px] text-[#9C8276]">{img.category} · {img.date || 'Undated'}</div>
                  </div>

                  {/* Actions & Privacy toggle */}
                  <div className="mt-4 pt-3 border-t border-[#F0E6DD] flex items-center justify-between gap-2">
                    <select
                      value={img.isPrivate ? 'private' : img.isPublished ? 'public' : 'draft'}
                      onChange={(e) => setGalleryVisibility(img, e.target.value as any)}
                      className="text-xs bg-[#FAF7F2] border border-[#D5BCAD] rounded px-2 py-1 text-[#3D251E]"
                    >
                      <option value="public">PUBLIC</option>
                      <option value="private">PRIVATE</option>
                      <option value="draft">DRAFT</option>
                    </select>

                    <button
                      onClick={() => handleDeleteGallery(img._id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: SETTINGS */}
        {currentSection === 'settings' && settings && (
          <div className="p-6 sm:p-10 max-w-3xl mx-auto">
            <h1 className="font-serif text-3xl text-[#3D251E] font-medium mb-2">Website Settings & Music</h1>
            <p className="text-xs text-[#7D5A4F] mb-8">
              Update landing copy, intros, romantic audio player, and final surprise reveal.
            </p>

            <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-[#E3D3C5] p-6 sm:p-8 space-y-6 shadow-xs text-xs">
              
              <div>
                <h3 className="font-serif text-xl text-[#3D251E] font-medium mb-3 pb-2 border-b border-[#F0E6DD]">
                  Hero Headline & Subtitle
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#5A433A] font-semibold uppercase mb-1">Headline</label>
                    <input
                      type="text"
                      value={settings.heroHeadline}
                      onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5A433A] font-semibold uppercase mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={settings.heroSubtitle}
                      onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl text-[#3D251E] font-medium mb-3 pb-2 border-b border-[#F0E6DD]">
                  Couple Intros
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#5A433A] font-semibold uppercase mb-1">Chukku Intro</label>
                    <textarea
                      rows={2}
                      value={settings.chukkuIntro}
                      onChange={(e) => setSettings({ ...settings, chukkuIntro: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5A433A] font-semibold uppercase mb-1">Hyphae Intro</label>
                    <textarea
                      rows={2}
                      value={settings.hyphaeIntro}
                      onChange={(e) => setSettings({ ...settings, hyphaeIntro: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl text-[#3D251E] font-medium mb-3 pb-2 border-b border-[#F0E6DD]">
                  Romantic Music Player
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="musicEnabled"
                      checked={settings.musicEnabled}
                      onChange={(e) => setSettings({ ...settings, musicEnabled: e.target.checked })}
                      className="w-4 h-4 accent-[#A84B3D]"
                    />
                    <label htmlFor="musicEnabled" className="text-sm text-[#3D251E] font-medium">
                      Enable floating background music player (never autoplays)
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#5A433A] font-semibold uppercase mb-1">Track Title</label>
                      <input
                        type="text"
                        value={settings.musicTrackTitle}
                        onChange={(e) => setSettings({ ...settings, musicTrackTitle: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#5A433A] font-semibold uppercase mb-1">Audio Stream URL</label>
                      <input
                        type="text"
                        value={settings.musicUrl}
                        onChange={(e) => setSettings({ ...settings, musicUrl: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl text-[#3D251E] font-medium mb-3 pb-2 border-b border-[#F0E6DD]">
                  Final Surprise
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#5A433A] font-semibold uppercase mb-1">Final Message</label>
                    <textarea
                      rows={3}
                      value={settings.finalSurpriseMessage}
                      onChange={(e) => setSettings({ ...settings, finalSurpriseMessage: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="finalSurpriseIsPrivate"
                      checked={settings.finalSurpriseIsPrivate}
                      onChange={(e) => setSettings({ ...settings, finalSurpriseIsPrivate: e.target.checked })}
                      className="w-4 h-4 accent-[#E11D48]"
                    />
                    <label htmlFor="finalSurpriseIsPrivate" className="text-sm text-[#E11D48] font-medium">
                      Keep Final Surprise PRIVATE (accessible only in vault, hidden from public)
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#A84B3D] hover:bg-[#8F3C30] text-white font-medium shadow-sm transition-colors cursor-pointer text-sm"
                >
                  Save Settings
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

      {/* Photo Uploader Modal */}
      <PhotoUploaderModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onSuccess={(newImg) => {
          setGallery([newImg, ...gallery]);
          triggerSuccess('Memory saved successfully!');
        }}
      />
    </div>
  );
};
