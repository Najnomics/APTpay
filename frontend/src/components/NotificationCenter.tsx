import React, { useState, useEffect } from 'react';
import { 
  Drawer,
  List,
  Badge,
  Typography,
  Button,
  Space,
  Tag,
  Avatar,
  Divider,
  Empty,
  Switch,
  Tooltip,
  notification
} from 'antd';
import { 
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  ClearOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface NotificationItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  category: 'transaction' | 'security' | 'system' | 'compliance';
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
}

interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Mock notification data with realistic payroll system events
  const mockNotifications: NotificationItem[] = [
    {
      id: '1',
      type: 'success',
      title: 'Payroll Batch Completed',
      message: 'Successfully processed $89,400 for 127 employees across 8 countries',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      category: 'transaction',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'warning',
      title: 'FX Rate Alert',
      message: 'USD/EUR rate changed by 2.3% - Review treasury strategy',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      category: 'system',
      read: false,
      priority: 'medium',
      actionRequired: true
    },
    {
      id: '3',
      type: 'info',
      title: 'New Employee Onboarded',
      message: 'Sarah Chen (Engineering, Singapore) added to payroll system',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      category: 'transaction',
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'error',
      title: 'Compliance Alert',
      message: 'KYC document verification failed for employee ID: 4567',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'compliance',
      read: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: '5',
      type: 'success',
      title: 'Security Scan Complete',
      message: 'Multi-signature wallet security audit passed - No vulnerabilities detected',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      category: 'security',
      read: true,
      priority: 'medium'
    },
    {
      id: '6',
      type: 'info',
      title: 'System Update',
      message: 'Treasury yield optimization algorithm updated - Expected 0.3% APY improvement',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      category: 'system',
      read: false,
      priority: 'low'
    }
  ];

  useEffect(() => {
    // Initialize notifications
    setNotifications(mockNotifications);

    // Real-time notification simulation
    if (realTimeEnabled) {
      const interval = setInterval(() => {
        const newNotifications = [
          {
            id: Date.now().toString(),
            type: Math.random() > 0.7 ? 'warning' : 'success',
            title: Math.random() > 0.5 ? 'Payment Processed' : 'System Alert',
            message: Math.random() > 0.5 
              ? `$${(Math.random() * 50000 + 10000).toFixed(0)} processed for ${Math.floor(Math.random() * 50 + 5)} employees`
              : 'Real-time monitoring detected optimization opportunity',
            timestamp: new Date(),
            category: Math.random() > 0.5 ? 'transaction' : 'system',
            read: false,
            priority: Math.random() > 0.7 ? 'high' : 'medium'
          } as NotificationItem
        ];

        setNotifications(prev => [newNotifications[0], ...prev.slice(0, 19)]);

        // Show browser notification for high priority
        if (newNotifications[0].priority === 'high') {
          notification.open({
            message: newNotifications[0].title,
            description: newNotifications[0].message,
            icon: getNotificationIcon(newNotifications[0].type),
            placement: 'topRight'
          });
        }
      }, 30000); // New notification every 30 seconds

      return () => clearInterval(interval);
    }
  }, [realTimeEnabled]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'error': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transaction': return <DollarOutlined />;
      case 'security': return <SafetyOutlined />;
      case 'system': return <ThunderboltOutlined />;
      case 'compliance': return <GlobalOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.category === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BellOutlined style={{ color: 'var(--primary)' }} />
          <span>Notification Center</span>
          <Badge count={unreadCount} size="small" />
        </div>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={480}
      extra={
        <Space>
          <Tooltip title="Real-time notifications">
            <Switch 
              checked={realTimeEnabled}
              onChange={setRealTimeEnabled}
              size="small"
            />
          </Tooltip>
          <Button 
            icon={<SettingOutlined />}
            type="text"
            size="small"
          />
        </Space>
      }
    >
      {/* Controls */}
      <div style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space wrap>
              <Button 
                size="small"
                type={filter === 'all' ? 'primary' : 'default'}
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button 
                size="small"
                type={filter === 'unread' ? 'primary' : 'default'}
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              <Button 
                size="small"
                type={filter === 'transaction' ? 'primary' : 'default'}
                onClick={() => setFilter('transaction')}
              >
                Transactions
              </Button>
              <Button 
                size="small"
                type={filter === 'security' ? 'primary' : 'default'}
                onClick={() => setFilter('security')}
              >
                Security
              </Button>
            </Space>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              size="small"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
            <Button 
              size="small"
              icon={<ClearOutlined />}
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              Clear All
            </Button>
          </div>
        </Space>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Empty 
          description="No notifications"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={filteredNotifications}
          renderItem={(item) => (
            <List.Item
              style={{ 
                padding: '16px 0',
                borderRadius: '8px',
                backgroundColor: item.read ? 'transparent' : 'rgba(102, 126, 234, 0.05)',
                border: item.read ? 'none' : '1px solid rgba(102, 126, 234, 0.1)',
                marginBottom: '8px',
                paddingLeft: '12px',
                paddingRight: '12px',
                cursor: 'pointer'
              }}
              onClick={() => markAsRead(item.id)}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ position: 'relative' }}>
                    <Avatar 
                      icon={getCategoryIcon(item.category)}
                      style={{ 
                        background: item.type === 'success' ? '#52c41a' :
                                   item.type === 'warning' ? '#faad14' :
                                   item.type === 'error' ? '#ff4d4f' : '#1890ff'
                      }}
                    />
                    {!item.read && (
                      <div style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--primary)'
                      }} />
                    )}
                  </div>
                }
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text strong style={{ 
                      color: item.read ? 'var(--text-secondary)' : 'var(--text-primary)'
                    }}>
                      {item.title}
                    </Text>
                    {item.priority === 'high' && (
                      <Tag color="red">HIGH</Tag>
                    )}
                    {item.actionRequired && (
                      <Tag color="orange">ACTION</Tag>
                    )}
                  </div>
                }
                description={
                  <div>
                    <Text style={{ 
                      color: item.read ? 'var(--text-secondary)' : 'var(--text-primary)',
                      fontSize: '14px'
                    }}>
                      {item.message}
                    </Text>
                    <div style={{ 
                      marginTop: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatTimestamp(item.timestamp)}
                      </Text>
                      <Tag 
                        style={{ margin: 0, textTransform: 'capitalize' }}
                      >
                        {item.category}
                      </Tag>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}

      {/* System Status Footer */}
      <div style={{ 
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        right: '24px',
        padding: '16px',
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text strong style={{ fontSize: '12px' }}>System Status</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#52c41a'
              }} />
              <Text style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                All services operational
              </Text>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Real-time monitoring
            </Text>
            <div style={{ marginTop: '4px' }}>
              <Badge status={realTimeEnabled ? 'processing' : 'default'} 
                     text={realTimeEnabled ? 'Active' : 'Paused'} />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default NotificationCenter;