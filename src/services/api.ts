import {
  GalleryImage,
  TimelineEvent,
  PersonalCardItem,
  LoveLetterItem,
  FutureGoalItem,
  PrivateNoteItem,
  PrivateJournalItem,
  SurpriseIdeaItem,
  SiteSettings,
  AdminUser
} from '../types/index.ts';

const TOKEN_KEY = 'chukku_hyphae_admin_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Request helper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
  }

  return data;
}

// PUBLIC API CALLS
export const publicApi = {
  getGallery: (category?: string) =>
    request<{ success: boolean; data: GalleryImage[] }>(
      category && category !== 'All' ? `/api/gallery?category=${encodeURIComponent(category)}` : '/api/gallery'
    ),

  getTimeline: () =>
    request<{ success: boolean; data: TimelineEvent[] }>('/api/timeline'),

  getCards: (owner: 'chukku' | 'hyphae') =>
    request<{ success: boolean; data: PersonalCardItem[] }>(`/api/cards/${owner}`),

  getLoveLetter: () =>
    request<{ success: boolean; data: LoveLetterItem | null }>('/api/love-letter'),

  getFuture: () =>
    request<{ success: boolean; data: FutureGoalItem[] }>('/api/future'),

  getSettings: () =>
    request<{ success: boolean; data: SiteSettings }>('/api/settings'),

  getFinalReveal: () =>
    request<{ success: boolean; data: { title: string; message: string; image: string } }>('/api/final-reveal')
};

// AUTH API CALLS
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    request<{ success: boolean; token: string; admin: AdminUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  verify: () =>
    request<{ success: boolean; admin: AdminUser }>('/api/auth/verify'),

  logout: () =>
    request<{ success: boolean; message: string }>('/api/auth/logout', {
      method: 'POST'
    }),

  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    request<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords)
    })
};

// ADMIN CMS API CALLS
export const adminApi = {
  getDashboard: () =>
    request<{ success: boolean; data: any }>('/api/admin/dashboard'),

  // Gallery
  getGallery: () =>
    request<{ success: boolean; data: GalleryImage[] }>('/api/admin/gallery'),
  createGalleryImage: (item: Partial<GalleryImage>) =>
    request<{ success: boolean; data: GalleryImage }>('/api/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(item)
    }),
  updateGalleryImage: (id: string, item: Partial<GalleryImage>) =>
    request<{ success: boolean; data: GalleryImage }>(`/api/admin/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    }),
  deleteGalleryImage: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/gallery/${id}`, {
      method: 'DELETE'
    }),

  // Timeline
  getTimeline: () =>
    request<{ success: boolean; data: TimelineEvent[] }>('/api/admin/timeline'),
  createTimelineEvent: (item: Partial<TimelineEvent>) =>
    request<{ success: boolean; data: TimelineEvent }>('/api/admin/timeline', {
      method: 'POST',
      body: JSON.stringify(item)
    }),
  updateTimelineEvent: (id: string, item: Partial<TimelineEvent>) =>
    request<{ success: boolean; data: TimelineEvent }>(`/api/admin/timeline/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    }),
  deleteTimelineEvent: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/timeline/${id}`, {
      method: 'DELETE'
    }),

  // Cards
  getCards: () =>
    request<{ success: boolean; data: PersonalCardItem[] }>('/api/admin/cards'),
  createCard: (item: Partial<PersonalCardItem>) =>
    request<{ success: boolean; data: PersonalCardItem }>('/api/admin/cards', {
      method: 'POST',
      body: JSON.stringify(item)
    }),
  updateCard: (id: string, item: Partial<PersonalCardItem>) =>
    request<{ success: boolean; data: PersonalCardItem }>(`/api/admin/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    }),
  deleteCard: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/cards/${id}`, {
      method: 'DELETE'
    }),

  // Love Letters
  getLoveLetters: () =>
    request<{ success: boolean; data: LoveLetterItem[] }>('/api/admin/love-letter'),
  createLoveLetter: (item: Partial<LoveLetterItem>) =>
    request<{ success: boolean; data: LoveLetterItem }>('/api/admin/love-letter', {
      method: 'POST',
      body: JSON.stringify(item)
    }),
  updateLoveLetter: (id: string, item: Partial<LoveLetterItem>) =>
    request<{ success: boolean; data: LoveLetterItem }>(`/api/admin/love-letter/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    }),
  deleteLoveLetter: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/love-letter/${id}`, {
      method: 'DELETE'
    }),

  // Future Goals
  getFuture: () =>
    request<{ success: boolean; data: FutureGoalItem[] }>('/api/admin/future'),
  createFutureGoal: (item: Partial<FutureGoalItem>) =>
    request<{ success: boolean; data: FutureGoalItem }>('/api/admin/future', {
      method: 'POST',
      body: JSON.stringify(item)
    }),
  updateFutureGoal: (id: string, item: Partial<FutureGoalItem>) =>
    request<{ success: boolean; data: FutureGoalItem }>(`/api/admin/future/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    }),
  deleteFutureGoal: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/future/${id}`, {
      method: 'DELETE'
    }),

  // Settings
  getSettings: () =>
    request<{ success: boolean; data: SiteSettings }>('/api/admin/settings'),
  updateSettings: (settings: Partial<SiteSettings>) =>
    request<{ success: boolean; data: SiteSettings }>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),

  // Upload Photo
  uploadPhoto: async (file: File): Promise<{ success: boolean; imageUrl: string }> => {
    const formData = new FormData();
    formData.append('photo', file);
    return request<{ success: boolean; imageUrl: string }>('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
  }
};

