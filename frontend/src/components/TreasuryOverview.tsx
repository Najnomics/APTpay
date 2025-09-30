import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Typography, 
  Button, 
  Space, 
  Table, 
  Tag,
  Input,
  Select,
  Alert,
  Timeline,
  Divider
} from 'antd';
import { 
  DollarOutlined, 
  RiseOutlined, 
  BankOutlined, 
  ThunderboltOutlined,
  PercentageOutlined,
  WalletOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const { Title, Text } = Typography;
const { Option } = Select;

interface YieldStrategy {
  id: number;
  name: string;
  apy: number;
  risk: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Inactive';
  allocation: number;
}

const TreasuryOverview: React.FC = () => {
  const [treasuryBalance] = useState(1000000);
  const [yieldEarned] = useState(4200);
  const [currentAPY] = useState(4.2);
  const [strategies, setStrategies] = useState<YieldStrategy[]>([
    {
      id: 1,
      name: 'Aries Markets Lending',
      apy: 4.2,
      risk: 'Low',
      status: 'Active',
      allocation: 60
    },
    {
      id: 2,
      name: 'Echelon Finance Vault',
      apy: 3.8,
      risk: 'Low',
      status: 'Active',
      allocation: 25
    },
    {
      id: 3,
      name: 'Tsunami Liquid Staking',
      apy: 5.1,
      risk: 'Medium',
      status: 'Active',
      allocation: 15
    }
  ]);

  const yieldHistory = [
    { month: 'Jan', yield: 350, balance: 950000 },
    { month: 'Feb', yield: 380, balance: 960000 },
    { month: 'Mar', yield: 420, balance: 970000 },
    { month: 'Apr', yield: 450, balance: 980000 },
    { month: 'May', yield: 480, balance: 990000 },
    { month: 'Jun', yield: 520, balance: 1000000 }
  ];

  const strategyColumns = [
    {
      title: 'Strategy',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: YieldStrategy) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Tag color={record.risk === 'Low' ? 'green' : record.risk === 'Medium' ? 'orange' : 'red'}>
            {record.risk} Risk
          </Tag>
        </div>
      ),
    },
    {
      title: 'APY',
      dataIndex: 'apy',
      key: 'apy',
      render: (apy: number) => (
        <Text strong style={{ color: '#52c41a' }}>{apy}%</Text>
      ),
    },
    {
      title: 'Allocation',
      dataIndex: 'allocation',
      key: 'allocation',
      render: (allocation: number) => (
        <div>
          <Progress 
            percent={allocation} 
            size="small" 
            strokeColor="#667eea"
            showInfo={false}
          />
          <Text type="secondary">{allocation}%</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: YieldStrategy) => (
        <Space>
          <Button type="link" size="small">
            Configure
          </Button>
          <Button type="link" size="small" danger>
            Disable
          </Button>
        </Space>
      ),
    },
  ];

  const totalAllocation = strategies.reduce((sum, strategy) => sum + strategy.allocation, 0);
  const weightedAPY = strategies.reduce((sum, strategy) => 
    sum + (strategy.apy * strategy.allocation / 100), 0
  );

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <Title level={2}>Treasury Overview</Title>
        <Text type="secondary">
          Manage corporate funds with automated yield optimization
        </Text>
      </div>

      <Alert
        message="💰 Just-in-Time Yield Withdrawal"
        description="Your funds earn yield until milliseconds before payroll execution. Zero treasury downtime, maximum efficiency."
        type="success"
        showIcon
        style={{ marginBottom: '30px', borderRadius: '10px' }}
      />

      <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Balance"
              value={treasuryBalance}
              prefix={<DollarOutlined />}
              suffix="USDC"
              valueStyle={{ color: '#667eea' }}
            />
            <Text type="secondary">Available for payroll</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Yield Earned"
              value={yieldEarned}
              prefix={<RiseOutlined />}
              suffix="USDC"
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary">This month</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Current APY"
              value={currentAPY}
              prefix={<PercentageOutlined />}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary">Weighted average</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Allocation"
              value={totalAllocation}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary">Funds deployed</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
        <Col xs={24} lg={16}>
          <Card title="Treasury Performance" extra={<Button type="link">View Details</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={yieldHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'balance') return [`${value.toLocaleString()} USDC`, 'Balance'];
                    return [`${value} USDC`, 'Yield'];
                  }}
                  labelStyle={{ color: '#333' }}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="yield" 
                  stackId="1"
                  stroke="#667eea" 
                  fill="#667eea"
                  fillOpacity={0.6}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#52c41a" 
                  strokeWidth={2}
                  dot={{ fill: '#52c41a', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<WalletOutlined />}
                block
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '25px',
                  height: '50px'
                }}
              >
                Deposit Funds
              </Button>
              <Button 
                icon={<RiseOutlined />}
                block
                style={{
                  border: '2px solid #52c41a',
                  color: '#52c41a',
                  borderRadius: '25px',
                  height: '50px'
                }}
              >
                Optimize Strategy
              </Button>
              <Button 
                icon={<BankOutlined />}
                block
                style={{
                  border: '2px solid #faad14',
                  color: '#faad14',
                  borderRadius: '25px',
                  height: '50px'
                }}
              >
                Emergency Withdraw
              </Button>
            </Space>
            
            <Divider />
            
            <div>
              <Text strong>Fund Allocation</Text>
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <Text>Available</Text>
                  <Text>{100 - totalAllocation}%</Text>
                </div>
                <Progress 
                  percent={100 - totalAllocation} 
                  strokeColor="#e1e5e9"
                  showInfo={false}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Yield Strategies" extra={
        <Button 
          type="primary" 
          icon={<ThunderboltOutlined />}
          style={{
            background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
            border: 'none',
            borderRadius: '25px'
          }}
        >
          Add Strategy
        </Button>
      }>
        <Table
          dataSource={strategies}
          columns={strategyColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: '30px' }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activities">
            <Timeline>
              <Timeline.Item 
                dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                color="green"
              >
                <Text strong>Yield Strategy Updated</Text>
                <br />
                <Text type="secondary">Aries Markets allocation increased to 60%</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<DollarOutlined style={{ color: '#667eea' }} />}
                color="blue"
              >
                <Text strong>Funds Deposited</Text>
                <br />
                <Text type="secondary">100,000 USDC added to treasury</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<RiseOutlined style={{ color: '#52c41a' }} />}
                color="green"
              >
                <Text strong>Yield Earned</Text>
                <br />
                <Text type="secondary">420 USDC earned this week</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                color="orange"
              >
                <Text strong>Strategy Rebalancing</Text>
                <br />
                <Text type="secondary">Automated rebalancing in progress</Text>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Risk Management">
            <div style={{ marginBottom: '20px' }}>
              <Text strong>Portfolio Risk Score: </Text>
              <Tag color="green">Low (2.3/10)</Tag>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <Text>Diversification</Text>
              <Progress percent={85} strokeColor="#52c41a" />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <Text>Liquidity</Text>
              <Progress percent={90} strokeColor="#52c41a" />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <Text>Volatility</Text>
              <Progress percent={25} strokeColor="#faad14" />
            </div>
            
            <Alert
              message="Risk Assessment: Excellent"
              description="Your treasury is well-diversified with low volatility and high liquidity. Ready for payroll execution."
              type="success"
              showIcon
              style={{ marginTop: '20px' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TreasuryOverview;
