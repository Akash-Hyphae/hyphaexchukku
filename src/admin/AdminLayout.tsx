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
  X,
  Upload,
  Calendar,
  MapPin,
  CheckCircle2,
  Circle,
  Quote
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

const PHOTO_OPTIONS = [
  { value: 'WhatsApp Image 2026-10-08 at 4.22.33 PM.jpeg', label: 'Cafe Mirror Loving Gaze' },
  { value: 'WhatsApp Image 2026-10-08 at 4.25.31 PM (3).jpeg', label: 'Cheek Kiss & Soft Smile' },
  { value: 'WhatsApp Image 2026-10-08 at 4.25.30 PM (3).jpeg', label: 'Hallway Mirror In Hoodie' },
  { value: 'WhatsApp Image 2026-10-08 at 4.25.25 PM (1).jpeg', label: 'Tender Kiss with Hand on Face' },
  { value: 'WhatsApp Image 2026-10-08 at 4.25.30 PM (2).jpeg', label: 'Hallway Mirror Kiss' },
  { value: 'WhatsApp Image 2026-10-08 at 4.25.23 PM (1).jpeg', label: 'Chukku Solo "My Day"' },
  { value: 'WhatsApp Image 2026-10-08 at 4.22.31 PM (2).jpeg', label: 'Lake Pichola Boat Ride' },
  { value: 'WhatsApp Image 2026-10-08 at 4.22.29 PM.jpeg', label: 'Hyphae Lake Portrait' },
  { value: 'WhatsApp Image 2026-10-08 at 4.22.31 PM (1).jpeg', label: 'Yellow Attire Couple Selfie' },
  { value: 'WhatsApp Image 2026-10-08 at 4.25.15 PM.jpeg', label: 'Midnight Birthday Cake Cutting' },
  { value: 'WhatsApp Image 2026-10-08 at 4.22.26 PM.jpeg', label: 'Video Call Screenshot' },
  { value: 'WhatsApp Image 2026-10-08 at 4.25.29 PM (1).jpeg', label: 'Under Warm Cafe Lights' }
];

