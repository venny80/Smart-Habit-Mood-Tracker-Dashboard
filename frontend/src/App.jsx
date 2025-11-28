import React from 'react'
import Dashboard from './components/Dashboard'


export default function App() {
return (
<div className="container">
<header>
<h1>Habit & Mood Tracker</h1>
<p className="subtitle">A small, human-friendly tracker to build better days.</p>
</header>
<main>
<Dashboard />
</main>
</div>
)
}