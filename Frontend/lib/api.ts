// API Configuration and Utilities

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      if (typeof window !== 'undefined') {
        removeAuthToken();
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
      throw new Error(errorData.message || 'Session expired. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ==================== AUTH API ====================

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    preferences: {
      pomodoroTime: number;
      breakTime: number;
      theme: string;
    };
  };
}

export const authAPI = {
  register: (data: RegisterData) =>
    apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginData) =>
    apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: () =>
    apiCall<{ success: boolean; user: any }>('/auth/me'),
};

// ==================== EVENTS API ====================

export interface Event {
  _id?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: number;
  month: number;
  year: number;
  category: string;
  color?: string;
  location?: string;
}

export const eventsAPI = {
  getAll: (year: number, month: number) =>
    apiCall<{ success: boolean; events: Event[] }>(
      `/events?year=${year}&month=${month}`
    ),

  create: (event: Event) =>
    apiCall<{ success: boolean; event: Event }>('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    }),

  update: (id: string, event: Partial<Event>) =>
    apiCall<{ success: boolean; event: Event }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    }),

  delete: (id: string) =>
    apiCall<{ success: boolean; message: string }>(`/events/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== TODOS API ====================

export interface Todo {
  _id?: string;
  title: string;
  description?: string;
  category: 'Work' | 'Personal' | 'Study' | 'Health' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  isCompleted: boolean;
  dueDate?: Date;
  tags?: string[];
}

export const todosAPI = {
  getAll: (filters?: string) =>
    apiCall<{ success: boolean; todos: Todo[]; count: number }>(
      `/todos${filters ? `?${filters}` : ''}`
    ),

  create: (todo: Partial<Todo>) =>
    apiCall<{ success: boolean; todo: Todo }>('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    }),

  update: (id: string, todo: Partial<Todo>) =>
    apiCall<{ success: boolean; todo: Todo }>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
    }),

  toggle: (id: string) =>
    apiCall<{ success: boolean; todo: Todo }>(`/todos/${id}/toggle`, {
      method: 'PATCH',
    }),

  delete: (id: string) =>
    apiCall<{ success: boolean; message: string }>(`/todos/${id}`, {
      method: 'DELETE',
    }),

  getStats: () =>
    apiCall<{ success: boolean; stats: any }>('/todos/stats/summary'),
};

// ==================== NOTES API ====================

export interface NoteImage {
  data: string;
  contentType: string;
  filename: string;
}

export interface Note {
  _id?: string;
  title: string;
  subtitle?: string;
  content: string;
  category: 'Study' | 'Work' | 'Personal' | 'Ideas' | 'Other';
  images?: NoteImage[];
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const notesAPI = {
  getAll: (filters?: string) =>
    apiCall<{ success: boolean; notes: Note[] }>(
      `/notes${filters ? `?${filters}` : ''}`
    ),

  create: (note: Partial<Note>, images?: File[]) => {
    const formData = new FormData();
    
    // Add note data
    Object.keys(note).forEach(key => {
      const value = note[key as keyof Note];
      if (value !== undefined && key !== 'images') {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });

    // Add images if any
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }

    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },

  update: (id: string, note: Partial<Note>, images?: File[], keepExisting?: boolean) => {
    const formData = new FormData();
    
    // Add note data
    Object.keys(note).forEach(key => {
      const value = note[key as keyof Note];
      if (value !== undefined && key !== 'images') {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });

    // Add images if any
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
      if (keepExisting) {
        formData.append('keepExistingImages', 'true');
      }
    }

    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },

  delete: (id: string) =>
    apiCall<{ success: boolean; message: string }>(`/notes/${id}`, {
      method: 'DELETE',
    }),

  getImage: (noteId: string, imageIndex: number) => {
    const token = getAuthToken();
    return `${API_BASE_URL}/notes/${noteId}/images/${imageIndex}?token=${token}`;
  },
};

// ==================== POMODORO API ====================

export interface PomodoroSession {
  _id?: string;
  type: 'focus' | 'break' | 'long-break';
  duration: number;
  taskName?: string;
  notes?: string;
  completedAt?: Date;
}

export const pomodoroAPI = {
  getSessions: (filters?: string) =>
    apiCall<{ success: boolean; sessions: PomodoroSession[] }>(
      `/pomodoro${filters ? `?${filters}` : ''}`
    ),

  logSession: (session: Partial<PomodoroSession>) =>
    apiCall<{ success: boolean; session: PomodoroSession }>('/pomodoro', {
      method: 'POST',
      body: JSON.stringify(session),
    }),

  getStats: (period?: string) =>
    apiCall<{ success: boolean; stats: any }>(
      `/pomodoro/stats${period ? `?period=${period}` : ''}`
    ),
};
