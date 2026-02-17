import request from '@/utils/request';
import type { LoginParams, LoginResult, RegisterParams, User } from '@/types';

/** 用户登录 */
export const login = (params: LoginParams) => {
  return request.post<LoginResult>('/auth/login', params);
};

/** 用户注册 */
export const register = (params: RegisterParams) => {
  return request.post<User>('/auth/register', params);
};

/** 获取当前用户信息 */
export const getProfile = () => {
  return request.get<User>('/auth/profile');
};

/** 邮箱验证 */
export const verifyEmail = (token: string) => {
  return request.get(`/auth/verify-email?token=${token}`);
};

/** 重新发送验证邮件 */
export const resendVerification = (email: string) => {
  return request.post('/auth/resend-verification', { email });
};
