import React, { useState } from 'react';
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
  Select,
  Input,
  Alert,
  Progress,
  Timeline
} from 'antd';
import { 
  SwapOutlined, 
  GlobalOutlined, 
  RiseOutlined,
  ThunderboltOutlined,
  PercentageOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;
const { Option } = Select;

interface CurrencyPair {
  id: number;
  base: string;
  quote: string;
  rate: number;
  change24h: number;
  volume24h: number;
  dex: string;
  liquidity: number;
}

interface SwapTransaction {
  id: number;
  from: string;
  to: string;
  amount: number;
  rate: number;
  dex: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  gasUsed: number;
}

const ForexModule: React.FC = () => {
  const [currencyPairs] = useState<CurrencyPair[]>([
    {
      id: 1,
      base: 'USDC',
      quote: 'EURc',
      rate: 0.918,
      change24h: 0.25,
      volume24h: 1250000,
      dex: 'Tapp',
      liquidity: 850000
    },
    {
      id: 2,
      base: 'USDC',
      quote: 'GBPc',
      rate: 0.785,
      change24h: -0.15,
      volume24h: 890000,
      dex: 'Hyperion',
      liquidity: 620000
    },
    {
      id: 3,
      base: 'USDC',
      quote: 'JPYc',
      rate: 148.5,
      change24h: 0.45,
      volume24h: 2100000,
      dex: 'Merkle Trade',
      liquidity: 1200000
    }
  ]);

  const [recentSwaps] = useState<SwapTransaction[]>([
    {
      id: 1,
      from: 'USDC',
      to: 'EURc',
      amount: 5000,
      rate: 0.918,
      dex: 'Tapp',
      status: 'completed',
      timestamp: '2024-01-15 10:30:15',
      gasUsed: 0.002
    },
    {
      id: 2,
      from: 'USDC',
      to: 'GBPc',
      amount: 4500,
      rate: 0.785,
      dex: 'Hyperion',
      status: 'completed',
      timestamp: '2024-01-15 10:32:22',
      gasUsed: 0.001
    },
    {
      id: 3,
      from: 'USDC',
      to: 'JPYc',
      amount: 10000,
      rate: 148.5,
      dex: 'Merkle Trade',
      status: 'pending',
      timestamp: '2024-01-15 10:35:08',
      gasUsed: 0.003
    }
  ]);

  const rateHistory = [
    { time: '09:00', USDC_EURc: 0.915, USDC_GBPc: 0.787, USDC_JPYc: 148.2 },
    { time: '10:00', USDC_EURc: 0.917, USDC_GBPc: 0.786, USDC_JPYc: 148.3 },
    { time: '11:00', USDC_EURc: 0.918, USDC_GBPc: 0.785, USDC_JPYc: 148.5 },
    { time: '12:00', USDC_EURc: 0.919, USDC_GBPc: 0.784, USDC_JPYc: 148.7 }
  ];

  const currencyColumns = [
    {
      title: 'Pair',
      dataIndex: 'base',
      key: 'pair',
      render: (base: string, record: CurrencyPair) => (
        <div>
          <Text strong>{base}/{record.quote}</Text>
          <br />
          <Tag color="blue">{record.dex}</Tag>
        </div>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number, record: CurrencyPair) => (
        <div>
          <Text strong style={{ fontSize: '1.1rem' }}>{rate}</Text>
          <br />
          <Text 
            type={record.change24h >= 0 ? 'success' : 'danger'}
            style={{ fontSize: '0.8rem' }}
          >
            {record.change24h >= 0 ? '+' : ''}{record.change24h}%
          </Text>
        </div>
      ),
    },
    {
      title: 'Volume 24h',
      dataIndex: 'volume24h',
      key: 'volume24h',
      render: (volume: number) => (
        <Text>{volume.toLocaleString()} USDC</Text>
      ),
    },
    {
      title: 'Liquidity',
      dataIndex: 'liquidity',
      key: 'liquidity',
      render: (liquidity: number) => (
        <div>
          <Progress 
            percent={(liquidity / 1500000) * 100} 
            size="small" 
            strokeColor="#52c41a"
            showInfo={false}
          />
          <Text type="secondary">{liquidity.toLocaleString()} USDC</Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CurrencyPair) => (
        <Button 
          type="primary" 
          size="small"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '15px'
          }}
        >
          Swap
        </Button>
      ),
    },
  ];

  const swapColumns = [
    {
      title: 'Pair',
      key: 'pair',
      render: (_: any, record: SwapTransaction) => (
        <Text strong>{record.from} → {record.to}</Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: SwapTransaction) => (
        <div>
          <Text strong>{amount.toLocaleString()} {record.from}</Text>
          <br />
          <Text type="secondary">
            ≈ {(amount * record.rate).toLocaleString()} {record.to}
          </Text>
        </div>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => (
        <Text strong>{rate}</Text>
      ),
    },
    {
      title: 'DEX',
      dataIndex: 'dex',
      key: 'dex',
      render: (dex: string) => (
        <Tag color="blue">{dex}</Tag>
      ),
    },
    {
      title: 'Gas Used',
      dataIndex: 'gasUsed',
      key: 'gasUsed',
      render: (gas: number) => (
        <Text>{gas} APT</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          completed: { color: 'green', icon: <CheckCircleOutlined /> },
          pending: { color: 'orange', icon: <ClockCircleOutlined /> },
          failed: { color: 'red', icon: <ClockCircleOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => (
        <Text type="secondary">{timestamp}</Text>
      ),
    },
  ];

  const totalVolume = currencyPairs.reduce((sum, pair) => sum + pair.volume24h, 0);
  const averageRate = currencyPairs.reduce((sum, pair) => sum + pair.rate, 0) / currencyPairs.length;
  const totalSwaps = recentSwaps.length;
  const completedSwaps = recentSwaps.filter(swap => swap.status === 'completed').length;

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <Title level={2}>Forex Module</Title>
        <Text type="secondary">
          On-chain currency exchange with optimal routing across DEXs
        </Text>
      </div>

      <Alert
        message="⚡ Parallel FX Optimization"
        description="APTpay queries multiple DEXs simultaneously for the best rates, executing trades with minimal slippage and MEV protection."
        type="info"
        showIcon
        style={{ marginBottom: '30px', borderRadius: '10px' }}
      />

      <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="24h Volume"
              value={totalVolume}
              prefix={<DollarOutlined />}
              suffix="USDC"
              valueStyle={{ color: '#667eea' }}
            />
            <Text type="secondary">Across all pairs</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Pairs"
              value={currencyPairs.length}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary">Supported currencies</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={((completedSwaps / totalSwaps) * 100).toFixed(1)}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary">Completed swaps</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Gas Cost"
              value={0.002}
              prefix={<PercentageOutlined />}
              suffix="APT"
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary">Per transaction</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
        <Col xs={24} lg={16}>
          <Card title="Exchange Rate Trends" extra={<Button type="link">View Full Chart</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rateHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    const pairName = name.replace('USDC_', 'USDC/').replace('c', 'c');
                    return [value, pairName];
                  }}
                  labelStyle={{ color: '#333' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="USDC_EURc" 
                  stroke="#667eea" 
                  strokeWidth={2}
                  dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="USDC_GBPc" 
                  stroke="#52c41a" 
                  strokeWidth={2}
                  dot={{ fill: '#52c41a', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="USDC_JPYc" 
                  stroke="#faad14" 
                  strokeWidth={2}
                  dot={{ fill: '#faad14', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Quick Swap">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>From</Text>
                <Select defaultValue="USDC" style={{ width: '100%', marginTop: '8px' }}>
                  <Option value="USDC">USDC</Option>
                  <Option value="EURc">EURc</Option>
                  <Option value="GBPc">GBPc</Option>
                  <Option value="JPYc">JPYc</Option>
                </Select>
              </div>
              
              <div>
                <Text strong>To</Text>
                <Select defaultValue="EURc" style={{ width: '100%', marginTop: '8px' }}>
                  <Option value="EURc">EURc</Option>
                  <Option value="GBPc">GBPc</Option>
                  <Option value="JPYc">JPYc</Option>
                  <Option value="USDC">USDC</Option>
                </Select>
              </div>
              
              <div>
                <Text strong>Amount</Text>
                <Input 
                  placeholder="1000" 
                  suffix="USDC"
                  style={{ marginTop: '8px' }}
                />
              </div>
              
              <Button 
                type="primary" 
                icon={<SwapOutlined />}
                block
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '25px',
                  height: '50px'
                }}
              >
                Execute Swap
              </Button>
            </Space>
            
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
              <Text strong>Best Rate Found:</Text>
              <br />
              <Text style={{ fontSize: '1.2rem', color: '#52c41a' }}>0.918 EURc</Text>
              <br />
              <Text type="secondary">Via Tapp DEX</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Supported Currency Pairs" extra={
            <Button 
              type="primary" 
              icon={<ThunderboltOutlined />}
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                border: 'none',
                borderRadius: '25px'
              }}
            >
              Add Pair
            </Button>
          }>
            <Table
              dataSource={currencyPairs}
              columns={currencyColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Recent Swaps">
            <Table
              dataSource={recentSwaps}
              columns={swapColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '30px' }}>
        <Col span={24}>
          <Card title="DEX Integration Status">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', color: '#667eea', marginBottom: '10px' }}>
                    🦄
                  </div>
                  <Text strong>Merkle Trade</Text>
                  <br />
                  <Tag color="green">Active</Tag>
                  <br />
                  <Text type="secondary">CLOB-based trading</Text>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', color: '#52c41a', marginBottom: '10px' }}>
                    ⚡
                  </div>
                  <Text strong>Hyperion</Text>
                  <br />
                  <Tag color="green">Active</Tag>
                  <br />
                  <Text type="secondary">AMM with concentrated liquidity</Text>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', color: '#faad14', marginBottom: '10px' }}>
                    🌊
                  </div>
                  <Text strong>Tapp</Text>
                  <br />
                  <Tag color="green">Active</Tag>
                  <br />
                  <Text type="secondary">Cross-chain bridge liquidity</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ForexModule;
