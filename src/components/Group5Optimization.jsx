import React, { useState } from 'react';
import { Target, Zap, DollarSign, Calculator, ArrowRight, ShieldCheck, Download, Award, CheckCircle2, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';
import dashboardData from '../data/dashboard_data.json';

export default function Group5Optimization() {
  const { segments, metrics, raw_vs_cleaned, pca_loadings, cluster_profiles, consumer_type_counts } = dashboardData;

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

  // Export Comprehensive PDF Report incorporating ALL Modules & Elements
  const exportReport = () => {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 14;
    const contentWidth = pageWidth - margin * 2; // 182mm

    // Color Palette
    const fuchsiaPink = [255, 0, 127];
    const fuchsiaDeep = [196, 0, 98];
    const fuchsiaLight = [255, 230, 242];
    const darkText = [15, 23, 42];
    const grayText = [71, 85, 105];
    const lightBg = [248, 250, 252];
    const cardBg = [255, 255, 255];

    let y = 0;

    const drawHeader = () => {
      doc.setFillColor(...fuchsiaPink);
      doc.rect(0, 0, pageWidth, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('SIEMENS ENERGY — CONSUMER SEGMENTATION COMPREHENSIVE REPORT', margin, 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleDateString()} | BDG2 Siemens Energy Portfolio (1,488 Cleaned Consumers)`, margin, 19);
      y = 30;
    };

    drawHeader();

    // SECTION 1: EXECUTIVE OVERVIEW & KPIS
    doc.setFillColor(...fuchsiaLight);
    doc.rect(margin, y, contentWidth, 34, 'F');
    doc.setDrawColor(...fuchsiaPink);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, 34, 'S');

    doc.setTextColor(...fuchsiaDeep);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('1. EXECUTIVE KPIS & MODEL EVALUATION METRICS', margin + 6, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkText);
    doc.text(`• Total Consumers Analyzed: ${metrics.total_consumers.toLocaleString()}`, margin + 6, y + 15);
    doc.text(`• PCA Cumulative Variance: ${metrics.cumulative_explained_var}% (4 PCs)`, margin + 6, y + 21);
    doc.text(`• Optimal Clusters (K): ${metrics.optimal_k}`, margin + 6, y + 27);

    doc.text(`• Silhouette Score: ${metrics.silhouette_score} (Peak Separation)`, margin + 95, y + 15);
    doc.text(`• Davies-Bouldin Index: ${metrics.davies_bouldin} (Compactness)`, margin + 95, y + 21);
    doc.text(`• Calinski-Harabasz Index: ${metrics.calinski_harabasz.toLocaleString()}`, margin + 95, y + 27);

    y += 40;

    // SECTION 2: GROUP 1 DATA AUDIT TABLE
    doc.setTextColor(...darkText);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('2. GROUP 1: DATA CLEANING & DOMAIN AUDIT', margin, y);
    y += 5;

    doc.setFillColor(240, 243, 248);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...fuchsiaDeep);
    doc.text('Domain', margin + 3, y + 4);
    doc.text('Raw Dim', margin + 35, y + 4);
    doc.text('Cleaned Dim', margin + 65, y + 4);
    doc.text('Raw Missing', margin + 95, y + 4);
    doc.text('Cleaned Missing', margin + 128, y + 4);
    doc.text('Outliers Treated', margin + 158, y + 4);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...darkText);

    raw_vs_cleaned.forEach(r => {
      doc.text(r.dataset, margin + 3, y + 4);
      doc.text(r.raw_dim, margin + 35, y + 4);
      doc.text(r.cleaned_dim, margin + 65, y + 4);
      doc.text(r.raw_missing.toLocaleString(), margin + 95, y + 4);
      doc.text(r.cleaned_missing.toLocaleString(), margin + 128, y + 4);
      doc.text(r.outliers.toLocaleString(), margin + 158, y + 4);
      doc.setDrawColor(230, 235, 242);
      doc.line(margin, y + 6, margin + contentWidth, y + 6);
      y += 7;
    });

    y += 6;

    // SECTION 3: GROUP 2 BUILDING SECTOR BREAKDOWN
    doc.setTextColor(...darkText);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('3. GROUP 2: BUILDING SECTOR DISTRIBUTION', margin, y);
    y += 5;

    const sectorSummary = `Education (573), Office (287), Public Assembly (187), Public Services (158), Lodging (148), Healthcare (25), Parking (22), Storage/Warehouse (13), Industrial (11), Retail (11), Services (9), Food (6), Science (5), Utility (4), Religion (3). Total: 1,488 Facilities.`;
    const sectorWrapped = doc.splitTextToSize(sectorSummary, contentWidth - 8);
    
    doc.setFillColor(250, 250, 252);
    doc.rect(margin, y, contentWidth, 6 + (sectorWrapped.length * 4), 'F');
    doc.setDrawColor(220, 225, 235);
    doc.rect(margin, y, contentWidth, 6 + (sectorWrapped.length * 4), 'S');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...darkText);
    doc.text(sectorWrapped, margin + 4, y + 5);

    y += 12 + (sectorWrapped.length * 4);

    // SECTION 4: GROUP 3 PCA LOADINGS SUMMARY
    doc.setTextColor(...darkText);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('4. GROUP 3: PRINCIPAL COMPONENT ANALYSIS (80.40% CUMULATIVE VARIANCE)', margin, y);
    y += 5;

    doc.setFillColor(240, 243, 248);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...fuchsiaDeep);
    doc.text('Feature Variable', margin + 3, y + 4);
    doc.text('PC1 (41.3%)', margin + 60, y + 4);
    doc.text('PC2 (18.6%)', margin + 95, y + 4);
    doc.text('PC3 (12.4%)', margin + 128, y + 4);
    doc.text('PC4 (8.2%)', margin + 158, y + 4);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    pca_loadings.slice(0, 7).forEach(row => {
      doc.text(row.feature, margin + 3, y + 4);
      doc.text(row.PC1 > 0 ? `+${row.PC1.toFixed(4)}` : row.PC1.toFixed(4), margin + 60, y + 4);
      doc.text(row.PC2 > 0 ? `+${row.PC2.toFixed(4)}` : row.PC2.toFixed(4), margin + 95, y + 4);
      doc.text(row.PC3 > 0 ? `+${row.PC3.toFixed(4)}` : row.PC3.toFixed(4), margin + 128, y + 4);
      doc.text(row.PC4 > 0 ? `+${row.PC4.toFixed(4)}` : row.PC4.toFixed(4), margin + 158, y + 4);
      doc.setDrawColor(230, 235, 242);
      doc.line(margin, y + 6, margin + contentWidth, y + 6);
      y += 6.5;
    });

    // Check page break for Section 5 & 6
    if (y > 220) {
      doc.addPage();
      y = 15;
    } else {
      y += 6;
    }

    // SECTION 5: GROUP 4 CLUSTER PROFILES
    doc.setTextColor(...darkText);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('5. GROUP 4: K-MEANS CLUSTER PROFILES (K = 2)', margin, y);
    y += 5;

    doc.setFillColor(240, 243, 248);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...fuchsiaDeep);
    doc.text('Cluster ID & Profile', margin + 3, y + 4);
    doc.text('Count (%)', margin + 65, y + 4);
    doc.text('Mean (kWh)', margin + 95, y + 4);
    doc.text('Peak Demand', margin + 125, y + 4);
    doc.text('Peak-to-Avg', margin + 155, y + 4);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...darkText);

    cluster_profiles.forEach(cp => {
      const seg = segments.find(s => s.id === cp.cluster);
      doc.text(`Cluster ${cp.cluster}: ${seg?.name || 'Segment'}`, margin + 3, y + 4);
      doc.text(`${seg?.count} (${seg?.pct}%)`, margin + 65, y + 4);
      doc.text(`${cp.mean_consumption} kWh`, margin + 95, y + 4);
      doc.text(`${cp.max_consumption} kWh`, margin + 125, y + 4);
      doc.text(`${cp.peak_to_average}`, margin + 155, y + 4);
      doc.setDrawColor(230, 235, 242);
      doc.line(margin, y + 6, margin + contentWidth, y + 6);
      y += 7;
    });

    y += 6;

    // SECTION 6: GROUP 5 FINANCIAL ROI & TARGETED ACTION PLANS
    doc.setFillColor(...fuchsiaLight);
    doc.rect(margin, y, contentWidth, 28, 'F');
    doc.setDrawColor(...fuchsiaPink);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, 28, 'S');

    doc.setTextColor(...fuchsiaDeep);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('6. GROUP 5: SIMULATED FINANCIAL SAVINGS & ROI ANALYSIS', margin + 6, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkText);
    doc.text(`• Simulated Portfolio Usage: ${totalAnnualKWh.toLocaleString()} kWh/yr`, margin + 6, y + 15);
    doc.text(`• Electricity Tariff Rate: $${ratePerKWh.toFixed(2)} / kWh`, margin + 6, y + 21);

    doc.text(`• Total Annual Cost: $${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} / yr`, margin + 95, y + 15);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(`• Est. Annual Savings: $${estimatedTotalPortfolioSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} / yr (~16.6% reduction)`, margin + 95, y + 21);

    y += 34;

    // TARGETED ACTION PLAN CARDS FOR CLUSTER 0 & CLUSTER 1
    doc.setTextColor(...darkText);
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
      doc.setFillColor(...fuchsiaPink);
      doc.rect(margin, y, 4, cardHeight, 'F');

      doc.setTextColor(...darkText);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Cluster ${seg.id}: ${seg.name} (${seg.pct}% | ${seg.count.toLocaleString()} Facilities)`, margin + 8, y + 6);

      let textY = y + 11;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...grayText);

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
      doc.setTextColor(...fuchsiaDeep);
      doc.text(`Expected Energy Benefit: ${seg.savings_est}`, margin + 8, textY);

      y += cardHeight + 5;
    });

    // Footers across all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(140, 145, 155);
      doc.text(`Siemens Energy Consumer Analytics Report (Groups 1–5 Complete)  |  Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }

    doc.save('Siemens_Energy_Segmentation_Comprehensive_Report.pdf');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, #FFE6F2 0%, #FFF0F6 50%, #FFFFFF 100%)',
        border: '1px solid rgba(255, 0, 127, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-fuchsia">GROUP 5 DELIVERABLE</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Targeted Optimization Matrix</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
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
      <div className="glass-card" style={{ borderLeft: '4px solid var(--fuchsia-pink)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Calculator size={24} color="var(--fuchsia-pink)" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>Interactive Energy Savings & ROI Calculator</h3>
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
                <strong style={{ color: 'var(--fuchsia-pink)' }}>{totalAnnualKWh.toLocaleString()} kWh</strong>
              </div>
              <input
                type="range"
                min="5000000"
                max="200000000"
                step="5000000"
                value={totalAnnualKWh}
                onChange={e => setTotalAnnualKWh(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--fuchsia-pink)' }}
              />
            </div>

            {/* Input 2: Electricity Tariff Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Average Electricity Tariff ($ / kWh):</span>
                <strong style={{ color: '#059669' }}>${ratePerKWh.toFixed(2)} / kWh</strong>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.45"
                step="0.01"
                value={ratePerKWh}
                onChange={e => setRatePerKWh(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--fuchsia-pink)' }}
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
                  background: '#F8FAFC',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem',
                  color: '#0F172A',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                {segments.map(s => (
                  <option key={s.id} value={s.id}>
                    Cluster {s.id}: {s.name} ({s.pct}% of facilities)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Column */}
          <div style={{
            background: 'var(--fuchsia-light)',
            border: '1px solid rgba(255, 0, 127, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span className="badge badge-fuchsia" style={{ marginBottom: '0.75rem' }}>ESTIMATED ANNUAL IMPACT</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Portfolio Annual Energy Cost:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                ${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} / year
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Targeted Savings for <strong>Cluster {currentSeg.id} ({currentSeg.name})</strong>:
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fuchsia-pink)', marginBottom: '0.5rem' }}>
                ${estimatedSegmentSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} / year
              </div>
            </div>

            <div style={{
              borderTop: '1px dashed rgba(255, 0, 127, 0.3)',
              paddingTop: '0.75rem',
              marginTop: '0.75rem',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estimated Entire Portfolio Savings:</span>
              <strong style={{ fontSize: '1.15rem', color: '#059669' }}>
                ${estimatedTotalPortfolioSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} / yr
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Consumer Profile Cards & Targeted Strategies */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Consumer Segments & Siemens Energy Optimization Strategies</h3>

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
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      {seg.id}
                    </span>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{seg.name}</h4>
                    <span className="badge badge-fuchsia">
                      {seg.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    {seg.description}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    {seg.count.toLocaleString()} Facilities ({seg.pct}%)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--fuchsia-pink)', fontWeight: 600 }}>
                    Expected Impact: {seg.savings_est}
                  </div>
                </div>
              </div>

              {/* Characteristics & Targeted Strategy */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1rem' }}>
                <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Key Operational Indicators
                  </span>
                  <ul style={{ paddingLeft: '1.1rem', marginTop: '0.4rem', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    {seg.characteristics.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>

                <div style={{ background: 'var(--fuchsia-light)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 0, 127, 0.2)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--fuchsia-deep)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Target size={14} /> Siemens Energy Targeted Action Plan
                  </span>
                  <p style={{ fontSize: '0.86rem', color: '#0F172A', marginTop: '0.4rem', fontWeight: 500 }}>
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
