/**
 * 邮箱验证页面
 * 处理邮件中的验证链接
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '@/services/auth';
import './VerifyEmail.css';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('failed');
      setErrorMessage('验证链接无效');
      return;
    }

    // 调用验证接口
    verifyEmail(token)
      .then(() => {
        setStatus('success');
      })
      .catch((error: any) => {
        setStatus('failed');
        setErrorMessage(error?.message || '邮箱验证失败或链接已失效');
      });
  }, [searchParams]);

  return (
    <div className='verify-container'>
      <div className="verify-title">
        <h1>易宿酒店管理端</h1>
      </div>
      <div className="verify-card">
        {status === 'verifying' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="verify-spinner"></div>
            <h2 style={{ marginTop: '20px', color: '#666' }}>正在验证邮箱...</h2>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ marginBottom: '16px', color: '#52c41a' }}>邮箱验证成功！</h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
              您的账号已激活，现在可以登录使用了
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="verify-button"
            >
              前往登录
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ marginBottom: '16px', color: '#ff4d4f' }}>验证失败</h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
              {errorMessage}
            </p>
            <div style={{ color: '#999', fontSize: '14px', marginBottom: '24px' }}>
              <p>可能的原因：</p>
              <p>• 验证链接已过期</p>
              <p>• 验证链接已被使用</p>
              <p>• 验证链接格式不正确</p>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="verify-button"
              style={{ marginBottom: '12px' }}
            >
              返回注册页面
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="verify-button"
              style={{ background: '#fff', color: '#1890ff', border: '1px solid #1890ff' }}
            >
              前往登录
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