// PRIVATE VAULT API CALLS
export const vaultApi = {
  getMemories: () =>
    request<{ success: boolean; data: GalleryImage[] }>('/api/admin/private/memories'),

  updateMemoryPrivacy: (id: string, data: { isPrivate?: boolean; isPublished?: boolean; privateNote?: string }) =>
    request<{ success: boolean; data: GalleryImage; message: string }>(`/api/admin/private/memories/${id}/privacy`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  getLetters: () =>
    request<{ success: boolean; data: LoveLetterItem[] }>('/api/admin/private/letters'),

  createLetter: (letter: Partial<LoveLetterItem>) =>
    request<{ success: boolean; data: LoveLetterItem }>('/api/admin/private/letters', {
      method: 'POST',
      body: JSON.stringify(letter)
    }),

  getNotes: () =>
    request<{ success: boolean; data: PrivateNoteItem[] }>('/api/admin/private/notes'),

  createNote: (note: Partial<PrivateNoteItem>) =>
    request<{ success: boolean; data: PrivateNoteItem }>('/api/admin/private/notes', {
      method: 'POST',
      body: JSON.stringify(note)
    }),

  updateNote: (id: string, note: Partial<PrivateNoteItem>) =>
    request<{ success: boolean; data: PrivateNoteItem }>(`/api/admin/private/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note)
    }),

  deleteNote: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/private/notes/${id}`, {
      method: 'DELETE'
    }),

  getJournals: () =>
    request<{ success: boolean; data: PrivateJournalItem[] }>('/api/admin/private/journal'),

  createJournal: (journal: Partial<PrivateJournalItem>) =>
    request<{ success: boolean; data: PrivateJournalItem }>('/api/admin/private/journal', {
      method: 'POST',
      body: JSON.stringify(journal)
    }),

  updateJournal: (id: string, journal: Partial<PrivateJournalItem>) =>
    request<{ success: boolean; data: PrivateJournalItem }>(`/api/admin/private/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(journal)
    }),

  deleteJournal: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/private/journal/${id}`, {
      method: 'DELETE'
    }),

  getSurprises: () =>
    request<{ success: boolean; data: SurpriseIdeaItem[] }>('/api/admin/private/surprises'),

  createSurprise: (surprise: Partial<SurpriseIdeaItem>) =>
    request<{ success: boolean; data: SurpriseIdeaItem }>('/api/admin/private/surprises', {
      method: 'POST',
      body: JSON.stringify(surprise)
    }),

  updateSurprise: (id: string, surprise: Partial<SurpriseIdeaItem>) =>
    request<{ success: boolean; data: SurpriseIdeaItem }>(`/api/admin/private/surprises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(surprise)
    }),

  deleteSurprise: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/private/surprises/${id}`, {
      method: 'DELETE'
    })
};
