import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip } from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip)

export default function Charts({ moods = [], habits = [] }) {
  // Prepare labels (last 14 entries or by date)
  const sliced = moods.slice(0, 14).reverse()
  const labels = sliced.map(m => m.date)
  const dataPoints = sliced.map(m => m.mood_score ?? 3)

  const data = {
    labels,
    datasets: [
      {
        label: 'Mood (recent)',
        data: dataPoints,
        tension: 0.3,
        fill: false,
        pointRadius: 4
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      title: { display: false, text: 'Mood trend' },
      tooltip: { enabled: true }
    },
    scales: {
      y: { min: 1, max: 5, ticks: { stepSize: 1 } }
    }
  }

  return (
    <div style={{ maxHeight: 200 }}>
      <Line data={data} options={options} />
    </div>
  )
}
