import React, { useState, useEffect } from 'react';
import { vaultApi, adminApi } from '../services/api.ts';
import {
  GalleryImage,
  LoveLetterItem,
  PrivateNoteItem,
  PrivateJournalItem,
  SurpriseIdeaItem
} from '../types/index.ts';
import {
  Lock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Heart,
  BookOpen,
  Gift,
  ShieldAlert,
  Save,
  Check,
  X,
  MapPin,
  Tag
} from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';
import { PhotoUploaderModal } from './PhotoUploaderModal.tsx';

export const PrivateVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'memories' | 'letters' | 'notes' | 'surprises' | 'journal'>('memories');
  
  // State for all vault data
  const [memories, setMemories] = useState<GalleryImage[]>([]);
  const [letters, setLetters] = useState<LoveLetterItem[]>([]);
  const [notes, setNotes] = useState<PrivateNoteItem[]>([]);
  const [journals, setJournals] = useState<PrivateJournalItem[]>([]);
  const [surprises, setSurprises] = useState<SurpriseIdeaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // 1. Photo Modal state (Create & Edit)
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<GalleryImage | null>(null);

  // 2. Note modal state (Create & Edit)
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<PrivateNoteItem | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Random thoughts');
  const [noteTags, setNoteTags] = useState('');

  // 3. Letter modal state (Create & Edit)
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [editingLetter, setEditingLetter] = useState<LoveLetterItem | null>(null);
  const [letterTitle, setLetterTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0]);
  const [letterMood, setLetterMood] = useState('Unfiltered Truth');

  // 4. Journal modal state (Create & Edit)
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [editingJournal, setEditingJournal] = useState<PrivateJournalItem | null>(null);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState('Deep Emotion');
  const [journalDate, setJournalDate] = useState(new Date().toISOString().split('T')[0]);

  // 5. Surprise modal state (Create & Edit)
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [editingSurprise, setEditingSurprise] = useState<SurpriseIdeaItem | null>(null);
  const [surpriseTitle, setSurpriseTitle] = useState('');
  const [surpriseDesc, setSurpriseDesc] = useState('');
  const [surpriseLocation, setSurpriseLocation] = useState('');
  const [surpriseBudget, setSurpriseBudget] = useState('');
  const [surpriseStatus, setSurpriseStatus] = useState<'Idea' | 'Planning' | 'Ready' | 'Completed'>('Planning');
  const [surpriseNotes, setSurpriseNotes] = useState('');
  const [surpriseChecklistText, setSurpriseChecklistText] = useState('');

  const triggerNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const loadAllVaultData = async () => {
    setLoading(true);
    try {
      const [memRes, letRes, notRes, jrRes, surRes] = await Promise.all([
        vaultApi.getMemories(),
        vaultApi.getLetters(),
        vaultApi.getNotes(),
        vaultApi.getJournals(),
        vaultApi.getSurprises()
      ]);

      if (memRes.success) setMemories(memRes.data);
      if (letRes.success) setLetters(letRes.data);
      if (notRes.success) setNotes(notRes.data);
      if (jrRes.success) setJournals(jrRes.data);
      if (surRes.success) setSurprises(surRes.data);
    } catch (err) {
      console.error('Failed to load private vault data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllVaultData();
  }, []);

  // Quick toggle photo privacy (PUBLIC <-> PRIVATE)
  const togglePhotoPrivacy = async (img: GalleryImage) => {
    const newIsPrivate = !img.isPrivate;
    try {
      const res = await vaultApi.updateMemoryPrivacy(img._id, {
        isPrivate: newIsPrivate,
        isPublished: !newIsPrivate
      });
      if (res.success) {
        setMemories(memories.map(m => m._id === img._id ? res.data : m));
        triggerNotify(newIsPrivate ? 'Marked as PRIVATE' : 'Published to public gallery');
      }
    } catch (err) {
      console.error('Failed to toggle privacy:', err);
    }
  };

  // Delete memory
  const handleDeleteMemory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this secret memory?')) return;
    try {
      const res = await adminApi.deleteGalleryImage(id);
      if (res.success) {
        setMemories(memories.filter(m => m._id !== id));
        triggerNotify('Memory deleted.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Create/Edit Note
  const openCreateNote = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('Random thoughts');
    setNoteTags('');
    setShowNoteModal(true);
  };

  const openEditNote = (note: PrivateNoteItem) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setNoteTags((note.tags || []).join(', '));
    setShowNoteModal(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;
    try {
      const parsedTags = noteTags.split(',').map(t => t.trim()).filter(Boolean);
      if (editingNote) {
        const res = await vaultApi.updateNote(editingNote._id, {
          title: noteTitle,
          content: noteContent,
          category: noteCategory,
          tags: parsedTags
        });
        if (res.success) {
          setNotes(notes.map(n => n._id === editingNote._id ? res.data : n));
          setShowNoteModal(false);
          triggerNotify('Note updated successfully.');
        }
      } else {
        const res = await vaultApi.createNote({
          title: noteTitle,
          content: noteContent,
          category: noteCategory,
          tags: parsedTags
        });
        if (res.success) {
          setNotes([res.data, ...notes]);
          setShowNoteModal(false);
          triggerNotify('Note saved.');
        }
      }
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await vaultApi.deleteNote(id);
      setNotes(notes.filter(n => n._id !== id));
      triggerNotify('Note deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // Open Create/Edit Letter
  const openCreateLetter = () => {
    setEditingLetter(null);
    setLetterTitle('');
    setLetterContent('');
    setLetterDate(new Date().toISOString().split('T')[0]);
    setLetterMood('Unfiltered Truth');
    setShowLetterModal(true);
  };

  const openEditLetter = (letter: LoveLetterItem) => {
    setEditingLetter(letter);
    setLetterTitle(letter.title);
    setLetterContent(letter.content);
    setLetterDate(letter.date);
    setLetterMood(letter.mood || 'Unfiltered Truth');
    setShowLetterModal(true);
  };

  const handleSaveLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterTitle || !letterContent) return;
    try {
      if (editingLetter) {
        const res = await vaultApi.updateLetter(editingLetter._id, {
          title: letterTitle,
          content: letterContent,
          date: letterDate,
          mood: letterMood,
          isPrivate: true,
          isPublished: false
        });
        if (res.success) {
          setLetters(letters.map(l => l._id === editingLetter._id ? res.data : l));
          setShowLetterModal(false);
          triggerNotify('Secret letter updated.');
        }
      } else {
        const res = await vaultApi.createLetter({
          title: letterTitle,
          content: letterContent,
          date: letterDate,
          mood: letterMood
        });
        if (res.success) {
          setLetters([res.data, ...letters]);
          setShowLetterModal(false);
          triggerNotify('Secret letter saved.');
        }
      }
    } catch (err) {
      console.error('Failed to save private letter:', err);
    }
  };

  const handleDeleteLetter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this secret letter?')) return;
    try {
      await vaultApi.deleteLetter(id);
      setLetters(letters.filter(l => l._id !== id));
      triggerNotify('Secret letter deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // Open Create/Edit Journal
  const openCreateJournal = () => {
    setEditingJournal(null);
    setJournalTitle('');
    setJournalContent('');
    setJournalMood('Deep Emotion');
    setJournalDate(new Date().toISOString().split('T')[0]);
    setShowJournalModal(true);
  };

  const openEditJournal = (entry: PrivateJournalItem) => {
    setEditingJournal(entry);
    setJournalTitle(entry.title);
    setJournalContent(entry.content);
    setJournalMood(entry.mood || 'Deep Emotion');
    setJournalDate(entry.date || new Date().toISOString().split('T')[0]);
    setShowJournalModal(true);
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTitle || !journalContent) return;
    try {
      if (editingJournal) {
        const res = await vaultApi.updateJournal(editingJournal._id, {
          title: journalTitle,
          content: journalContent,
          date: journalDate,
          mood: journalMood
        });
        if (res.success) {
          setJournals(journals.map(j => j._id === editingJournal._id ? res.data : j));
          setShowJournalModal(false);
          triggerNotify('Journal entry updated.');
        }
      } else {
        const res = await vaultApi.createJournal({
          title: journalTitle,
          content: journalContent,
          date: journalDate,
          mood: journalMood,
          tags: ['private', 'vault']
        });
        if (res.success) {
          setJournals([res.data, ...journals]);
          setShowJournalModal(false);
          triggerNotify('Journal entry saved.');
        }
      }
    } catch (err) {
      console.error('Failed to save journal entry:', err);
    }
  };

  const handleDeleteJournal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) return;
    try {
      await vaultApi.deleteJournal(id);
      setJournals(journals.filter(j => j._id !== id));
      triggerNotify('Journal entry deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // Open Create/Edit Surprise
  const openCreateSurprise = () => {
    setEditingSurprise(null);
    setSurpriseTitle('');
    setSurpriseDesc('');
    setSurpriseLocation('');
    setSurpriseBudget('');
    setSurpriseStatus('Planning');
    setSurpriseNotes('');
    setSurpriseChecklistText('Scout location\nOrganize logistics');
    setShowSurpriseModal(true);
  };

  const openEditSurprise = (surprise: SurpriseIdeaItem) => {
    setEditingSurprise(surprise);
    setSurpriseTitle(surprise.title);
    setSurpriseDesc(surprise.description);
    setSurpriseLocation(surprise.location || '');
    setSurpriseBudget(surprise.budget || '');
    setSurpriseStatus(surprise.status);
    setSurpriseNotes(surprise.notes || '');
    setSurpriseChecklistText((surprise.checklist || []).map(c => c.text).join('\n'));
    setShowSurpriseModal(true);
  };

  const handleSaveSurprise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surpriseTitle || !surpriseDesc) return;
    try {
      const checklistLines = surpriseChecklistText
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

      const parsedChecklist = checklistLines.map((text, idx) => {
        const existing = editingSurprise?.checklist?.[idx];
        return {
          id: existing?.id || `chk_${Date.now()}_${idx}`,
          text,
          done: existing?.done || false
        };
      });

      if (editingSurprise) {
        const res = await vaultApi.updateSurprise(editingSurprise._id, {
          title: surpriseTitle,
          description: surpriseDesc,
          location: surpriseLocation,
          budget: surpriseBudget,
          status: surpriseStatus,
          notes: surpriseNotes,
          checklist: parsedChecklist
        });
        if (res.success) {
          setSurprises(surprises.map(s => s._id === editingSurprise._id ? res.data : s));
          setShowSurpriseModal(false);
          triggerNotify('Surprise plan updated.');
        }
      } else {
        const res = await vaultApi.createSurprise({
          title: surpriseTitle,
          description: surpriseDesc,
          location: surpriseLocation,
          budget: surpriseBudget,
          status: surpriseStatus,
          notes: surpriseNotes,
          checklist: parsedChecklist
        });
        if (res.success) {
          setSurprises([res.data, ...surprises]);
          setShowSurpriseModal(false);
          triggerNotify('Surprise plan saved.');
        }
      }
    } catch (err) {
      console.error('Failed to save surprise idea:', err);
    }
  };

  const handleDeleteSurprise = async (id: string) => {
    if (!confirm('Are you sure you want to delete this surprise idea?')) return;
    try {
      await vaultApi.deleteSurprise(id);
      setSurprises(surprises.filter(s => s._id !== id));
      triggerNotify('Surprise idea deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleChecklist = async (surprise: SurpriseIdeaItem, checkId: string) => {
    const updatedChecklist = surprise.checklist.map(c =>
      c.id === checkId ? { ...c, done: !c.done } : c
    );
    try {
      const res = await vaultApi.updateSurprise(surprise._id, { checklist: updatedChecklist });
      if (res.success) {
        setSurprises(surprises.map(s => s._id === surprise._id ? res.data : s));
      }
    } catch (err) {
      console.error('Failed to update checklist:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0808] text-[#E8DFD8] p-6 sm:p-10 select-none">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-[#166534] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Glow Header */}
      <div className="relative pb-8 mb-8 border-b border-[#2C1819] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#231214] border border-[#542127] flex items-center justify-center text-[#E11D48] shadow-lg shadow-rose-950/40">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-wider text-white">
              PRIVATE VAULT
            </h1>
            <p className="font-serif italic text-sm text-[#B28A85]">
              “Some things are meant to stay between us.”
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-sans text-[#7D5A56] bg-[#1A0E10] px-4 py-2 rounded-full border border-[#33171A]">
          <ShieldAlert className="w-4 h-4 text-[#E11D48]" />
          <span>Never exposed to public visitors</span>
        </div>
      </div>

      {/* Vault Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#241315]">
        {[
          { id: 'memories', label: 'Private Memories & Hidden Photos', count: memories.length },
          { id: 'letters', label: 'Private Letters', count: letters.length },
          { id: 'notes', label: 'Private Notes', count: notes.length },
          { id: 'surprises', label: 'Surprise Ideas', count: surprises.length },
          { id: 'journal', label: 'Personal Journal', count: journals.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-sans tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#E11D48] text-white font-medium shadow-md shadow-rose-950/40'
                : 'bg-[#180E10] text-[#9E827D] hover:text-white border border-[#2B1618]'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* --- TAB 1: PRIVATE MEMORIES --- */}
      {activeTab === 'memories' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-serif text-2xl text-white">Private Memories</h2>
              <p className="text-xs text-[#8A6D68]">
                Photographs that are restricted to this vault. Changing privacy immediately updates public visibility.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingMemory(null);
                setShowPhotoModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold rounded-lg tracking-wider uppercase cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Secret Photo</span>
            </button>
          </div>

          {memories.length === 0 ? (
            <div className="py-20 text-center text-[#8A6D68] bg-[#140C0E] rounded-xl border border-[#241315]">
              <p className="font-serif text-xl">Nothing hidden here yet.</p>
              <button
                onClick={() => {
                  setEditingMemory(null);
                  setShowPhotoModal(true);
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-[#E11D48] text-white text-xs font-semibold inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Your First Secret Memory</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map(img => (
                <div
                  key={img._id}
                  className="bg-[#170E10] border border-[#2C1819] rounded-xl overflow-hidden p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#0D0808] relative mb-3">
                      <ImageWithFallback
                        src={img.imageUrl}
                        alt={img.title}
                        title={img.title}
                        className="w-full h-full"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded-full text-[10px] text-[#E11D48] flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>PRIVATE</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg text-white font-medium">{img.title}</h3>
                    {img.caption && <p className="text-xs text-[#B2948E] mt-1 line-clamp-2">{img.caption}</p>}
                    
                    {img.privateNote && (
                      <div className="mt-3 p-2.5 rounded bg-[#2A1215] border border-[#48181F] text-xs text-[#F4A8B5]">
                        <span className="block text-[10px] uppercase font-bold text-[#E11D48] mb-0.5">Secret Note:</span>
                        {img.privateNote}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#261416] flex justify-between items-center text-xs">
                    <span className="text-[#8A6D68]">{img.date || 'Undated'}</span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePhotoPrivacy(img)}
                        className="px-2.5 py-1 rounded bg-[#2D1619] hover:bg-[#3D1D22] text-[#E8A598] transition-colors cursor-pointer text-xs"
                      >
                        Make Public
                      </button>

                      <button
                        onClick={() => {
                          setEditingMemory(img);
                          setShowPhotoModal(true);
                        }}
                        className="p-1.5 rounded hover:bg-[#2D1619] text-[#B2948E] hover:text-white"
                        title="Edit Memory"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteMemory(img._id)}
                        className="p-1.5 rounded hover:bg-rose-950/40 text-rose-400 hover:text-rose-300"
                        title="Delete Memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: PRIVATE LETTERS --- */}
      {activeTab === 'letters' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-serif text-2xl text-white">Private Letters</h2>
              <p className="text-xs text-[#8A6D68]">
                Intimate letters that never appear on the public website.
              </p>
            </div>
            <button
              onClick={openCreateLetter}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold rounded-lg tracking-wider uppercase cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write Secret Letter</span>
            </button>
          </div>

          <div className="space-y-6">
            {letters.map(letter => (
              <div
                key={letter._id}
                className="bg-[#170E10] border border-[#2C1819] rounded-xl p-6 sm:p-8 relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] text-[#E11D48] uppercase tracking-widest font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Private Letter · Mood: {letter.mood || 'Unfiltered'}</span>
                    </span>
                    <h3 className="font-serif text-2xl text-white font-medium mt-1">{letter.title}</h3>
                    <span className="text-xs text-[#7A615D]">{letter.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditLetter(letter)}
                      className="p-2 rounded hover:bg-[#2D1619] text-[#B2948E] hover:text-white"
                      title="Edit Letter"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLetter(letter._id)}
                      className="p-2 rounded hover:bg-rose-950/40 text-rose-400 hover:text-rose-300"
                      title="Delete Letter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="font-serif text-base sm:text-lg text-[#D6C5BC] whitespace-pre-line leading-relaxed">
                  {letter.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: PRIVATE NOTES --- */}
      {activeTab === 'notes' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-serif text-2xl text-white">Private Notes</h2>
              <p className="text-xs text-[#8A6D68]">
                Personal thoughts, things to remember, little gift ideas, and daily reminders.
              </p>
            </div>
            <button
              onClick={openCreateNote}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold rounded-lg tracking-wider uppercase cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <div
                key={note._id}
                className="bg-[#170E10] border border-[#2C1819] rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-[#E11D48] font-bold uppercase tracking-wider">
                      {note.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditNote(note)}
                        className="text-[#9E827D] hover:text-white p-1"
                        title="Edit Note"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-[#7A5A55] hover:text-red-400 p-1"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg text-white font-medium">{note.title}</h3>
                  <p className="text-xs sm:text-sm text-[#C4B2AA] mt-2 whitespace-pre-line leading-relaxed">
                    {note.content}
                  </p>
                </div>

                {note.tags && note.tags.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#261416] flex flex-wrap gap-1.5">
                    {note.tags.map(t => (
                      <span key={t} className="text-[10px] text-[#9E827D]">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: SURPRISE IDEAS --- */}
      {activeTab === 'surprises' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-serif text-2xl text-white">Surprise Ideas</h2>
              <p className="text-xs text-[#8A6D68]">
                Secret planning for anniversaries, special dates, gifts, and trips.
              </p>
            </div>
            <button
              onClick={openCreateSurprise}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold rounded-lg tracking-wider uppercase cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Surprise</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {surprises.map(surprise => (
              <div
                key={surprise._id}
                className="bg-[#170E10] border border-[#2C1819] rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E11D48]">
                      Status: {surprise.status}
                    </span>
                    <div className="flex items-center gap-2">
                      {surprise.budget && (
                        <span className="text-xs text-[#A89387]">Budget: {surprise.budget}</span>
                      )}
                      <button
                        onClick={() => openEditSurprise(surprise)}
                        className="p-1 rounded text-[#9E827D] hover:text-white"
                        title="Edit Surprise"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSurprise(surprise._id)}
                        className="p-1 rounded text-[#7A5A55] hover:text-red-400"
                        title="Delete Surprise"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl text-white font-medium">{surprise.title}</h3>
                  <p className="text-xs sm:text-sm text-[#C4B2AA] mt-2 leading-relaxed">
                    {surprise.description}
                  </p>

                  {/* Checklist */}
                  {surprise.checklist && surprise.checklist.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#261416]">
                      <span className="text-[10px] font-semibold text-[#8A6D68] uppercase tracking-wider mb-2 block">
                        Action Checklist (Click to Toggle)
                      </span>
                      <div className="space-y-1.5">
                        {surprise.checklist.map(item => (
                          <div
                            key={item.id}
                            onClick={() => toggleChecklist(surprise, item.id)}
                            className="flex items-center gap-2 text-xs text-[#D6C5BC] cursor-pointer hover:text-white"
                          >
                            {item.done ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-[#5A4044]" />
                            )}
                            <span className={item.done ? 'line-through text-[#7A5A5F]' : ''}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {surprise.notes && (
                    <div className="mt-4 p-2.5 rounded bg-[#201012] border border-[#3A181C] text-xs text-[#F4A8B5]">
                      <span className="font-bold text-[#E11D48] text-[10px] block">Execution Notes:</span>
                      {surprise.notes}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#261416] flex justify-between items-center text-xs text-[#7A615D]">
                  <span>{surprise.date || 'TBD'}</span>
                  <span>{surprise.location || 'Secret Location'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: PERSONAL JOURNAL --- */}
      {activeTab === 'journal' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-serif text-2xl text-white">Personal Journal</h2>
              <p className="text-xs text-[#8A6D68]">
                A digital diary for deep memories, feelings, and personal reflections.
              </p>
            </div>
            <button
              onClick={openCreateJournal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold rounded-lg tracking-wider uppercase cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
            </button>
          </div>

          <div className="space-y-6">
            {journals.map(entry => (
              <div
                key={entry._id}
                className="bg-[#170E10] border border-[#2C1819] rounded-xl p-6 sm:p-8"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#E11D48]">
                      <span>{entry.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>Mood: {entry.mood}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-white font-medium mt-1">{entry.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditJournal(entry)}
                      className="p-1.5 rounded text-[#9E827D] hover:text-white"
                      title="Edit Entry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteJournal(entry._id)}
                      className="p-1.5 rounded text-[#7A5A55] hover:text-red-400"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="font-serif text-base sm:text-lg text-[#D6C5BC] leading-relaxed whitespace-pre-line">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- MODALS ----------------- */}

      {/* 1. Photo Modal (Create & Edit) */}
      <PhotoUploaderModal
        isOpen={showPhotoModal}
        onClose={() => {
          setShowPhotoModal(false);
          setEditingMemory(null);
        }}
        defaultPrivate={true}
        initialData={editingMemory}
        onSuccess={(savedImg) => {
          if (editingMemory) {
            setMemories(memories.map(m => m._id === savedImg._id ? savedImg : m));
            triggerNotify('Memory updated.');
          } else {
            setMemories([savedImg, ...memories]);
            triggerNotify('Secret memory saved to vault.');
          }
        }}
      />

      {/* 2. Note Modal (Create & Edit) */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#170E10] border border-[#3C1D22] rounded-xl p-6 max-w-md w-full">
            <h3 className="font-serif text-xl text-white mb-4">
              {editingNote ? 'Edit Private Note' : 'Add Private Note'}
            </h3>
            <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
              <input
                type="text"
                required
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note Title (e.g. Things She Loves)"
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
              />
              <textarea
                rows={4}
                required
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your private note..."
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
              />
              <input
                type="text"
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                placeholder="Category (e.g. Gift Ideas, Reminders)"
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
              />
              <input
                type="text"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
                placeholder="Tags comma separated (e.g. chukku, gifts)"
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded border border-[#33181B] text-[#8A6D68]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#E11D48] text-white font-medium"
                >
                  {editingNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Letter Modal (Create & Edit) */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#170E10] border border-[#3C1D22] rounded-xl p-6 max-w-lg w-full">
            <h3 className="font-serif text-xl text-white mb-4">
              {editingLetter ? 'Edit Secret Letter' : 'Write Secret Letter'}
            </h3>
            <form onSubmit={handleSaveLetter} className="space-y-4 text-xs">
              <input
                type="text"
                required
                value={letterTitle}
                onChange={(e) => setLetterTitle(e.target.value)}
                placeholder="Title (e.g. Things I Never Said Out Loud)"
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
              />
              <textarea
                rows={6}
                required
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                placeholder="Write your private letter..."
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white font-serif text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={letterDate}
                  onChange={(e) => setLetterDate(e.target.value)}
                  placeholder="Date / Occasion"
                  className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
                />
                <input
                  type="text"
                  value={letterMood}
                  onChange={(e) => setLetterMood(e.target.value)}
                  placeholder="Mood (e.g. Unfiltered Truth)"
                  className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLetterModal(false)}
                  className="px-4 py-2 rounded border border-[#33181B] text-[#8A6D68]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#E11D48] text-white font-medium"
                >
                  {editingLetter ? 'Update Secret Letter' : 'Save Secret Letter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Journal Modal (Create & Edit) */}
      {showJournalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#170E10] border border-[#3C1D22] rounded-xl p-6 max-w-lg w-full">
            <h3 className="font-serif text-xl text-white mb-4">
              {editingJournal ? 'Edit Journal Entry' : 'New Private Journal Entry'}
            </h3>
            <form onSubmit={handleSaveJournal} className="space-y-4 text-xs">
              <input
                type="text"
                required
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                placeholder="Entry Title"
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
              />
              <textarea
                rows={6}
                required
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="Dear Journal..."
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white font-serif text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={journalDate}
                  onChange={(e) => setJournalDate(e.target.value)}
                  className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
                />
                <input
                  type="text"
                  value={journalMood}
                  onChange={(e) => setJournalMood(e.target.value)}
                  placeholder="Mood"
                  className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJournalModal(false)}
                  className="px-4 py-2 rounded border border-[#33181B] text-[#8A6D68]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#E11D48] text-white font-medium"
                >
                  {editingJournal ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Surprise Modal (Create & Edit) */}
      {showSurpriseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#170E10] border border-[#3C1D22] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl text-white mb-4">
              {editingSurprise ? 'Edit Surprise Plan' : 'Plan Secret Surprise'}
            </h3>
            <form onSubmit={handleSaveSurprise} className="space-y-4 text-xs">
              <input
                type="text"
                required
                value={surpriseTitle}
                onChange={(e) => setSurpriseTitle(e.target.value)}
                placeholder="Surprise Title (e.g. Stargazing Rooftop)"
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
              />
              <textarea
                rows={3}
                required
                value={surpriseDesc}
                onChange={(e) => setSurpriseDesc(e.target.value)}
                placeholder="Description of the surprise plan..."
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={surpriseLocation}
                  onChange={(e) => setSurpriseLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
                />
                <input
                  type="text"
                  value={surpriseBudget}
                  onChange={(e) => setSurpriseBudget(e.target.value)}
                  placeholder="Estimated Budget"
                  className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
                />
              </div>
              <div>
                <label className="block text-[#A89387] mb-1">Status</label>
                <select
                  value={surpriseStatus}
                  onChange={(e) => setSurpriseStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
                >
                  <option value="Idea">Idea</option>
                  <option value="Planning">Planning</option>
                  <option value="Ready">Ready</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A89387] mb-1">Checklist Items (one per line)</label>
                <textarea
                  rows={3}
                  value={surpriseChecklistText}
                  onChange={(e) => setSurpriseChecklistText(e.target.value)}
                  placeholder="Order flowers&#10;Book rooftop table&#10;Prepare music"
                  className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
                />
              </div>

              <textarea
                rows={2}
                value={surpriseNotes}
                onChange={(e) => setSurpriseNotes(e.target.value)}
                placeholder="Secret notes / instructions..."
                className="w-full p-2.5 bg-[#0D0708] border border-[#33181B] rounded text-white"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSurpriseModal(false)}
                  className="px-4 py-2 rounded border border-[#33181B] text-[#8A6D68]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#E11D48] text-white font-medium"
                >
                  {editingSurprise ? 'Update Plan' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
