import React from 'react';
import { PieChart, CheckCircle2, Award, Activity, ShieldCheck, TrendingUp, Sliders } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import dashboardData from '../data/dashboard_data.json';

ChartJS.register(...registerables);

export default function Group4KMeans() {
  const { metrics, k_eval, centroids, segments, cluster_profiles } = dashboardData;

  const kLabels = k_eval.map(item => `K=${item.k}`);
  const silScores = k_eval.map(item => item.silhouette);
  const wcssScores = k_eval.map(item => item.wcss);

  const kChartData = {
    labels: kLabels,
    datasets: [
      {
        type: 'line',
        label: 'Silhouette Score (Higher=Better)',
        data: silScores,
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#38BDF8',
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'WCSS / Inertia (Lower=Better)',
        data: wcssScores,
        borderColor: '#00E5FF',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 4,
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  };

  const kChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94A3B8', font: { family: 'Inter', size: 12 } } },
      tooltip: { backgroundColor: 'rgba(8, 12, 20, 0.95)', titleColor: '#FFF', bodyColor: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.3)', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(56, 189, 248, 0.05)' }, ticks: { color: '#94A3B8' } },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Silhouette Score', color: '#38BDF8' },
        grid: { color: 'rgba(56, 189, 248, 0.05)' },
        ticks: { color: '#94A3B8' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Within-Cluster Sum of Squares (WCSS)', color: '#00E5FF' },
        grid: { drawOnChartArea: false },
        ticks: { color: '#94A3B8' }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <PieChart size={24} color="#38BDF8" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>Group 4 — K-Means Segmentation & Model Evaluation</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Optimal cluster selection testing K from 2 to 8 across 1,488 building consumers. Selected <strong>Optimal K = 2</strong> clusters achieving maximum Silhouette separation (0.3823) and robust cluster compactness.
        </p>
      </div>

      {/* Model Evaluation Metric Cards */}
      <div className="grid-cols-3">
        <div className="glass-card" style={{ borderTop: '4px solid #38BDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Silhouette Score</span>
            <Award size={20} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            {metrics.silhouette_score}
          </div>
          <span className="badge badge-yellow" style={{ marginTop: '0.5rem' }}>MAXIMUM SEPARATION AT K=2</span>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #34D399' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Davies-Bouldin Index</span>
            <ShieldCheck size={20} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            {metrics.davies_bouldin}
          </div>
          <span className="badge badge-emerald" style={{ marginTop: '0.5rem' }}>COMPACT & SEPARATED</span>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #00E5FF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calinski-Harabasz Index</span>
            <TrendingUp size={20} color="#00E5FF" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            {metrics.calinski_harabasz.toLocaleString()}
          </div>
          <span className="badge badge-orange" style={{ marginTop: '0.5rem' }}>HIGH VARIANCE RATIO</span>
        </div>
      </div>

      {/* Elbow Method & Silhouette Curves */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>Elbow & Silhouette Curve Analysis (K = 2..8)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Evaluating optimal cluster count K. Peak Silhouette score of <strong>0.3823</strong> achieved at K=2.
            </p>
          </div>
          <span className="badge badge-yellow">OPTIMAL K = 2 CONFIRMED</span>
        </div>
        <div style={{ height: '300px' }}>
          <Chart type="line" data={kChartData} options={kChartOptions} />
        </div>
      </div>

      {/* Cluster Profiles Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#FFF' }}>
          Cluster Profiles & Operational Statistics
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Mean operational statistics comparing Cluster 0 (601 Facilities) and Cluster 1 (887 Facilities):
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(56, 189, 248, 0.3)', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Cluster ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Segment Profile</th>
                <th style={{ padding: '0.75rem 1rem' }}>Mean Consumption</th>
                <th style={{ padding: '0.75rem 1rem' }}>Peak Demand</th>
                <th style={{ padding: '0.75rem 1rem' }}>Peak-to-Avg Ratio</th>
                <th style={{ padding: '0.75rem 1rem' }}>Weekday / Weekend</th>
                <th style={{ padding: '0.75rem 1rem' }}>Day / Night</th>
              </tr>
            </thead>
            <tbody>
              {cluster_profiles.map((cp, idx) => {
                const seg = segments.find(s => s.id === cp.cluster);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: cp.cluster === 0 ? '#38BDF8' : '#60A5FA',
                        color: '#080C14',
                        fontWeight: 800
                      }}>
                        {cp.cluster}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#FFF' }}>
                      {seg?.name || `Segment ${cp.cluster}`}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#38BDF8', fontWeight: 700 }}>
                      {cp.mean_consumption} kWh
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#00E5FF' }}>
                      {cp.max_consumption} kWh
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#60A5FA' }}>
                      {cp.peak_to_average}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                      {cp.weekday_weekend_ratio}x ({cp.weekday_mean} / {cp.weekend_mean})
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                      {cp.day_night_ratio}x ({cp.day_mean} / {cp.night_mean})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
