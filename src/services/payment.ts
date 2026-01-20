/**
 * payment相关接口
 */
import { request } from '@/utils/request';

export function getPaymentList(data: any) {
  return request.get('/api/payment/list', { params: data });
}

export function getPaymentRefundList(data: any) {
  return request.get('/api/payment/refund/list', { params: data });
}

export function requestRefund(data: any) {
  return request.post('/api/payment/requestRefund', { data });
}

export function resetPayStatus(outTradeNO: string) {
  return request.get(`/api/payment/resetPayStatus/${outTradeNO}`);
}

export function refreshPayStatus(outTradeNO: string) {
  return request.get(`/api/payment/refreshPayStatus/${outTradeNO}`);
}

export function refreshRefundStatus(outTradeNO: string) {
  return request.get(`/api/payment/refreshRefundStatus/${outTradeNO}`);
}

export function resetRefundStatus(outTradeNO: string) {
  return request.get(`/api/payment/resetRefundStatus/${outTradeNO}`);
}
