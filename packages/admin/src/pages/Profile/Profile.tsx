/**
 * 个人中心页面
 * 功能：显示当前登录用户的基本信息
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Tag, Space, Modal } from 'antd';
import { UserOutlined, MailOutlined, LogoutOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/types/constants';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  /**
   * 处理退出登录
   * 弹窗确认后清除认证信息并跳转到登录页
   */
  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        logout();
        navigate(ROUTES.LOGIN);
      },
    });
  };

  /**
   * 格式化日期时间
   * @param dateString ISO 格式的日期字符串
   * @returns 格式化后的日期时间字符串
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  /**
   * 获取角色显示文本和标签颜色
   */
  const getRoleInfo = (role: string) => {
    const roleMap = {
      merchant: { text: '商户', color: 'blue' },
      admin: { text: '管理员', color: 'red' },
    };
    return roleMap[role as keyof typeof roleMap] || { text: '未知', color: 'default' };
  };

  // 如果用户未登录，显示提示信息
  if (!user) {
    return (
      <div className="profile-container">
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 16, color: '#999' }}>您尚未登录，请先登录</p>
            <Button type="primary" onClick={() => navigate(ROUTES.LOGIN)}>
              前往登录
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const roleInfo = getRoleInfo(user.role);

  return (
    <div className="profile-container">
      <Card className="profile-card">
        {/* 页面标题 */}
        <div className="profile-header">
          <h2 className="page-title">个人中心</h2>
        </div>

        {/* 用户信息卡片 */}
        <Card 
          type="inner" 
          title={
            <Space>
              <UserOutlined />
              <span>基本信息</span>
            </Space>
          }
          className="info-card"
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item 
              label={
                <Space>
                  <UserOutlined />
                  <span>用户名</span>
                </Space>
              }
            >
              {user.username}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  <MailOutlined />
                  <span>邮箱</span>
                </Space>
              }
            >
              {user.email}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  <SafetyOutlined />
                  <span>用户角色</span>
                </Space>
              }
            >
              <Tag color={roleInfo.color}>{roleInfo.text}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="用户 ID">
              {user.id}
            </Descriptions.Item>
            
            <Descriptions.Item label="注册时间">
              {formatDate(user.createdAt)}
            </Descriptions.Item>
            
            <Descriptions.Item label="最后更新">
              {formatDate(user.updatedAt)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 操作按钮 */}
        <div className="profile-actions">
          <Space size="middle">
            <Button 
              type="default" 
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
            <Button 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
