/**
 * 人工客服 WebSocket Hook
 * 负责管理客服端的 WebSocket 连接、会话管理和消息收发
 */

import { useState, useEffect, useRef } from 'react';
import { message as antMessage } from 'antd';
import { io, Socket } from 'socket.io-client';
import {
  refreshQueue,
  refreshConversationByStatus,
  getConversationMessages,
} from '@/services/chat';

// ==================== 类型定义 ====================

/** 会话状态枚举 */
export type ConversationStatus = 'waiting' | 'serving' | 'closed';

/** 会话信息 */
export interface Conversation {
  id: string;
  conversation_id: string;
  userId: string;
  user_id: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  unreadCount: number;
  updateTime: string;
  status: ConversationStatus;
  wait_time?: number;
  queue_position?: number;
  first_message?: string;
}

/** 消息信息 */
export interface Message {
  id: string;
  content: string;
  query?: string;
  answer?: string;
  senderId: string;
  senderName: string;
  createTime: string;
  created_at: number;
  type: 'text' | 'image';
  from_?: 'user' | 'human';
  from_source?: 'api' | 'human';
}

// ==================== 配置常量 ====================

const SERVER_URL = 'https://agent.kaimen.site';
const NAMESPACE = '/chat/human-service/human';
const SOCKET_PATH = '/chat/socket.io';

/**
 * 人工客服 Hook
 */
