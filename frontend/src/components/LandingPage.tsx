import React from 'react';
import { 
  Layout,
  Button, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic,
  Avatar,
  Space,
  Tag,
  Timeline,
  List,
  Divider
} from 'antd';
import { 
  RocketOutlined,
  DollarOutlined,
  TeamOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  StarOutlined,
  PlayCircleOutlined,
  RightOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  GithubOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  const metrics = [
    { title: '$2.4M+', subtitle: 'Processed Volume', icon: <DollarOutlined /> },
    { title: '127', subtitle: 'Active Employees', icon: <TeamOutlined /> },
    { title: '23', subtitle: 'Countries', icon: <GlobalOutlined /> },
    { title: '99.97%', subtitle: 'Success Rate', icon: <CheckCircleOutlined /> }
  ];

  const features = [
    {
      icon: <ThunderboltOutlined style={{ color: '#667eea' }} />,
      title: 'Instant Cross-Border Payments',
      description: 'Process global payroll in minutes, not days. Advanced blockchain infrastructure ensures real-time settlement.'
    },
    {
      icon: <SafetyOutlined style={{ color: '#52c41a' }} />,
      title: 'Enterprise-Grade Security',
      description: 'Multi-signature wallets, advanced encryption, and comprehensive compliance with global financial regulations.'
    },
    {
      icon: <DollarOutlined style={{ color: '#faad14' }} />,
      title: 'Treasury Management',
      description: 'Optimize cash flow with automated yield strategies and real-time liquidity management across multiple currencies.'
    },
    {
      icon: <RiseOutlined style={{ color: '#f5222d' }} />,
      title: 'Advanced Analytics',
      description: 'Deep business intelligence with predictive analytics, compliance reporting, and operational insights.'
    }
  ];

  const investors = [
    { name: 'Andreessen Horowitz', logo: 'A16Z', tier: 'Lead Investor' },
    { name: 'Coinbase Ventures', logo: 'CB', tier: 'Strategic' },
    { name: 'Multicoin Capital', logo: 'MC', tier: 'Early Stage' },
    { name: 'Jump Crypto', logo: 'JC', tier: 'Strategic' }
  ];

  const teamMembers = [
    { name: 'Sarah Chen', role: 'CEO & Co-founder', experience: 'Ex-Stripe, Goldman Sachs' },
    { name: 'Michael Rodriguez', role: 'CTO & Co-founder', experience: 'Ex-Coinbase, Google' },
    { name: 'Dr. Emily Zhang', role: 'Chief Risk Officer', experience: 'Ex-JPMorgan, MIT PhD' },
    { name: 'David Kim', role: 'Head of Product', experience: 'Ex-Uber, McKinsey' }
  ];

  const milestones = [
    { title: 'Q1 2024', description: 'Launched MVP with 5 pilot customers' },
    { title: 'Q2 2024', description: 'Processed $500K in cross-border payments' },
    { title: 'Q3 2024', description: 'Raised $5M Seed Round, 50+ customers' },
    { title: 'Q4 2024', description: '$2.4M+ processed, 23 countries, Series A ready' }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation Header */}
      <Header style={{ 
        background: 'rgba(10, 10, 11, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        padding: '0 5%'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RocketOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <Title level={3} style={{ margin: 0, color: 'white' }}>APTpay</Title>
          </div>
          
          <Space size="large">
            <Text style={{ color: 'var(--text-secondary)' }}>Product</Text>
            <Text style={{ color: 'var(--text-secondary)' }}>Company</Text>
            <Text style={{ color: 'var(--text-secondary)' }}>Investors</Text>
            <Button type="primary" className="professional-button">
              Request Demo
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <section style={{ 
          padding: '120px 5% 80px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Tag color="blue" style={{ marginBottom: '24px', fontSize: '14px', padding: '8px 16px' }}>
              <StarOutlined /> Series A Ready • $2.4M+ Processed
            </Tag>
            
            <Title level={1} style={{ 
              fontSize: '64px', 
              fontWeight: 700, 
              marginBottom: '24px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.1'
            }}>
              The Future of<br />Global Payroll
            </Title>
            
            <Paragraph style={{ 
              fontSize: '24px', 
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 48px'
            }}>
              Enterprise blockchain infrastructure for instant cross-border payments. 
              Trusted by 127+ remote teams across 23 countries.
            </Paragraph>
            
            <Space size="large">
              <Button 
                type="primary" 
                size="large"
                className="professional-button"
                style={{ height: '56px', fontSize: '18px', padding: '0 32px' }}
                icon={<PlayCircleOutlined />}
              >
                Watch Demo
              </Button>
              <Button 
                size="large"
                className="professional-button secondary"
                style={{ height: '56px', fontSize: '18px', padding: '0 32px' }}
                icon={<RightOutlined />}
              >
                View Pitch Deck
              </Button>
            </Space>
            
            {/* Key Metrics */}
            <Row gutter={[48, 24]} style={{ marginTop: '80px' }}>
              {metrics.map((metric, index) => (
                <Col xs={12} sm={6} key={index}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      color: 'var(--primary)',
                      marginBottom: '8px'
                    }}>
                      {metric.icon}
                    </div>
                    <Title level={2} style={{ 
                      margin: 0, 
                      fontSize: '36px',
                      fontWeight: 700,
                      color: 'var(--text-primary)'
                    }}>
                      {metric.title}
                    </Title>
                    <Text style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                      {metric.subtitle}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Product Features */}
        <section style={{ padding: '80px 5%', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <Title level={2} style={{ fontSize: '48px', marginBottom: '24px' }}>
                Built for Enterprise Scale
              </Title>
              <Text style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>
                Comprehensive payroll infrastructure that scales with your global workforce
              </Text>
            </div>
            
            <Row gutter={[48, 48]}>
              {features.map((feature, index) => (
                <Col xs={24} md={12} key={index}>
                  <Card 
                    className="professional-card"
                    style={{ height: '100%', border: 'none' }}
                  >
                    <div style={{ marginBottom: '24px', fontSize: '48px' }}>
                      {feature.icon}
                    </div>
                    <Title level={3} style={{ marginBottom: '16px' }}>
                      {feature.title}
                    </Title>
                    <Paragraph style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '16px',
                      lineHeight: '1.6'
                    }}>
                      {feature.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Investor Section */}
        <section style={{ padding: '80px 5%' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <Title level={2} style={{ fontSize: '48px', marginBottom: '24px' }}>
                Backed by Industry Leaders
              </Title>
              <Text style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>
                Supported by top-tier VCs and strategic investors in fintech and blockchain
              </Text>
            </div>
            
            <Row gutter={[32, 32]}>
              {investors.map((investor, index) => (
                <Col xs={12} sm={6} key={index}>
                  <Card 
                    className="professional-card"
                    style={{ textAlign: 'center', height: '140px' }}
                  >
                    <Avatar 
                      size={64}
                      style={{ 
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        marginBottom: '16px',
                        fontSize: '18px',
                        fontWeight: 700
                      }}
                    >
                      {investor.logo}
                    </Avatar>
                    <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                      {investor.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {investor.tier}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Team Section */}
        <section style={{ padding: '80px 5%', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <Title level={2} style={{ fontSize: '48px', marginBottom: '24px' }}>
                World-Class Team
              </Title>
              <Text style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>
                Leaders from top fintech and blockchain companies
              </Text>
            </div>
            
            <Row gutter={[32, 32]}>
              {teamMembers.map((member, index) => (
                <Col xs={12} sm={6} key={index}>
                  <Card className="professional-card" style={{ textAlign: 'center' }}>
                    <Avatar 
                      size={80}
                      style={{ 
                        background: `hsl(${index * 90}, 70%, 60%)`,
                        marginBottom: '16px',
                        fontSize: '24px'
                      }}
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Title level={4} style={{ marginBottom: '8px' }}>
                      {member.name}
                    </Title>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                      {member.role}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {member.experience}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Traction & Milestones */}
        <section style={{ padding: '80px 5%' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Row gutter={[64, 48]}>
              <Col xs={24} md={12}>
                <Title level={2} style={{ fontSize: '48px', marginBottom: '32px' }}>
                  Proven Traction
                </Title>
                <Timeline>
                  {milestones.map((milestone, index) => (
                    <Timeline.Item 
                      key={index}
                      color={index === milestones.length - 1 ? 'green' : 'blue'}
                    >
                      <Title level={4} style={{ marginBottom: '8px' }}>
                        {milestone.title}
                      </Title>
                      <Text style={{ color: 'var(--text-secondary)' }}>
                        {milestone.description}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Col>
              
              <Col xs={24} md={12}>
                <Card className="professional-card">
                  <Title level={3} style={{ marginBottom: '24px' }}>
                    Series A Metrics
                  </Title>
                  <List
                    dataSource={[
                      { label: 'ARR Growth', value: '340% YoY' },
                      { label: 'Customer Retention', value: '98%' },
                      { label: 'Gross Margin', value: '89%' },
                      { label: 'CAC Payback', value: '4 months' },
                      { label: 'NPS Score', value: '72' },
                      { label: 'Market Size', value: '$50B TAM' }
                    ]}
                    renderItem={(item: any) => (
                      <List.Item style={{ 
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: '1px solid var(--border)'
                      }}>
                        <Text>{item.label}</Text>
                        <Text strong style={{ color: 'var(--success)' }}>
                          {item.value}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ 
          padding: '80px 5%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2} style={{ 
              fontSize: '48px', 
              color: 'white',
              marginBottom: '24px'
            }}>
              Ready to Transform Global Payroll?
            </Title>
            <Paragraph style={{ 
              fontSize: '20px', 
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '48px'
            }}>
              Join leading companies already using APTpay to power their global workforce.
              Schedule a demo to see how we can scale with your business.
            </Paragraph>
            <Space size="large">
              <Button 
                size="large"
                style={{ 
                  background: 'white',
                  color: 'var(--primary)',
                  border: 'none',
                  height: '56px',
                  fontSize: '18px',
                  padding: '0 32px',
                  fontWeight: 600
                }}
                icon={<ArrowRightOutlined />}
              >
                Schedule Demo
              </Button>
              <Button 
                size="large"
                style={{ 
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  height: '56px',
                  fontSize: '18px',
                  padding: '0 32px'
                }}
              >
                Request Pitch Deck
              </Button>
            </Space>
          </div>
        </section>
      </Content>

      {/* Footer */}
      <Footer style={{ 
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '48px 5%'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[48, 32]}>
            <Col xs={24} md={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <RocketOutlined style={{ fontSize: '16px', color: 'white' }} />
                </div>
                <Title level={4} style={{ margin: 0, color: 'white' }}>APTpay</Title>
              </div>
              <Text style={{ color: 'var(--text-secondary)' }}>
                The future of global payroll infrastructure, powered by blockchain technology.
              </Text>
              <div style={{ marginTop: '24px' }}>
                <Space size="large">
                  <LinkedinOutlined style={{ fontSize: '20px', color: 'var(--text-secondary)' }} />
                  <TwitterOutlined style={{ fontSize: '20px', color: 'var(--text-secondary)' }} />
                  <GithubOutlined style={{ fontSize: '20px', color: 'var(--text-secondary)' }} />
                </Space>
              </div>
            </Col>
            
            <Col xs={12} md={4}>
              <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>Product</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Text style={{ color: 'var(--text-secondary)' }}>Payroll Engine</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>Treasury Management</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>FX Trading</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>Analytics</Text>
              </div>
            </Col>
            
            <Col xs={12} md={4}>
              <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>Company</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Text style={{ color: 'var(--text-secondary)' }}>About</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>Careers</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>Investors</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>Press</Text>
              </div>
            </Col>
            
            <Col xs={12} md={4}>
              <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>Resources</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Text style={{ color: 'var(--text-secondary)' }}>Documentation</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>API Reference</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>Support</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>Status</Text>
              </div>
            </Col>
            
            <Col xs={12} md={4}>
              <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>Legal</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Text style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>Terms of Service</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>Security</Text>
                <Text style={{ color: 'var(--text-secondary)' }}>Compliance</Text>
              </div>
            </Col>
          </Row>
          
          <Divider style={{ borderColor: 'var(--border)', margin: '32px 0' }} />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <Text style={{ color: 'var(--text-secondary)' }}>
              © 2024 APTpay. All rights reserved.
            </Text>
            <Text style={{ color: 'var(--text-secondary)' }}>
              Built on Aptos • Secured by Multi-sig • Enterprise Ready
            </Text>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default LandingPage;