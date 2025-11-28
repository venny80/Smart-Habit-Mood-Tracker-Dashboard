import React, { useEffect, useState } from 'react'
import HabitList from './HabitList'
import MoodList from './MoodList'
import Charts from './Charts'
import { fetchHabits, fetchMoods, createMood, createHabit } from '../api'

export default function Dashboard() {
  const [habits, setHabits] = useState([])
  const [moods, setMoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingHabit, setAddingHabit] = useState(false)
  const [habitForm, setHabitForm] = useState({ title: '', frequency: 'daily', target: 1, category: '' })

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [h, m] = await Promise.all([fetchHabits(), fetchMoods()])
        setHabits(h)
        setMoods(m)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function addQuickMood(moodKey) {
    const entry = {
      date: new Date().toISOString().slice(0, 10),
      mood: moodKey,
      mood_score: moodScoreFromKey(moodKey),
      note: '',
      habit_done: 0
    }
    try {
      const created = await createMood(entry)
      setMoods(prev => [created, ...prev])
    } catch (err) {
      console.error(err)
      alert('Failed to add mood')
    }
  }

  function moodScoreFromKey(key) {
    return key === 'very_happy' ? 5 : key === 'happy' ? 4 : key === 'neutral' ? 3 : key === 'sad' ? 2 : 1
  }

  async function submitHabit(e) {
    e.preventDefault()
    try {
      const created = await createHabit(habitForm)
      setHabits(prev => [created, ...prev])
      setHabitForm({ title: '', frequency: 'daily', target: 1, category: '' })
      setAddingHabit(false)
    } catch (err) {
      console.error(err)
      alert('Failed to create habit')
    }
  }

  return (
    <div style={{ display: 'flex', gap: 18 }}>
      <div style={{ flex: 1 }}>
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="section-title">Today</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ minWidth: 220 }}>
              <div className="small">How are you feeling today?</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {['very_happy', 'happy', 'neutral', 'sad', 'stressed'].map(m => (
                  <button key={m} className="btn" onClick={() => addQuickMood(m)}>
                    {emojiFor(m)} {labelFor(m)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <Charts moods={moods} habits={habits} />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 12 }}>
          <HabitList habits={habits} setHabits={setHabits} />
        </div>

        <div className="card">
          <MoodList moods={moods} setMoods={setMoods} />
        </div>
      </div>

      <aside style={{ width: 340 }}>
        <div className="card">
          <div className="section-title">Quick Add Habit</div>

          {!addingHabit ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={() => setAddingHabit(true)}>Add Habit</button>
              <button className="btn-ghost" onClick={() => {
                setHabitForm({ title: 'Morning Walk', frequency: 'daily', target: 1, category: 'health' })
                setAddingHabit(true)
              }}>Suggest</button>
            </div>
          ) : (
            <form onSubmit={submitHabit} style={{ marginTop: 8 }}>
              <input required placeholder="Habit title" value={habitForm.title} onChange={e => setHabitForm({ ...habitForm, title: e.target.value })} />
              <select value={habitForm.frequency} onChange={e => setHabitForm({ ...habitForm, frequency: e.target.value })}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
              <input type="number" min={1} value={habitForm.target} onChange={e => setHabitForm({ ...habitForm, target: parseInt(e.target.value || 1) })} />
              <input placeholder="Category (e.g., health)" value={habitForm.category} onChange={e => setHabitForm({ ...habitForm, category: e.target.value })} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" type="submit">Save</button>
                <button type="button" className="btn-ghost" onClick={() => setAddingHabit(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </aside>
    </div>
  )
}

function emojiFor(k) {
  return k === 'very_happy' ? '😄' : k === 'happy' ? '🙂' : k === 'neutral' ? '😐' : k === 'sad' ? '☹️' : '😣'
}
function labelFor(k) {
  return k === 'very_happy' ? 'Very happy' : k === 'happy' ? 'Happy' : k === 'neutral' ? 'Neutral' : k === 'sad' ? 'Sad' : 'Stressed'
}
