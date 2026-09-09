import React from 'react';
import { 
  BarChart2, 
  CheckCircle2, 
  Cpu, 
  Database, 
  PieChart, 
  TrendingUp, 
  ArrowRight,
  Zap,
  ShieldCheck,
  Award
} from 'lucide-react';
import dashboardData from '../data/dashboard_data.json';

export default function OverviewTab({ setActiveTab }) {
  const { metrics, centroids, segments } = dashboardData;

  const kpis = [
    { title: 'Total Consumers Analyzed', value: metrics.total_consumers.toLocaleString(), label: 'Aggregated facility profiles', icon: Database, color: 'var(--baby-pink-magenta)' },
    { title: 'Optimal Clusters (K)', value: metrics.optimal_k, label: 'K-Means Silhouette maximum', icon: PieChart, color: '#9C27B0' },
    { title: 'PCA Explained Variance', value: `${metrics.cumulative_explained_var}%`, label: 'Top 4 Principal Components', icon: Cpu, color: 'var(--baby-pink-deep)' },
    { title: 'Silhouette Score', value: metrics.silhouette_score, label: 'Peak cluster separation (K=2)', icon: Award, color: '#D97706' },
    { title: 'Davies-Bouldin Index', value: metrics.davies_bouldin, label: 'Cluster compactness (lower=better)', icon: ShieldCheck, color: '#059669' },
    { title: 'Calinski-Harabasz', value: metrics.calinski_harabasz.toLocaleString(), label: 'Variance ratio criterion', icon: TrendingUp, color: '#E11D48' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, #FFE6EA 0%, #FFF0F4 50%, #FFFFFF 100%)',
        border: '1px solid rgba(255, 182, 193, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-pink">UPDATED DATASET PIPELINE ACTIVE</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>BDG2 Siemens Energy Portfolio (1,488 Consumers)</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1F2937' }}>
              Consumer Energy Consumption Segmentation Dashboard
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '850px', fontSize: '0.95rem' }}>
              End-to-end unsupervised machine learning framework integrating <strong>PCA dimensionality reduction (80.40% variance)</strong> and <strong>K-Means clustering (K=2 optimal separation)</strong> to segment Siemens Energy building & facility consumers into actionable operational profiles.
            </p>
          </div>
          <button className="btn-primary" onClick={() => setActiveTab('group5')}>
            View Optimization Hub <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-cols-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-card glass-card-interactive" style={{ borderLeft: `4px solid ${kpi.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {kpi.title}
                </span>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--baby-pink-light)',
                  color: kpi.color
                }}>
                  <Icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1F2937', letterSpacing: '-0.02em' }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {kpi.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cluster Distribution Overview & Key Segments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem' }}>
        {/* Cluster Distribution Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>Cluster Size Distribution</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>K = 2 Consumer Segments</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {segments.map(seg => (
              <div key={seg.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1F2937' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: seg.color }}></span>
                    Cluster {seg.id}: {seg.name}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <strong style={{ color: '#1F2937' }}>{seg.count.toLocaleString()}</strong> ({seg.pct}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#FFF0F4', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${seg.pct}%`,
                    height: '100%',
                    background: seg.color,
                    borderRadius: '4px',
                    transition: 'width 0.6s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Group Workflow Summary */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1F2937' }}>
            Project Workflow & Methodology (Groups 1–5)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[
              { g: 'Group 1', title: 'Dataset & Data Preparation', desc: 'Ingested BDG2 Siemens metadata (1,636), weather (331,166), and electricity consumption (17,544 readings × 1,489 buildings). Cleaned 2.47M missing values and 120k outliers.', tab: 'group1' },
              { g: 'Group 2', title: 'EDA & Feature Engineering', desc: 'Aggregated consumption into 16 statistical features including mean, std, min, max, peak-to-average, weekday/weekend ratios, day/night ratios, and peak hour cyclical sin/cos.', tab: 'group2' },
              { g: 'Group 3', title: 'PCA & Dimensionality Reduction', desc: 'Extracted 4 Principal Components capturing 80.40% cumulative variance. Computed PCA loadings for overall magnitude (PC1: 41.3%), operational shift (PC2: 18.6%), and peak hour timing (PC3: 12.4%).', tab: 'group3' },
              { g: 'Group 4', title: 'K-Means & Model Evaluation', desc: 'Tested K=2..8. Confirmed Optimal K=2 with peak Silhouette score (0.3823). Evaluated via Davies-Bouldin (1.1245) and Calinski-Harabasz (3482.15).', tab: 'group4' },
              { g: 'Group 5', title: 'Optimization & Dashboard Hub', desc: 'Formulated targeted Siemens Energy operational tactics (BESS peak shaving, Desigo CC automation, low-power standby schedules) with interactive ROI calculator & PDF exporter.', tab: 'group5' },
            ].map((step, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveTab(step.tab)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#FFF0F4',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="glass-card-interactive"
              >
                <div style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  background: 'var(--baby-pink-light)',
                  color: 'var(--baby-pink-magenta)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap'
                }}>
                  {step.g}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1F2937' }}>{step.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
