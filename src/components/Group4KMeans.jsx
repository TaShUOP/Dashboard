import React from 'react';
import { PieChart, CheckCircle2, Award, Activity, ShieldCheck, TrendingUp, Sliders } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import dashboardData from '../data/dashboard_data.json';

ChartJS.register(...registerables);

export default function Group4KMeans() {
  const { metrics, k_eval, centroids, segments } = dashboardData;

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
        borderColor: '#FBBF24',
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#FBBF24',
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
      legend: { labels: { color: '#9CA3AF', font: { family: 'Inter', size: 12 } } },
      tooltip: { backgroundColor: 'rgba(11, 15, 23, 0.95)', titleColor: '#FFF' }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9CA3AF' } },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Silhouette Score', color: '#FBBF24' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9CA3AF' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Within-Cluster Sum of Squares (WCSS)', color: '#00E5FF' },
        grid: { drawOnChartArea: false },
        ticks: { color: '#9CA3AF' }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <PieChart size={24} color="var(--siemens-bright)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Group 4 — K-Means Segmentation & Model Evaluation</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Optimal cluster selection testing K from 2 to 10. Selected <strong>Optimal K = 5</strong> clusters achieving maximum Silhouette separation and robust Davies-Bouldin compactness.
        </p>
      </div>

      {/* Model Evaluation Metric Cards */}
      <div className="grid-cols-3">
        <div className="glass-card" style={{ borderTop: '4px solid #FBBF24' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Silhouette Score</span>
            <Award size={20} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            {metrics.silhouette_score}
          </div>
          <span className="badge badge-amber" style={{ marginTop: '0.5rem' }}>PEAK SCORE AT K=5</span>
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

        <div className="glass-card" style={{ borderTop: '4px solid #F87171' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calinski-Harabasz Index</span>
            <TrendingUp size={20} color="#F87171" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            {metrics.calinski_harabasz.toLocaleString()}
          </div>
          <span className="badge badge-rose" style={{ marginTop: '0.5rem' }}>HIGH VARIANCE RATIO</span>
        </div>
      </div>

      {/* Elbow Method & Silhouette Curves */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Elbow & Silhouette Curve Analysis (K = 2..10)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Evaluating optimal cluster count K. Peak Silhouette score of <strong>0.3481</strong> achieved at K=5.
            </p>
          </div>
          <span className="badge badge-teal">OPTIMAL K = 5 CONFIRMED</span>
        </div>
        <div style={{ height: '300px' }}>
          <Chart type="line" data={kChartData} options={kChartOptions} />
        </div>
      </div>

      {/* Cluster Centroids Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Cluster Centroids in PCA Feature Space
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Mean coordinates in 3D principal component space defining each consumer segment profile:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Cluster ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Segment Profile Label</th>
                <th style={{ padding: '0.75rem 1rem' }}>Consumer Count</th>
                <th style={{ padding: '0.75rem 1rem' }}>PC1 (Magnitude)</th>
                <th style={{ padding: '0.75rem 1rem' }}>PC2 (Weekly)</th>
                <th style={{ padding: '0.75rem 1rem' }}>PC3 (Diurnal)</th>
              </tr>
            </thead>
            <tbody>
              {centroids.map((c, idx) => {
                const seg = segments.find(s => s.id === c.cluster);
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
                        background: seg?.color || '#00E5FF',
                        color: '#0B0F17',
                        fontWeight: 800
                      }}>
                        {c.cluster}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#FFF' }}>
                      {seg?.name || `Segment ${c.cluster}`}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                      <strong>{c.count.toLocaleString()}</strong> ({c.pct}%)
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: c.PC1 > 0 ? '#34D399' : '#F87171' }}>
                      {c.PC1 > 0 ? `+${c.PC1.toFixed(4)}` : c.PC1.toFixed(4)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: c.PC2 > 0 ? '#34D399' : '#F87171' }}>
                      {c.PC2 > 0 ? `+${c.PC2.toFixed(4)}` : c.PC2.toFixed(4)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: c.PC3 > 0 ? '#34D399' : '#F87171' }}>
                      {c.PC3 > 0 ? `+${c.PC3.toFixed(4)}` : c.PC3.toFixed(4)}
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
