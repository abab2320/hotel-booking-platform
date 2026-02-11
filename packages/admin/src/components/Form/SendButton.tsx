import react, { useEffect } from 'react';
import './SendButton.css';

const SendButton: React.FC = () => {
    //发送验证码的60秒倒计时
    const [countdown, setCountdown] = react.useState(0);

    useEffect(() => {
        if(countdown <= 0) return 
        else{
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const onSendCode = () => {
        alert('发送验证码功能尚未实现');
        setCountdown(60);
    }

    return(
        <button type="button" 
            className='send-button' 
            onClick={onSendCode}
            disabled={countdown > 0}
        >
            {countdown > 0 ? `重新发送(${countdown}s)` : '发送验证码'}
        </button>
    )
}

export default SendButton;