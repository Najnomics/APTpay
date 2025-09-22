import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Table, 
  Progress, 
  Tag, 
  Space,
  Typography,
  Alert,
  Spin
} from 'antd';
import { 
  DollarOutlined, 
  TeamOutlined, 
  TrophyOutlined, 
  SafetyOutlined,
  PlayCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useAPTpay } from '../hooks/useAPTpay';
import { PayrollBatch, BatchStatus, Employee } from '../types';

const { Title, Text } = Typography;

interface PayrollDashboardProps {
  className?: string;
}

export const PayrollDashboard: React.FC<PayrollDashboardProps> = ({ className }) => {
  const {
    dashboardData,
    isLoading,
    error,
    refreshDashboard,
    executePayroll,
    getBatches,
    isConnected
  } = useAPTpay();

  const [batches, setBatches] = useState<PayrollBatch[]>([]);
  const [isExecuting, setIsExecuting] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (isConnected) {
      refreshDashboard();
      loadBatches();
    }
  }, [isConnected]);

  const loadBatches = async () => {
    try {
      const batchData = await getBatches();
      setBatches(batchData);
    } catch (err) {
      console.error('Failed to load batches:', err);
    }
  };

  const handleExecutePayroll = async (batchId: number) => {
    setIsExecuting(prev => ({ ...prev, [batchId]: true }));
    
    try {
      const result = await executePayroll(batchId);
      if (result.success) {
        await loadBatches();
        await refreshDashboard();
      }
    } catch (err) {
      console.error('Failed to execute payroll:', err);
    } finally {
      setIsExecuting(prev => ({ ...prev, [batchId]: false }));
    }
  };

  const getBatchStatusTag = (status: BatchStatus) => {
    const statusConfig = {
      [BatchStatus.PENDING]: { color: 'orange', text: 'Pending' },
      [BatchStatus.EXECUTING]: { color: 'blue', text: 'Executing' },
      [BatchStatus.COMPLETED]: { color: 'green', text: 'Completed' },
      [BatchStatus.FAILED]: { color: 'red', text: 'Failed' }
    };

    const config = statusConfig[status] || statusConfig[BatchStatus.FAILED];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const batchColumns = [
    {
      title: 'Batch ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Employees',
      dataIndex: 'payment_count',
      key: 'payment_count',
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount: number, record: PayrollBatch) => 
        `${(amount / 1000000).toLocaleString()} ${record.currency}`,
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: BatchStatus) => getBatchStatusTag(status),
    },
    {
      title: 'Success Rate',
      key: 'success_rate',
      render: (record: PayrollBatch) => {
        if (record.status === BatchStatus.PENDING) return '-';
        const rate = record.payment_count > 0 
          ? (record.successful_payments / record.payment_count) * 100 
          : 0;
        return (
          <Progress 
            percent={rate} 
            size="small" 
            status={rate === 100 ? 'success' : rate > 0 ? 'active' : 'exception'}
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: PayrollBatch) => (
        <Space>
          {record.status === BatchStatus.PENDING && (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              loading={isExecuting[record.id]}
              onClick={() => handleExecutePayroll(record.id)}
              size="small"
            >
              Execute
            </Button>
          )}
          <Button size="small">View Details</Button>
        </Space>
      ),
    },
  ];

  if (!isConnected) {
    return (
      <Card className={className}>
        <Alert
          message="Wallet Not Connected"
          description="Please connect your wallet to view the payroll dashboard."
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <Alert
          message="Error Loading Dashboard"
          description={error.message}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={refreshDashboard}>
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className={className}>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Payroll Dashboard</Title>
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={refreshDashboard}
              loading={isLoading}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Employees"
              value={dashboardData?.employeeCount || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Monthly Payroll"
              value={dashboardData?.monthlyPayroll || 0}
              prefix={<DollarOutlined />}
              precision={2}
              suffix="USDC"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Cost Savings"
              value={dashboardData?.costSavings || 0}
              prefix={<TrophyOutlined />}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Compliance Score"
              value={dashboardData?.complianceStatus.kycCompliance || 0}
              prefix={<SafetyOutlined />}
              precision={0}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Treasury Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="Treasury Balance" extra={<Text type="secondary">Live</Text>}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="Available"
                value={(dashboardData?.treasuryBalance.available_balance || 0) / 1000000}
                precision={2}
                suffix="USDC"
              />
              <Statistic
                title="Earning Yield"
                value={(dashboardData?.treasuryBalance.yield_balance || 0) / 1000000}
                precision={2}
                suffix="USDC"
              />
              <Statistic
                title="Current APY"
                value={(dashboardData?.currentAPY || 0) / 100}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Performance Metrics">
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Processing Time</Text>
                  <br />
                  <Title level={3} style={{ margin: 0, color: '#1890ff' }}>3 min</Title>
                  <Text type="secondary">vs 3-7 days traditional</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Success Rate</Text>
                  <br />
                  <Title level={3} style={{ margin: 0, color: '#52c41a' }}>99.8%</Title>
                  <Text type="secondary">payment success</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Fee Reduction</Text>
                  <br />
                  <Title level={3} style={{ margin: 0, color: '#faad14' }}>95%</Title>
                  <Text type="secondary">vs traditional</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Recent Payroll Batches */}
      <Card 
        title="Payroll Batches" 
        extra={
          <Button type="primary" onClick={() => {/* Navigate to create batch */}}>
            Create New Batch
          </Button>
        }
      >
        <Spin spinning={isLoading}>
          <Table
            columns={batchColumns}
            dataSource={batches}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default PayrollDashboard;