import React, { useState, useEffect } from 'react';
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
  Timeline,
  Alert
} from 'antd';
import { 
  DollarOutlined, 
  TeamOutlined, 
  GlobalOutlined, 
  ThunderboltOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const { Title, Text } = Typography;

interface DashboardData {
  treasuryBalance: number;
  totalEmployees: number;
  monthlyPayroll: number;
  yieldEarned: number;
  currentAPY: number;
  recentTransactions: any[];
  yieldHistory: any[];
  employeeDistribution: any[];
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    treasuryBalance: 1000000,
    totalEmployees: 45,
    monthlyPayroll: 225000,
    yieldEarned: 4200,
    currentAPY: 4.2,
    recentTransactions: [
      {
        id: 1,
        employee: 'Alice Johnson',
        amount: 5000,
        currency: 'USDC',
        status: 'completed',
        timestamp: '2024-01-15 10:30'
      },
      {
        id: 2,
        employee: 'Bob Smith',
        amount: 4500,
        currency: 'EURc',
        status: 'pending',
        timestamp: '2024-01-15 10:32'
      },
      {
        id: 3,
        employee: 'Carol Davis',
        amount: 5200,
        currency: 'USDC',
        status: 'completed',
        timestamp: '2024-01-15 10:35'
      }
    ],
    yieldHistory: [
      { month: 'Jan', yield: 350 },
      { month: 'Feb', yield: 380 },
      { month: 'Mar', yield: 420 },
      { month: 'Apr', yield: 450 },
      { month: 'May', yield: 480 },
      { month: 'Jun', yield: 520 }
    ],
    employeeDistribution: [
      { name: 'USDC', value: 65, color: '#667eea' },
      { name: 'EURc', value: 25, color: '#764ba2' },
      { name: 'GBPc', value: 10, color: '#f093fb' }
    ]
  });

  const transactionColumns = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: any) => `${amount.toLocaleString()} ${record.currency}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          completed: { color: 'green', text: 'Completed' },
          pending: { color: 'orange', text: 'Pending' },
          failed: { color: 'red', text: 'Failed' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'failed':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={1} style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '10px'
        }}>
          APTpay Dashboard
        </Title>
        <Text style={{ fontSize: '1.2rem', color: '#666' }}>
          Cross-Border Payroll & Treasury Platform
        </Text>
      </div>

      <Alert
        message="🎉 APTpay is Live on Aptos Devnet!"
        description="Your treasury is earning 4.2% APY while processing global payroll. Ready to revolutionize cross-border payments."
        type="success"
        showIcon
        style={{ marginBottom: '30px', borderRadius: '10px' }}
      />

      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Treasury Balance"
              value={dashboardData.treasuryBalance}
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
              title="Total Employees"
              value={dashboardData.totalEmployees}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary">Across 12 countries</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Monthly Payroll"
              value={dashboardData.monthlyPayroll}
              prefix={<GlobalOutlined />}
              suffix="USDC"
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary">Processed instantly</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Yield Earned"
              value={dashboardData.yieldEarned}
              prefix={<RiseOutlined />}
              suffix="USDC"
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary">This month</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        <Col xs={24} lg={16}>
          <Card title="Treasury Yield Performance" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.yieldHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value} USDC`, 'Yield']}
                  labelStyle={{ color: '#333' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Employee Currency Distribution" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.employeeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData.employeeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Transactions" extra={<Button type="link">View All</Button>}>
            <Table
              dataSource={dashboardData.recentTransactions}
              columns={transactionColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="System Status">
            <Timeline>
              <Timeline.Item 
                dot={<ThunderboltOutlined style={{ color: '#667eea' }} />}
                color="blue"
              >
                <Text strong>Payroll System</Text>
                <br />
                <Text type="secondary">All systems operational</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<DollarOutlined style={{ color: '#52c41a' }} />}
                color="green"
              >
                <Text strong>Treasury Module</Text>
                <br />
                <Text type="secondary">Yield: 4.2% APY</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<GlobalOutlined style={{ color: '#faad14' }} />}
                color="orange"
              >
                <Text strong>Forex Module</Text>
                <br />
                <Text type="secondary">3 DEX integrations active</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                color="green"
              >
                <Text strong>Access Control</Text>
                <br />
                <Text type="secondary">Multi-sig secure</Text>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '40px' }}>
        <Col span={24}>
          <Card title="Quick Actions">
            <Space size="large" wrap>
              <Button 
                type="primary" 
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '25px',
                  height: '50px',
                  padding: '0 30px'
                }}
              >
                Execute Payroll
              </Button>
              <Button 
                size="large"
                style={{
                  border: '2px solid #667eea',
                  color: '#667eea',
                  borderRadius: '25px',
                  height: '50px',
                  padding: '0 30px'
                }}
              >
                Add Employee
              </Button>
              <Button 
                size="large"
                style={{
                  border: '2px solid #52c41a',
                  color: '#52c41a',
                  borderRadius: '25px',
                  height: '50px',
                  padding: '0 30px'
                }}
              >
                Deposit Funds
              </Button>
              <Button 
                size="large"
                style={{
                  border: '2px solid #faad14',
                  color: '#faad14',
                  borderRadius: '25px',
                  height: '50px',
                  padding: '0 30px'
                }}
              >
                View Reports
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
