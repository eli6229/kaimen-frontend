/**
 * 交易模块 API 服务
 */
import { request } from '@/utils/request';
import type { OrderListParams, OrderDetail } from '@/types/trade';
import { generateMockOrderList, generateMockOrderDetail } from './trade.mock';

// 是否使用 Mock 数据（开发环境）
const USE_MOCK = process.env.NODE_ENV === 'development';

/**
 * 获取订单列表
 */
export function getOrderList(params: OrderListParams) {
  // 开发环境使用 Mock 数据
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = generateMockOrderList(50);
        const { page = 1, pageSize = 20 } = params;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        
        resolve({
          data: {
            list: mockData.slice(start, end),
            total: mockData.length,
          },
          success: true,
        });
      }, 500);
    });
  }
  
  return request.get('/api/order/list', { params });
}

/**
 * 获取订单详情
 */
export function getOrderDetail(orderId: string) {
  // 开发环境使用 Mock 数据
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: generateMockOrderDetail(orderId),
          success: true,
        });
      }, 500);
    });
  }
  
  return request.get(`/api/order/${orderId}`);
}

/**
 * 导出订单数据
 */
export function exportOrders(params: OrderListParams) {
  return request.get('/api/order/export', { 
    params,
    responseType: 'blob'
  });
}

/**
 * 取消订单
 */
export function cancelOrder(orderId: string, reason?: string) {
  return request.post('/api/order/cancel', { orderId, reason });
}

/**
 * 确认收货
 */
export function confirmReceipt(orderId: string) {
  return request.post('/api/order/confirm', { orderId });
}

/**
 * 申请退款
 */
export function applyRefund(orderId: string, reason: string, amount: number) {
  return request.post('/api/order/refund/apply', { orderId, reason, amount });
}

/**
 * 更新物流信息
 */
export function updateLogistics(orderId: string, logistics: {
  company: string;
  trackingNo: string;
}) {
  return request.post('/api/order/logistics/update', { orderId, ...logistics });
}
