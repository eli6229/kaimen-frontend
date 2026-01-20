/**
 * 用户相关接口
 */
import { request } from '@/utils/request';

export function userLogin(name: string, password: string) {
  return request.post('/api/auth/login', {
    data: { username: name, password: password },
  });
}

export function userRegister(data: any) {
  return request.post('/api/user/register', { data });
}

export function useUpdate(data: any) {
  return request.post('/api/user/update', { data });
}

export function userDelete(userId: string) {
  return request.delete(`/api/user/${userId}`);
}

export function getWechatUserList(data: any) {
  return request.get('/api/user/wechat/list', { params: data });
}

export function getWechatUserInfo(userId: string) {
  return request.get(`/api/user/wechat/${userId}`);
}

export function getAdminUserList(data: any) {
  return request.get('/api/user/list', { params: data });
}
