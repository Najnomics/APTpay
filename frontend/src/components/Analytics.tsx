import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Button, 
  Space, 
  Table,
  Tag,
  DatePicker,
  Select,
  Progress,
  Tooltip,
  Badge,
  Divider
} from 'antd';
import { 
  BarChartOutlined,
  DollarOutlined, 
  TeamOutlined, 
  GlobalOutlined, 
  DownloadOutlined,
  FilterOutlined,
  RiseOutlined,
  FallOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  FileExcelOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAPTpayData } from '../hooks/useAPTpayData';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Analytics: React.FC = () => {
  const { treasuryBalance, employeeCount, totalProcessed } = useAPTpayData();
  const [timeframe, setTimeframe] = useState('30d');
  const [region, setRegion] = useState('all');
  
  // Enhanced analytics data
  const performanceMetrics = [
    { metric: 'Processing Speed', value: 2.3, unit: 'minutes', change: -15.2, benchmark: 4.1 },
    { metric: 'Success Rate', value: 99.97, unit: '%', change: 0.12, benchmark: 99.2 },
    { metric: 'Cost Efficiency', value: 89, unit: '%', change: 12.5, benchmark: 76 },
    { metric: 'Settlement Time', value: 47, unit: 'seconds', change: -22.1, benchmark: 72 }
  ];

  // Revenue breakdown data
  const revenueData = [
    { month: 'Jul', processing: 18000, fx: 4200, treasury: 2800, total: 25000 },
    { month: 'Aug', processing: 22000, fx: 5100, treasury: 3200, total: 30300 },
    { month: 'Sep', processing: 28000, fx: 6800, treasury: 4100, total: 38900 },
    { month: 'Oct', processing: 34000, fx: 8200, treasury: 5300, total: 47500 },
    { month: 'Nov', processing: 42000, fx: 9900, treasury: 6500, total: 58400 },
    { month: 'Dec', processing: 51000, fx: 12100, treasury: 7800, total: 70900 }
  ];

  // Geographic performance data
  const geoPerformance = [
    { region: 'North America', volume: 2100000, transactions: 4200, avgFee: 0.64, growth: 28.5 },
    { region: 'Europe', volume: 1680000, transactions: 3360, avgFee: 0.72, growth: 32.1 },
    { region: 'Asia Pacific', volume: 980000, transactions: 1960, avgFee: 0.58, growth: 45.2 },
    { region: 'Latin America', volume: 420000, transactions: 840, avgFee: 0.68, growth: 52.3 }
  ];

  // Risk and compliance metrics
  const complianceMetrics = [
    { metric: 'AML Screening', score: 98.5, status: 'excellent' },
    { metric: 'KYC Completion', score: 96.2, status: 'excellent' },
    { metric: 'Fraud Detection', score: 99.1, status: 'excellent' },
    { metric: 'Regulatory Compliance', score: 94.8, status: 'good' }
  ];

  // Transaction flow analysis
  const flowData = [
    { step: 'Initiation', success: 100, failed: 0.0, pending: 0.0 },
    { step: 'Validation', success: 99.8, failed: 0.2, pending: 0.0 },
    { step: 'Processing', success: 99.6, failed: 0.1, pending: 0.3 },
    { step: 'Settlement', success: 99.4, failed: 0.1, pending: 0.5 },
    { step: 'Completion', success: 99.3, failed: 0.1, pending: 0.6 }
  ];

  const geoColumns = [
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume: number) => <Text>${(volume / 1000000).toFixed(1)}M</Text>
    },
    {
      title: 'Transactions',
      dataIndex: 'transactions',
      key: 'transactions',
      render: (count: number) => <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
    },
    {
      title: 'Avg Fee',
      dataIndex: 'avgFee',
      key: 'avgFee',
      render: (fee: number) => <Text>{fee}%</Text>
    },
    {
      title: 'Growth',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth: number) => (
        <span style={{ color: growth > 0 ? '#52c41a' : '#ff4d4f' }}>
          {growth > 0 ? <RiseOutlined /> : <FallOutlined />} {growth}%
        </span>
      )
    }
  ];

  const exportReport = (format: string) => {
    console.log(`Exporting analytics report in ${format} format`);
    // Implementation for export functionality
  };

  return (
    <div className="slide-up">
      {/* Header with controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        padding: '24px 0',
        borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <Title level={2} style={{ margin: 0, color: 'var(--text-primary)' }}>
            Advanced Analytics
          </Title>
          <Text type="secondary">Comprehensive performance insights and business intelligence</Text>
        </div>
        
        <Space size="large">
          <Space>
            <CalendarOutlined />
            <RangePicker />
          </Space>
          <Select 
            value={region} 
            onChange={setRegion}
            style={{ width: 140 }}
            prefix={<GlobalOutlined />}
          >
            <Option value="all">All Regions</Option>
            <Option value="na">North America</Option>
            <Option value="eu">Europe</Option>
            <Option value="apac">Asia Pacific</Option>
            <Option value="latam">Latin America</Option>
          </Select>
          <Button.Group>
            <Button 
              icon={<FileExcelOutlined />}
              onClick={() => exportReport('excel')}
            >
              Excel
            </Button>
            <Button 
              icon={<FilePdfOutlined />}
              onClick={() => exportReport('pdf')}
            >
              PDF
            </Button>
          </Button.Group>
        </Space>
      </div>

      {/* Key Performance Indicators */}
      <div className="metrics-grid" style={{ marginBottom: '32px' }}>
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">
                <BarChartOutlined />
              </div>
              <Tooltip title={`Benchmark: ${metric.benchmark} ${metric.unit}`}>
                <InfoCircleOutlined style={{ color: 'var(--text-secondary)' }} />
              </Tooltip>
            </div>
            <div className="metric-value">{metric.value}{metric.unit}</div>
            <div className="metric-label">{metric.metric}</div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '8px'
            }}>
              <span style={{ 
                color: metric.change > 0 ? 'var(--success)' : 'var(--error)',
                fontSize: '12px',
                fontWeight: 600
              }}>
                {metric.change > 0 ? <RiseOutlined /> : <FallOutlined />} {Math.abs(metric.change)}%
              </span>
              <Progress 
                percent={Math.min(100, (metric.value / metric.benchmark) * 100)}
                size="small"
                showInfo={false}
                strokeColor={metric.value > metric.benchmark ? '#52c41a' : '#faad14'}
              />
            </div>
          </div>
        ))}
      </div>

      <Row gutter={[24, 24]}>
        {/* Revenue Analysis */}
        <Col xs={24} lg={16}>
          <Card className="professional-card" title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarOutlined style={{ color: 'var(--primary)' }} />
              <span>Revenue Breakdown</span>
              <Tag color="green">+87% YTD</Tag>
            </div>
          }>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorProcessing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFX" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#764ba2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTreasury" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f093fb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f093fb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <RechartsTooltip 
                  contentStyle={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="processing" 
                  stackId="1"
                  stroke="#667eea" 
                  fill="url(#colorProcessing)"
                  name="Processing Fees"
                />
                <Area 
                  type="monotone" 
                  dataKey="fx" 
                  stackId="1"
                  stroke="#764ba2" 
                  fill="url(#colorFX)"
                  name="FX Spread"
                />
                <Area 
                  type="monotone" 
                  dataKey="treasury" 
                  stackId="1"
                  stroke="#f093fb" 
                  fill="url(#colorTreasury)"
                  name="Treasury Yield"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Compliance Dashboard */}
        <Col xs={24} lg={8}>
          <Card className="professional-card" title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <InfoCircleOutlined style={{ color: 'var(--success)' }} />
              <span>Compliance Score</span>
            </div>
          }>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {complianceMetrics.map((metric, index) => (
                <div key={index}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px' 
                  }}>
                    <Text strong>{metric.metric}</Text>
                    <Text style={{ color: 'var(--success)' }}>{metric.score}%</Text>
                  </div>
                  <Progress 
                    percent={metric.score} 
                    size="small"
                    strokeColor={
                      metric.status === 'excellent' ? '#52c41a' : 
                      metric.status === 'good' ? '#faad14' : '#ff4d4f'
                    }
                  />
                </div>
              ))}
              
              <Divider style={{ margin: '16px 0' }} />
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  color: 'var(--success)',
                  marginBottom: '8px'
                }}>
                  97.2%
                </div>
                <Text type="secondary">Overall Compliance Score</Text>
                <div style={{ marginTop: '12px' }}>
                  <Badge status="success" text="All systems compliant" />
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {/* Geographic Performance */}
        <Col xs={24} lg={14}>
          <Card 
            className="professional-card" 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GlobalOutlined style={{ color: 'var(--primary)' }} />
                <span>Regional Performance</span>
              </div>
            }
          >
            <Table 
              columns={geoColumns}
              dataSource={geoPerformance}
              pagination={false}
              size="middle"
              className="professional-table"
            />
          </Card>
        </Col>

        {/* Transaction Flow */}
        <Col xs={24} lg={10}>
          <Card className="professional-card" title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiseOutlined style={{ color: 'var(--warning)' }} />
              <span>Transaction Flow</span>
            </div>
          }>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={flowData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="step" type="category" stroke="var(--text-secondary)" />
                <RechartsTooltip 
                  contentStyle={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }} 
                />
                <Bar dataKey="success" fill="#52c41a" name="Success" />
                <Bar dataKey="failed" fill="#ff4d4f" name="Failed" />
                <Bar dataKey="pending" fill="#faad14" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Business Intelligence Summary */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card className="professional-card" title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChartOutlined style={{ color: 'var(--primary)' }} />
              <span>Business Intelligence Summary</span>
            </div>
          }>
            <Row gutter={[32, 32]}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Monthly Recurring Revenue"
                  value={totalProcessed * 0.0064}
                  precision={0}
                  valueStyle={{ color: 'var(--success)', fontSize: '28px', fontWeight: 700 }}
                  prefix={<DollarOutlined />}
                  suffix="USD"
                />
                <Text type="secondary">↗️ 34% vs last month</Text>
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Customer Lifetime Value"
                  value={48500}
                  precision={0}
                  valueStyle={{ color: 'var(--primary)', fontSize: '28px', fontWeight: 700 }}
                  prefix={<TeamOutlined />}
                  suffix="USD"
                />
                <Text type="secondary">Based on {employeeCount} active employees</Text>
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Market Penetration"
                  value={23}
                  precision={0}
                  valueStyle={{ color: 'var(--warning)', fontSize: '28px', fontWeight: 700 }}
                  prefix={<GlobalOutlined />}
                  suffix="countries"
                />
                <Text type="secondary">Expanding to 5 new markets Q1</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;