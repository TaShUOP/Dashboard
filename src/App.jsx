import React, { useState } from 'react';
import Navbar from './components/Navbar';
import OverviewTab from './components/OverviewTab';
import Group1DataPrep from './components/Group1DataPrep';
import Group2EDA from './components/Group2EDA';
import Group3PCA from './components/Group3PCA';
import Group4KMeans from './components/Group4KMeans';
import Group5Optimization from './components/Group5Optimization';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab setActiveTab={setActiveTab} />;
      case 'group1':
        return <Group1DataPrep />;
      case 'group2':
        return <Group2EDA />;
      case 'group3':
        return <Group3PCA />;
      case 'group4':
        return <Group4KMeans />;
      case 'group5':
        return <Group5Optimization />;
      default:
        return <OverviewTab setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{
        flex: 1,
        maxWidth: '1600px',
        width: '100%',
        margin: '0 auto',
        padding: '1.75rem 1.75rem 3rem 1.75rem'
      }}>
        {renderActiveTab()}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.25rem 1.75rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        background: 'rgba(9, 13, 22, 0.95)'
      }}>
        Siemens Energy Consumer Analytics Dashboard — Built with PCA & K-Means Unsupervised Learning (Groups 1–5 Complete)
      </footer>
    </div>
  );
}
