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
