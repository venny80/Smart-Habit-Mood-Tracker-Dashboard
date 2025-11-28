import React from 'react'
import { deleteMood } from '../api'

export default function MoodList({ moods = [], setMoods = () => {} }) {
  async function handleDelete(id) {
    if (!confirm('Delete this mood entry?')) return
    try {
      await deleteMood(id)
      setMoods(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete mood entry')
    }
  }

  return (
    <div>
      <div className="section-title">Mood Log</div>
      {moods.length === 0 && <div className="small">No mood entries yet.</div>}
      {moods.map(m => (
        <div className="list-item" key={m.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{m.date}</strong>
              <div className="small">{moodLabel(m.mood)} • {m.note}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <div className="small">Score: {m.mood_score || '-'}</div>
              <button className="btn-ghost" onClick={() => handleDelete(m.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function moodLabel(k) {
  if (!k) return ''
  return k === 'very_happy' ? 'Very happy' : k === 'happy' ? 'Happy' : k === 'neutral' ? 'Neutral' : k === 'sad' ? 'Sad' : 'Stressed'
}
