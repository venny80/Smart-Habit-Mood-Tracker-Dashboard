import React from 'react'
import { incrementStreak, deleteHabit } from '../api'

export default function HabitList({ habits = [], setHabits = () => {} }) {
  async function handleIncrement(id) {
    try {
      const updated = await incrementStreak(id)
      setHabits(prev => prev.map(h => (h.id === id ? updated : h)))
    } catch (err) {
      console.error(err)
      alert('Failed to increment streak')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this habit?')) return
    try {
      await deleteHabit(id)
      setHabits(prev => prev.filter(h => h.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete')
    }
  }

  return (
    <div>
      <div className="section-title">Habits</div>
      <div>
        {habits.length === 0 && <div className="small">No habits yet — add one on the right.</div>}
        {habits.map(h => (
          <div className="list-item" key={h.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{h.title}</strong>
                <div className="small">{h.frequency} • {h.category}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className="small">Streak: {h.streak || 0}</div>
                <button className="btn-ghost" onClick={() => handleIncrement(h.id)}>+1</button>
                <button className="btn-ghost" onClick={() => handleDelete(h.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
