import { request as umiRequest } from '@umijs/max';

/**
 * 获取认证头
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
/**
 * 主请求实例
 */
export const request = {
  get: (url: string, options?: any) => {
    return umiRequest(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });
  },
  post: (url: string, options?: any) => {
    return umiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });
  },
  put: (url: string, options?: any) => {
    return umiRequest(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });
  },
  delete: (url: string, options?: any) => {
    return umiRequest(url, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });
  },
};

/**
 * 聊天服务请求实例
 * 使用环境变量配置的聊天服务地址
 */
export const chat_request = {
  get: (url: string, options?: any) => {
    const { headers: optionHeaders, ...restOptions } = options || {};
    return umiRequest(url, {
      method: 'GET',
      baseURL: 'https://agent.kaimen.site',
      ...restOptions,
      headers: {
        ...optionHeaders,
        'Authorization': 'Bearer app-s8l0tNc5oPbHVJBeoLCXoPMg',
      },
    });
  },
  post: (url: string, options?: any) => {
    const { headers: optionHeaders, ...restOptions } = options || {};
    return umiRequest(url, {
      method: 'POST',
      baseURL: 'https://agent.kaimen.site',
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...optionHeaders,
        'Authorization': 'Bearer app-s8l0tNc5oPbHVJBeoLCXoPMg',
      },
    });
  },
};
