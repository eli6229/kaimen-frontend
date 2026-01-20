/**
 * chat相关接口
 */
import { chat_request } from '@/utils/request';

export function refreshQueue() {
  return chat_request.get('/chat/api/human-service/queue');
}

export function refreshConversationByStatus(data: any) {
  return chat_request.get('/chat/api/human-service/conversations', { params: data });
}

export function refreshStats() {
  return chat_request.get('/chat/api/human-service/stats');
}

export function getConversationMessages(conversationId: string, data: any) {
  return chat_request.get(`/chat/api/human-service/conversations/${conversationId}/messages`, { params: data });
}

export function getUserConversations(data: any) {
  return chat_request.get('/chat/users/messages', { params: data });
}

// AI润色
export function polishAppraisal(data: any) {
  return chat_request.post('/chat/api/appraisal/polish', { data });
}
