/**
 * 登录页面
<<<<<<< HEAD
 * TODO: 根据错误码实现详细的错误信息显示
=======
 * TODO: 实现登录表单
>>>>>>> ece3e32a8077af697785812640beeb6b4551a696
 */
import React from 'react';
import { useState } from 'react';
import { LoginParams } from '@/types';
import{ login } from '@/services/auth';
import { useAuthStore } from '@/store';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
=======
>>>>>>> ece3e32a8077af697785812640beeb6b4551a696
import './Login.css';

const LoginInput: React.FC<{ label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; isDisabled?: boolean }> = ({ label, type = 'text', value, onChange, error, isDisabled }) => (
  <div className="input-group">
    <label>{label}</label>
    <input type={type} placeholder={`请输入${label}`} value={value} onChange={onChange} disabled={isDisabled} />
    {error && <span className='error-font'>{error}</span>}
  </div>
);

const Login: React.FC = () => {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [accountError, setAccountError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLogging,setIsLogging] = useState(false);
<<<<<<< HEAD
    const navigate = useNavigate();
=======
>>>>>>> ece3e32a8077af697785812640beeb6b4551a696

    function handleSubmit(){
        //登录表单验证
        setAccountError('');
        setPasswordError('');
        
        //表单验证并生成错误信息
        let hasError = false;
        if(!account){
            setAccountError('账号不能为空');
            hasError = true;
        }
        if(!password){
            setPasswordError('密码不能为空');
            hasError = true;
        }
        if(hasError){
            return;
        }

        //发送登录请求
        const params: LoginParams = {
            username: account,
            password: password,
        };
        console.log('登录参数:', params);
        setIsLogging(true);
        login(params)
            .then(res => {
                console.log('登录成功:', res);
                useAuthStore.getState().setAuth(res.token, res.user);
                
                // 根据用户角色自动跳转到对应页面
<<<<<<< HEAD
               const routes = {
                    merchant: '/merchant/dashboard',
                    admin: '/admin/dashboard',
                    default: '/',
               };
               navigate(routes[res.user.role]);
            })
            .catch(err => {
                console.error('登录失败:', err);
                //message.error(err.message || '登录失败，请重试');
                //现在还没有根据错误码类型，进行详细的错误提示，后续可以根据后端返回的错误码，进行更细化的错误提示
                //TODO: 根据后端返回的错误码，进行更细化的错误提示
                message.error('登录失败，请检查账号和密码');
=======
                if (res.user.role === 'merchant') {
                    window.location.href = '/merchant/hotels';
                } else if (res.user.role === 'admin') {
                    window.location.href = '/admin/audit';
                } else {
                    window.location.href = '/';
                }
            })
            .catch(err => {
                console.error('登录失败:', err);
                const errorMsg = err instanceof Error ? err.message : '登录失败，请检查账号密码';
                alert(errorMsg);
>>>>>>> ece3e32a8077af697785812640beeb6b4551a696
                setIsLogging(false);
            });
    }

  return (
    <div className="container">
        <div className="title">
            <h1>易宿酒店管理端</h1>
        </div>
        <div className = "card">  
            <h2>登录</h2>
            <form className = "form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                <LoginInput 
                    label="账号" 
                    value={account} 
                    onChange={e => setAccount(e.target.value)}
                    error={accountError} isDisabled={isLogging} />
                <LoginInput 
                    label="密码" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    error={passwordError} isDisabled={isLogging} />
                <label className = "toRegister">没有账号？<a href="/register">注册</a></label>
                <button 
                    className="login-button" 
                    type="submit" 
                    disabled={isLogging}
                >
<<<<<<< HEAD
                    {isLogging ? '登录中' : '登录'}
                    {isLogging && <Spin size="small" style={{ marginLeft: 8, color: '#fff' }} />}
=======
                    {isLogging ? '登录中...' : '登录'}
>>>>>>> ece3e32a8077af697785812640beeb6b4551a696
                </button>
            </form>
        </div>
    </div>
  );
};

export default Login;
