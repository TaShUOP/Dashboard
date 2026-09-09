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
        borderColor: '#FF80BF',
        backgroundColor: 'rgba(255, 128, 191, 0.2)',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#C2185B',
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'WCSS / Inertia (Lower=Better)',
        data: wcssScores,
        borderColor: '#9C27B0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
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
      legend: { labels: { color: '#4B5563', font: { family: 'Inter', size: 12 } } },
      tooltip: { backgroundColor: '#FFFFFF', titleColor: '#1F2937', bodyColor: '#C2185B', borderColor: 'rgba(255, 182, 193, 0.4)', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 182, 193, 0.15)' }, ticks: { color: '#4B5563' } },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Silhouette Score', color: '#C2185B' },
        grid: { color: 'rgba(255, 182, 193, 0.15)' },
        ticks: { color: '#4B5563' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Within-Cluster Sum of Squares (WCSS)', color: '#9C27B0' },
        grid: { drawOnChartArea: false },
        ticks: { color: '#4B5563' }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <PieChart size={24} color="var(--baby-pink-magenta)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2937' }}>Group 4 — K-Means Segmentation & Model Evaluation</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Optimal cluster selection testing K from 2 to 8 across 1,488 building consumers. Selected <strong>Optimal K = 2</strong> clusters achieving maximum Silhouette separation (0.3823) and robust cluster compactness.
        </p>
      </div>

      {/* Model Evaluation Metric Cards */}
      <div className="grid-cols-3">
        <div className="glass-card" style={{ borderTop: '4px solid #FF80BF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Silhouette Score</span>
            <Award size={20} color="#C2185B" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1F2937' }}>
            {metrics.silhouette_score}
          </div>
          <span className="badge badge-pink" style={{ marginTop: '0.5rem' }}>MAXIMUM SEPARATION AT K=2</span>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Davies-Bouldin Index</span>
            <ShieldCheck size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1F2937' }}>
            {metrics.davies_bouldin}
          </div>
          <span className="badge badge-emerald" style={{ marginTop: '0.5rem' }}>COMPACT & SEPARATED</span>
        </div>

        <div className="glass-card" style={{ borderTop: '4px solid #E11D48' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calinski-Harabasz Index</span>
            <TrendingUp size={20} color="#E11D48" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1F2937' }}>
            {metrics.calinski_harabasz.toLocaleString()}
          </div>
          <span className="badge badge-rose" style={{ marginTop: '0.5rem' }}>HIGH VARIANCE RATIO</span>
        </div>
      </div>

      {/* Elbow Method & Silhouette Curves */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>Elbow & Silhouette Curve Analysis (K = 2..8)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Evaluating optimal cluster count K. Peak Silhouette score of <strong>0.3823</strong> achieved at K=2.
            </p>
          </div>
          <span className="badge badge-pink">OPTIMAL K = 2 CONFIRMED</span>
        </div>
        <div style={{ height: '300px' }}>
          <Chart type="line" data={kChartData} options={kChartOptions} />
        </div>
      </div>

      {/* Cluster Profiles Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1F2937' }}>
          Cluster Profiles & Operational Statistics
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Mean operational statistics comparing Cluster 0 (601 Facilities) and Cluster 1 (887 Facilities):
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255, 182, 193, 0.5)', background: 'var(--baby-pink-light)', color: 'var(--baby-pink-magenta)', textAlign: 'left' }}>
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
                  <tr key={idx} style={{ borderBottom: '1px solid #FFF0F4' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: seg?.color || '#FF80BF',
                        color: '#FFFFFF',
                        fontWeight: 800
                      }}>
                        {cp.cluster}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#1F2937' }}>
                      {seg?.name || `Segment ${cp.cluster}`}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--baby-pink-magenta)', fontWeight: 700 }}>
                      {cp.mean_consumption} kWh
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#E11D48' }}>
                      {cp.max_consumption} kWh
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#D97706' }}>
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
