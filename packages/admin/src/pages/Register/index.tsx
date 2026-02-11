//TODO:完成注册界面

import React from 'react';
import {Radio} from 'antd';
import {CheckboxGroupProps} from 'antd/es/checkbox';
import './Register.css';

interface RegisterInputProps{
    label: string;
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegisterInput: React.FC<RegisterInputProps> = ({ label, type = "text", onChange }) => {
    return(
        <>
        <div className = "input-group">
            <label>{label}</label>
            <input type={type} placeholder={"请输入"+label} onChange={onChange} />
        </div>
        </>
    )
}

interface EmailInputProps{
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({onChange}) => {
    return(
        <>
        <div className = "input-group">
            <label>邮箱</label>
            <div className="email-group">
            <input type="email" placeholder={"请输入邮箱"} onChange={onChange} />
            <button type="button" className='send-button' onClick={() => alert('发送验证码功能尚未实现')}>发送验证码</button>
            </div>
        </div>
        </>
    )
}

const options: CheckboxGroupProps['options'] = [
    { label: '管理员', value: 'admin' },
    { label: '商家', value: 'merchant' },
];

const Register: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState('admin');

  return (
    <>
    <div className = 'container'>
        <div className = "card">
        <h2>注册</h2>
        <form>
            <Radio.Group 
                options={options} 
                defaultValue="admin" 
                optionType='button' 
                buttonStyle='solid' 
                onChange={(e) => setRole(e.target.value)} 
                style = {{ marginBottom: '10px'}}
            />
            <EmailInput onChange={(e) => setEmail(e.target.value)} />
            <RegisterInput label="密码" type="password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className = "register-button">注册</button>
        </form>
        </div>
    </div>
    </>
  )
};

export default Register;