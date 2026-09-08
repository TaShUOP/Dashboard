import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Activity, RotateCw, ZoomIn, ZoomOut, Filter, Info, ChevronRight } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import dashboardData from '../data/dashboard_data.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Group3PCA() {
  const { metrics, k_eval, pca_loadings, sample_points, segments } = dashboardData;

  const [selectedClusterFilter, setSelectedClusterFilter] = useState('ALL');
  const [angleX, setAngleX] = useState(0.4);
  const [angleY, setAngleY] = useState(0.6);
  const [zoom, setZoom] = useState(1.0);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const canvasRef = useRef(null);

  // Explained variance ratios from Group 3 notebook
  const explainedVariance = [31.77, 14.80, 12.82, 10.66, 8.84, 7.47, 3.66, 3.01, 1.79, 1.33, 0.94, 0.78, 0.75, 0.54, 0.40, 0.27, 0.15, 0.02, 0.0, 0.0];
  const cumulativeVariance = [31.77, 46.57, 59.39, 70.05, 78.89, 86.36, 90.02, 93.03, 94.82, 96.15, 97.09, 97.87, 98.62, 99.16, 99.56, 99.83, 99.98, 100.0, 100.0, 100.0];

  // Canvas 3D Scatter Plot Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.fillStyle = '#0E1420';
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
    const scale = 35 * zoom;

    // Draw coordinate axes
    const axes = [
      { name: 'PC1 (Magnitude)', x: 4, y: 0, z: 0, color: '#00E5FF' },
      { name: 'PC2 (Weekly)', x: 0, y: 4, z: 0, color: '#8B5CF6' },
      { name: 'PC3 (Diurnal)', x: 0, y: 0, z: 4, color: '#10B981' }
    ];

    axes.forEach(axis => {
      // Rotate axis vector
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
      ctx.font = '11px Outfit, sans-serif';
      ctx.fillText(axis.name, px + 5, py + 5);
    });

    // Draw Sample Points
    const clusterColors = {
      0: '#3B82F6',
      1: '#EF4444',
      2: '#10B981',
      3: '#F59E0B',
      4: '#8B5CF6'
    };

    filteredPoints.forEach(pt => {
      // 3D rotation matrix transform
      const y1 = pt.PC2 * cosX - pt.PC3 * sinX;
      const z1 = pt.PC2 * sinX + pt.PC3 * cosX;
      const x2 = pt.PC1 * cosY + z1 * sinY;
      const z2 = -pt.PC1 * sinY + z1 * cosY;

      const px = centerX + x2 * scale;
      const py = centerY - y1 * scale;

      // Draw point dot
      ctx.beginPath();
      ctx.arc(px, py, 2.5 * zoom, 0, 2 * Math.PI);
      ctx.fillStyle = clusterColors[pt.cluster] || '#00E5FF';
      ctx.globalAlpha = 0.75;
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;

  }, [angleX, angleY, zoom, selectedClusterFilter, sample_points]);

  // Scree plot data
  const screeChartData = {
    labels: Array.from({ length: 10 }, (_, i) => `PC${i + 1}`),
    datasets: [
      {
        type: 'bar',
        label: 'Individual Explained Variance (%)',
        data: explainedVariance.slice(0, 10),
        backgroundColor: 'rgba(0, 229, 255, 0.5)',
        borderColor: '#00E5FF',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Cumulative Variance (%)',
        data: cumulativeVariance.slice(0, 10),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
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
      legend: { labels: { color: '#9CA3AF', font: { family: 'Inter', size: 11 } } },
      tooltip: { backgroundColor: 'rgba(11, 15, 23, 0.95)', titleColor: '#FFF' }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9CA3AF' } },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Variance Ratio (%)', color: '#00E5FF' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9CA3AF' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Cumulative (%)', color: '#8B5CF6' },
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
          <Cpu size={24} color="var(--siemens-bright)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Group 3 — Principal Component Analysis (PCA) Studio</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Dimensionality reduction transforming 20 correlated energy consumption & lag features into 3 orthogonal Principal Components explaining <strong>59.39%</strong> of total dataset variance.
        </p>
      </div>

      {/* 3D PCA Scatter Plot & Scree Plot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* Interactive 3D PCA Visualizer */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Interactive 3D PCA Scatter Map</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>PC1 (31.8%) vs PC2 (14.8%) vs PC3 (12.8%)</span>
            </div>

            {/* Cluster Filter Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                value={selectedClusterFilter}
                onChange={e => setSelectedClusterFilter(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.35rem 0.65rem',
                  color: '#FFF',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              >
                <option value="ALL" style={{ background: '#0B0F17' }}>Filter: All Clusters</option>
                {segments.map(s => (
                  <option key={s.id} value={s.id} style={{ background: '#0B0F17' }}>Cluster {s.id}: {s.name}</option>
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
          <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <canvas ref={canvasRef} width={600} height={320} style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>
        </div>

        {/* Scree Plot */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Scree Plot & Variance Explained
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            First 3 components capture <strong>59.39%</strong> total information.
          </p>
          <div style={{ flex: 1, minHeight: '280px' }}>
            <Line data={screeChartData} options={screeOptions} />
          </div>
        </div>
      </div>

      {/* PCA Loading Matrix & Factor Drivers */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          PCA Loading Matrix & Principal Component Drivers
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Eigenvector weights indicating feature influence on each principal axis:
        </p>

        {/* 3 PC Driver Cards */}
        <div className="grid-cols-3" style={{ marginBottom: '1.25rem' }}>
          <div style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span className="badge badge-teal">PC1 (31.77% VAR)</span>
              <strong style={{ fontSize: '0.8rem', color: 'var(--siemens-bright)' }}>Magnitude & Peak Factor</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Driven strongly by <strong>total_consumption (0.370)</strong>, <strong>lag_1 (0.369)</strong>, <strong>lag_168 (0.350)</strong>, and baseline differences.
            </p>
          </div>

          <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span className="badge badge-purple">PC2 (14.80% VAR)</span>
              <strong style={{ fontSize: '0.8rem', color: '#A78BFA' }}>Weekly Operational Shift</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Driven by <strong>day_of_week (0.445)</strong>, <strong>is_weekend (0.385)</strong>, and negative correlation with 24h change (-0.382).
            </p>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span className="badge badge-emerald">PC3 (12.82% VAR)</span>
              <strong style={{ fontSize: '0.8rem', color: '#34D399' }}>Diurnal Rhythm & Baseline</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Driven by <strong>hour_sin (0.416)</strong>, <strong>rolling_mean_7d (0.372)</strong>, and negative hour offset (-0.391).
            </p>
          </div>
        </div>

        {/* Loading Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem 1rem' }}>Feature Variable</th>
                <th style={{ padding: '0.65rem 1rem' }}>PC1 Loading</th>
                <th style={{ padding: '0.65rem 1rem' }}>PC2 Loading</th>
                <th style={{ padding: '0.65rem 1rem' }}>PC3 Loading</th>
              </tr>
            </thead>
            <tbody>
              {pca_loadings.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <td style={{ padding: '0.65rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.feature}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', color: Math.abs(row.PC1) > 0.3 ? 'var(--siemens-bright)' : 'var(--text-secondary)', fontWeight: Math.abs(row.PC1) > 0.3 ? 700 : 400 }}>
                    {row.PC1 > 0 ? `+${row.PC1.toFixed(4)}` : row.PC1.toFixed(4)}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', color: Math.abs(row.PC2) > 0.3 ? '#A78BFA' : 'var(--text-secondary)', fontWeight: Math.abs(row.PC2) > 0.3 ? 700 : 400 }}>
                    {row.PC2 > 0 ? `+${row.PC2.toFixed(4)}` : row.PC2.toFixed(4)}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', color: Math.abs(row.PC3) > 0.3 ? '#34D399' : 'var(--text-secondary)', fontWeight: Math.abs(row.PC3) > 0.3 ? 700 : 400 }}>
                    {row.PC3 > 0 ? `+${row.PC3.toFixed(4)}` : row.PC3.toFixed(4)}
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