export const useCustomerService = (userId: string, userName: string) => {
  // ==================== 状态管理 ====================
  console.log('1111',userId, userName)
  /** WebSocket 连接实例 */
  const socketRef = useRef<Socket | null>(null);
  
  /** 是否已连接 */
  const [isConnected, setIsConnected] = useState(false);
  
  /** 当前会话 ID */
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  /** 当前用户 ID */
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  /** 当前会话的消息列表 */
  const [messages, setMessages] = useState<Message[]>([]);
  
  /** 等待队列列表 */
  const [waitingQueue, setWaitingQueue] = useState<Conversation[]>([]);
  
  /** 活跃会话列表 */
  const [activeConversations, setActiveConversations] = useState<Conversation[]>([]);
  
  /** 已结束会话列表 */
  const [closedConversations, setClosedConversations] = useState<Conversation[]>([]);
  
  /** 加载状态 */
  const [loading, setLoading] = useState(false);
  
  /** 排队人数 */
  const [queueCount, setQueueCount] = useState(0);
  
  /** 已订阅的会话集合（用于避免重复订阅） */
  const subscribedConversations = useRef<Set<string>>(new Set());
  
  /** 有新消息的会话集合 */
  const [conversationsWithNewMessages, setConversationsWithNewMessages] = useState<Set<string>>(new Set());

  // ==================== WebSocket 连接管理 ====================

  /**
   * 连接 WebSocket
   */
  const connect = () => {
    if (socketRef.current?.connected) {
      console.log('✅ WebSocket 已连接');
      return;
    }

    // 如果存在旧连接，先断开
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log('🔌 开始连接 WebSocket...');

    // 创建 Socket.IO 连接
    socketRef.current = io(SERVER_URL + NAMESPACE, {
      path: SOCKET_PATH,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      timeout: 20000,
    });

    // 连接成功
    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket 连接成功');
      
      // 发送客服上线通知
      socketRef.current?.emit('human_online', {
        type: 'human_online',
        data: {
          human_id: userId,
          human_name: userName,
          timestamp: Math.floor(Date.now() / 1000),
        },
      });
    });

    // 上线确认
    socketRef.current.on('human_online_ack', (data) => {
      console.log('✅ 客服上线确认', data);
      setIsConnected(true);
      
      // 清空订阅记录
      subscribedConversations.current.clear();
      
      // 刷新所有数据
      loadWaitingQueue();
      loadActiveConversations();
    });

    // 新会话通知
    socketRef.current.on('new_conversation', (data) => {
      console.log('🆕 新会话通知', data);
      antMessage.info('有新的客户请求接入');
      loadWaitingQueue();
    });

    // 接受会话确认
    socketRef.current.on('accept_conversation_ack', (data) => {
      console.log('✅ 接受会话确认', data);
      loadWaitingQueue();
      loadActiveConversations();
    });

    // 接收用户消息
    socketRef.current.on('user_message', (data) => {
      console.log('💬 收到用户消息', data);
      
      const msgData = data?.data || data || {};
      const conversationId = msgData.conversation_id;
      
      if (!conversationId) {
        console.warn('⚠️ 收到无效消息，缺少 conversation_id');
        return;
      }

      // 确保会话已订阅
      if (!subscribedConversations.current.has(conversationId)) {
        console.log('📝 自动订阅会话:', conversationId);
        acceptConversation(conversationId, msgData.user_id);
      }

      // 如果是当前会话的消息，添加到消息列表
      if (conversationId === currentConversationId) {
        const newMessage: Message = {
          id: `msg_${Date.now()}`,
          content: msgData.content || msgData.message_content || '',
          query: msgData.content || msgData.message_content || '',
          senderId: msgData.user_id || 'user',
          senderName: '用户',
          createTime: new Date().toISOString(),
          created_at: msgData.timestamp || Math.floor(Date.now() / 1000),
          type: 'text',
          from_: 'user',
        };
        
        setMessages((prev) => [...prev, newMessage]);
      } else {
        // 其他会话有新消息，添加到未读标记
        setConversationsWithNewMessages((prev) => new Set(prev).add(conversationId));
        antMessage.info(`收到来自会话 ${conversationId.slice(0, 8)}... 的新消息`);
      }
    });

    // 会话关闭事件
    socketRef.current.on('conversation_closed', (data) => {
      console.log('🔚 会话已关闭', data);
      
      const closedConversationId = data.data?.conversation_id;
      
      if (closedConversationId) {
        subscribedConversations.current.delete(closedConversationId);
        setConversationsWithNewMessages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(closedConversationId);
          return newSet;
        });
        
        // 如果关闭的是当前会话
        if (closedConversationId === currentConversationId) {
          antMessage.info('当前会话已结束');
        }
      }
      
      loadActiveConversations();
      loadClosedConversations();
    });

    // 断开连接
    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ WebSocket 断开连接:', reason);
      setIsConnected(false);
    });

    // 连接错误
    socketRef.current.on('connect_error', (error) => {
      console.error('❌ WebSocket 连接错误:', error);
      setIsConnected(false);
    });
  };

  /**
   * 断开 WebSocket
   */
  const disconnect = () => {
    if (!socketRef.current) return;

    console.log('🔌 断开 WebSocket 连接');

    try {
      if (socketRef.current.connected && isConnected) {
        // 发送下线通知
        socketRef.current.emit('human_offline', {
          type: 'human_offline',
          data: {
            timestamp: Math.floor(Date.now() / 1000),
          },
        });
      }

      socketRef.current.disconnect();
    } catch (error) {
      console.warn('⚠️ 断开连接失败:', error);
    } finally {
      socketRef.current = null;
      setIsConnected(false);
      subscribedConversations.current.clear();
      setConversationsWithNewMessages(new Set());
    }
  };

  // ==================== 数据加载函数 ====================

  /**
   * 加载等待队列
   */
  const loadWaitingQueue = async () => {
    try {
      const response = await refreshQueue();
      const queue = response?.queue || [];
      setWaitingQueue(queue);
      setQueueCount(queue.length);
    } catch (error) {
      console.error('❌ 加载等待队列失败:', error);
    }
  };

  /**
   * 加载活跃会话列表
   */
  const loadActiveConversations = async () => {
    try {
      const response = await refreshConversationByStatus({ status: 'connected' });
      const conversations = response?.conversations || [];
      setActiveConversations(conversations);
      
      // 自动订阅所有活跃会话
      if (socketRef.current?.connected && isConnected) {
        conversations.forEach((conv: any) => {
          const convId = conv.conversation_id;
          if (convId && !subscribedConversations.current.has(convId)) {
            console.log('📝 自动订阅活跃会话:', convId);
            acceptConversation(convId, conv.user_id);
          }
        });
      }
    } catch (error) {
      console.error('❌ 加载活跃会话失败:', error);
    }
  };

  /**
   * 加载已结束会话列表
   */
  const loadClosedConversations = async () => {
    try {
      const response = await refreshConversationByStatus({ status: 'closed' });
      setClosedConversations(response?.conversations || []);
    } catch (error) {
      console.error('❌ 加载已结束会话失败:', error);
    }
  };

  /**
   * 加载会话消息历史
   */
  const loadMessages = async (conversationId: string) => {
    setLoading(true);
    try {
      const response = await getConversationMessages(conversationId, {
        pageSize: 100,
      });
      setMessages(response?.data || response?.messages || []);
    } catch (error) {
      console.error('❌ 加载消息失败:', error);
      antMessage.error('加载消息失败');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== 会话操作函数 ====================

  /**
   * 接受会话
   * @param conversationId 会话 ID
   * @param userId 用户 ID
   */
  const acceptConversation = (conversationId: string, userId: string) => {
    if (!socketRef.current?.connected || !isConnected) {
      antMessage.error('WebSocket 未连接');
      return;
    }

    console.log('✅ 接受会话:', conversationId);

    // 发送接受会话消息
    if (!subscribedConversations.current.has(conversationId)) {
      socketRef.current.emit('accept_conversation', {
        type: 'accept_conversation',
        data: {
          conversation_id: conversationId,
          timestamp: Math.floor(Date.now() / 1000),
        },
      });
      subscribedConversations.current.add(conversationId);
    }

    // 设置为当前会话
    setCurrentConversationId(conversationId);
    setCurrentUserId(userId);
    
    // 清除新消息标记
    setConversationsWithNewMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(conversationId);
      return newSet;
    });

    // 加载消息历史
    loadMessages(conversationId);
  };

  /**
   * 切换到指定会话
   * @param conversationId 会话 ID
   * @param userId 用户 ID
   */
  const switchConversation = (conversationId: string, userId: string) => {
    acceptConversation(conversationId, userId);
  };

  /**
   * 关闭会话
   * @param conversationId 会话 ID
   */
  const closeConversation = (conversationId: string) => {
    if (!socketRef.current?.connected || !isConnected) {
      antMessage.error('WebSocket 未连接');
      return;
    }

    console.log('🔚 关闭会话:', conversationId);

    socketRef.current.emit('close_conversation', {
      type: 'close_conversation',
      data: {
        conversation_id: conversationId,
        close_reason: '客服主动关闭',
        timestamp: Math.floor(Date.now() / 1000),
      },
    });

    // 如果关闭的是当前会话，清除状态
    if (conversationId === currentConversationId) {
      setCurrentConversationId(null);
      setCurrentUserId(null);
      setMessages([]);
    }

    // 刷新列表
    setTimeout(() => {
      loadActiveConversations();
      loadWaitingQueue();
      loadClosedConversations();
    }, 500);
  };

  /**
   * 发送消息
   * @param content 消息内容
   */
  const sendMessage = (content: string) => {
    if (!currentConversationId) {
      antMessage.error('请先选择一个会话');
      return;
    }

    if (!socketRef.current?.connected || !isConnected) {
      antMessage.error('WebSocket 未连接');
      return;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      antMessage.error('消息内容不能为空');
      return;
    }

    console.log('📤 发送消息:', trimmedContent);

    // 添加消息到本地列表
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content: trimmedContent,
      answer: trimmedContent,
      senderId: userId,
      senderName: '客服',
      createTime: new Date().toISOString(),
      created_at: Math.floor(Date.now() / 1000),
      type: 'text',
      from_: 'human',
      from_source: 'human',
    };
    
    setMessages((prev) => [...prev, newMessage]);

    // 通过 WebSocket 发送消息
    socketRef.current.emit('human_message', {
      type: 'human_message',
      data: {
        conversation_id: currentConversationId,
        message_content: trimmedContent,
        message_type: 'text',
        timestamp: Math.floor(Date.now() / 1000),
      },
    });
  };

  // ==================== 生命周期 ====================

  /**
   * 组件挂载时自动连接
   */
  useEffect(() => {
    connect();
    // 已完成队列
    loadActiveConversations();
    loadWaitingQueue();
    loadClosedConversations();
    return () => {
      // 组件卸载时断开连接（可选，根据需求决定是否保持连接）
      // disconnect();
    };
  }, [userId, userName]);

  // ==================== 返回值 ====================

  return {
    // 连接状态
    isConnected,
    loading,
    
    // 当前会话
    currentConversationId,
    currentUserId,
    messages,
    
    // 会话列表
    waitingQueue,
    activeConversations,
    closedConversations,
    queueCount,
    conversationsWithNewMessages,
    
    // 操作方法
    connect,
    disconnect,
    acceptConversation,
    switchConversation,
    closeConversation,
    sendMessage,
    loadMessages,
    
    // 刷新方法
    loadWaitingQueue,
    loadActiveConversations,
    loadClosedConversations,
  };
};
