import React, { useState } from 'react';
import { Database, Filter, Search, CheckCircle, AlertTriangle, FileText, RefreshCw, BarChart2 } from 'lucide-react';
import dashboardData from '../data/dashboard_data.json';

export default function Group1DataPrep() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const { raw_vs_cleaned } = dashboardData;

  const dataDictionary = [
    { name: 'mean_consumption', type: 'Float (kWh)', cat: 'Aggregate Stat', desc: 'Average hourly electricity consumption across the observation period.' },
    { name: 'total_consumption', type: 'Float (kWh)', cat: 'Aggregate Stat', desc: 'Total cumulative energy consumption recorded for the building consumer.' },
    { name: 'std_consumption', type: 'Float', cat: 'Variance Stat', desc: 'Standard deviation of hourly consumption, measuring load volatility.' },
    { name: 'min_consumption', type: 'Float (kWh)', cat: 'Baseload Stat', desc: 'Minimum recorded hourly consumption, representing base standby load.' },
    { name: 'max_consumption', type: 'Float (kWh)', cat: 'Peak Load Stat', desc: 'Maximum single-hour peak demand recorded.' },
    { name: 'peak_to_average', type: 'Float Ratio', cat: 'Load Factor', desc: 'Ratio of max peak consumption to mean consumption (Max / Mean).' },
    { name: 'weekday_mean', type: 'Float (kWh)', cat: 'Temporal Mean', desc: 'Average consumption during Monday-Friday operational hours.' },
    { name: 'weekend_mean', type: 'Float (kWh)', cat: 'Temporal Mean', desc: 'Average consumption during Saturday-Sunday off-peak hours.' },
    { name: 'day_mean', type: 'Float (kWh)', cat: 'Diurnal Stat', desc: 'Average daytime consumption (08:00 to 20:00).' },
    { name: 'night_mean', type: 'Float (kWh)', cat: 'Diurnal Stat', desc: 'Average nighttime baseline consumption (20:00 to 08:00).' },
    { name: 'weekday_weekend_ratio', type: 'Float Ratio', cat: 'Operational Ratio', desc: 'Ratio of weekday average to weekend average (Weekday Mean / Weekend Mean).' },
    { name: 'day_night_ratio', type: 'Float Ratio', cat: 'Operational Ratio', desc: 'Ratio of daytime average to nighttime average (Day Mean / Night Mean).' },
    { name: 'peak_hour_consumption', type: 'Float (kWh)', cat: 'Peak Demand', desc: 'Consumption recorded during the facility peak hour.' },
    { name: 'hourly_mean_std', type: 'Float', cat: 'Variance Stat', desc: 'Standard deviation across 24 hourly mean profile buckets.' },
    { name: 'peak_hour_sin / cos', type: 'Float [-1, 1]', cat: 'Cyclical Math', desc: 'Trigonometric sine/cosine transformation of facility peak hour.' },
  ];

  const filteredDict = dataDictionary.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterType === 'ALL' || item.cat === filterType;
    return matchesSearch && matchesCat;
  });

  const categories = ['ALL', 'Aggregate Stat', 'Variance Stat', 'Baseload Stat', 'Peak Load Stat', 'Load Factor', 'Temporal Mean', 'Diurnal Stat', 'Operational Ratio', 'Cyclical Math'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Database size={24} color="var(--baby-pink-magenta)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2937' }}>Group 1 — Dataset Selection & Data Preparation</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Research, ingestion, cleaning, missing-value imputation, duplicate removal, outlier treatment, and schema verification for the Building Data Genome 2 (BDG2) Siemens Energy portfolio dataset.
        </p>
      </div>

      {/* Raw vs Cleaned Dataset Comparison Audit Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1F2937' }}>
          Raw vs. Cleaned Dataset Audit Comparison
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Comprehensive summary of data cleaning, missing value imputation, and outlier treatment across all 3 source domains:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255, 182, 193, 0.5)', background: 'var(--baby-pink-light)', color: 'var(--baby-pink-magenta)' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Dataset Domain</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Raw Dimension</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Cleaned Dimension</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Duplicates Dropped</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Raw Missing Values</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Cleaned Missing</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Outliers Treated</th>
              </tr>
            </thead>
            <tbody>
              {raw_vs_cleaned.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #FFF0F4' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--baby-pink-magenta)' }}>
                    {row.dataset}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{row.raw_dim}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#1F2937', fontWeight: 600 }}>{row.cleaned_dim}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669' }}>{row.duplicates}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#E11D48' }}>{row.raw_missing.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 700 }}>{row.cleaned_missing.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#D97706' }}>{row.outliers.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Dictionary & Schema Explorer */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1F2937' }}>Data Dictionary & Variable Schema</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              16 aggregated features used for consumer segmentation
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search variables..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  background: '#FFF5F7',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                  color: '#1F2937',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '200px'
                }}
              />
            </div>

            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{
                background: '#FFF5F7',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.75rem',
                color: '#1F2937',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              {categories.map(c => (
                <option key={c} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255, 182, 193, 0.5)', background: 'var(--baby-pink-light)', color: 'var(--baby-pink-magenta)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Feature Variable Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Data Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Description & Operational Context</th>
              </tr>
            </thead>
            <tbody>
              {filteredDict.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #FFF0F4' }} className="glass-card-interactive">
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--baby-pink-magenta)' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                    {item.type}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className="badge badge-pink">{item.cat}</span>
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
