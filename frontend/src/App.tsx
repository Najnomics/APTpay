import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Button, Space, Typography, Card, Row, Col, Statistic, Progress, Badge, Avatar, Dropdown } from 'antd';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  BankOutlined, 
  SwapOutlined, 
  SettingOutlined,
  WalletOutlined,
  DollarOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  MenuOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  CrownOutlined,
  SafetyOutlined,
  RocketOutlined,
  RiseOutlined
} from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import PayrollManager from './components/PayrollManager';
import TreasuryOverview from './components/TreasuryOverview';
import ForexModule from './components/ForexModule';
import Analytics from './components/Analytics';
import LandingPage from './components/LandingPage';
import NotificationCenter from './components/NotificationCenter';
import WalletConnectModal from './components/WalletConnectModal';
import Settings from './components/Settings';
import { walletService, WalletState } from './services/walletService';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [walletState, setWalletState] = useState<WalletState | null>(null);
  const [showLanding, setShowLanding] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [walletModalVisible, setWalletModalVisible] = useState(false);

  // Professional navigation structure
  const menuSections = [
    {
      title: 'Core Platform',
      items: [
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: 'Dashboard',
        },
        {
          key: 'payroll',
          icon: <TeamOutlined />,
          label: 'Payroll Engine',
        },
        {
          key: 'treasury',
          icon: <BankOutlined />,
          label: 'Treasury Management',
        },
        {
          key: 'forex',
          icon: <SwapOutlined />,
          label: 'FX Trading',
        },
      ]
    },
    {
      title: 'Business Intelligence',
      items: [
        {
          key: 'analytics',
          icon: <RiseOutlined />,
          label: 'Advanced Analytics',
        },
      ]
    },
    {
      title: 'Operations',
      items: [
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'System Config',
        },
      ]
    }
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
    },
    {
      key: 'security',
      icon: <SafetyOutlined />,
      label: 'Security',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'payroll':
        return <PayrollManager />;
      case 'treasury':
        return <TreasuryOverview />;
      case 'forex':
        return <ForexModule />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const handleWalletConnect = () => {
    setWalletModalVisible(true);
  };

  const handleWalletConnected = (state: WalletState) => {
    setWalletState(state);
    setWalletModalVisible(false);
  };

  const handleWalletDisconnect = () => {
    setWalletState(null);
  };

  return (
    <div className="App">
      {showLanding ? (
        <LandingPage />
      ) : (
      <Layout>
        {/* Professional Sidebar */}
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          width={256}
          className="professional-sidebar"
        >
          {/* Logo Section */}
          <div style={{ 
            padding: '32px 24px 24px', 
            borderBottom: '1px solid var(--border)',
            textAlign: collapsed ? 'center' : 'left'
          }}>
            <div className="logo-section">
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: collapsed ? '0' : '12px'
              }}>
                <RocketOutlined style={{ fontSize: '20px', color: 'white' }} />
              </div>
              {!collapsed && (
                <div>
                  <div className="logo">APTpay</div>
                  <div className="tagline">Enterprise Payroll Infrastructure</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div style={{ padding: '24px 0' }}>
            {menuSections.map((section, index) => (
              <div key={index} className="nav-section">
                {!collapsed && (
                  <div className="nav-section-title">{section.title}</div>
                )}
                <Menu
                  mode="inline"
                  selectedKeys={[selectedKey]}
                  theme="dark"
                  items={section.items.map(item => ({
                    ...item,
                    onClick: () => setSelectedKey(item.key)
                  }))}
                />
              </div>
            ))}
          </div>
        </Sider>
        
        <Layout>
          {/* Professional Header */}
          <div className="header-container">
            <div className="logo-section">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ 
                  color: 'var(--text-secondary)',
                  marginRight: '16px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px'
                }}
              />
              <div className="company-info">
                <Text strong style={{ color: 'var(--text-primary)', fontSize: '18px' }}>
                  Production Dashboard
                </Text>
                <div className="tagline">
                  Cross-border payroll • $2.4M+ processed
                </div>
              </div>
            </div>
            
            <div className="header-actions">
              {/* System Status */}
              <div className="wallet-status">
                <div className="status-dot"></div>
                <span>All Systems Operational</span>
              </div>
              
              {/* Landing Page Toggle */}
              <Button
                onClick={() => setShowLanding(!showLanding)}
                className="professional-button secondary"
                style={{ height: '40px' }}
              >
                {showLanding ? 'Dashboard' : 'Landing'}
              </Button>

              {/* Notifications */}
              <Badge count={3} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  onClick={() => setNotificationVisible(true)}
                  style={{
                    color: 'var(--text-secondary)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px'
                  }}
                />
              </Badge>

              {/* Wallet Connection */}
              <Button 
                type={walletState?.connected ? "default" : "primary"}
                icon={<WalletOutlined />}
                onClick={handleWalletConnect}
                className={walletState?.connected ? "professional-button secondary" : "professional-button"}
                style={{ height: '44px' }}
              >
                {walletState?.connected 
                  ? `${walletService.formatAddress(walletState.address || '')}` 
                  : 'Connect Wallet'
                }
              </Button>

              {/* User Menu */}
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Avatar 
                  size={40}
                  style={{ 
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    cursor: 'pointer'
                  }}
                >
                  <UserOutlined />
                </Avatar>
              </Dropdown>
            </div>
          </div>
          
          {/* Main Content Area */}
          <Content>
            <div className="content-container fade-in">
              <div className="page-header">
                <Title className="page-title">
                  {menuSections
                    .flatMap(section => section.items)
                    .find(item => item.key === selectedKey)?.label || 'Dashboard'}
                </Title>
                <Text className="page-subtitle">
                  Real-time cross-border payroll management powered by Aptos blockchain
                </Text>
              </div>
              
              {renderContent()}
            </div>
          </Content>
        </Layout>
      </Layout>
      )}
      
      {/* Notification Center */}
      <NotificationCenter 
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
      
      {/* Wallet Connect Modal */}
      <WalletConnectModal
        visible={walletModalVisible}
        onClose={() => setWalletModalVisible(false)}
        onWalletConnected={handleWalletConnected}
      />
    </div>
  );
}

export default App;