/**
 * 注册页面
 * 流程：填写信息 → 提交注册 → 邮箱接收验证链接 → 点击链接验证 → 完成注册
 */
import React, { useState } from 'react';
import { Radio, message } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { useNavigate } from 'react-router-dom';
import { register, resendVerification } from '@/services/auth';
import type { RegisterParams, UserRole } from '@/types';
import './Register.css';

interface RegisterInputProps {
  label: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

const RegisterInput: React.FC<RegisterInputProps> = ({ 
  label, 
  type = "text", 
  value,
  onChange, 
  error,
  disabled 
}) => {
  return (
    <>
      <div className="input-group">
        <label>{label}</label>
        <input 
          type={type} 
          placeholder={"请输入" + label} 
          value={value}
          onChange={onChange} 
          disabled={disabled}
        />
        {error && <span className="error-font">{error}</span>}
      </div>
    </>
  );
}



const options: CheckboxGroupProps['options'] = [
  { label: '管理员', value: 'admin' },
  { label: '商家', value: 'merchant' },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('merchant');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // 错误状态
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // 重新发送验证邮件
  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await resendVerification(email);
      message.success('验证邮件已重新发送，请查收');
    } catch (error: any) {
      message.error(error?.message || '发送失败，请稍后重试');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 重置错误
    setEmailError('');
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // 表单验证
    let hasError = false;

    if (!email) {
      setEmailError('邮箱不能为空');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('请输入有效的邮箱地址');
      hasError = true;
    }

    if (!username) {
      setUsernameError('用户名不能为空');
      hasError = true;
    } else if (username.length < 3 || username.length > 50) {
      setUsernameError('用户名长度应在3-50个字符之间');
      hasError = true;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('用户名只能包含字母、数字和下划线');
      hasError = true;
    }

    if (!password) {
      setPasswordError('密码不能为空');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('密码长度至少8个字符');
      hasError = true;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('密码必须包含大小写字母和数字');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('请确认密码');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('两次输入的密码不一致');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // 发送注册请求
    const params: RegisterParams = {
      email,
      username,
      password,
      role,
    };

    setIsRegistering(true);
    try {
      const response = await register(params);
      message.success('注册成功！验证邮件已发送到您的邮箱');
      console.log('注册成功:', response);
      
      // 显示验证提示界面
      setRegistrationSuccess(true);
    } catch (error: any) {
      console.error('注册失败:', error);
      
      // 根据错误信息给出友好提示
      if (error?.message?.includes('邮箱已被占用')) {
        setEmailError('该邮箱已被注册');
        message.error('该邮箱已被注册，请使用其他邮箱');
      } else {
        message.error(error?.message || '注册失败，请重试');
      }
      
      setIsRegistering(false);
    }
  };

  return (
    <>
      <div className='container'>
        <div className="title">
          <h1>易宿酒店管理端</h1>
        </div>
        <div className="card">
          {!registrationSuccess ? (
            // 注册表单
            <>
              <h2>注册</h2>
              <form onSubmit={handleSubmit}>
                <Radio.Group
                  options={options}
                  value={role}
                  optionType='button'
                  buttonStyle='solid'
                  onChange={(e) => setRole(e.target.value)}
                  style={{ marginBottom: '20px' }}
                  disabled={isRegistering}
                />
                <RegisterInput
                  label="邮箱"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  disabled={isRegistering}
                />
                <RegisterInput
                  label="用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={usernameError}
                  disabled={isRegistering}
                />
                <RegisterInput
                  label="密码"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  disabled={isRegistering}
                />
                <RegisterInput
                  label="确认密码"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={confirmPasswordError}
                  disabled={isRegistering}
                />
                
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
                  <p style={{ margin: '4px 0' }}>💡 注册后将发送验证邮件到您的邮箱</p>
                  <p style={{ margin: '4px 0' }}>📧 请查收邮件并点击链接完成验证</p>
                </div>
                
                <label className="toLogin">
                  已有账号？<a href="/login">登录</a>
                </label>
                <button 
                  type="submit" 
                  className="register-button"
                  disabled={isRegistering}
                >
                  {isRegistering ? '注册中...' : '注册'}
                </button>
              </form>
            </>
          ) : (
            // 注册成功，等待邮箱验证
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>📧</div>
              <h2 style={{ marginBottom: '16px', color: '#52c41a' }}>注册成功！</h2>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px', lineHeight: '1.8' }}>
                验证邮件已发送至<br />
                <strong style={{ color: '#1890ff' }}>{email}</strong>
              </p>
              <div style={{ 
                background: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'left',
                fontSize: '14px',
                lineHeight: '1.8'
              }}>
                <p style={{ margin: '4px 0' }}>✅ 请前往邮箱查收验证邮件</p>
                <p style={{ margin: '4px 0' }}>✅ 点击邮件中的验证链接完成验证</p>
                <p style={{ margin: '4px 0' }}>✅ 验证完成后即可登录使用</p>
              </div>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
                没有收到邮件？请检查垃圾邮件箱
              </p>
              <button 
                onClick={handleResendVerification}
                disabled={isResending}
                className="register-button"
                style={{ marginBottom: '12px' }}
              >
                {isResending ? '发送中...' : '重新发送验证邮件'}
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="register-button"
                style={{ background: '#fff', color: '#1890ff', border: '1px solid #1890ff' }}
              >
                前往登录
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
