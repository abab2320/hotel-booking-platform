import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useMemo } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { FolderOpenOutlined, ReconciliationOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { ROUTES } from '@/types/constants';
import { useAuthStore } from '@/store';
import './Layout.css';

/**
 * 主布局组件
 * 包含侧边栏、顶部导航等
 */
const { Header, Sider, Content } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 从全局状态获取用户信息和登出方法
  const { user, logout } = useAuthStore();

  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuProps['items'] = useMemo(() => [
    {
      key: ROUTES.MERCHANT.HOTELS,
      icon: React.createElement(ReconciliationOutlined),
      label: '酒店列表',
    },
    {
      key: 'drafts',
      icon: React.createElement(FolderOpenOutlined),
      label: '草稿箱',
    },
    {
      key: 'profile',
      icon: React.createElement(UserOutlined),
      label: '个人中心',
    },
  ], []);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'drafts') {
      navigate('/merchant/hotels?filter=drafts');
      return;
    }
    if (key === 'profile') {
      navigate('/profile');
      return;
    }
    navigate(String(key));
  };

  const userMenu = (
    <Menu
      items={[
        { key: 'profile', label: '个人资料', icon: React.createElement(UserOutlined) },
        { key: 'logout', label: '退出登录', icon: React.createElement(LogoutOutlined) },
      ]}
      onClick={({ key }) => {
        if (key === 'logout') {
          logout();
          navigate('/login');
        } else if (key === 'profile') {
          navigate('/profile');
        }
      }}
    />
  );

  const HeaderContent = () => {
    if(user == null) {
      // 这种情况理论上不应该发生，因为未登录用户会被重定向到登录页
      //navigate('/login');
      return null;
    }
    else if (user.role === 'admin') {
      return <span>欢迎管理员 {user.username}！</span>;
    }
    else if (user.role === 'merchant') {
      return <span>欢迎商户 {user.username}！</span>;
    }
  }

  //根据路由计算当前被选中的菜单项
  const selectedKeys = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/merchant/hotels')) return [ROUTES.MERCHANT.HOTELS];
    if (path.startsWith('/profile')) return ['profile'];
    return [];
  }, [location.pathname]);

  return (
    <AntLayout className="layout">
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        style = {{ position:'fixed', zIndex: 1001, height: '100vh' }}
        onCollapse={(c) => setCollapsed(c)}
        breakpoint="lg"
      >
        <div className="sider-logo">
          <span key={collapsed ? 'collapsed' : 'expanded'} className="sider-logo-text">
            {collapsed ? '易宿' : '易宿酒店管理系统'}
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          selectedKeys={selectedKeys}
        />
      </Sider>
      <AntLayout>
        <Header className="header">
          <div className="header-left">
            <div className="logo-short">{HeaderContent()}</div>
          </div>
          <div className="header-right">
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="user-info">
                <Avatar size="small" icon={<UserOutlined />} />
                <span className="user-name">{user?.username || '未登录'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={`content ${collapsed ? 'collapsed' : ''}`}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
