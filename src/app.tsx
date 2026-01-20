// 运行时配置
import { history } from '@umijs/max';
import { message } from 'antd';
import type { RequestConfig } from '@umijs/max';
import RightContent from '@/components/RightContent';
import { RuntimeConfig } from 'umi';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string; userInfo?: any }> {
  // 从 localStorage 获取用户信息
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  
  // 如果没有登录且不在登录页，跳转到登录页
  if (!userInfo && location.pathname !== '/login') {
    history.push('/login');
  }
  
  return { 
    name: userInfo?.name || '@umijs/max',
    userInfo,
  };
}

export const layout: RuntimeConfig['layout'] = (initialState) => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    title: '后台管理11',
    layout: 'mix', // 使用 mix 布局
    menu: {
      locale: false,
    },
    // 自定义右侧内容渲染
    rightContentRender: () => {
      return <RightContent />;
    },
    // 退出登录
    logout: () => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      history.push('/login');
    },
  };
};


// http://kaimen-web-prod-164046-6-1360990667.sh.run.tcloudbase.com
// 请求配置
export const request: RequestConfig = {
  // 请求基础URL，根据环境变量配置
  baseURL:'http://kaimen-web-prod-164046-6-1360990667.sh.run.tcloudbase.com',
  //  process.env.API_BASE_URL || 'http://localhost:8080',
  // 请求超时时间
  timeout: 10000,

  // 请求拦截器
  requestInterceptors: [
    (url: string, options: any) => {
      // 如果请求头中已经有 Authorization，不要覆盖
      if (options.headers?.Authorization) {
        return { url, options };
      }
      
      // 从 localStorage 获取 token
      const token = localStorage.getItem('token');
      
      // 如果有 token，添加到请求头
      if (token) {
        const headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
        return {
          url,
          options: { ...options, headers },
        };
      }
      
      return { url, options };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      // 检查 response 是否存在
      if (!response) {
        console.error('Response is null or undefined');
        return {};
      }

      const { data } = response;
      console.log('response',data,  data?.error);
      
      // 如果返回 401，说明未授权，跳转到登录页
      if (data?.error && data.error.code >= 400) {
        message.error(data.error.message);
        if (data.error.code === 401) {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
          history.push('/login');
        }
      }
      
      return response || {};
    },
  ],

  // 错误处理
  errorConfig: {
    errorHandler: (error: any) => {
      console.log(error,'error')
      if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        console.error('Response error:', error.response);
      } else if (error.request) {
        // 请求已发出，但没有收到响应
        message.error('网络错误，请检查网络连接');
        console.error('Request error:', error.request);
      } else {
        // 发送请求时出了点问题
        message.error('请求失败：' + error.message);
        console.error('Error:', error.message);
      }
      throw error;
    },
  },
};
