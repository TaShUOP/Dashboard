import React, { useState } from 'react';
import { Target, Zap, DollarSign, Calculator, ArrowRight, ShieldCheck, Download, Award, CheckCircle2, RefreshCw } from 'lucide-react';
import dashboardData from '../data/dashboard_data.json';

export default function Group5Optimization() {
  const { segments } = dashboardData;

  // ROI Calculator State
  const [totalAnnualKWh, setTotalAnnualKWh] = useState(50000000); // 50M kWh default
  const [ratePerKWh, setRatePerKWh] = useState(0.14); // $0.14 / kWh default
  const [selectedSegmentId, setSelectedSegmentId] = useState(1); // Default segment 1 Heavy Industrial

  // Savings calculation
  const totalAnnualCost = totalAnnualKWh * ratePerKWh;
  
  // Segment weightings
  const currentSeg = segments.find(s => s.id === selectedSegmentId) || segments[1];
  const segCostShare = totalAnnualCost * (currentSeg.pct / 100);

  // Savings percentages based on segment strategies
  const savingsPctMap = {
    0: 0.065, // 6.5% base low baseload
    1: 0.215, // 21.5% heavy industrial peak shaving
    2: 0.135, // 13.5% weekend shift
    3: 0.175, // 17.5% office HVAC automation
    4: 0.120, // 12.0% volatile load control
  };

  const estimatedSegmentSavings = segCostShare * (savingsPctMap[selectedSegmentId] || 0.15);
  const estimatedTotalPortfolioSavings = totalAnnualCost * 0.152; // ~15.2% overall portfolio savings

  const exportReport = () => {
    const reportText = `
================================================================================
SIEMENS ENERGY — CONSUMER SEGMENTATION & OPTIMIZATION REPORT
================================================================================
Generated: ${new Date().toLocaleString()}
Dataset: BDG2 Siemens Energy Portfolio (17,376 Cleaned Observations)
Framework: PCA (3 Components, 59.39% Variance) + K-Means Clustering (K=5)

MODEL EVALUATION METRICS:
- Optimal Clusters (K): 5
- Silhouette Score: 0.3481 (Peak Separation)
- Davies-Bouldin Index: 1.0357 (Compactness)
- Calinski-Harabasz Index: 8574.51 (Variance Ratio)

CONSUMER SEGMENT PROFILES & TARGETED STRATEGIES:
${segments.map(s => `
[Cluster ${s.id}]: ${s.name} (${s.pct}% of Portfolio, ${s.count} facilities)
- Key Profile: ${s.description}
- Targeted Strategy: ${s.strategy}
- Expected Efficiency Benefit: ${s.savings_est}
`).join('\n')}

ESTIMATED FINANCIAL IMPACT:
- Simulated Portfolio Usage: ${totalAnnualKWh.toLocaleString()} kWh/yr
- Average Electricity Tariff: $${ratePerKWh.toFixed(2)}/kWh
- Estimated Annual Energy Savings: $${estimatedTotalPortfolioSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} / year
================================================================================
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Siemens_Energy_Segmentation_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
        border: '1px solid rgba(0, 229, 255, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-teal">GROUP 5 DELIVERABLE</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Targeted Optimization Matrix</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              Consumer Segment Profiles & Targeted Siemens Energy Optimization Hub
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '850px' }}>
              Actionable efficiency interventions tailored specifically to the operational characteristics of each of the 5 identified consumer segments.
            </p>
          </div>
          <button className="btn-primary" onClick={exportReport}>
            <Download size={18} /> Export Executive Report
          </button>
        </div>
      </div>

      {/* Interactive ROI & Energy Savings Calculator */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--siemens-bright)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Calculator size={24} color="var(--siemens-bright)" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Interactive Energy Savings & ROI Calculator</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Simulate annual Siemens Energy facility portfolio electricity consumption to estimate dollar and kWh savings
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
          {/* Inputs Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Input 1: Total Annual Consumption */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Annual Portfolio Electricity Consumption (kWh):</span>
                <strong style={{ color: 'var(--siemens-bright)' }}>{totalAnnualKWh.toLocaleString()} kWh</strong>
              </div>
              <input
                type="range"
                min="5000000"
                max="200000000"
                step="5000000"
                value={totalAnnualKWh}
                onChange={e => setTotalAnnualKWh(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Input 2: Electricity Tariff Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Average Electricity Tariff ($ / kWh):</span>
                <strong style={{ color: '#34D399' }}>${ratePerKWh.toFixed(2)} / kWh</strong>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.45"
                step="0.01"
                value={ratePerKWh}
                onChange={e => setRatePerKWh(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Input 3: Segment Selector */}
            <div>
              <label style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Select Segment Profile for Detailed Strategy Deep-Dive:
              </label>
              <select
                value={selectedSegmentId}
                onChange={e => setSelectedSegmentId(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem',
                  color: '#FFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                {segments.map(s => (
                  <option key={s.id} value={s.id} style={{ background: '#0B0F17' }}>
                    Cluster {s.id}: {s.name} ({s.pct}% of facilities)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Column */}
          <div style={{
            background: 'rgba(0, 153, 153, 0.08)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: '0.75rem' }}>ESTIMATED ANNUAL IMPACT</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Portfolio Annual Energy Cost:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF', marginBottom: '0.75rem' }}>
                ${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} / year
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Targeted Savings for <strong>Cluster {currentSeg.id} ({currentSeg.name})</strong>:
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--siemens-bright)', marginBottom: '0.5rem' }}>
                ${estimatedSegmentSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} / year
              </div>
            </div>

            <div style={{
              borderTop: '1px dashed rgba(0, 229, 255, 0.3)',
              paddingTop: '0.75rem',
              marginTop: '0.75rem',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estimated Entire Portfolio Savings:</span>
              <strong style={{ fontSize: '1.15rem', color: '#34D399' }}>
                ${estimatedTotalPortfolioSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} / yr
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Consumer Profile Cards & Targeted Strategies */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>5 Consumer Segments & Siemens Energy Optimization Strategies</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {segments.map(seg => (
            <div key={seg.id} className="glass-card" style={{ borderLeft: `5px solid ${seg.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: seg.color,
                      color: '#0B0F17',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      {seg.id}
                    </span>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>{seg.name}</h4>
                    <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: seg.color, border: `1px solid ${seg.color}` }}>
                      {seg.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    {seg.description}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {seg.count.toLocaleString()} Facilities ({seg.pct}%)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: seg.color, fontWeight: 600 }}>
                    Expected Impact: {seg.savings_est}
                  </div>
                </div>
              </div>

              {/* Characteristics & Targeted Strategy */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Key Operational Indicators
                  </span>
                  <ul style={{ paddingLeft: '1.1rem', marginTop: '0.4rem', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    {seg.characteristics.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>

                <div style={{ background: 'rgba(0, 229, 255, 0.04)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 229, 255, 0.15)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--siemens-bright)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Target size={14} /> Siemens Energy Targeted Action Plan
                  </span>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', marginTop: '0.4rem', fontWeight: 500 }}>
                    {seg.strategy}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
