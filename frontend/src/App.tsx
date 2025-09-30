import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Button, Space, Typography, Card, Row, Col, Statistic, Progress } from 'antd';
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
  MenuOutlined
} from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import PayrollManager from './components/PayrollManager';
import TreasuryOverview from './components/TreasuryOverview';
import ForexModule from './components/ForexModule';
import Settings from './components/Settings';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'payroll',
      icon: <TeamOutlined />,
      label: 'Payroll Manager',
    },
    {
      key: 'treasury',
      icon: <BankOutlined />,
      label: 'Treasury Overview',
    },
    {
      key: 'forex',
      icon: <SwapOutlined />,
      label: 'Forex Module',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
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
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            borderBottom: '1px solid #e1e5e9'
          }}>
            <ThunderboltOutlined style={{ 
              fontSize: '2rem', 
              color: '#667eea',
              marginBottom: '10px'
            }} />
            {!collapsed && (
              <Title level={4} style={{ margin: 0, color: '#667eea' }}>
                APTpay
              </Title>
            )}
          </div>
          
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems.map(item => ({
              ...item,
              onClick: () => setSelectedKey(item.key)
            }))}
            style={{ 
              border: 'none',
              background: 'transparent'
            }}
          />
        </Sider>
        
        <Layout>
          <Header style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '0 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <Button
              type="text"
              icon={collapsed ? <MenuOutlined /> : <MenuOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            
            <Space size="large">
              <Button 
                type="primary" 
                icon={<WalletOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '25px',
                  height: '40px',
                  padding: '0 20px'
                }}
              >
                Connect Wallet
              </Button>
            </Space>
          </Header>
          
          <Content style={{ 
            margin: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            minHeight: 'calc(100vh - 120px)'
          }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
