import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Button, 
  List, 
  Typography, 
  Space, 
  Card,
  Divider,
  Avatar,
  Tag,
  Tooltip,
  Alert,
  Statistic,
  Row,
  Col,
  notification
} from 'antd';
import { 
  WalletOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CopyOutlined,
  DisconnectOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { walletService, WalletState, WalletAdapter } from '../services/walletService';

const { Title, Text, Paragraph } = Typography;

interface WalletConnectModalProps {
  visible: boolean;
  onClose: () => void;
  onWalletConnected: (walletState: WalletState) => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ 
  visible, 
  onClose, 
  onWalletConnected 
}) => {
  const [loading, setLoading] = useState(false);
  const [walletState, setWalletState] = useState<WalletState | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletAdapter[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      const wallets = walletService.getAvailableWallets();
      setAvailableWallets(wallets);
      
      const currentState = walletService.getWalletState();
      if (currentState.connected) {
        setWalletState(currentState);
        loadTransactionHistory();
      }
    }
  }, [visible]);

  const loadTransactionHistory = async () => {
    try {
      const history = await walletService.getTransactionHistory(5);
      setTransactionHistory(history);
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    }
  };

  const handleWalletConnect = async (walletName: string) => {
    setLoading(true);
    try {
      const state = await walletService.connectWallet(walletName);
      setWalletState(state);
      onWalletConnected(state);
      
      notification.success({
        message: 'Wallet Connected',
        description: `Successfully connected to ${walletName}`,
        placement: 'topRight'
      });
      
      await loadTransactionHistory();
    } catch (error: any) {
      notification.error({
        message: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        placement: 'topRight'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWalletDisconnect = async () => {
    try {
      await walletService.disconnectWallet();
      setWalletState(null);
      setTransactionHistory([]);
      
      notification.success({
        message: 'Wallet Disconnected',
        description: 'Successfully disconnected from wallet',
        placement: 'topRight'
      });
    } catch (error: any) {
      notification.error({
        message: 'Disconnection Failed',
        description: error.message || 'Failed to disconnect wallet',
        placement: 'topRight'
      });
    }
  };

  const handleRefreshBalance = async () => {
    if (!walletState) return;
    
    try {
      const newBalance = await walletService.refreshBalance();
      setWalletState({ ...walletState, balance: newBalance });
      
      notification.success({
        message: 'Balance Updated',
        description: `Current balance: ${newBalance.toFixed(4)} APT`,
        placement: 'topRight'
      });
    } catch (error) {
      notification.error({
        message: 'Refresh Failed',
        description: 'Failed to refresh balance',
        placement: 'topRight'
      });
    }
  };

  const copyAddress = () => {
    if (walletState?.address) {
      navigator.clipboard.writeText(walletState.address);
      notification.success({
        message: 'Address Copied',
        description: 'Wallet address copied to clipboard',
        placement: 'topRight'
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) / 1000).toLocaleDateString();
  };

  if (!visible) return null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <WalletOutlined style={{ color: 'var(--primary)' }} />
          <span>{walletState?.connected ? 'Wallet Connected' : 'Connect Wallet'}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      {!walletState?.connected ? (
        <div>
          <Alert
            message="Connect Your Aptos Wallet"
            description="Choose a wallet to connect to APTpay. Make sure you have one of the supported wallets installed."
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          {availableWallets.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '40px' }}>
              <ExclamationCircleOutlined 
                style={{ fontSize: '48px', color: 'var(--warning)', marginBottom: '16px' }} 
              />
              <Title level={4}>No Wallets Found</Title>
              <Paragraph type="secondary">
                Please install a supported Aptos wallet to continue:
              </Paragraph>
              <Space direction="vertical" size="large" style={{ marginTop: '24px' }}>
                <Button 
                  type="link" 
                  href="https://petra.app/" 
                  target="_blank"
                  style={{ height: 'auto', padding: '8px 0' }}
                >
                  🪨 Install Petra Wallet
                </Button>
                <Button 
                  type="link" 
                  href="https://martianwallet.xyz/" 
                  target="_blank"
                  style={{ height: 'auto', padding: '8px 0' }}
                >
                  👽 Install Martian Wallet
                </Button>
              </Space>
            </Card>
          ) : (
            <List
              dataSource={availableWallets}
              renderItem={(wallet) => (
                <List.Item style={{ padding: '16px 0' }}>
                  <Card 
                    hoverable
                    style={{ width: '100%', cursor: 'pointer' }}
                    onClick={() => handleWalletConnect(wallet.name)}
                    loading={loading}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Avatar size={48} style={{ fontSize: '24px' }}>
                          {wallet.icon}
                        </Avatar>
                        <div>
                          <Title level={4} style={{ margin: 0 }}>
                            {wallet.name}
                          </Title>
                          <Text type="secondary">
                            {wallet.name === 'Petra' ? 'Most popular Aptos wallet' : 'Feature-rich Aptos wallet'}
                          </Text>
                        </div>
                      </div>
                      <Tag color="green">Available</Tag>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </div>
      ) : (
        <div>
          <Alert
            message="Wallet Successfully Connected"
            description="Your wallet is connected and ready to use with APTpay"
            type="success"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          {/* Wallet Info Card */}
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Wallet Balance"
                  value={walletState.balance}
                  precision={4}
                  suffix="APT"
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: 'var(--success)' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Network"
                  value={walletState.network.toUpperCase()}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: 'var(--primary)' }}
                />
              </Col>
            </Row>

            <Divider />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Text strong>Address:</Text>
              <Text code style={{ flex: 1 }}>
                {walletService.formatAddress(walletState.address || '')}
              </Text>
              <Tooltip title="Copy Address">
                <Button 
                  icon={<CopyOutlined />} 
                  size="small" 
                  onClick={copyAddress}
                />
              </Tooltip>
            </div>

            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleRefreshBalance}
                size="small"
              >
                Refresh Balance
              </Button>
              <Button 
                icon={<DisconnectOutlined />}
                onClick={handleWalletDisconnect}
                danger
                size="small"
              >
                Disconnect
              </Button>
            </Space>
          </Card>

          {/* Transaction History */}
          {transactionHistory.length > 0 && (
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ClockCircleOutlined />
                  <span>Recent Transactions</span>
                </div>
              }
              size="small"
            >
              <List
                dataSource={transactionHistory.slice(0, 3)}
                size="small"
                renderItem={(tx) => (
                  <List.Item>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      width: '100%',
                      alignItems: 'center'
                    }}>
                      <div>
                        <Text strong>{tx.type || 'Transaction'}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {formatTimestamp(tx.timestamp)}
                        </Text>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Tag color={tx.success ? 'green' : 'red'}>
                          {tx.success ? 'Success' : 'Failed'}
                        </Tag>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Gas: {(parseInt(tx.gas_used || '0') / 100000000).toFixed(4)} APT
                        </Text>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Wallet Features */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <InfoCircleOutlined />
                <span>Wallet Features</span>
              </div>
            }
            size="small"
            style={{ marginTop: '16px' }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: '24px', color: 'var(--success)' }} />
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>Secure</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Private keys never leave your device
                    </Text>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: '24px', color: 'var(--success)' }} />
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>Fast</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Instant transaction signing
                    </Text>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: '24px', color: 'var(--success)' }} />
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>Compatible</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Works with all Aptos dApps
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      )}
    </Modal>
  );
};

export default WalletConnectModal;