import React from 'react';
import { 
  Zap, 
  BarChart3, 
  Layers, 
  PieChart, 
  Target, 
  Database, 
  Cpu,
  Activity
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: Activity, badge: 'Summary' },
    { id: 'group1', label: 'G1: Data Prep', icon: Database, badge: 'G1' },
    { id: 'group2', label: 'G2: EDA & Features', icon: Layers, badge: 'G2' },
    { id: 'group3', label: 'G3: PCA Studio', icon: Cpu, badge: 'G3' },
    { id: 'group4', label: 'G4: K-Means & Eval', icon: PieChart, badge: 'G4' },
    { id: 'group5', label: 'G5: Strategy & ROI', icon: Target, badge: 'G5' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 12, 20, 0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
      padding: '0.85rem 1.75rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)'
          }}>
            <Zap size={24} color="#080C14" strokeWidth={2.8} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
                SIEMENS <span style={{ color: 'var(--light-blue)' }}>ENERGY</span>
              </h1>
              <span className="badge badge-yellow">PCA & K-MEANS AI</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Consumer Consumption Segmentation & Targeted Optimization Analytics
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0.25) 100%)' : 'transparent',
                  color: isActive ? '#38BDF8' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 12px rgba(56, 189, 248, 0.3)' : 'none'
                }}
              >
                <Icon size={16} color={isActive ? '#38BDF8' : 'currentColor'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
