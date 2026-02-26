import { useRoutes, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

// 页面组件
import Login from '@/pages/Login/Login';
import Register from '@/pages/Register/Register';
import VerifyEmail from '@/pages/VerifyEmail/VerifyEmail';
import HotelList from '@/pages/HotelManage/List/HotelList';
import DraftBox from '@/pages/HotelManage/DraftBox/DraftBox';
import HotelEdit from '@/pages/HotelManage/Edit/HotelEdit';
import HotelDetail from '@/pages/HotelManage/Detail/HotelDetail';
import HotelAuditList from '@/pages/HotelAudit/List/HotelAuditList';
import HotelAuditDetail from '@/pages/HotelAudit/Detail';
import Profile from '@/pages/Profile';
import Layout from '@/components/Layout';

// 临时占位组件
const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: 24 }}>
    <h1>{title}</h1>
    <p>页面开发中...</p>
  </div>
);

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  // 商户路由（使用 Layout 框架）
  {
    path: '/merchant',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/merchant/hotels" replace />,
      },
      {
        path: 'hotels',
        element: <HotelList />,
      },
      {
        path: 'drafts',
        element: <DraftBox />,
      },
      {
        path: 'hotels/new',
        element: <HotelEdit />,
      },
      {
        path: 'hotels/:id',
        element: <HotelDetail />,
      },
      {
        path: 'hotels/:id/edit',
        element: <HotelEdit />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  // 管理员路由（使用 Layout 框架）
  {
    path: '/admin',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/hotels" replace />,
      },
      {
        path: 'hotels',
        element: <HotelAuditList />,
      },
      {
        path: 'hotels/:id',
        element: <HotelAuditDetail />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  // 404
  {
    path: '*',
    element: <Placeholder title="404 - 页面不存在" />,
  },
];

const AppRoutes = () => {
  return useRoutes(routes);
};

export default AppRoutes;