interface AdminLayoutProps {
  onBackToPublic: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToPublic }) => {
  const { admin, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState<string>(() => {
    const saved = sessionStorage.getItem('admin_target_tab');
    if (saved) {
      sessionStorage.removeItem('admin_target_tab');
      return saved;
    }
    return 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [cards, setCards] = useState<PersonalCardItem[]>([]);
  const [letters, setLetters] = useState<LoveLetterItem[]>([]);
  const [future, setFuture] = useState<FutureGoalItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Notifications
  const [saveSuccess, setSaveSuccess] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<GalleryImage | null>(null);

  // --- MODAL STATES ---
  // 1. Timeline Modal
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<TimelineEvent | null>(null);
  const [tDate, setTDate] = useState('');
  const [tTitle, setTTitle] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tLoc, setTLoc] = useState('');
  const [tImg, setTImg] = useState('');
  const [tQuote, setTQuote] = useState('');
  const [tVisibility, setTVisibility] = useState<'public' | 'private' | 'draft'>('public');

  // 2. Personal Card Modal (Chukku / Hyphae)
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardModalOwner, setCardModalOwner] = useState<'chukku' | 'hyphae'>('chukku');
  const [editingCard, setEditingCard] = useState<PersonalCardItem | null>(null);
  const [cTitle, setCTitle] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cCategory, setCCategory] = useState('');
  const [cImg, setCImg] = useState('');
  const [cVisibility, setCVisibility] = useState<'public' | 'private' | 'draft'>('public');

  // 3. Love Letter Modal
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [editingLetter, setEditingLetter] = useState<LoveLetterItem | null>(null);
  const [lTitle, setLTitle] = useState('');
  const [lContent, setLContent] = useState('');
  const [lDate, setLDate] = useState('');
  const [lMood, setLMood] = useState('');
  const [lVisibility, setLVisibility] = useState<'public' | 'private'>('public');

  // 4. Future Goal Modal
  const [showFutureModal, setShowFutureModal] = useState(false);
  const [editingFuture, setEditingFuture] = useState<FutureGoalItem | null>(null);
  const [fTitle, setFTitle] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fCategory, setFCategory] = useState<any>('Experiences');
  const [fTargetDate, setFTargetDate] = useState('');
  const [fCompleted, setFCompleted] = useState(false);
  const [fVisibility, setFVisibility] = useState<'public' | 'private' | 'draft'>('public');

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

  // --- TIMELINE HANDLERS ---
  const openCreateTimeline = () => {
    setEditingTimeline(null);
    setTDate(new Date().toISOString().split('T')[0]);
    setTTitle('');
    setTDesc('');
    setTLoc('');
    setTImg(PHOTO_OPTIONS[0].value);
    setTQuote('');
    setTVisibility('public');
    setShowTimelineModal(true);
  };

  const openEditTimeline = (item: TimelineEvent) => {
    setEditingTimeline(item);
    setTDate(item.date);
    setTTitle(item.title);
    setTDesc(item.description);
    setTLoc(item.location || '');
    setTImg(item.imageUrl || '');
    setTQuote(item.quote || '');
    setTVisibility(item.isPrivate ? 'private' : item.isPublished ? 'public' : 'draft');
    setShowTimelineModal(true);
  };

  const handleSaveTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle || !tDate) return;
    const isPrivate = tVisibility === 'private';
    const isPublished = tVisibility === 'public';

    try {
      if (editingTimeline) {
        const res = await adminApi.updateTimelineEvent(editingTimeline._id, {
          date: tDate,
          title: tTitle,
          description: tDesc,
          location: tLoc,
          imageUrl: tImg,
          quote: tQuote,
          isPrivate,
          isPublished
        });
        if (res.success) {
          setTimeline(timeline.map(t => t._id === editingTimeline._id ? res.data : t));
          triggerSuccess('Milestone updated successfully.');
        }
      } else {
        const res = await adminApi.createTimelineEvent({
          date: tDate,
          title: tTitle,
          description: tDesc,
          location: tLoc,
          imageUrl: tImg,
          quote: tQuote,
          isPrivate,
          isPublished
        });
        if (res.success) {
          setTimeline([...timeline, res.data]);
          triggerSuccess('Milestone added to our story.');
        }
      }
      setShowTimelineModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    try {
      await adminApi.deleteTimelineEvent(id);
      setTimeline(timeline.filter(t => t._id !== id));
      triggerSuccess('Milestone deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTimelineVisibility = async (item: TimelineEvent, status: 'public' | 'private' | 'draft') => {
    const isPrivate = status === 'private';
    const isPublished = status === 'public';
    try {
      const res = await adminApi.updateTimelineEvent(item._id, { isPrivate, isPublished });
      if (res.success) {
        setTimeline(timeline.map(t => t._id === item._id ? res.data : t));
        triggerSuccess(`Milestone visibility updated to ${status.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- PERSONAL CARD HANDLERS ---
  const openCreateCard = (owner: 'chukku' | 'hyphae') => {
    setCardModalOwner(owner);
    setEditingCard(null);
    setCTitle('');
    setCDesc('');
    setCCategory(owner === 'chukku' ? 'Things I Love About You' : 'My Side of the Story');
    setCImg(PHOTO_OPTIONS[0].value);
    setCVisibility('public');
    setShowCardModal(true);
  };

  const openEditCard = (card: PersonalCardItem) => {
    setEditingCard(card);
    setCardModalOwner(card.owner);
    setCTitle(card.title);
    setCDesc(card.description);
    setCCategory(card.category);
    setCImg(card.imageUrl || '');
    setCVisibility(card.isPrivate ? 'private' : card.isPublished ? 'public' : 'draft');
    setShowCardModal(true);
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitle || !cDesc) return;
    const isPrivate = cVisibility === 'private';
    const isPublished = cVisibility === 'public';

    try {
      if (editingCard) {
        const res = await adminApi.updateCard(editingCard._id, {
          title: cTitle,
          description: cDesc,
          category: cCategory,
          imageUrl: cImg,
          isPrivate,
          isPublished
        });
        if (res.success) {
          setCards(cards.map(c => c._id === editingCard._id ? res.data : c));
          triggerSuccess('Card updated successfully.');
        }
      } else {
        const res = await adminApi.createCard({
          owner: cardModalOwner,
          title: cTitle,
          description: cDesc,
          category: cCategory,
          imageUrl: cImg,
          isPrivate,
          isPublished
        });
        if (res.success) {
          setCards([...cards, res.data]);
          triggerSuccess('Card added successfully.');
        }
      }
      setShowCardModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    try {
      await adminApi.deleteCard(id);
      setCards(cards.filter(c => c._id !== id));
      triggerSuccess('Card deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCardVisibility = async (card: PersonalCardItem, status: 'public' | 'private' | 'draft') => {
    const isPrivate = status === 'private';
    const isPublished = status === 'public';
    try {
      const res = await adminApi.updateCard(card._id, { isPrivate, isPublished });
      if (res.success) {
        setCards(cards.map(c => c._id === card._id ? res.data : c));
        triggerSuccess(`Card visibility updated to ${status.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- LOVE LETTER HANDLERS ---
  const openCreateLetter = () => {
    setEditingLetter(null);
    setLTitle('A Letter For You');
    setLContent('');
    setLDate(new Date().toISOString().split('T')[0]);
    setLMood('Endless Love');
    setLVisibility('public');
    setShowLetterModal(true);
  };

  const openEditLetter = (letter: LoveLetterItem) => {
    setEditingLetter(letter);
    setLTitle(letter.title);
    setLContent(letter.content);
    setLDate(letter.date);
    setLMood(letter.mood || 'Pure Devotion');
    setLVisibility(letter.isPrivate ? 'private' : 'public');
    setShowLetterModal(true);
  };

  const handleSaveLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lTitle || !lContent) return;
    const isPrivate = lVisibility === 'private';
    const isPublished = lVisibility === 'public';

    try {
      if (editingLetter) {
        const res = await adminApi.updateLoveLetter(editingLetter._id, {
          title: lTitle,
          content: lContent,
          date: lDate,
          mood: lMood,
          isPrivate,
          isPublished
        });
        if (res.success) {
          setLetters(letters.map(l => l._id === editingLetter._id ? res.data : l));
          triggerSuccess('Love letter updated.');
        }
      } else {
        const res = await adminApi.createLoveLetter({
          title: lTitle,
          content: lContent,
          date: lDate,
          mood: lMood,
          isPrivate,
          isPublished
        });
        if (res.success) {
          setLetters([...letters, res.data]);
          triggerSuccess('Love letter saved.');
        }
      }
      setShowLetterModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLetter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this love letter?')) return;
    try {
      await adminApi.deleteLoveLetter(id);
      setLetters(letters.filter(l => l._id !== id));
      triggerSuccess('Love letter deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLetterVisibility = async (letter: LoveLetterItem, status: 'public' | 'private') => {
    const isPrivate = status === 'private';
    const isPublished = status === 'public';
    try {
      const res = await adminApi.updateLoveLetter(letter._id, { isPrivate, isPublished });
      if (res.success) {
        setLetters(letters.map(l => l._id === letter._id ? res.data : l));
        triggerSuccess(`Letter marked as ${status.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- FUTURE GOAL HANDLERS ---
  const openCreateFuture = () => {
    setEditingFuture(null);
    setFTitle('');
    setFDesc('');
    setFCategory('Travel');
    setFTargetDate('');
    setFCompleted(false);
    setFVisibility('public');
    setShowFutureModal(true);
  };

  const openEditFuture = (goal: FutureGoalItem) => {
    setEditingFuture(goal);
    setFTitle(goal.title);
    setFDesc(goal.description);
    setFCategory(goal.category);
    setFTargetDate(goal.targetDate || '');
    setFCompleted(goal.completed);
    setFVisibility(goal.isPrivate ? 'private' : goal.isPublished ? 'public' : 'draft');
    setShowFutureModal(true);
  };

  const handleSaveFuture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fTitle || !fDesc) return;
    const isPrivate = fVisibility === 'private';
    const isPublished = fVisibility === 'public';

    try {
      if (editingFuture) {
        const res = await adminApi.updateFutureGoal(editingFuture._id, {
          title: fTitle,
          description: fDesc,
          category: fCategory,
          targetDate: fTargetDate,
          completed: fCompleted,
          isPrivate,
          isPublished
        });
        if (res.success) {
          setFuture(future.map(f => f._id === editingFuture._id ? res.data : f));
          triggerSuccess('Future dream updated.');
        }
      } else {
        const res = await adminApi.createFutureGoal({
          title: fTitle,
          description: fDesc,
          category: fCategory,
          targetDate: fTargetDate,
          completed: fCompleted,
          isPrivate,
          isPublished
        });
        if (res.success) {
          setFuture([...future, res.data]);
          triggerSuccess('Future dream added to bucket list.');
        }
      }
      setShowFutureModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFuture = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bucket list item?')) return;
    try {
      await adminApi.deleteFutureGoal(id);
      setFuture(future.filter(f => f._id !== id));
      triggerSuccess('Future item deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFutureCompleted = async (goal: FutureGoalItem) => {
    try {
      const res = await adminApi.updateFutureGoal(goal._id, { completed: !goal.completed });
      if (res.success) {
        setFuture(future.map(f => f._id === goal._id ? res.data : f));
        triggerSuccess(goal.completed ? 'Marked as in progress' : 'Marked as completed ❤️');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFutureVisibility = async (goal: FutureGoalItem, status: 'public' | 'private' | 'draft') => {
    const isPrivate = status === 'private';
    const isPublished = status === 'public';
    try {
      const res = await adminApi.updateFutureGoal(goal._id, { isPrivate, isPublished });
      if (res.success) {
        setFuture(future.map(f => f._id === goal._id ? res.data : f));
        triggerSuccess(`Visibility updated to ${status.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- SETTINGS SAVE ---
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

        {/* SECTION: PRIVATE VAULT */}
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
                onClick={() => {
                  setEditingMemory(null);
                  setShowPhotoModal(true);
                }}
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

                  <div className="mt-4 pt-3 border-t border-[#F0E6DD] flex items-center justify-between gap-2">
                    <select
                      value={img.isPrivate ? 'private' : img.isPublished ? 'public' : 'draft'}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        const isPriv = val === 'private';
                        const isPub = val === 'public';
                        adminApi.updateGalleryImage(img._id, { isPrivate: isPriv, isPublished: isPub }).then(res => {
                          if (res.success) {
                            setGallery(gallery.map(g => g._id === img._id ? res.data : g));
                            triggerSuccess(`Updated status to ${val.toUpperCase()}`);
                          }
                        });
                      }}
                      className="text-xs bg-[#FAF7F2] border border-[#D5BCAD] rounded px-2 py-1 text-[#3D251E]"
                    >
                      <option value="public">PUBLIC</option>
                      <option value="private">PRIVATE</option>
                      <option value="draft">DRAFT</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingMemory(img);
                          setShowPhotoModal(true);
                        }}
                        className="p-1 rounded text-[#7D5A4F] hover:text-[#3D251E] hover:bg-[#F5ECE3]"
                        title="Edit Memory"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (!confirm('Are you sure you want to delete this memory?')) return;
                          adminApi.deleteGalleryImage(img._id).then(() => {
                            setGallery(gallery.filter(g => g._id !== img._id));
                            triggerSuccess('Photo deleted.');
                          });
                        }}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: TIMELINE MILESTONES */}
        {currentSection === 'timeline' && (
          <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl text-[#3D251E] font-medium">Timeline Milestones</h1>
                <p className="text-xs text-[#7D5A4F] mt-1">
                  Create, edit, and organize every milestone in our romantic story.
                </p>
              </div>

              <button
                onClick={openCreateTimeline}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold rounded-lg tracking-wider uppercase shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl border border-[#E3D3C5] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs"
                >
                  <div className="flex items-start gap-4">
                    {item.imageUrl && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F5ECE3] shrink-0">
                        <ImageWithFallback
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#8F7266] uppercase tracking-wider mb-1">
                        <span className="font-semibold text-[#A84B3D] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.date}
                        </span>
                        {item.location && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {item.location}
                            </span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.isPrivate ? 'bg-[#FFE4E6] text-[#BE123C]' : item.isPublished ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEF3C7] text-[#B45309]'
                        }`}>
                          {item.isPrivate ? 'PRIVATE' : item.isPublished ? 'PUBLIC' : 'DRAFT'}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl text-[#3D251E] font-medium">{item.title}</h3>
                      <p className="text-xs text-[#6B5349] mt-1 max-w-xl line-clamp-2">{item.description}</p>
                      {item.quote && (
                        <p className="font-handwriting text-sm text-[#A84B3D] mt-1">“{item.quote}”</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <select
                      value={item.isPrivate ? 'private' : item.isPublished ? 'public' : 'draft'}
                      onChange={(e) => toggleTimelineVisibility(item, e.target.value as any)}
                      className="text-xs bg-[#FAF7F2] border border-[#D5BCAD] rounded px-2.5 py-1.5 text-[#3D251E]"
                    >
                      <option value="public">PUBLIC</option>
                      <option value="private">PRIVATE</option>
                      <option value="draft">DRAFT</option>
                    </select>

                    <button
                      onClick={() => openEditTimeline(item)}
                      className="p-2 rounded hover:bg-[#F5ECE3] text-[#6B5349] hover:text-[#3D251E]"
                      title="Edit Milestone"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteTimeline(item._id)}
                      className="p-2 rounded hover:bg-red-50 text-red-600 hover:text-red-800"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: CHUKKU PAGE CONTENT */}
        {currentSection === 'chukku' && (
          <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl text-[#3D251E] font-medium">Chukku Page Management</h1>
                <p className="text-xs text-[#7D5A4F] mt-1">
                  Manage Chukku’s dedicated page: introduction quotes and personalized love cards.
                </p>
              </div>

              <button
                onClick={() => openCreateCard('chukku')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold rounded-lg tracking-wider uppercase shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Chukku Love Card</span>
              </button>
            </div>

            {/* Quick Intro & Featured Banner Editor */}
            {settings && (
              <div className="bg-white p-6 rounded-xl border border-[#E3D3C5] shadow-xs space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A433A] uppercase tracking-wider mb-2">
                    Chukku Page Introduction Quote
                  </label>
                  <textarea
                    rows={2}
                    value={settings.chukkuIntro || ''}
                    onChange={(e) => setSettings({ ...settings, chukkuIntro: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A433A] uppercase tracking-wider mb-2">
                      Featured Photograph
                    </label>
                    <select
                      value={settings.chukkuFeaturedImage || ''}
                      onChange={(e) => setSettings({ ...settings, chukkuFeaturedImage: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                    >
                      {PHOTO_OPTIONS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A433A] uppercase tracking-wider mb-2">
                      Featured Romantic Quote
                    </label>
                    <input
                      type="text"
                      value={settings.chukkuFeaturedQuote || ''}
                      onChange={(e) => setSettings({ ...settings, chukkuFeaturedQuote: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={async () => {
                      await adminApi.updateSettings({
                        chukkuIntro: settings.chukkuIntro,
                        chukkuFeaturedImage: settings.chukkuFeaturedImage,
                        chukkuFeaturedQuote: settings.chukkuFeaturedQuote
                      });
                      triggerSuccess('Chukku page headers & featured image updated!');
                    }}
                    className="px-5 py-2.5 bg-[#3D251E] hover:bg-[#2A1813] text-white text-xs font-medium rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Chukku Page Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Chukku Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.filter(c => c.owner === 'chukku').map(card => (
                <div key={card._id} className="bg-white rounded-xl border border-[#E3D3C5] p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    {card.imageUrl && (
                      <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#F5ECE3] mb-3">
                        <ImageWithFallback
                          src={card.imageUrl}
                          alt={card.title}
                          className="w-full h-full"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-[#A84B3D] uppercase tracking-wider">
                        {card.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        card.isPrivate ? 'bg-[#FFE4E6] text-[#BE123C]' : card.isPublished ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}>
                        {card.isPrivate ? 'PRIVATE' : card.isPublished ? 'PUBLIC' : 'DRAFT'}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-[#3D251E] font-medium">{card.title}</h3>
                    <p className="text-xs text-[#6B5349] mt-2 line-clamp-3">{card.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0E6DD] flex items-center justify-between gap-2">
                    <select
                      value={card.isPrivate ? 'private' : card.isPublished ? 'public' : 'draft'}
                      onChange={(e) => toggleCardVisibility(card, e.target.value as any)}
                      className="text-xs bg-[#FAF7F2] border border-[#D5BCAD] rounded px-2 py-1 text-[#3D251E]"
                    >
                      <option value="public">PUBLIC</option>
                      <option value="private">PRIVATE</option>
                      <option value="draft">DRAFT</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCard(card)}
                        className="p-1.5 rounded hover:bg-[#F5ECE3] text-[#6B5349]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card._id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: HYPHAE PAGE CONTENT */}
        {currentSection === 'hyphae' && (
          <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl text-[#3D251E] font-medium">Hyphae Page Management</h1>
                <p className="text-xs text-[#7D5A4F] mt-1">
                  Manage Hyphae’s perspective: words, promises, and confessions for Chukku.
                </p>
              </div>

              <button
                onClick={() => openCreateCard('hyphae')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold rounded-lg tracking-wider uppercase shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hyphae Card</span>
              </button>
            </div>

            {/* Hyphae Page Intro, Featured Banner & Closing Note Editor */}
            {settings && (
              <div className="bg-white p-6 rounded-xl border border-[#E3D3C5] shadow-xs space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A433A] uppercase tracking-wider mb-2">
                    Hyphae Page Introduction Quote
                  </label>
                  <textarea
                    rows={2}
                    value={settings.hyphaeIntro || ''}
                    onChange={(e) => setSettings({ ...settings, hyphaeIntro: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5A433A] uppercase tracking-wider mb-2">
                      Featured Photograph
                    </label>
                    <select
                      value={settings.hyphaeFeaturedImage || ''}
                      onChange={(e) => setSettings({ ...settings, hyphaeFeaturedImage: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                    >
                      {PHOTO_OPTIONS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A433A] uppercase tracking-wider mb-2">
                      Featured Romantic Quote
                    </label>
                    <input
                      type="text"
                      value={settings.hyphaeFeaturedQuote || ''}
                      onChange={(e) => setSettings({ ...settings, hyphaeFeaturedQuote: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A433A] uppercase tracking-wider mb-2">
                    Heartfelt Closing Note from Hyphae
                  </label>
                  <textarea
                    rows={3}
                    value={settings.hyphaePersonalNote || ''}
                    onChange={(e) => setSettings({ ...settings, hyphaePersonalNote: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={async () => {
                      await adminApi.updateSettings({
                        hyphaeIntro: settings.hyphaeIntro,
                        hyphaeFeaturedImage: settings.hyphaeFeaturedImage,
                        hyphaeFeaturedQuote: settings.hyphaeFeaturedQuote,
                        hyphaePersonalNote: settings.hyphaePersonalNote
                      });
                      triggerSuccess('Hyphae page headers & note updated!');
                    }}
                    className="px-5 py-2.5 bg-[#3D251E] hover:bg-[#2A1813] text-white text-xs font-medium rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Hyphae Page Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Hyphae Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.filter(c => c.owner === 'hyphae').map(card => (
                <div key={card._id} className="bg-white rounded-xl border border-[#E3D3C5] p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    {card.imageUrl && (
                      <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#F5ECE3] mb-3">
                        <ImageWithFallback
                          src={card.imageUrl}
                          alt={card.title}
                          className="w-full h-full"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-[#A84B3D] uppercase tracking-wider">
                        {card.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        card.isPrivate ? 'bg-[#FFE4E6] text-[#BE123C]' : card.isPublished ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}>
                        {card.isPrivate ? 'PRIVATE' : card.isPublished ? 'PUBLIC' : 'DRAFT'}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-[#3D251E] font-medium">{card.title}</h3>
                    <p className="text-xs text-[#6B5349] mt-2 line-clamp-3">{card.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0E6DD] flex items-center justify-between gap-2">
                    <select
                      value={card.isPrivate ? 'private' : card.isPublished ? 'public' : 'draft'}
                      onChange={(e) => toggleCardVisibility(card, e.target.value as any)}
                      className="text-xs bg-[#FAF7F2] border border-[#D5BCAD] rounded px-2 py-1 text-[#3D251E]"
                    >
                      <option value="public">PUBLIC</option>
                      <option value="private">PRIVATE</option>
                      <option value="draft">DRAFT</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCard(card)}
                        className="p-1.5 rounded hover:bg-[#F5ECE3] text-[#6B5349]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card._id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: LOVE LETTER MANAGEMENT */}
        {currentSection === 'love-letter' && (
          <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl text-[#3D251E] font-medium">Love Letter Management</h1>
                <p className="text-xs text-[#7D5A4F] mt-1">
                  Draft, update, and manage public love letters as well as confidential vault letters.
                </p>
              </div>

              <button
                onClick={openCreateLetter}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold rounded-lg tracking-wider uppercase shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Letter</span>
              </button>
            </div>

            <div className="space-y-6">
              {letters.map(letter => (
                <div
                  key={letter._id}
                  className="bg-white rounded-xl border border-[#E3D3C5] p-6 shadow-xs relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs text-[#8F7266]">
                        <span className="font-semibold text-[#A84B3D]">{letter.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>Mood: {letter.mood || 'Unfiltered'}</span>
                      </div>
                      
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        letter.isPrivate ? 'bg-[#FFE4E6] text-[#BE123C]' : 'bg-[#DCFCE7] text-[#15803D]'
                      }`}>
                        {letter.isPrivate ? 'PRIVATE (Vault only)' : 'PUBLIC (Visible to visitors)'}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-[#3D251E] font-medium">{letter.title}</h3>
                    <p className="font-serif text-sm text-[#4A352D] mt-3 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto bg-[#FAF7F2] p-4 rounded-lg border border-[#F0E6DD]">
                      {letter.content}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#F0E6DD] flex items-center justify-between">
                    <button
                      onClick={() => toggleLetterVisibility(letter, letter.isPrivate ? 'public' : 'private')}
                      className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                        letter.isPrivate ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FFE4E6] text-[#BE123C]'
                      }`}
                    >
                      {letter.isPrivate ? 'Make Letter PUBLIC' : 'Make Letter PRIVATE'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditLetter(letter)}
                        className="p-2 rounded hover:bg-[#F5ECE3] text-[#6B5349]"
                        title="Edit Letter"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteLetter(letter._id)}
                        className="p-2 rounded hover:bg-red-50 text-red-600"
                        title="Delete Letter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: FUTURE BUCKET LIST */}
        {currentSection === 'future' && (
          <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl text-[#3D251E] font-medium">Future Bucket List</h1>
                <p className="text-xs text-[#7D5A4F] mt-1">
                  Manage dreams and experiences we haven't done yet, track completion, and set visibility.
                </p>
              </div>

              <button
                onClick={openCreateFuture}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A84B3D] hover:bg-[#8F3C30] text-white text-xs font-semibold rounded-lg tracking-wider uppercase shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Future Dream</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {future.map((goal, idx) => (
                <div
                  key={goal._id}
                  className="bg-white rounded-xl border border-[#E3D3C5] p-5 sm:p-6 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#A84B3D] uppercase tracking-wider">
                        {goal.category} {goal.targetDate ? `· ${goal.targetDate}` : ''}
                      </span>

                      <button
                        onClick={() => toggleFutureCompleted(goal)}
                        className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                          goal.completed ? 'text-emerald-700' : 'text-[#8F7266]'
                        }`}
                      >
                        {goal.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#A89387]" />
                        )}
                        <span>{goal.completed ? 'Completed' : 'Dreaming'}</span>
                      </button>
                    </div>

                    <h3 className="font-serif text-xl text-[#3D251E] font-medium">{goal.title}</h3>
                    <p className="text-xs text-[#6B5349] mt-2 leading-relaxed">{goal.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#F0E6DD] flex items-center justify-between">
                    <select
                      value={goal.isPrivate ? 'private' : goal.isPublished ? 'public' : 'draft'}
                      onChange={(e) => toggleFutureVisibility(goal, e.target.value as any)}
                      className="text-xs bg-[#FAF7F2] border border-[#D5BCAD] rounded px-2.5 py-1 text-[#3D251E]"
                    >
                      <option value="public">PUBLIC</option>
                      <option value="private">PRIVATE</option>
                      <option value="draft">DRAFT</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditFuture(goal)}
                        className="p-1.5 rounded hover:bg-[#F5ECE3] text-[#6B5349]"
                        title="Edit Dream"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteFuture(goal._id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600"
                        title="Delete Dream"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                  Hero Headline, Subtitle & Featured Image
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#5A433A] font-semibold uppercase mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={settings.heroButtonText || 'Enter our story →'}
                        onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#5A433A] font-semibold uppercase mb-1">Hero Featured Photo</label>
                      <select
                        value={settings.featuredImageUrl}
                        onChange={(e) => setSettings({ ...settings, featuredImageUrl: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                      >
                        {PHOTO_OPTIONS.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Memory Section */}
              <div>
                <h3 className="font-serif text-xl text-[#3D251E] font-medium mb-3 pb-2 border-b border-[#F0E6DD]">
                  Featured Memory Section (Home Page Spotlight)
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#5A433A] font-semibold uppercase mb-1">Section Title</label>
                      <input
                        type="text"
                        value={settings.featuredMemoryTitle || 'The Moment Time Stood Still'}
                        onChange={(e) => setSettings({ ...settings, featuredMemoryTitle: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#5A433A] font-semibold uppercase mb-1">Handwritten Subtitle</label>
                      <input
                        type="text"
                        value={settings.featuredMemorySubtitle || '“Just us, nothing else.”'}
                        onChange={(e) => setSettings({ ...settings, featuredMemorySubtitle: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#5A433A] font-semibold uppercase mb-1">Spotlight Photo</label>
                    <select
                      value={settings.featuredMemoryImage || PHOTO_OPTIONS[1].value}
                      onChange={(e) => setSettings({ ...settings, featuredMemoryImage: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                    >
                      {PHOTO_OPTIONS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#5A433A] font-semibold uppercase mb-1">Story Paragraph</label>
                    <textarea
                      rows={2}
                      value={settings.featuredMemoryText || ''}
                      onChange={(e) => setSettings({ ...settings, featuredMemoryText: e.target.value })}
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#5A433A] font-semibold uppercase mb-1">Surprise Title</label>
                      <input
                        type="text"
                        value={settings.finalSurpriseTitle || 'One Last Thing…'}
                        onChange={(e) => setSettings({ ...settings, finalSurpriseTitle: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#5A433A] font-semibold uppercase mb-1">Surprise Photograph</label>
                      <select
                        value={settings.finalSurpriseImage || PHOTO_OPTIONS[1].value}
                        onChange={(e) => setSettings({ ...settings, finalSurpriseImage: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                      >
                        {PHOTO_OPTIONS.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

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

      {/* -------------------- MODALS -------------------- */}
      
      {/* 1. TIMELINE MODAL */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#E3D3C5] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowTimelineModal(false)}
              className="absolute top-5 right-5 text-[#8F7266] hover:text-[#3D251E]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl text-[#3D251E] font-medium mb-4">
              {editingTimeline ? 'Edit Milestone' : 'Add Milestone to Our Story'}
            </h2>

            <form onSubmit={handleSaveTimeline} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5A433A] font-semibold uppercase mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={tDate}
                    onChange={(e) => setTDate(e.target.value)}
                    placeholder="e.g. October 2025"
                    className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                  />
                </div>
                <div>
                  <label className="block text-[#5A433A] font-semibold uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={tLoc}
                    onChange={(e) => setTLoc(e.target.value)}
                    placeholder="e.g. Udaipur, Lake Pichola"
                    className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  placeholder="e.g. First Time Meeting in Person"
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                />
              </div>

              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Story / Description</label>
                <textarea
                  rows={3}
                  required
                  value={tDesc}
                  onChange={(e) => setTDesc(e.target.value)}
                  placeholder="Write the memory..."
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                />
              </div>

              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Romantic Quote</label>
                <input
                  type="text"
                  value={tQuote}
                  onChange={(e) => setTQuote(e.target.value)}
                  placeholder="e.g. My heart beat so fast that day..."
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5A433A] font-semibold uppercase mb-1">Attach Photograph</label>
                  <select
                    value={tImg}
                    onChange={(e) => setTImg(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                  >
                    <option value="">(No photo)</option>
                    {PHOTO_OPTIONS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#5A433A] font-semibold uppercase mb-1">Visibility</label>
                  <select
                    value={tVisibility}
                    onChange={(e) => setTVisibility(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                  >
                    <option value="public">PUBLIC (Website)</option>
                    <option value="private">PRIVATE (Vault only)</option>
                    <option value="draft">DRAFT</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTimelineModal(false)}
                  className="px-4 py-2 border border-[#D5BCAD] rounded-lg text-[#6B5349]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#A84B3D] text-white rounded-lg font-medium"
                >
                  {editingTimeline ? 'Update Milestone' : 'Save Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PERSONAL CARD MODAL (CHUKKU & HYPHAE) */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#E3D3C5] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCardModal(false)}
              className="absolute top-5 right-5 text-[#8F7266] hover:text-[#3D251E]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl text-[#3D251E] font-medium mb-4">
              {editingCard ? 'Edit Card' : `Add ${cardModalOwner === 'chukku' ? 'Chukku' : 'Hyphae'} Card`}
            </h2>

            <form onSubmit={handleSaveCard} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Card Title</label>
                <input
                  type="text"
                  required
                  value={cTitle}
                  onChange={(e) => setCTitle(e.target.value)}
                  placeholder="e.g. Your Radiant Smile"
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                />
              </div>

              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Category / Section</label>
                <input
                  type="text"
                  required
                  value={cCategory}
                  onChange={(e) => setCCategory(e.target.value)}
                  placeholder={cardModalOwner === 'chukku' ? 'Things I Love About You / Little Things' : 'My Side of the Story / Dreams / Keepsakes'}
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                />
              </div>

              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Description / Words</label>
                <textarea
                  rows={3}
                  required
                  value={cDesc}
                  onChange={(e) => setCDesc(e.target.value)}
                  placeholder="Write the details..."
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5A433A] font-semibold uppercase mb-1">Photograph</label>
                  <select
                    value={cImg}
                    onChange={(e) => setCImg(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                  >
                    <option value="">(No photo)</option>
                    {PHOTO_OPTIONS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#5A433A] font-semibold uppercase mb-1">Visibility</label>
                  <select
                    value={cVisibility}
                    onChange={(e) => setCVisibility(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                  >
                    <option value="public">PUBLIC (Website)</option>
                    <option value="private">PRIVATE (Vault only)</option>
                    <option value="draft">DRAFT</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="px-4 py-2 border border-[#D5BCAD] rounded-lg text-[#6B5349]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#A84B3D] text-white rounded-lg font-medium"
                >
                  {editingCard ? 'Update Card' : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. LOVE LETTER MODAL */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#E3D3C5] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowLetterModal(false)}
              className="absolute top-5 right-5 text-[#8F7266] hover:text-[#3D251E]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl text-[#3D251E] font-medium mb-4">
              {editingLetter ? 'Edit Love Letter' : 'Write Love Letter'}
            </h2>

            <form onSubmit={handleSaveLetter} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Letter Title</label>
                <input
                  type="text"
                  required
                  value={lTitle}
                  onChange={(e) => setLTitle(e.target.value)}
                  placeholder="e.g. A Little Letter For You"
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5A433A] font-semibold uppercase mb-1">Date</label>
                  <input
                    type="text"
                    value={lDate}
                    onChange={(e) => setLDate(e.target.value)}
                    placeholder="e.g. October 2026"
                    className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                  />
                </div>
                <div>
                  <label className="block text-[#5A433A] font-semibold uppercase mb-1">Mood / Tag</label>
                  <input
                    type="text"
                    value={lMood}
                    onChange={(e) => setLMood(e.target.value)}
                    placeholder="e.g. Pure Devotion"
                    className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Letter Content</label>
                <textarea
                  rows={8}
                  required
                  value={lContent}
                  onChange={(e) => setLContent(e.target.value)}
                  placeholder="Write your heartfelt letter..."
                  className="w-full p-3 bg-white border border-[#D5BCAD] rounded-lg font-serif text-base text-[#3D251E] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Privacy Level</label>
                <select
                  value={lVisibility}
                  onChange={(e) => setLVisibility(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                >
                  <option value="public">PUBLIC (Displayed in the public Love Letter section)</option>
                  <option value="private">PRIVATE (Kept only inside the Private Vault)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLetterModal(false)}
                  className="px-4 py-2 border border-[#D5BCAD] rounded-lg text-[#6B5349]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#A84B3D] text-white rounded-lg font-medium"
                >
                  {editingLetter ? 'Update Letter' : 'Save Letter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. FUTURE GOAL MODAL */}
      {showFutureModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#E3D3C5] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFutureModal(false)}
              className="absolute top-5 right-5 text-[#8F7266] hover:text-[#3D251E]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl text-[#3D251E] font-medium mb-4">
              {editingFuture ? 'Edit Future Dream' : 'Add Future Bucket List Item'}
            </h2>

            <form onSubmit={handleSaveFuture} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Dream Title</label>
                <input
                  type="text"
                  required
                  value={fTitle}
                  onChange={(e) => setFTitle(e.target.value)}
                  placeholder="e.g. Watch the Sunrise From a Mountain Peak"
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5A433A] font-semibold uppercase mb-1">Category</label>
                  <select
                    value={fCategory}
                    onChange={(e) => setFCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Sunrise">Sunrise</option>
                    <option value="Experiences">Experiences</option>
                    <option value="Moments">Moments</option>
                    <option value="Dreams">Dreams</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5A433A] font-semibold uppercase mb-1">Target Date / Timeline</label>
                  <input
                    type="text"
                    value={fTargetDate}
                    onChange={(e) => setFTargetDate(e.target.value)}
                    placeholder="e.g. Spring 2027 / Next Winter"
                    className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={fDesc}
                  onChange={(e) => setFDesc(e.target.value)}
                  placeholder="Describe what we will do together..."
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-sm text-[#3D251E]"
                />
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="fCompleted"
                  checked={fCompleted}
                  onChange={(e) => setFCompleted(e.target.checked)}
                  className="w-4 h-4 accent-[#A84B3D]"
                />
                <label htmlFor="fCompleted" className="text-sm text-[#3D251E]">
                  Already completed / experienced together
                </label>
              </div>

              <div>
                <label className="block text-[#5A433A] font-semibold uppercase mb-1">Visibility</label>
                <select
                  value={fVisibility}
                  onChange={(e) => setFVisibility(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-[#D5BCAD] rounded-lg text-xs text-[#3D251E]"
                >
                  <option value="public">PUBLIC (Website)</option>
                  <option value="private">PRIVATE (Vault only)</option>
                  <option value="draft">DRAFT</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFutureModal(false)}
                  className="px-4 py-2 border border-[#D5BCAD] rounded-lg text-[#6B5349]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#A84B3D] text-white rounded-lg font-medium"
                >
                  {editingFuture ? 'Update Dream' : 'Save Dream'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHOTO UPLOADER MODAL */}
      <PhotoUploaderModal
        isOpen={showPhotoModal}
        onClose={() => {
          setShowPhotoModal(false);
          setEditingMemory(null);
        }}
        initialData={editingMemory}
        onSuccess={(savedImg) => {
          if (editingMemory) {
            setGallery(gallery.map(g => g._id === savedImg._id ? savedImg : g));
            triggerSuccess('Memory updated successfully!');
          } else {
            setGallery([savedImg, ...gallery]);
            triggerSuccess('Memory saved successfully!');
          }
        }}
      />
    </div>
  );
};
