import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Activity, RotateCw, ZoomIn, ZoomOut, Filter, Info, ChevronRight } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart, Line, Bar } from 'react-chartjs-2';
import dashboardData from '../data/dashboard_data.json';

ChartJS.register(...registerables);

export default function Group3PCA() {
  const { metrics, pca_loadings, sample_points, segments } = dashboardData;

  const [selectedClusterFilter, setSelectedClusterFilter] = useState('ALL');
  const [angleX, setAngleX] = useState(0.4);
  const [angleY, setAngleY] = useState(0.6);
  const [zoom, setZoom] = useState(1.0);

  const canvasRef = useRef(null);

  // Explained variance ratios for 4 Principal Components
  const explainedVariance = [41.25, 18.60, 12.40, 8.15];
  const cumulativeVariance = [41.25, 59.85, 72.25, 80.40];

  // Canvas 3D Scatter Plot Renderer (White Theme Compatible)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Light Background
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, height);

    // Filter points based on cluster selection
    const filteredPoints = selectedClusterFilter === 'ALL' 
      ? sample_points 
      : sample_points.filter(p => p.cluster === parseInt(selectedClusterFilter));

    // Projection calculation
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30 * zoom;

    // Draw coordinate axes
    const axes = [
      { name: 'PC1 (Magnitude)', x: 4, y: 0, z: 0, color: '#FF007F' },
      { name: 'PC2 (Ratios)', x: 0, y: 4, z: 0, color: '#9333EA' },
      { name: 'PC3 (Peak Hour)', x: 0, y: 0, z: 4, color: '#059669' }
    ];

    axes.forEach(axis => {
      const y1 = axis.y * cosX - axis.z * sinX;
      const z1 = axis.y * sinX + axis.z * cosX;
      const x2 = axis.x * cosY + z1 * sinY;
      const z2 = -axis.x * sinY + z1 * cosY;

      const px = centerX + x2 * scale;
      const py = centerY - y1 * scale;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(px, py);
      ctx.strokeStyle = axis.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = axis.color;
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText(axis.name, px + 5, py + 5);
    });

    // Draw Sample Points (1,488 points)
    const clusterColors = {
      0: '#3B82F6',
      1: '#FF007F'
    };

    filteredPoints.forEach(pt => {
      const y1 = pt.PC2 * cosX - pt.PC3 * sinX;
      const z1 = pt.PC2 * sinX + pt.PC3 * cosX;
      const x2 = pt.PC1 * cosY + z1 * sinY;
      const z2 = -pt.PC1 * sinY + z1 * cosY;

      const px = centerX + x2 * scale;
      const py = centerY - y1 * scale;

      ctx.beginPath();
      ctx.arc(px, py, 2.8 * zoom, 0, 2 * Math.PI);
      ctx.fillStyle = clusterColors[pt.cluster] || '#FF007F';
      ctx.globalAlpha = 0.8;
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;

  }, [angleX, angleY, zoom, selectedClusterFilter, sample_points]);

  // Scree plot data
  const screeChartData = {
    labels: ['PC1', 'PC2', 'PC3', 'PC4'],
    datasets: [
      {
        type: 'bar',
        label: 'Individual Variance (%)',
        data: explainedVariance,
        backgroundColor: 'rgba(255, 0, 127, 0.6)',
        borderColor: '#FF007F',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Cumulative Variance (%)',
        data: cumulativeVariance,
        borderColor: '#9333EA',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  };

  const screeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#475569', font: { family: 'Inter', size: 11 } } },
      tooltip: { backgroundColor: '#FFFFFF', titleColor: '#0F172A', bodyColor: '#FF007F', borderColor: 'rgba(255, 0, 127, 0.2)', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 0, 127, 0.05)' }, ticks: { color: '#475569' } },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Variance Ratio (%)', color: '#FF007F' },
        grid: { color: 'rgba(255, 0, 127, 0.05)' },
        ticks: { color: '#475569' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Cumulative (%)', color: '#9333EA' },
        grid: { drawOnChartArea: false },
        ticks: { color: '#475569' }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Cpu size={24} color="var(--fuchsia-pink)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>Group 3 — Principal Component Analysis (PCA) Studio</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Dimensionality reduction transforming 16 consumption features into 4 Principal Components capturing <strong>80.40%</strong> of total dataset variance across 1,488 building consumers.
        </p>
      </div>

      {/* 3D PCA Scatter Plot & Scree Plot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* Interactive 3D PCA Visualizer */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Interactive 3D PCA Scatter Map (1,488 Consumers)</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>PC1 (41.3%) vs PC2 (18.6%) vs PC3 (12.4%)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                value={selectedClusterFilter}
                onChange={e => setSelectedClusterFilter(e.target.value)}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.35rem 0.65rem',
                  color: '#0F172A',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              >
                <option value="ALL">Filter: All Clusters</option>
                {segments.map(s => (
                  <option key={s.id} value={s.id}>Cluster {s.id}: {s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Controls */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <RotateCw size={14} /> X-Pitch:
              <input type="range" min="-1.5" max="1.5" step="0.05" value={angleX} onChange={e => setAngleX(parseFloat(e.target.value))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <RotateCw size={14} /> Y-Yaw:
              <input type="range" min="-1.5" max="1.5" step="0.05" value={angleY} onChange={e => setAngleY(parseFloat(e.target.value))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ZoomIn size={14} /> Zoom:
              <button className="btn-secondary" style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }} onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}>+</button>
              <button className="btn-secondary" style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }} onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>-</button>
            </div>
          </div>

          {/* Canvas Box */}
          <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <canvas ref={canvasRef} width={600} height={320} style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>
        </div>

        {/* Scree Plot */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
            Scree Plot & Cumulative Variance
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Top 4 components capture <strong>80.40%</strong> total information.
          </p>
          <div style={{ flex: 1, minHeight: '280px' }}>
            <Chart type="bar" data={screeChartData} options={screeOptions} />
          </div>
        </div>
      </div>

      {/* PCA Loading Matrix & Factor Drivers */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0F172A' }}>
          PCA Loading Matrix & Principal Component Drivers
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Eigenvector loadings for 16 features across 4 Principal Components:
        </p>

        {/* Loading Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255, 0, 127, 0.2)', background: 'var(--fuchsia-light)', color: 'var(--fuchsia-deep)', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem 1rem' }}>Feature Variable</th>
                <th style={{ padding: '0.65rem 1rem' }}>PC1 Loading (41.3%)</th>
                <th style={{ padding: '0.65rem 1rem' }}>PC2 Loading (18.6%)</th>
                <th style={{ padding: '0.65rem 1rem' }}>PC3 Loading (12.4%)</th>
                <th style={{ padding: '0.65rem 1rem' }}>PC4 Loading (8.2%)</th>
              </tr>
            </thead>
            <tbody>
              {pca_loadings.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.65rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#0F172A' }}>
                    {row.feature}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', color: Math.abs(row.PC1) > 0.3 ? 'var(--fuchsia-pink)' : 'var(--text-secondary)', fontWeight: Math.abs(row.PC1) > 0.3 ? 700 : 400 }}>
                    {row.PC1 > 0 ? `+${row.PC1.toFixed(4)}` : row.PC1.toFixed(4)}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', color: Math.abs(row.PC2) > 0.3 ? '#9333EA' : 'var(--text-secondary)', fontWeight: Math.abs(row.PC2) > 0.3 ? 700 : 400 }}>
                    {row.PC2 > 0 ? `+${row.PC2.toFixed(4)}` : row.PC2.toFixed(4)}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', color: Math.abs(row.PC3) > 0.3 ? '#059669' : 'var(--text-secondary)', fontWeight: Math.abs(row.PC3) > 0.3 ? 700 : 400 }}>
                    {row.PC3 > 0 ? `+${row.PC3.toFixed(4)}` : row.PC3.toFixed(4)}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', color: Math.abs(row.PC4) > 0.3 ? '#D97706' : 'var(--text-secondary)', fontWeight: Math.abs(row.PC4) > 0.3 ? 700 : 400 }}>
                    {row.PC4 > 0 ? `+${row.PC4.toFixed(4)}` : row.PC4.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
