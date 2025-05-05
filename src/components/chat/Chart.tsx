// components/chat/HistoricalChart.tsx
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
  } from 'chart.js'
  import { Line } from 'react-chartjs-2'
  
  ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)
  
  interface Props {
    data: {
      date: string
      close: number
    }[]
  }
  
  const HistoricalChart = ({ data }: Props) => {
    const chartData = {
      labels: data.map(d => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Closing Price',
          data: data.map(d => d.close),
          fill: false,
          borderColor: '#6366F1', // Tailwind indigo-500
          tension: 0.2,
        },
      ],
    }
  
    const options = {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          title: { display: true, text: 'Date' },
          ticks: { maxTicksLimit: 10 },
        },
        y: {
          title: { display: true, text: 'Price (USD)' },
        },
      },
    }
  
    return (
      <div className="mt-4">
        <Line data={chartData} options={options} />
      </div>
    )
  }
  
  export default HistoricalChart
  