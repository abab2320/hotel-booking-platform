import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useMemo } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { 
  FolderOpenOutlined, 
  ReconciliationOutlined, 
  UserOutlined, 
  LogoutOutlined,
  AuditOutlined,
} from '@ant-design/icons';
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

  /**
   * 根据用户角色动态生成菜单项
   * 商户角色：酒店列表、草稿箱、个人中心
   * 管理员角色：酒店审核、个人中心
   */
  const menuItems: MenuProps['items'] = useMemo(() => {
    // 如果用户未登录，返回空菜单
    if (!user) return [];

    // 商户角色菜单
    if (user.role === 'merchant') {
      return [
        {
          key: ROUTES.MERCHANT.HOTELS,
          icon: React.createElement(ReconciliationOutlined),
          label: '酒店列表',
        },
        {
          key: ROUTES.MERCHANT.DRAFTS,
          icon: React.createElement(FolderOpenOutlined),
          label: '草稿箱',
        },
        {
          key: ROUTES.MERCHANT.PROFILE,
          icon: React.createElement(UserOutlined),
          label: '个人中心',
        },
      ];
    }

    // 管理员角色菜单
    if (user.role === 'admin') {
      return [
        {
          key: ROUTES.ADMIN.HOTELS,
          icon: React.createElement(AuditOutlined),
          label: '酒店审核',
        },
        {
          key: ROUTES.ADMIN.PROFILE,
          icon: React.createElement(UserOutlined),
          label: '个人中心',
        },
      ];
    }

    // 默认返回空菜单
    return [];
  }, [user]);

  /**
   * 菜单点击处理
   * 统一导航到目标路由，支持商户和管理员两种角色的路由
   */
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(String(key));
  };

  /**
   * 用户下拉菜单
   * 包含个人资料和退出登录，根据用户角色导航到对应的个人中心
   */
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
          // 根据用户角色导航到对应的个人中心页面
          const profileRoute = user?.role === 'admin' ? ROUTES.ADMIN.PROFILE : ROUTES.MERCHANT.PROFILE;
          navigate(profileRoute);
        }
      }}
    />
  );

  /**
   * 顶部欢迎信息
   * 根据用户角色显示不同的欢迎语
   */
  const HeaderContent = () => {
    // 用户未登录（理论上不应该发生，因为会被重定向到登录页）
    if (!user) {
      return null;
    }
    
    // 根据角色显示不同的欢迎语
    if (user.role === 'admin') {
      return <span>欢迎管理员 {user.username}！</span>;
    }
    
    if (user.role === 'merchant') {
      return <span>欢迎商户 {user.username}！</span>;
    }
    
    return <span>欢迎 {user.username}！</span>;
  };

  /**
   * 根据当前路由计算选中的菜单项
   * 支持商户和管理员两种角色的路由匹配
   */
  const selectedKeys = useMemo(() => {
    const path = location.pathname;
    
    // 管理员路由匹配
    if (path.startsWith('/admin/profile')) return [ROUTES.ADMIN.PROFILE];
    if (path.startsWith('/admin/hotels')) return [ROUTES.ADMIN.HOTELS];
    
    // 商户路由匹配
    if (path.startsWith('/merchant/profile')) return [ROUTES.MERCHANT.PROFILE];
    if (path.startsWith('/merchant/drafts')) return [ROUTES.MERCHANT.DRAFTS];
    if (path.startsWith('/merchant/hotels')) return [ROUTES.MERCHANT.HOTELS];
    
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
        {/* 侧边栏标题 - 根据收起状态显示不同文本 */}
        <div className="sider-logo">
          <span key={collapsed ? 'collapsed' : 'expanded'} className="sider-logo-text">
            {collapsed ? '易宿' : '易宿酒店管理系统'}
          </span>
        </div>
        {/* 菜单 - 根据用户角色动态显示菜单项 */}
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          selectedKeys={selectedKeys}
        />
      </Sider>
      <AntLayout>
        {/* 顶部导航栏 - 显示欢迎信息和用户下拉菜单 */}
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
        {/* 内容区域 - 渲染子路由 */}
        <Content className={`content ${collapsed ? 'collapsed' : ''}`}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
