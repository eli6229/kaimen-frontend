/**
 * appraisal相关接口
 */
import { request } from '@/utils/request';

export function getAppraisalList(data: any) {
  return request.get('/api/appraisal/list', { params: data });
}

export function getLightOrder(data: any) {
  return request.get('/api/appraisal/getLightOrder', { params: data });
}

export function addAppraisalLightResult(token: string, data: any) {
  return request.post(`/api/appraisal/lightResult/add?token=${token}`, { data });
}

export function addAppraisalResult(data: any) {
  return request.post('/api/appraisal/result/add', { data });
}

export function updateAppraisalInfo(data: any) {
  return request.post('/api/appraisal/update', { data });
}

export function getAppraisalBuyList(data: any) {
  return request.get('/api/appraisalBuy/query', { params: data });
}

export function getAppraisalConsignmentList(data: any) {
  return request.get('/api/appraisalConsignment/query', { params: data });
}

// 估价
export function addAppraisalEvaluate(data: any) {
  return request.post('/api/appraisal/evaluate', { data });
}

// 取消估价
export function cancelAppraisalEvaluate(data: any) {
  return request.post('/api/appraisal/cancelEvaluate', { data });
}

// 移动端估价
export function addAppraisalEvaluateOnPhon(token: string, data: any) {
  return request.post(`/api/appraisal/evaluateOnPhone?token=${token}`, { data });
}

// 移动端取消光速估价
export function cancelAppraisalEvaluateOnPhone(token: string, data: any) {
  return request.post(`/api/appraisal/cancelEvaluateOnPhone?token=${token}`, { data });
}
