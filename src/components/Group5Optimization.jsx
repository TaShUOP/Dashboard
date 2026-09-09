import React, { useState } from 'react';
import { Target, Zap, DollarSign, Calculator, ArrowRight, ShieldCheck, Download, Award, CheckCircle2, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';
import dashboardData from '../data/dashboard_data.json';

export default function Group5Optimization() {
  const { segments, metrics, raw_vs_cleaned, pca_loadings, cluster_profiles } = dashboardData;

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

  // Export Executive PDF Report with Clean Black Table Text & Spaced Layout
  const exportReport = () => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const margin = 14;
    const contentWidth = pageWidth - margin * 2; // 182mm

    // Light Blue & Black Design Palette
    const lightBlueHeader = [56, 189, 248];
    const darkBg = [8, 12, 20];
    const darkHeaderBg = [15, 23, 42];
    const textBlack = [0, 0, 0];
    const textDarkGray = [30, 41, 59];
    const textWhite = [255, 255, 255];

    let y = 0;

    const drawHeader = () => {
      doc.setFillColor(...lightBlueHeader);
      doc.rect(0, 0, pageWidth, 24, 'F');
      doc.setTextColor(...darkBg);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('SIEMENS ENERGY — CONSUMER SEGMENTATION REPORT', margin, 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleDateString()} | BDG2 Siemens Energy Portfolio (1,488 Cleaned Consumers)`, margin, 19);
      y = 30;
    };

    drawHeader();

    // SECTION 1: EXECUTIVE OVERVIEW & KPIS
    doc.setFillColor(...darkHeaderBg);
    doc.rect(margin, y, contentWidth, 34, 'F');
    doc.setDrawColor(...lightBlueHeader);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, 34, 'S');

    doc.setTextColor(...lightBlueHeader);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('1. EXECUTIVE KPIS & MODEL EVALUATION METRICS', margin + 6, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...textWhite);
    doc.text(`• Total Consumers Analyzed: ${metrics.total_consumers.toLocaleString()}`, margin + 6, y + 15);
    doc.text(`• PCA Cumulative Variance: ${metrics.cumulative_explained_var}% (4 PCs)`, margin + 6, y + 21);
    doc.text(`• Optimal Clusters (K): ${metrics.optimal_k}`, margin + 6, y + 27);

    doc.text(`• Silhouette Score: ${metrics.silhouette_score} (Peak Separation)`, margin + 95, y + 15);
    doc.text(`• Davies-Bouldin Index: ${metrics.davies_bouldin} (Compactness)`, margin + 95, y + 21);
    doc.text(`• Calinski-Harabasz Index: ${metrics.calinski_harabasz.toLocaleString()}`, margin + 95, y + 27);

    y += 40;

    // SECTION 2: GROUP 1 DATA AUDIT TABLE
    doc.setTextColor(...textBlack);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('2. GROUP 1: DATA CLEANING & DOMAIN AUDIT', margin, y);
    y += 5;

    doc.setFillColor(...darkHeaderBg);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...lightBlueHeader);
    doc.text('Domain', margin + 3, y + 4);
    doc.text('Raw Dim', margin + 35, y + 4);
    doc.text('Cleaned Dim', margin + 65, y + 4);
    doc.text('Raw Missing', margin + 95, y + 4);
    doc.text('Cleaned Missing', margin + 128, y + 4);
    doc.text('Outliers Treated', margin + 158, y + 4);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    raw_vs_cleaned.forEach(r => {
      doc.setTextColor(...textBlack);
      doc.text(r.dataset, margin + 3, y + 4);
      doc.text(r.raw_dim, margin + 35, y + 4);
      doc.text(r.cleaned_dim, margin + 65, y + 4);
      doc.text(r.raw_missing.toLocaleString(), margin + 95, y + 4);
      doc.text(r.cleaned_missing.toLocaleString(), margin + 128, y + 4);
      doc.text(r.outliers.toLocaleString(), margin + 158, y + 4);
      doc.setDrawColor(220, 225, 235);
      doc.line(margin, y + 6, margin + contentWidth, y + 6);
      y += 7;
    });

    y += 6;

    // SECTION 3: GROUP 2 BUILDING SECTOR BREAKDOWN
    doc.setTextColor(...textBlack);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('3. GROUP 2: BUILDING SECTOR DISTRIBUTION', margin, y);
    y += 5;

    const sectorSummary = `Education (573), Office (287), Public Assembly (187), Public Services (158), Lodging (148), Healthcare (25), Parking (22), Storage/Warehouse (13), Industrial (11), Retail (11), Services (9), Food (6), Science (5), Utility (4), Religion (3). Total: 1,488 Facilities.`;
    const sectorWrapped = doc.splitTextToSize(sectorSummary, contentWidth - 8);
    
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 6 + (sectorWrapped.length * 4), 'F');
    doc.setDrawColor(220, 225, 235);
    doc.rect(margin, y, contentWidth, 6 + (sectorWrapped.length * 4), 'S');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textBlack);
    doc.text(sectorWrapped, margin + 4, y + 5);

    y += 12 + (sectorWrapped.length * 4);

    // SECTION 4: GROUP 3 PCA LOADINGS SUMMARY
    doc.setTextColor(...textBlack);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('4. GROUP 3: PRINCIPAL COMPONENT ANALYSIS (80.40% CUMULATIVE VARIANCE)', margin, y);
    y += 5;

    doc.setFillColor(...darkHeaderBg);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...lightBlueHeader);
    doc.text('Feature Variable', margin + 3, y + 4);
    doc.text('PC1 (41.3%)', margin + 58, y + 4);
    doc.text('PC2 (18.6%)', margin + 90, y + 4);
    doc.text('PC3 (12.4%)', margin + 122, y + 4);
    doc.text('PC4 (8.2%)', margin + 154, y + 4);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    pca_loadings.slice(0, 7).forEach(row => {
      doc.setTextColor(...textBlack);
      doc.text(row.feature, margin + 3, y + 4);
      doc.text(row.PC1 > 0 ? `+${row.PC1.toFixed(4)}` : row.PC1.toFixed(4), margin + 58, y + 4);
      doc.text(row.PC2 > 0 ? `+${row.PC2.toFixed(4)}` : row.PC2.toFixed(4), margin + 90, y + 4);
      doc.text(row.PC3 > 0 ? `+${row.PC3.toFixed(4)}` : row.PC3.toFixed(4), margin + 122, y + 4);
      doc.text(row.PC4 > 0 ? `+${row.PC4.toFixed(4)}` : row.PC4.toFixed(4), margin + 154, y + 4);
      doc.setDrawColor(220, 225, 235);
      doc.line(margin, y + 6, margin + contentWidth, y + 6);
      y += 6.5;
    });

    if (y > 220) {
      doc.addPage();
      y = 15;
    } else {
      y += 6;
    }

    // SECTION 5: GROUP 4 CLUSTER PROFILES (No Text Overshooting / Overlap)
    doc.setTextColor(...textBlack);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('5. GROUP 4: K-MEANS CLUSTER PROFILES (K = 2)', margin, y);
    y += 5;

    doc.setFillColor(...darkHeaderBg);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...lightBlueHeader);
    doc.text('Cluster ID & Profile', margin + 3, y + 4);
    doc.text('Count (%)', margin + 74, y + 4);
    doc.text('Mean (kWh)', margin + 104, y + 4);
    doc.text('Peak Demand', margin + 134, y + 4);
    doc.text('Peak-to-Avg', margin + 162, y + 4);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    cluster_profiles.forEach(cp => {
      const seg = segments.find(s => s.id === cp.cluster);
      const profileName = `Cluster ${cp.cluster}: ${seg?.name || 'Segment'}`;
      
      doc.setTextColor(...textBlack);
      doc.text(profileName, margin + 3, y + 4);
      doc.text(`${seg?.count} (${seg?.pct}%)`, margin + 74, y + 4);
      doc.text(`${cp.mean_consumption} kWh`, margin + 104, y + 4);
      doc.text(`${cp.max_consumption} kWh`, margin + 134, y + 4);
      doc.text(`${cp.peak_to_average}`, margin + 162, y + 4);
      doc.setDrawColor(220, 225, 235);
      doc.line(margin, y + 6, margin + contentWidth, y + 6);
      y += 7;
    });

    y += 6;

    // SECTION 6: GROUP 5 FINANCIAL ROI & TARGETED ACTION PLANS
    doc.setFillColor(...darkHeaderBg);
    doc.rect(margin, y, contentWidth, 28, 'F');
    doc.setDrawColor(...lightBlueHeader);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, 28, 'S');

    doc.setTextColor(...lightBlueHeader);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('6. GROUP 5: SIMULATED FINANCIAL SAVINGS & ROI ANALYSIS', margin + 6, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...textWhite);
    doc.text(`• Simulated Portfolio Usage: ${totalAnnualKWh.toLocaleString()} kWh/yr`, margin + 6, y + 15);
    doc.text(`• Electricity Tariff Rate: $${ratePerKWh.toFixed(2)} / kWh`, margin + 6, y + 21);

    doc.text(`• Total Annual Cost: $${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} / yr`, margin + 95, y + 15);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 211, 153);
    doc.text(`• Est. Annual Savings: $${estimatedTotalPortfolioSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} / yr (~16.6% reduction)`, margin + 95, y + 21);

    y += 34;

    // TARGETED ACTION PLAN CARDS
    doc.setTextColor(...textBlack);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TARGETED SIEMENS ENERGY OPTIMIZATION ACTION PLANS', margin, y);
    y += 6;

    segments.forEach(seg => {
      const profileText = `Profile: ${seg.description}`;
      const profileLines = doc.splitTextToSize(profileText, contentWidth - 12);

      const strategyText = `Siemens Action Plan: ${seg.strategy}`;
      const strategyLines = doc.splitTextToSize(strategyText, contentWidth - 12);

      const cardHeight = 12 + (profileLines.length * 3.8) + (strategyLines.length * 3.8) + 6;

      if (y + cardHeight > 275) {
        doc.addPage();
        y = 15;
      }

      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, contentWidth, cardHeight, 'F');
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.3);
      doc.rect(margin, y, contentWidth, cardHeight, 'S');

      // Left Accent Strip
      doc.setFillColor(seg.id === 0 ? 56 : 0, seg.id === 0 ? 189 : 229, seg.id === 0 ? 248 : 255);
      doc.rect(margin, y, 4, cardHeight, 'F');

      doc.setTextColor(...textBlack);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Cluster ${seg.id}: ${seg.name} (${seg.pct}% | ${seg.count.toLocaleString()} Facilities)`, margin + 8, y + 6);

      let textY = y + 11;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...textDarkGray);

      profileLines.forEach(line => {
        doc.text(line, margin + 8, textY);
        textY += 3.8;
      });

      textY += 1;

      strategyLines.forEach(line => {
        doc.text(line, margin + 8, textY);
        textY += 3.8;
      });

      textY += 2;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text(`Expected Energy Benefit: ${seg.savings_est}`, margin + 8, textY);

      y += cardHeight + 5;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 110, 120);
      doc.text(`Siemens Energy Consumer Analytics Report (Light Blue & Black Theme)  |  Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }

    doc.save('Siemens_Energy_Segmentation_Report.pdf');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(2, 132, 199, 0.12) 50%, rgba(8, 12, 20, 0.95) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.35)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-yellow">GROUP 5 DELIVERABLE</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Targeted Optimization Matrix</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
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
      <div className="glass-card" style={{ borderLeft: '4px solid #38BDF8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Calculator size={24} color="#38BDF8" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>Interactive Energy Savings & ROI Calculator</h3>
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
                <strong style={{ color: '#38BDF8' }}>{totalAnnualKWh.toLocaleString()} kWh</strong>
              </div>
              <input
                type="range"
                min="5000000"
                max="200000000"
                step="5000000"
                value={totalAnnualKWh}
                onChange={e => setTotalAnnualKWh(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#38BDF8' }}
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
                style={{ width: '100%', accentColor: '#38BDF8' }}
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
                  <option key={s.id} value={s.id} style={{ background: '#080C14' }}>
                    Cluster {s.id}: {s.name} ({s.pct}% of facilities)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Column */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>ESTIMATED ANNUAL IMPACT</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Portfolio Annual Energy Cost:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF', marginBottom: '0.75rem' }}>
                ${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} / year
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Targeted Savings for <strong>Cluster {currentSeg.id} ({currentSeg.name})</strong>:
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38BDF8', marginBottom: '0.5rem' }}>
                ${estimatedSegmentSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} / year
              </div>
            </div>

            <div style={{
              borderTop: '1px dashed rgba(56, 189, 248, 0.3)',
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
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Consumer Segments & Siemens Energy Optimization Strategies</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {segments.map(seg => (
            <div key={seg.id} className="glass-card" style={{ borderLeft: `5px solid ${seg.id === 0 ? '#38BDF8' : '#00E5FF'}` }}>
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
                      background: seg.id === 0 ? '#38BDF8' : '#00E5FF',
                      color: '#080C14',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      {seg.id}
                    </span>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>{seg.name}</h4>
                    <span className={seg.id === 0 ? 'badge badge-yellow' : 'badge badge-orange'}>
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
                  <div style={{ fontSize: '0.78rem', color: seg.id === 0 ? '#38BDF8' : '#00E5FF', fontWeight: 600 }}>
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

                <div style={{ background: 'rgba(56, 189, 248, 0.06)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <span style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Target size={14} /> Siemens Energy Targeted Action Plan
                  </span>
                  <p style={{ fontSize: '0.86rem', color: '#FFF', marginTop: '0.4rem', fontWeight: 500 }}>
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
