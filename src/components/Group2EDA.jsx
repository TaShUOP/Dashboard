import React from 'react';
import { Layers, Activity, Sliders, TrendingUp, Compass, BarChart } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import dashboardData from '../data/dashboard_data.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale);

export default function Group2EDA() {
  const { pca_loadings } = dashboardData;

  // Correlation values for key features with target total_consumption
  const featureCorrelations = [
    { name: 'total_consumption_lag_1', corr: 0.94, desc: 'Highest autocorrelation — immediate 1-hour inertia' },
    { name: 'total_consumption_lag_24', corr: 0.81, desc: 'Strong diurnal 24-hour daily cycle repeat' },
    { name: 'total_consumption_lag_168', corr: 0.88, desc: 'High weekly 7-day operational cycle repeat' },
    { name: 'rolling_mean_24', corr: 0.85, desc: 'Smoothed daily average baseline indicator' },
    { name: 'rolling_mean_7d', corr: 0.72, desc: 'Weekly macro trend indicator' },
    { name: 'vs_hourly_baseline', corr: 0.64, desc: 'Hourly anomaly peak indicator' },
    { name: 'is_weekend', corr: -0.42, desc: 'Negative correlation — significant drop on weekends' },
    { name: 'hour_sin', corr: -0.31, desc: 'Diurnal cyclical phase component' },
  ];

  // Cyclical Sine/Cosine curve simulation for hour of day
  const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const sinValues = hourLabels.map((_, h) => Math.sin((2 * Math.PI * h) / 24));
  const cosValues = hourLabels.map((_, h) => Math.cos((2 * Math.PI * h) / 24));

  const cyclicChartData = {
    labels: hourLabels,
    datasets: [
      {
        label: 'Hour Sin Transformation',
        data: sinValues,
        borderColor: '#00E5FF',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Hour Cos Transformation',
        data: cosValues,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9CA3AF', font: { family: 'Inter', size: 12 } }
      },
      tooltip: {
        backgroundColor: 'rgba(11, 15, 23, 0.95)',
        titleColor: '#FFF',
        bodyColor: '#00E5FF',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9CA3AF' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9CA3AF' }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Layers size={24} color="var(--siemens-bright)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Group 2 — EDA, Feature Engineering & Preprocessing</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Formulation of 20 high-dimensional features incorporating historical consumption lags, moving average windows, baseline offsets, and cyclical trigonometric transformations.
        </p>
      </div>

      {/* Feature Engineering Highlights Grid */}
      <div className="grid-cols-3">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Activity size={20} color="#00E5FF" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Temporal Lags & Inertia</h4>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Captured short-term inertia (`lag_1`), daily cycle repetition (`lag_24`), and weekly operational routines (`lag_168`).
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <TrendingUp size={20} color="#34D399" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Rolling Windows</h4>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Smooth out erratic meter noise using 24-hour daily moving average (`rolling_mean_24`) and 7-day macro baseline window (`rolling_mean_7d`).
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Compass size={20} color="#A78BFA" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Cyclical Time Encoding</h4>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Mapped discrete hours (0..23) and days (0..6) onto unit circles using sine/cosine trigonometry to preserve continuous periodic distance.
          </p>
        </div>
      </div>

      {/* Feature Correlation & Cyclical Curves */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Correlation Ranking */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Feature Correlation with Target Consumption
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {featureCorrelations.map((fc, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--siemens-bright)' }}>{fc.name}</span>
                  <span style={{ fontWeight: 700, color: fc.corr > 0 ? '#34D399' : '#F87171' }}>
                    r = {fc.corr > 0 ? `+${fc.corr}` : fc.corr}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.abs(fc.corr) * 100}%`,
                    height: '100%',
                    background: fc.corr > 0 ? 'var(--siemens-teal)' : '#EF4444',
                    borderRadius: '3px'
                  }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{fc.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trigonometric Cyclical Feature Encoding Plot */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Cyclical Trigonometric Time Transformation
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Transforming 23:00 to 00:00 continuous periodicity: <code>hour_sin = sin(2π × hour / 24)</code>
          </p>
          <div style={{ flex: 1, minHeight: '260px' }}>
            <Line data={cyclicChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
