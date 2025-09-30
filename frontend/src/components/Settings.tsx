import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space, 
  Switch,
  Input,
  Select,
  Slider,
  Alert,
  Divider,
  Form,
  InputNumber,
  Tag,
  Timeline,
  Progress
} from 'antd';
import { 
  SettingOutlined, 
  SecurityScanOutlined, 
  DollarOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  BellOutlined,
  KeyOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [emergencyPause, setEmergencyPause] = useState(false);
  const [autoYield, setAutoYield] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const onFinish = (values: any) => {
    console.log('Settings saved:', values);
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <Title level={2}>Settings</Title>
        <Text type="secondary">
          Configure your APTpay platform preferences and security settings
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              companyName: 'APTpay Corp',
              defaultCurrency: 'USDC',
              timezone: 'UTC',
              multisigThreshold: 2,
              autoYield: true,
              notifications: true
            }}
          >
            <Card title="General Settings" style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="companyName"
                    label="Company Name"
                    rules={[{ required: true, message: 'Please enter company name' }]}
                  >
                    <Input placeholder="Enter company name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="defaultCurrency"
                    label="Default Currency"
                    rules={[{ required: true, message: 'Please select default currency' }]}
                  >
                    <Select placeholder="Select currency">
                      <Option value="USDC">USDC</Option>
                      <Option value="EURc">EURc</Option>
                      <Option value="GBPc">GBPc</Option>
                      <Option value="JPYc">JPYc</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="timezone"
                    label="Timezone"
                  >
                    <Select placeholder="Select timezone">
                      <Option value="UTC">UTC</Option>
                      <Option value="EST">Eastern Time</Option>
                      <Option value="PST">Pacific Time</Option>
                      <Option value="CET">Central European Time</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="multisigThreshold"
                    label="Multi-sig Threshold"
                    rules={[{ required: true, message: 'Please set threshold' }]}
                  >
                    <InputNumber 
                      min={1} 
                      max={5} 
                      style={{ width: '100%' }}
                      addonAfter="of 3 signers"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Treasury Settings" style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '20px' }}>
                    <Text strong>Auto Yield Optimization</Text>
                    <br />
                    <Text type="secondary">Automatically optimize yield strategies</Text>
                    <br />
                    <Switch 
                      checked={autoYield} 
                      onChange={setAutoYield}
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '20px' }}>
                    <Text strong>Emergency Reserve</Text>
                    <br />
                    <Text type="secondary">Maintain emergency fund reserves</Text>
                    <br />
                    <InputNumber 
                      defaultValue={5} 
                      min={1} 
                      max={20} 
                      style={{ marginTop: '8px' }}
                      addonAfter="%"
                    />
                  </div>
                </Col>
                <Col xs={24}>
                  <div>
                    <Text strong>Slippage Tolerance: {slippageTolerance}%</Text>
                    <Slider
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={slippageTolerance}
                      onChange={setSlippageTolerance}
                      marks={{
                        0.1: '0.1%',
                        1: '1%',
                        3: '3%',
                        5: '5%'
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="Security Settings" style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Alert
                    message="🔒 Multi-Signature Security Active"
                    description="All treasury operations require 2 of 3 signatures for execution."
                    type="success"
                    showIcon
                    style={{ marginBottom: '20px' }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '20px' }}>
                    <Text strong>Emergency Pause</Text>
                    <br />
                    <Text type="secondary">Immediately halt all operations</Text>
                    <br />
                    <Switch 
                      checked={emergencyPause} 
                      onChange={setEmergencyPause}
                      style={{ marginTop: '8px' }}
                      checkedChildren="Paused"
                      unCheckedChildren="Active"
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '20px' }}>
                    <Text strong>Access Logging</Text>
                    <br />
                    <Text type="secondary">Log all administrative actions</Text>
                    <br />
                    <Switch 
                      defaultChecked
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="Notification Settings" style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <div style={{ marginBottom: '20px' }}>
                    <Text strong>Enable Notifications</Text>
                    <br />
                    <Text type="secondary">Receive alerts for important events</Text>
                    <br />
                    <Switch 
                      checked={notifications} 
                      onChange={setNotifications}
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '20px' }}>
                    <Text strong>Payroll Completion</Text>
                    <br />
                    <Switch defaultChecked style={{ marginTop: '8px' }} />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '20px' }}>
                    <Text strong>Yield Updates</Text>
                    <br />
                    <Switch defaultChecked style={{ marginTop: '8px' }} />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '20px' }}>
                    <Text strong>Security Alerts</Text>
                    <br />
                    <Switch defaultChecked style={{ marginTop: '8px' }} />
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '20px' }}>
                    <Text strong>FX Rate Changes</Text>
                    <br />
                    <Switch style={{ marginTop: '8px' }} />
                  </div>
                </Col>
              </Row>
            </Card>

            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<SettingOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '25px',
                  height: '50px',
                  padding: '0 30px'
                }}
              >
                Save Settings
              </Button>
              <Button 
                style={{
                  border: '2px solid #d9d9d9',
                  borderRadius: '25px',
                  height: '50px',
                  padding: '0 30px'
                }}
              >
                Reset to Default
              </Button>
            </Space>
          </Form>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="System Status" style={{ marginBottom: '24px' }}>
            <Timeline>
              <Timeline.Item 
                dot={<SecurityScanOutlined style={{ color: '#52c41a' }} />}
                color="green"
              >
                <Text strong>Security</Text>
                <br />
                <Text type="secondary">All systems secure</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<DollarOutlined style={{ color: '#667eea' }} />}
                color="blue"
              >
                <Text strong>Treasury</Text>
                <br />
                <Text type="secondary">4.2% APY active</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<GlobalOutlined style={{ color: '#faad14' }} />}
                color="orange"
              >
                <Text strong>Forex</Text>
                <br />
                <Text type="secondary">3 DEXs connected</Text>
              </Timeline.Item>
              <Timeline.Item 
                dot={<ThunderboltOutlined style={{ color: '#52c41a' }} />}
                color="green"
              >
                <Text strong>Payroll</Text>
                <br />
                <Text type="secondary">Ready for execution</Text>
              </Timeline.Item>
            </Timeline>
          </Card>

          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                icon={<KeyOutlined />}
                block
                style={{
                  border: '2px solid #667eea',
                  color: '#667eea',
                  borderRadius: '25px',
                  height: '50px'
                }}
              >
                Rotate Admin Keys
              </Button>
              <Button 
                icon={<TeamOutlined />}
                block
                style={{
                  border: '2px solid #52c41a',
                  color: '#52c41a',
                  borderRadius: '25px',
                  height: '50px'
                }}
              >
                Manage Roles
              </Button>
              <Button 
                icon={<BellOutlined />}
                block
                style={{
                  border: '2px solid #faad14',
                  color: '#faad14',
                  borderRadius: '25px',
                  height: '50px'
                }}
              >
                Test Notifications
              </Button>
            </Space>
          </Card>

          <Card title="Platform Statistics" style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <Text strong>Uptime</Text>
              <Progress percent={99.9} strokeColor="#52c41a" />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <Text strong>Security Score</Text>
              <Progress percent={95} strokeColor="#667eea" />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <Text strong>Performance</Text>
              <Progress percent={98} strokeColor="#faad14" />
            </div>
            
            <Alert
              message="Excellent Performance"
              description="Your APTpay instance is running optimally with high security and performance metrics."
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

export default Settings;
