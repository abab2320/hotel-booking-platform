import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/index';
import DevTools from '@/components/DevTools';

function App() {
  // 判断是否为开发环境
  const isDevelopment = import.meta.env.DEV;

  return (
    <BrowserRouter>
      <AppRoutes />
      {/* 仅在开发环境显示开发工具 */}
      {isDevelopment && <DevTools />}
    </BrowserRouter>
  );
}

export default App;
