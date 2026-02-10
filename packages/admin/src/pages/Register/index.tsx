/**
 * 注册页面
 */
import React, { useState } from 'react';
import { RegisterParams, UserRole } from '@/types';
import { register } from '@/services/auth';
import './Register.css';

const RegisterInput: React.FC<{ 
  label: string; 
  type?: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  error?: string; 
  isDisabled?: boolean;
  placeholder?: string;
}> = ({ label, type = 'text', value, onChange, error, isDisabled, placeholder }) => (
  <div className="input-group">
    <label>{label}</label>
    <input 
      type={type} 
      placeholder={placeholder || `请输入${label}`} 
      value={value} 
      onChange={onChange} 
      disabled={isDisabled} 
    />
    {error && <span className='error-font'>{error}</span>}
  </div>
);

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [role, setRole] = useState<UserRole>('merchant');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 发送验证码
  const handleSendCode = async () => {
    // 清空邮箱错误
    setEmailError('');
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('邮箱不能为空');
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError('邮箱格式不正确');
      return;
    }

    try {
      setIsSendingCode(true);
      // TODO: 调用发送验证码 API
      // await sendVerificationCode(email);
      console.log('发送验证码到:', email);
      alert('验证码已发送到您的邮箱');
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error('发送验证码失败:', err);
      alert('发送验证码失败，请稍后重试');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 表单提交
  const handleSubmit = async () => {
    // 清空所有错误
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setVerificationCodeError('');

    let hasError = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 表单验证
    if (!email) {
      setEmailError('邮箱不能为空');
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError('邮箱格式不正确');
      hasError = true;
    }

    if (!password) {
      setPasswordError('密码不能为空');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('密码长度不能少于6位');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('请确认密码');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('两次输入的密码不一致');
      hasError = true;
    }

    if (!verificationCode) {
      setVerificationCodeError('验证码不能为空');
      hasError = true;
    } else if (verificationCode.length !== 6) {
      setVerificationCodeError('验证码为6位数字');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // 发送注册请求
    const params: RegisterParams = {
      username: email,
      password: password,
      role: role,
    };

    try {
      setIsRegistering(true);
      const res = await register(params);
      console.log('注册成功:', res);
      alert('注册成功！请登录');
      window.location.href = '/login';
    } catch (err) {
      console.error('注册失败:', err);
      const errorMsg = err instanceof Error ? err.message : '注册失败，请重试';
      alert(errorMsg);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="container">
      <div className="title">
        <h1>易宿酒店管理端</h1>
      </div>
      <div className="card">
        <h2>注册</h2>
        <form className="form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <RegisterInput
            label="邮箱"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={emailError}
            isDisabled={isRegistering}
            placeholder="请输入邮箱地址"
          />

          <div className="input-group">
            <label>邮箱验证码</label>
            <div className="code-input-wrapper">
              <input
                type="text"
                placeholder="请输入6位验证码"
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value)}
                disabled={isRegistering}
                maxLength={6}
              />
              <button
                type="button"
                className="send-code-btn"
                onClick={handleSendCode}
                disabled={isSendingCode || countdown > 0 || isRegistering}
              >
                {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
              </button>
            </div>
            {verificationCodeError && <span className='error-font'>{verificationCodeError}</span>}
          </div>

          <RegisterInput
            label="密码"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={passwordError}
            isDisabled={isRegistering}
            placeholder="至少6位密码"
          />

          <RegisterInput
            label="确认密码"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            error={confirmPasswordError}
            isDisabled={isRegistering}
            placeholder="请再次输入密码"
          />

          <div className="input-group">
            <label>注册角色</label>
            <div className="role-selector">
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="merchant"
                  checked={role === 'merchant'}
                  onChange={e => setRole(e.target.value as UserRole)}
                  disabled={isRegistering}
                />
                <span>商户</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={e => setRole(e.target.value as UserRole)}
                  disabled={isRegistering}
                />
                <span>管理员</span>
              </label>
            </div>
          </div>

          <label className="to-login">
            已有账号？<a href="/login">立即登录</a>
          </label>

          <button
            className="register-button"
            type="submit"
            disabled={isRegistering}
          >
            {isRegistering ? '注册中...' : '注册'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
