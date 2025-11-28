// API wrapper supporting mock and real API mode.
// Use import.meta.env.VITE_MODE and VITE_API_URL to configure.

export const MODE = import.meta.env.VITE_MODE || 'api';
export const API_URL = import.meta.env.VITE_API_URL || 'https://smart-habit-mood-tracker-dashboard-mjmw.onrender.com/api';

// --- Mock data (frontend-only demo)
const mockHabits = [
  { id: 1, title: 'Morning Walk', frequency: 'daily', target: 1, streak: 3, category: 'health', created_at: new Date().toISOString() },
  { id: 2, title: 'Read 20 pages', frequency: 'daily', target: 1, streak: 7, category: 'learning', created_at: new Date().toISOString() }
];

const mockMoods = [
  { id: 1, date: '2025-11-25', mood: 'happy', mood_score: 4, note: 'Good day', habit_done: 1, created_at: new Date().toISOString() },
  { id: 2, date: '2025-11-24', mood: 'neutral', mood_score: 3, note: 'Okay', habit_done: 0, created_at: new Date().toISOString() }
];

// Helper to simulate delay in mock mode
const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

// --- Habits
export async function fetchHabits() {
  if (MODE === 'mock') {
    await delay();
    return [...mockHabits].sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));
  }
  const res = await fetch(`${API_URL}/habits`);
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
}

export async function createHabit(habit) {
  if (MODE === 'mock') {
    await delay();
    const newH = { ...habit, id: Math.floor(Math.random()*100000), streak: 0, created_at: new Date().toISOString() };
    mockHabits.unshift(newH);
    return newH;
  }
  const res = await fetch(`${API_URL}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit)
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
}

export async function updateHabit(id, habit) {
  if (MODE === 'mock') {
    await delay();
    const idx = mockHabits.findIndex(h => h.id === id);
    if (idx !== -1) mockHabits[idx] = { ...mockHabits[idx], ...habit };
    return mockHabits[idx];
  }
  const res = await fetch(`${API_URL}/habits/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit)
  });
  if (!res.ok) throw new Error('Failed to update habit');
  return res.json();
}

export async function deleteHabit(id) {
  if (MODE === 'mock') {
    await delay();
    const idx = mockHabits.findIndex(h => h.id === id);
    if (idx !== -1) mockHabits.splice(idx, 1);
    return { deleted: 1 };
  }
  const res = await fetch(`${API_URL}/habits/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete habit');
  return res.json();
}

export async function incrementStreak(id) {
  if (MODE === 'mock') {
    await delay();
    const idx = mockHabits.findIndex(h => h.id === id);
    if (idx !== -1) mockHabits[idx].streak = (mockHabits[idx].streak || 0) + 1;
    return mockHabits[idx];
  }
  const res = await fetch(`${API_URL}/habits/${id}/increment`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to increment streak');
  return res.json();
}

// --- Moods
export async function fetchMoods(from, to) {
  if (MODE === 'mock') {
    await delay();
    return [...mockMoods].sort((a,b)=> new Date(b.date) - new Date(a.date));
  }
  const url = new URL(`${API_URL}/moods`);
  if (from) url.searchParams.set('from', from);
  if (to) url.searchParams.set('to', to);
  const res = await fetch(url.href);
  if (!res.ok) throw new Error('Failed to fetch moods');
  return res.json();
}

export async function createMood(mood) {
  if (MODE === 'mock') {
    await delay();
    const newM = { ...mood, id: Math.floor(Math.random()*100000), created_at: new Date().toISOString() };
    mockMoods.unshift(newM);
    return newM;
  }
  const res = await fetch(`${API_URL}/moods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mood)
  });
  if (!res.ok) throw new Error('Failed to create mood');
  return res.json();
}

export async function updateMood(id, mood) {
  if (MODE === 'mock') {
    await delay();
    const idx = mockMoods.findIndex(m => m.id === id);
    if (idx !== -1) mockMoods[idx] = { ...mockMoods[idx], ...mood };
    return mockMoods[idx];
  }
  const res = await fetch(`${API_URL}/moods/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mood)
  });
  if (!res.ok) throw new Error('Failed to update mood');
  return res.json();
}

export async function deleteMood(id) {
  if (MODE === 'mock') {
    await delay();
    const idx = mockMoods.findIndex(m => m.id === id);
    if (idx !== -1) mockMoods.splice(idx, 1);
    return { deleted: 1 };
  }
  const res = await fetch(`${API_URL}/moods/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete mood');
  return res.json();
}
