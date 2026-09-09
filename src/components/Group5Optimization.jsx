import React, { useState } from 'react';
import { Target, Zap, DollarSign, Calculator, ArrowRight, ShieldCheck, Download, Award, CheckCircle2, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';
import dashboardData from '../data/dashboard_data.json';

export default function Group5Optimization() {
  const { segments, metrics } = dashboardData;

  // ROI Calculator State
  const [totalAnnualKWh, setTotalAnnualKWh] = useState(50000000); // 50M kWh default
  const [ratePerKWh, setRatePerKWh] = useState(0.14); // $0.14 / kWh default
  const [selectedSegmentId, setSelectedSegmentId] = useState(1); // Default segment 1 High-Volume

  // Savings calculation
  const totalAnnualCost = totalAnnualKWh * ratePerKWh;
  
  const currentSeg = segments.find(s => s.id === selectedSegmentId) || segments[1];
  const segCostShare = totalAnnualCost * (currentSeg.pct / 100);

  const savingsPctMap = {
    0: 0.095, // 9.5% low to moderate baseload efficiency
    1: 0.215, // 21.5% high volume peak shaving & BESS
  };

  const estimatedSegmentSavings = segCostShare * (savingsPctMap[selectedSegmentId] || 0.15);
  const estimatedTotalPortfolioSavings = totalAnnualCost * 0.166; // ~16.6% overall portfolio savings

  // Export Report as PDF using jsPDF with auto word wrapping & dynamic box sizing
  const exportReport = () => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const margin = 14;
    const contentWidth = pageWidth - margin * 2; // 182mm

    // Color Palette
    const cyan = [0, 153, 153];
    const darkBg = [11, 15, 23];
    const darkCard = [20, 28, 42];
    const textWhite = [255, 255, 255];
    const accentTeal = [0, 229, 255];

    // Page 1 Header Banner
    doc.setFillColor(...cyan);
    doc.rect(0, 0, pageWidth, 26, 'F');

    doc.setTextColor(...textWhite);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('SIEMENS ENERGY — CONSUMER SEGMENTATION REPORT', margin, 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Generated: ${new Date().toLocaleDateString()}  |  Dataset: BDG2 Siemens Portfolio (1,488 Cleaned Consumers)`, margin, 21);

    let y = 32;

    // Section 1: Executive KPI Metrics Box
    const kpiBoxHeight = 36;
    doc.setFillColor(...darkCard);
    doc.rect(margin, y, contentWidth, kpiBoxHeight, 'F');
    doc.setDrawColor(...cyan);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, kpiBoxHeight, 'S');

    doc.setTextColor(...accentTeal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('EXECUTIVE KPI & MODEL EVALUATION METRICS', margin + 6, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...textWhite);
    doc.text(`• Total Consumers Analyzed: ${metrics.total_consumers.toLocaleString()}`, margin + 6, y + 16);
    doc.text(`• PCA Explained Variance: ${metrics.cumulative_explained_var}% (4 PCs)`, margin + 6, y + 22);
    doc.text(`• Optimal Clusters (K): ${metrics.optimal_k}`, margin + 6, y + 28);

    doc.text(`• Silhouette Score: ${metrics.silhouette_score} (Highest Separation)`, margin + 95, y + 16);
    doc.text(`• Davies-Bouldin Index: ${metrics.davies_bouldin} (Compactness)`, margin + 95, y + 22);
    doc.text(`• Calinski-Harabasz: ${metrics.calinski_harabasz.toLocaleString()}`, margin + 95, y + 28);

    y += kpiBoxHeight + 8;

    // Section 2: Simulated Financial Impact Box (Wrapped Text)
    const roiBoxHeight = 36;
    doc.setFillColor(...darkCard);
    doc.rect(margin, y, contentWidth, roiBoxHeight, 'F');
    doc.setDrawColor(0, 229, 255);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, roiBoxHeight, 'S');

    doc.setTextColor(...accentTeal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('SIMULATED FINANCIAL SAVINGS & ROI ANALYSIS', margin + 6, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...textWhite);
    doc.text(`• Portfolio Consumption: ${totalAnnualKWh.toLocaleString()} kWh/yr`, margin + 6, y + 17);
    doc.text(`• Electricity Tariff: $${ratePerKWh.toFixed(2)} / kWh`, margin + 6, y + 24);

    doc.text(`• Total Annual Cost: $${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, margin + 95, y + 17);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 211, 153);
    const savingsText = `• Est. Annual Savings: $${estimatedTotalPortfolioSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr (~16.6%)`;
    const wrappedSavings = doc.splitTextToSize(savingsText, 82);
    doc.text(wrappedSavings, margin + 95, y + 24);

    y += roiBoxHeight + 10;

    // Section 3: 2 Consumer Profiles & Strategies Header
    doc.setTextColor(...darkBg);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CONSUMER SEGMENTS & TARGETED OPTIMIZATION STRATEGIES', margin, y);
    y += 6;

    const maxTextWidth = contentWidth - 14; // 168mm text printable width

    segments.forEach((seg) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      const profileText = `Profile: ${seg.description}`;
      const profileLines = doc.splitTextToSize(profileText, maxTextWidth);

      const strategyText = `Siemens Strategy: ${seg.strategy}`;
      const strategyLines = doc.splitTextToSize(strategyText, maxTextWidth);

      const lineHeight = 3.8;
      const cardHeight = 14 + (profileLines.length * lineHeight) + (strategyLines.length * lineHeight) + 6;

      if (y + cardHeight > 275) {
        doc.addPage();
        y = 16;
      }

      // Draw Card Box
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, y, contentWidth, cardHeight, 'F');
      doc.setDrawColor(210, 215, 225);
      doc.setLineWidth(0.3);
      doc.rect(margin, y, contentWidth, cardHeight, 'S');

      // Left Accent Strip Color
      const r = parseInt(seg.color.slice(1, 3), 16) || 0;
      const g = parseInt(seg.color.slice(3, 5), 16) || 153;
      const b = parseInt(seg.color.slice(5, 7), 16) || 153;
      doc.setFillColor(r, g, b);
      doc.rect(margin, y, 4, cardHeight, 'F');

      // Card Title
      doc.setTextColor(11, 15, 23);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(`Cluster ${seg.id}: ${seg.name} (${seg.pct}% | ${seg.count.toLocaleString()} Facilities)`, margin + 8, y + 6);

      // Card Body Paragraphs
      let textY = y + 11;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60, 65, 75);

      profileLines.forEach(line => {
        doc.text(line, margin + 8, textY);
        textY += lineHeight;
      });

      textY += 1;

      strategyLines.forEach(line => {
        doc.text(line, margin + 8, textY);
        textY += lineHeight;
      });

      textY += 2;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 140, 140);
      doc.text(`Expected Savings: ${seg.savings_est}`, margin + 8, textY);

      y += cardHeight + 5;
    });

    // Page Numbers & Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      doc.text(`Siemens Energy Consumer Segmentation Analytics Report  |  Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }

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
              Actionable efficiency interventions tailored specifically to the operational characteristics of each of the identified consumer segments.
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

      {/* Consumer Profile Cards & Targeted Strategies */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Consumer Segments & Siemens Energy Optimization Strategies</h3>

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
