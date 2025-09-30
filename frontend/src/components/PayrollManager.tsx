import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Select, 
  Modal, 
  Form, 
  Typography, 
  Statistic,
  Progress,
  Alert,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ThunderboltOutlined,
  TeamOutlined,
  DollarOutlined,
  GlobalOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Employee {
  id: number;
  name: string;
  address: string;
  salary: number;
  currency: string;
  country: string;
  status: 'active' | 'inactive';
  lastPaid: string;
}

const PayrollManager: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: 'Alice Johnson',
      address: '0x1234...5678',
      salary: 5000,
      currency: 'USDC',
      country: 'United States',
      status: 'active',
      lastPaid: '2024-01-01'
    },
    {
      id: 2,
      name: 'Bob Smith',
      address: '0x2345...6789',
      salary: 4500,
      currency: 'EURc',
      country: 'Germany',
      status: 'active',
      lastPaid: '2024-01-01'
    },
    {
      id: 3,
      name: 'Carol Davis',
      address: '0x3456...7890',
      salary: 5200,
      currency: 'USDC',
      country: 'United Kingdom',
      status: 'active',
      lastPaid: '2024-01-01'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Employee) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '0.8rem' }}>
            {record.address}
          </Text>
        </div>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number, record: Employee) => (
        <div>
          <Text strong>{salary.toLocaleString()} {record.currency}</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Paid',
      dataIndex: 'lastPaid',
      key: 'lastPaid',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Employee) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingEmployee) {
        setEmployees(employees.map(emp => 
          emp.id === editingEmployee.id ? { ...emp, ...values } : emp
        ));
      } else {
        const newEmployee: Employee = {
          id: Math.max(...employees.map(e => e.id)) + 1,
          ...values,
          lastPaid: 'Never',
          status: 'active'
        };
        setEmployees([...employees, newEmployee]);
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <Title level={2}>Payroll Manager</Title>
        <Text type="secondary">
          Manage your global workforce and execute payroll payments
        </Text>
      </div>

      <Alert
        message="🚀 Parallel Processing Ready"
        description="APTpay can process 1000+ employees simultaneously with instant cross-border payments."
        type="info"
        showIcon
        style={{ marginBottom: '30px', borderRadius: '10px' }}
      />

      <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Employees"
              value={employees.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#667eea' }}
            />
            <Text type="secondary">{activeEmployees} active</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Monthly Payroll"
              value={totalPayroll}
              prefix={<DollarOutlined />}
              suffix="USDC"
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary">Total across all employees</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Countries"
              value={new Set(employees.map(e => e.country)).size}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary">Global coverage</Text>
          </Card>
        </Col>
      </Row>

      <Card 
        title="Employee Management" 
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<ThunderboltOutlined />}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '25px'
              }}
            >
              Execute Payroll
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                border: 'none',
                borderRadius: '25px'
              }}
            >
              Add Employee
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={employees}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Employee Name"
            rules={[{ required: true, message: 'Please enter employee name' }]}
          >
            <Input placeholder="Enter employee name" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Wallet Address"
            rules={[{ required: true, message: 'Please enter wallet address' }]}
          >
            <Input placeholder="0x..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="salary"
                label="Monthly Salary"
                rules={[{ required: true, message: 'Please enter salary' }]}
              >
                <Input type="number" placeholder="5000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Preferred Currency"
                rules={[{ required: true, message: 'Please select currency' }]}
              >
                <Select placeholder="Select currency">
                  <Option value="USDC">USDC</Option>
                  <Option value="EURc">EURc</Option>
                  <Option value="GBPc">GBPc</Option>
                  <Option value="JPYc">JPYc</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: 'Please enter country' }]}
          >
            <Input placeholder="Enter country" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PayrollManager;
