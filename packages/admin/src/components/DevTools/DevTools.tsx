/**
 * 开发工具组件
 * 仅在开发环境使用，用于快速切换登录状态
 * 使用方法：将此组件添加到 App.tsx 或 Layout 组件中
 */
import React, { useState } from 'react';
import { Button, Card, Space, Tag, Descriptions, Modal } from 'antd';
import { UserOutlined, CrownOutlined, LogoutOutlined, EyeOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/types';
import './DevTools.css';

const DevTools: React.FC = () => {
  const { user, setAuth, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  /**
   * 模拟商户登录
   * 创建一个测试商户用户并设置到全局状态
   */
  const mockMerchantLogin = () => {
    const mockUser: User = {
      id: 1,
      username: '测试商户',
      email: 'merchant@test.com',
      role: 'merchant',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAuth('mock-token-merchant-123', mockUser);
    navigate('/merchant/hotels');
    Modal.success({
      title: '模拟登录成功',
      content: '已登录为测试商户',
    });
  };

  /**
   * 模拟管理员登录
   * 创建一个测试管理员用户并设置到全局状态
   */
  const mockAdminLogin = () => {
    const mockUser: User = {
      id: 2,
      username: '测试管理员',
      email: 'admin@test.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAuth('mock-token-admin-456', mockUser);
    navigate('/admin/hotels');
    Modal.success({
      title: '模拟登录成功',
      content: '已登录为测试管理员',
    });
  };

  /**
   * 清除登录状态
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
    Modal.info({
      title: '已退出登录',
      content: '登录状态已清除',
    });
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <div className="dev-tools-trigger" onClick={() => setVisible(!visible)}>
        🛠️
      </div>

      {/* 开发工具面板 */}
      {visible && (
        <div className="dev-tools-panel">
          <Card
            title={
              <Space>
                <span>🛠️ 开发工具</span>
                <Tag color="orange">DEV ONLY</Tag>
              </Space>
            }
            extra={
              <Button
                type="text"
                size="small"
                onClick={() => setVisible(false)}
              >
                ✕
              </Button>
            }
            className="dev-tools-card"
          >
            {/* 当前登录状态 */}
            <div className="dev-tools-section">
              <h4>
                <EyeOutlined /> 当前状态
              </h4>
              {isAuthenticated && user ? (
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="用户名">
                    {user.username}
                  </Descriptions.Item>
                  <Descriptions.Item label="角色">
                    <Tag color={user.role === 'admin' ? 'red' : 'blue'}>
                      {user.role === 'admin' ? '管理员' : '商户'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="邮箱">
                    {user.email}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <p style={{ color: '#999', textAlign: 'center', padding: '12px 0' }}>
                  未登录
                </p>
              )}
            </div>

            {/* 快速登录按钮 */}
            <div className="dev-tools-section">
              <h4>⚡ 快速登录</h4>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  block
                  type="primary"
                  icon={<UserOutlined />}
                  onClick={mockMerchantLogin}
                >
                  模拟商户登录
                </Button>
                <Button
                  block
                  danger
                  icon={<CrownOutlined />}
                  onClick={mockAdminLogin}
                >
                  模拟管理员登录
                </Button>
                {isAuthenticated && (
                  <Button
                    block
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                  >
                    清除登录状态
                  </Button>
                )}
              </Space>
            </div>

            {/* 使用说明 */}
            <div className="dev-tools-section">
              <h4>📖 使用说明</h4>
              <ul style={{ fontSize: 12, color: '#666', paddingLeft: 20, margin: 0 }}>
                <li>点击"模拟商户登录"可快速切换到商户角色</li>
                <li>点击"模拟管理员登录"可切换到管理员角色</li>
                <li>登录状态会保存到 localStorage，刷新页面不会丢失</li>
                <li>⚠️ 此工具仅供开发测试使用</li>
              </ul>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default DevTools;
