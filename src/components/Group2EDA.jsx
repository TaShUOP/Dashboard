import React from 'react';
import { Layers, Activity, Sliders, TrendingUp, Compass, BarChart } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import dashboardData from '../data/dashboard_data.json';

ChartJS.register(...registerables);

export default function Group2EDA() {
  const { consumer_type_counts } = dashboardData;

  const typeLabels = Object.keys(consumer_type_counts).map(t => t.toUpperCase());
  const typeValues = Object.values(consumer_type_counts);

  const typeChartData = {
    labels: typeLabels,
    datasets: [
      {
        label: 'Number of Building Facilities',
        data: typeValues,
        backgroundColor: [
          '#38BDF8', '#0EA5E9', '#0284C7', '#00E5FF', '#2563EB', 
          '#7DD3FC', '#0369A1', '#A78BFA', '#34D399', '#60A5FA'
        ],
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(8, 12, 20, 0.95)',
        titleColor: '#FFF',
        bodyColor: '#38BDF8',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(56, 189, 248, 0.05)' },
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(56, 189, 248, 0.05)' },
        ticks: { color: '#94A3B8' }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Layers size={24} color="#38BDF8" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>Group 2 — EDA, Feature Engineering & Preprocessing</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Formulation of 16 statistical & behavioral features across 1,488 building consumers incorporating consumption volume, peak-to-average load ratios, weekday/weekend shifts, day/night ratios, and cyclical peak hour transformations.
        </p>
      </div>

      {/* Building Type Breakdown Bar Chart */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', color: '#FFF' }}>
          Consumer Building Sector Distribution (1,488 Total Facilities)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Facility breakdown across Education (573), Office (287), Public Assembly (187), Public Services (158), Lodging (148), Healthcare (25), Parking (22), and Industrial sectors.
        </p>
        <div style={{ height: '300px' }}>
          <Bar data={typeChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
