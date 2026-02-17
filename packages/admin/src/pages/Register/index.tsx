//TODO:完成注册界面的逻辑部分，以及前后端链接部分

import React, { useState } from 'react';
import { Radio, message } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { useNavigate } from 'react-router-dom';
import { register } from '@/services/auth';
import type { RegisterParams, UserRole } from '@/types';
import SendButton from '@/components/Form/SendButton';
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

interface EmailInputProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, error, disabled }) => {
  return (
    <>
      <div className="input-group">
        <label>邮箱</label>
        <div className="email-group">
          <input 
            type="email" 
            placeholder={"请输入邮箱"} 
            value={value}
            onChange={onChange} 
            disabled={disabled}
          />
          <SendButton />
        </div>
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
  const [role, setRole] = useState<UserRole>('merchant');
  const [isRegistering, setIsRegistering] = useState(false);

  // 错误状态
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 重置错误
    setEmailError('');
    setUsernameError('');
    setPasswordError('');

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
      await register(params);
      message.success('注册成功，请前往邮箱完成验证后登录');
      // 3秒后跳转到登录页
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('注册失败:', error);
      message.error(error?.message || '注册失败，请重试');
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
            <EmailInput
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
        </div>
      </div>
    </>
  );
};

export default Register;
