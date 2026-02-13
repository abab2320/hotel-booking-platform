import { useRoutes, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

// 页面组件 - 后续开发时添加
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import HotelList from '@/pages/HotelManage/List';
import Layout from '@/components/Layout';
// import HotelEdit from '@/pages/HotelManage/Edit';
// import AuditList from '@/pages/HotelAudit/List';
// import AuditDetail from '@/pages/HotelAudit/Detail';

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
        path: 'hotels/new',
        element: <Placeholder title="新增酒店" />,
      },
      {
        path: 'hotels/:id',
        element: <Placeholder title="酒店详情" />,
      },
      {
        path: 'hotels/:id/edit',
        element: <Placeholder title="编辑酒店" />,
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
        element: <Placeholder title="酒店审核列表" />,
      },
      {
        path: 'hotels/:id',
        element: <Placeholder title="酒店审核详情" />,
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
