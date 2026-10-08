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
  Check
} from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';

export const PrivateVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'memories' | 'letters' | 'notes' | 'surprises' | 'journal'>('memories');
  
  // State for all vault data
  const [memories, setMemories] = useState<GalleryImage[]>([]);
  const [letters, setLetters] = useState<LoveLetterItem[]>([]);
  const [notes, setNotes] = useState<PrivateNoteItem[]>([]);
  const [journals, setJournals] = useState<PrivateJournalItem[]>([]);
  const [surprises, setSurprises] = useState<SurpriseIdeaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Note modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Random thoughts');
  const [noteTags, setNoteTags] = useState('');

  // New Letter modal state
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [letterTitle, setLetterTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0]);
  const [letterMood, setLetterMood] = useState('Unfiltered Truth');

  // New Journal modal state
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState('Deep Emotion');
  const [journalDate, setJournalDate] = useState(new Date().toISOString().split('T')[0]);

  // New Surprise modal state
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [surpriseTitle, setSurpriseTitle] = useState('');
  const [surpriseDesc, setSurpriseDesc] = useState('');
  const [surpriseLocation, setSurpriseLocation] = useState('');
  const [surpriseBudget, setSurpriseBudget] = useState('');
  const [surpriseStatus, setSurpriseStatus] = useState<'Idea' | 'Planning' | 'Ready' | 'Completed'>('Planning');
  const [surpriseNotes, setSurpriseNotes] = useState('');

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
      }
    } catch (err) {
      console.error('Failed to toggle privacy:', err);
    }
  };

  // Create Note
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;
    try {
      const res = await vaultApi.createNote({
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
        tags: noteTags.split(',').map(t => t.trim()).filter(Boolean)
      });
      if (res.success) {
        setNotes([res.data, ...notes]);
        setShowNoteModal(false);
        setNoteTitle('');
        setNoteContent('');
        setNoteTags('');
      }
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  // Create Letter
  const handleCreateLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterTitle || !letterContent) return;
    try {
      const res = await vaultApi.createLetter({
        title: letterTitle,
        content: letterContent,
        date: letterDate,
        mood: letterMood
      });
      if (res.success) {
        setLetters([res.data, ...letters]);
        setShowLetterModal(false);
        setLetterTitle('');
        setLetterContent('');
      }
    } catch (err) {
      console.error('Failed to create private letter:', err);
    }
  };

  // Create Journal
  const handleCreateJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTitle || !journalContent) return;
    try {
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
        setJournalTitle('');
        setJournalContent('');
      }
    } catch (err) {
      console.error('Failed to create journal entry:', err);
    }
  };

  // Create Surprise
  const handleCreateSurprise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surpriseTitle || !surpriseDesc) return;
    try {
      const res = await vaultApi.createSurprise({
        title: surpriseTitle,
        description: surpriseDesc,
        location: surpriseLocation,
        budget: surpriseBudget,
        status: surpriseStatus,
        notes: surpriseNotes,
        checklist: [
          { id: '1', text: 'Scout location', done: false },
          { id: '2', text: 'Organize logistics', done: false }
        ]
      });
      if (res.success) {
        setSurprises([res.data, ...surprises]);
        setShowSurpriseModal(false);
        setSurpriseTitle('');
        setSurpriseDesc('');
        setSurpriseLocation('');
        setSurpriseBudget('');
        setSurpriseNotes('');
      }
    } catch (err) {
      console.error('Failed to create surprise idea:', err);
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-serif text-2xl text-white">Private Memories</h2>
              <p className="text-xs text-[#8A6D68]">
                Photographs that are restricted to this vault. Changing privacy immediately updates public visibility.
              </p>
            </div>
          </div>

          {memories.length === 0 ? (
            <div className="py-20 text-center text-[#8A6D68] bg-[#140C0E] rounded-xl border border-[#241315]">
              <p className="font-serif text-xl">Nothing hidden here yet.</p>
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
                    <button
                      onClick={() => togglePhotoPrivacy(img)}
                      className="px-3 py-1.5 rounded bg-[#2D1619] hover:bg-[#3D1D22] text-[#E8A598] transition-colors cursor-pointer text-xs"
                    >
                      Make Public
                    </button>
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
              onClick={() => setShowLetterModal(true)}
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
              onClick={() => setShowNoteModal(true)}
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
                    <button
                      onClick={async () => {
                        await vaultApi.deleteNote(note._id);
                        setNotes(notes.filter(n => n._id !== note._id));
                      }}
                      className="text-[#7A5A55] hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
              onClick={() => setShowSurpriseModal(true)}
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
                    {surprise.budget && (
                      <span className="text-xs text-[#A89387]">Budget: {surprise.budget}</span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl text-white font-medium">{surprise.title}</h3>
                  <p className="text-xs sm:text-sm text-[#C4B2AA] mt-2 leading-relaxed">
                    {surprise.description}
                  </p>

                  {/* Checklist */}
                  {surprise.checklist && surprise.checklist.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#261416]">
                      <span className="text-[10px] font-semibold text-[#8A6D68] uppercase tracking-wider mb-2 block">
                        Action Checklist
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
              onClick={() => setShowJournalModal(true)}
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
                </div>

                <p className="font-serif text-base sm:text-lg text-[#D6C5BC] leading-relaxed whitespace-pre-line">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals for creating vault items */}
      {/* 1. Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#170E10] border border-[#3C1D22] rounded-xl p-6 max-w-md w-full">
            <h3 className="font-serif text-xl text-white mb-4">Add Private Note</h3>
            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
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
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#170E10] border border-[#3C1D22] rounded-xl p-6 max-w-lg w-full">
            <h3 className="font-serif text-xl text-white mb-4">Write Secret Letter</h3>
            <form onSubmit={handleCreateLetter} className="space-y-4 text-xs">
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
                  type="date"
                  value={letterDate}
                  onChange={(e) => setLetterDate(e.target.value)}
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
                  Save Secret Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Journal Modal */}
      {showJournalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#170E10] border border-[#3C1D22] rounded-xl p-6 max-w-lg w-full">
            <h3 className="font-serif text-xl text-white mb-4">New Private Journal Entry</h3>
            <form onSubmit={handleCreateJournal} className="space-y-4 text-xs">
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Surprise Modal */}
      {showSurpriseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#170E10] border border-[#3C1D22] rounded-xl p-6 max-w-md w-full">
            <h3 className="font-serif text-xl text-white mb-4">Plan Secret Surprise</h3>
            <form onSubmit={handleCreateSurprise} className="space-y-4 text-xs">
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
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
