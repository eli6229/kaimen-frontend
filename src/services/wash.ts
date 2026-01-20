/**
 * 洗护相关接口
 */
import { request } from '@/utils/request';

export function getWashList(data: any) {
  return request.get('/api/wash/getWashList', { params: data });
}

export function completeWashOrder(data: any) {
  return request.post('/api/wash/complete', { data });
}

export function closeWashOrder(data: any) {
  return request.post('/api/wash/close', { data });
}
