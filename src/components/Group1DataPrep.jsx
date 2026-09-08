import React, { useState } from 'react';
import { Database, Filter, Search, CheckCircle, AlertTriangle, FileText, RefreshCw, BarChart2 } from 'lucide-react';

export default function Group1DataPrep() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const dataDictionary = [
    { name: 'total_consumption', type: 'Float (Scaled)', cat: 'Target Meter', desc: 'Raw hourly energy consumption (kWh) standardized using z-score normalization.' },
    { name: 'total_consumption_lag_1', type: 'Float (Scaled)', cat: 'Lag Feature', desc: 'Consumption recorded 1 hour prior to reference observation.' },
    { name: 'total_consumption_lag_24', type: 'Float (Scaled)', cat: 'Lag Feature', desc: 'Consumption recorded 24 hours prior (same hour previous day).' },
    { name: 'total_consumption_lag_168', type: 'Float (Scaled)', cat: 'Lag Feature', desc: 'Consumption recorded 168 hours prior (same hour previous week).' },
    { name: 'total_consumption_rolling_mean_24', type: 'Float (Scaled)', cat: 'Rolling Stat', desc: '24-hour moving average consumption window to smooth out micro-spikes.' },
    { name: 'total_consumption_rolling_mean_7d', type: 'Float (Scaled)', cat: 'Rolling Stat', desc: '7-day moving average consumption window for macro baseline trend.' },
    { name: 'consumption_vs_hourly_baseline', type: 'Float (Scaled)', cat: 'Baseline Diff', desc: 'Difference between current consumption and mean consumption for that specific hour of day.' },
    { name: 'consumption_change_1h', type: 'Float (Scaled)', cat: 'Delta', desc: 'Rate of change in consumption over 1 hour (d/dt).' },
    { name: 'consumption_change_24h', type: 'Float (Scaled)', cat: 'Delta', desc: 'Rate of change in consumption compared to 24 hours ago.' },
    { name: 'consumption_vs_hour_weekend_baseline', type: 'Float (Scaled)', cat: 'Baseline Diff', desc: 'Difference between consumption and baseline conditioned on weekday vs weekend.' },
    { name: 'hour', type: 'Integer (0-23)', cat: 'Temporal', desc: 'Hour of day from 0 (midnight) to 23.' },
    { name: 'day_of_week', type: 'Integer (0-6)', cat: 'Temporal', desc: 'Day of week index from 0 (Monday) to 6 (Sunday).' },
    { name: 'month', type: 'Integer (1-12)', cat: 'Temporal', desc: 'Calendar month index.' },
    { name: 'is_weekend', type: 'Binary (0/1)', cat: 'Temporal', desc: 'Indicator flag (1 for Saturday/Sunday, 0 for Monday-Friday).' },
    { name: 'hour_sin / hour_cos', type: 'Float [-1, 1]', cat: 'Cyclical Math', desc: 'Trigonometric sine/cosine transformation of hour to preserve 23h -> 0h continuous periodicity.' },
    { name: 'day_of_week_sin / cos', type: 'Float [-1, 1]', cat: 'Cyclical Math', desc: 'Trigonometric sine/cosine transformation of day of week.' },
    { name: 'month_sin / cos', type: 'Float [-1, 1]', cat: 'Cyclical Math', desc: 'Trigonometric sine/cosine transformation of calendar month.' },
  ];

  const filteredDict = dataDictionary.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterType === 'ALL' || item.cat === filterType;
    return matchesSearch && matchesCat;
  });

  const categories = ['ALL', 'Target Meter', 'Lag Feature', 'Rolling Stat', 'Baseline Diff', 'Delta', 'Temporal', 'Cyclical Math'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Database size={24} color="var(--siemens-bright)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Group 1 — Dataset Selection & Data Preparation</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Research, ingestion, cleaning, missing-value imputation, duplicate removal, outlier treatment, and schema verification for the Building Data Genome 2 (BDG2) Siemens Energy portfolio dataset.
        </p>
      </div>

      {/* Raw vs Cleaned Dataset Comparison */}
      <div className="grid-cols-2">
        <div className="glass-card" style={{ borderLeft: '4px solid #EF4444' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="#EF4444" /> Raw Ingested Dataset Audit
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Source Dataset</span>
              <strong style={{ color: '#FFF' }}>Building Data Genome 2 (BDG2)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Raw Ingested Records</span>
              <strong style={{ color: '#FFF' }}>17,544 rows</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Missing Values Found</span>
              <strong style={{ color: '#EF4444' }}>168 rows (0.95%) — Lag window gaps</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Duplicate Rows</span>
              <strong style={{ color: '#FFF' }}>0 duplicates detected</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Unbounded Outliers</span>
              <strong style={{ color: '#F59E0B' }}>Extreme meter spikes (&gt; 4 sigma)</strong>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid var(--siemens-bright)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} color="var(--siemens-bright)" /> Cleaned ML-Ready Dataset
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Final ML Sample Count</span>
              <strong style={{ color: 'var(--siemens-bright)' }}>17,376 cleaned rows</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Missing Values Remaining</span>
              <strong style={{ color: '#34D399' }}>0 missing values (100% clean)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Outlier Treatment</span>
              <strong style={{ color: '#FFF' }}>IQR & Winsorization clipped at 99.5th %tile</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Feature Matrix Dimension</span>
              <strong style={{ color: '#FFF' }}>20 Numerical Features</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Scaling Standard</span>
              <strong style={{ color: 'var(--siemens-accent)' }}>StandardScaler (Mean=0.0, Std=1.0)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Data Dictionary & Schema Explorer */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Data Dictionary & Variable Schema</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Comprehensive schema defining target, lag, rolling, baseline, and cyclical features
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search variables..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                  color: '#FFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '200px'
                }}
              />
            </div>

            {/* Category Select */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.75rem',
                color: '#FFF',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              {categories.map(c => (
                <option key={c} value={c} style={{ background: '#0B0F17' }}>Category: {c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Dictionary Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Feature Variable Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Data Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Description & Behavioral Context</th>
              </tr>
            </thead>
            <tbody>
              {filteredDict.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s' }} className="glass-card-interactive">
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--siemens-bright)' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                    {item.type}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className="badge badge-purple">{item.cat}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                    {item.desc}
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
