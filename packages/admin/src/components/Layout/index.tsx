import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

/**
 * 主布局组件
 * 包含侧边栏、顶部导航等
 */
const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      {/* TODO: 实现侧边栏和顶部导航 */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
