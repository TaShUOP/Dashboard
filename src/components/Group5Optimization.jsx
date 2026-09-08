import React, { useState } from 'react';
import { Target, Zap, DollarSign, Calculator, ArrowRight, ShieldCheck, Download, Award, CheckCircle2, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';
import dashboardData from '../data/dashboard_data.json';

export default function Group5Optimization() {
  const { segments, metrics } = dashboardData;

  // ROI Calculator State
  const [totalAnnualKWh, setTotalAnnualKWh] = useState(50000000); // 50M kWh default
  const [ratePerKWh, setRatePerKWh] = useState(0.14); // $0.14 / kWh default
  const [selectedSegmentId, setSelectedSegmentId] = useState(1); // Default segment 1 Heavy Industrial

  // Savings calculation
  const totalAnnualCost = totalAnnualKWh * ratePerKWh;
  
  const currentSeg = segments.find(s => s.id === selectedSegmentId) || segments[1];
  const segCostShare = totalAnnualCost * (currentSeg.pct / 100);

  const savingsPctMap = {
    0: 0.065, // 6.5% base low baseload
    1: 0.215, // 21.5% heavy industrial peak shaving
    2: 0.135, // 13.5% weekend shift
    3: 0.175, // 17.5% office HVAC automation
    4: 0.120, // 12.0% volatile load control
  };

  const estimatedSegmentSavings = segCostShare * (savingsPctMap[selectedSegmentId] || 0.15);
  const estimatedTotalPortfolioSavings = totalAnnualCost * 0.152; // ~15.2% overall portfolio savings

  // Export Report as PDF using jsPDF
  const exportReport = () => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Color Palette
    const cyan = [0, 153, 153];
    const darkBg = [11, 15, 23];
    const darkCard = [20, 28, 42];
    const textGray = [156, 163, 175];
    const textWhite = [255, 255, 255];
    const accentTeal = [0, 229, 255];

    // Page 1 Header Banner
    doc.setFillColor(...cyan);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(...textWhite);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('SIEMENS ENERGY — CONSUMER SEGMENTATION REPORT', 14, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Dataset: BDG2 Siemens Portfolio (17,376 Rows)`, 14, 22);

    let y = 36;

    // Executive Summary Box
    doc.setFillColor(...darkCard);
    doc.rect(14, y, pageWidth - 28, 38, 'F');
    doc.setDrawColor(...cyan);
    doc.setLineWidth(0.5);
    doc.rect(14, y, pageWidth - 28, 38, 'S');

    doc.setTextColor(...accentTeal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('EXECUTIVE KPI & MODEL EVALUATION METRICS', 20, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...textWhite);
    doc.text(`• Total Observations: ${metrics.total_observations.toLocaleString()}`, 20, y + 18);
    doc.text(`• PCA Explained Variance: ${metrics.cumulative_explained_var}% (3 Components)`, 20, y + 24);
    doc.text(`• Optimal Clusters (K): ${metrics.optimal_k}`, 20, y + 30);

    doc.text(`• Silhouette Score: ${metrics.silhouette_score} (Highest Separation)`, 110, y + 18);
    doc.text(`• Davies-Bouldin Index: ${metrics.davies_bouldin} (Compactness)`, 110, y + 24);
    doc.text(`• Calinski-Harabasz: ${metrics.calinski_harabasz.toLocaleString()}`, 110, y + 30);

    y += 46;

    // Section 2: Simulated Financial Impact
    doc.setFillColor(...darkCard);
    doc.rect(14, y, pageWidth - 28, 32, 'F');
    doc.setDrawColor(0, 229, 255);
    doc.rect(14, y, pageWidth - 28, 32, 'S');

    doc.setTextColor(...accentTeal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('SIMULATED FINANCIAL SAVINGS & ROI ANALYSIS', 20, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...textWhite);
    doc.text(`• Portfolio Consumption: ${totalAnnualKWh.toLocaleString()} kWh/yr`, 20, y + 17);
    doc.text(`• Electricity Tariff: $${ratePerKWh.toFixed(2)} / kWh`, 20, y + 23);
    doc.text(`• Total Annual Cost: $${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 110, y + 17);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 211, 153);
    doc.text(`• Estimated Annual Savings: $${estimatedTotalPortfolioSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} / yr (~15.2% reduction)`, 110, y + 23);

    y += 40;

    // Section 3: 5 Consumer Profiles & Strategies
    doc.setTextColor(...darkBg);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CONSUMER SEGMENTS & TARGETED OPTIMIZATION STRATEGIES', 14, y);
    y += 6;

    segments.forEach((seg, idx) => {
      // Add page if needed
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFillColor(245, 247, 250);
      doc.rect(14, y, pageWidth - 28, 32, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(14, y, pageWidth - 28, 32, 'S');

      // Left bar color indicator
      const r = parseInt(seg.color.slice(1, 3), 16) || 0;
      const g = parseInt(seg.color.slice(3, 5), 16) || 153;
      const b = parseInt(seg.color.slice(5, 7), 16) || 153;
      doc.setFillColor(r, g, b);
      doc.rect(14, y, 4, 32, 'F');

      doc.setTextColor(11, 15, 23);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Cluster ${seg.id}: ${seg.name} (${seg.pct}% | ${seg.count.toLocaleString()} Facilities)`, 22, y + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(70, 70, 70);
      doc.text(`Profile: ${seg.description}`, 22, y + 15);
      doc.text(`Siemens Strategy: ${seg.strategy}`, 22, y + 21);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 153, 153);
      doc.text(`Expected Savings: ${seg.savings_est}`, 22, y + 27);

      y += 36;
    });

    // Page Numbers & Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Siemens Energy Consumer Segmentation Analytics — Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }

    // Save as PDF file
    doc.save('Siemens_Energy_Segmentation_Report.pdf');
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
            <Download size={18} /> Export Executive PDF Report
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
