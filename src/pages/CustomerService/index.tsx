import { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  List, 
  Badge, 
  Input, 
  Button, 
  Space, 
  Avatar,
  Empty,
  Spin,
  message,
  Tag,
  Tabs 
} from 'antd';
import { UserOutlined, SendOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { useCustomerService } from '@/hooks/useCustomerService';
import dayjs from 'dayjs';
import styles from './index.less';

/**
 * 输入框区域组件
 * 独立组件，避免父组件重新渲染时重新创建
 */
const InputArea: React.FC<{
  currentConversationId: string | null;
  readonly: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}> = ({ currentConversationId, readonly, inputValue, onInputChange, onSend }) => {
  if (!currentConversationId) return null;

  if (readonly) {
    return (
      <div className={styles.inputArea}>
        <div style={{ 
          padding: '12px 0', 
          background: '#f5f5f5', 
          borderRadius: '4px',
          textAlign: 'center',
          color: '#999'
        }}>
          这是历史会话记录，无法发送新消息
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inputArea}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <Input.TextArea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
          autoSize={{ minRows: 2, maxRows: 4 }}
          style={{ flex: '0 0 80%', minHeight: '54px'}}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={onSend}
          disabled={!inputValue.trim()}
          style={{ flex: '0 0 calc(20% - 8px)', height: 'auto', minHeight: '54px', borderRadius:'6px' }}
        >
          发送
        </Button>
      </div>
    </div>
  );
};

/**
 * 人工客服页面
 * 功能：
 * 1. 接受等待队列中的客户会话
 * 2. 管理活跃会话（切换、关闭）
 * 3. 收发消息
 * 4. 查看已结束会话
 */
const CustomerServicePage: React.FC = () => {
  // ==================== 状态管理 ====================
  
  /** 获取用户信息 */
  const { userInfo } = useModel('global');
  console.log('2222',userInfo)
  /** 消息输入内容 */
  const [inputValue, setInputValue] = useState('');
  
  /** 消息列表滚动容器引用 */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  /** 移动端：是否显示聊天页面（隐藏列表） */
  const [showMobileChatView, setShowMobileChatView] = useState(false);
  
  /** 检测是否为移动端 */
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // 检测屏幕大小
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /** 使用人工客服 Hook */
  const {
    isConnected,
    loading,
    currentConversationId,
    currentUserId,
    messages,
    waitingQueue,
    activeConversations,
    closedConversations,
    queueCount,
    conversationsWithNewMessages,
    connect,
    disconnect,
    acceptConversation,
    switchConversation,
    closeConversation,
    sendMessage,
    loadWaitingQueue,
    loadActiveConversations,
    loadClosedConversations,
  } = useCustomerService(
    userInfo?.userId,
    userInfo?.nickname || userInfo?.name || '客服'
  );

  // ==================== 工具函数 ====================

  /**
   * 滚动消息列表到底部
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * 格式化时间戳
   * 使用 dayjs 统一处理时间格式
   */


  // ==================== 事件处理 ====================

  /**
   * 发送消息
   */
  const handleSendMessage = () => {
    const content = inputValue.trim();
    if (!content) {
      return;
    }

    sendMessage(content);
    setInputValue('');
    setTimeout(scrollToBottom, 100);
  };

  /**
   * 接受等待队列中的会话
   */
  const handleAcceptConversation = (conversationId: string, userId: string) => {
    acceptConversation(conversationId, userId);
    // 移动端：显示聊天页面
    if (isMobile) {
      setShowMobileChatView(true);
    }
    setTimeout(scrollToBottom, 500);
  };

  /**
   * 切换到指定会话
   */
  const handleSwitchConversation = (conversationId: string, userId: string) => {
    switchConversation(conversationId, userId);
    // 移动端：显示聊天页面
    if (isMobile) {
      setShowMobileChatView(true);
    }
    setTimeout(scrollToBottom, 500);
  };
  
  /**
   * 返回用户列表（移动端）
   */
  const handleBackToList = () => {
    setShowMobileChatView(false);
  };

  /**
   * 关闭指定会话
   */
  const handleCloseConversation = (conversationId: string) => {
    closeConversation(conversationId);
  };

  /**
   * 刷新所有数据
   */
  const handleRefreshAll = () => {
    loadWaitingQueue();
    loadActiveConversations();
    loadClosedConversations();
    message.success('刷新成功');
  };

  // ==================== 生命周期 ====================

  /**
   * 监听消息变化，自动滚动到底部
   */
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  // ==================== 渲染函数 ====================

  /**
   * 渲染用户列表项
   */
  const renderConversationItem = (item: any, type: 'waiting' | 'active' | 'closed') => {
    const isActive = currentConversationId === item.conversation_id;
    const hasNewMessage = conversationsWithNewMessages.has(item.conversation_id);
    
    return (
      <List.Item
        key={item.conversation_id}
        className={isActive ? styles.activeItem : styles.listItem}
        onClick={() => {
          if (type === 'waiting') {
            handleAcceptConversation(item.conversation_id, item.user_id);
          } else if (type === 'active') {
            handleSwitchConversation(item.conversation_id, item.user_id);
          } else {
            // 已关闭会话，只查看
            switchConversation(item.conversation_id, item.user_id);
          }
        }}
      >
        <List.Item.Meta
          avatar={
            type === 'waiting' ? (
              <Badge count={item.queue_position} size="small" style={{ backgroundColor: '#ff4d4f' }}>
                <Avatar icon={<UserOutlined />} />
              </Badge>
            ) : (
              <Badge dot={hasNewMessage}>
                <Avatar icon={<UserOutlined />} />
              </Badge>
            )
          }
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>用户 {item.user_id}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {type === 'waiting' && item.wait_time && (
                  <span style={{ fontSize: '11px', color: '#ff4d4f' }}>
                    等待 {item.wait_time}s
                  </span>
                )}
                {type === 'active' && item.updateTime && (
                  <span style={{ fontSize: '11px', color: '#999' }}>
                    {dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                )}
                {type === 'closed' && item.closed_at && (
                  <span style={{ fontSize: '11px', color: '#999' }}>
                    {dayjs(item.closed_at*1000).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                )}
                {isActive && type === 'active' && (
                  <Tag color="success" style={{ margin: 0, fontSize: '11px', padding: '0 4px' }}>
                    当前
                  </Tag>
                )}
              </div>
            </div>
          }
          description={
            <div style={{ 
              fontSize: '13px',
              color: hasNewMessage ? '#000' : '#666',
              fontWeight: hasNewMessage ? 500 : 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '220px',
              marginTop: '4px'
            }}>
              {item.lastMessage || item.first_message || '暂无消息'}
            </div>
          }
        />
      </List.Item>
    );
  };

  /**
   * 渲染聊天区域（包含消息列表和输入框）
   */
  const renderChatArea = (showCloseButton: boolean = true, readonly: boolean = false) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Card
          title={
            <Space>
              {/* 移动端：显示返回按钮 */}
              {isMobile && (
                <Button 
                  type="text" 
                  icon={<span>←</span>} 
                  onClick={handleBackToList}
                  style={{ padding: '4px 8px' }}
                />
              )}
              {currentConversationId ? (
                <>
                  <span>会话: {currentConversationId.slice(0, 8)}...</span>
                  <Tag>用户ID: {currentUserId}</Tag>
                </>
              ) : (
                <span>请选择会话</span>
              )}
            </Space>
          }
          extra={
            currentConversationId && showCloseButton && !isMobile && (
              <Button 
                danger 
                size="small"
                onClick={() => handleCloseConversation(currentConversationId)}
              >
                结束会话
              </Button>
            )
          }
          bodyStyle={{ 
            padding: 0, 
            height: isMobile ? 'calc(100vh - 360px)' : 'calc(100vh - 400px)', 
            overflow: 'auto' 
          }}
          style={{ flex: 1 }}
        >
          {!currentConversationId ? (
            <Empty description="请从左侧选择或接受一个会话" style={{ marginTop: 100 }} />
          ) : loading ? (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
              <Spin size="large" tip="加载消息中..." />
            </div>
          ) : (
            <div className={styles.messageList}>
              {messages.length === 0 ? (
                <Empty description="暂无消息" style={{ marginTop: 50 }} />
              ) : (
                messages.map((msg) => {
                  const isUser = msg.from_ === 'user' || msg.query;
                  const isAI = msg.from_source === 'api';
                  const content = msg.content || msg.query || msg.answer || '';
                  
                  return (
                    <div
                      key={msg.id}
                      className={isUser ? styles.messageLeft : styles.messageRight}
                    >
                      <div className={styles.messageContent}>
                        <div className={styles.messageSender}>
                          {isUser ? '用户' : isAI ? 'AI' : '客服'}
                        </div>
                        <div className={styles.messageText}>{content}</div>
                        <div className={styles.messageTime}>
                          {dayjs(msg.created_at || msg.createTime).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </Card>
        
        {/* 消息输入区域 - 使用独立的 InputArea 组件 */}
        <InputArea
          currentConversationId={currentConversationId}
          readonly={readonly}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSendMessage}
        />
      </div>
    );
  };


  // ==================== 主渲染 ====================

  return (
    <div className={styles.container}>
      {/* 顶部工具栏 */}
      <Card style={{ marginBottom: '16px' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <span style={{ fontWeight: 500 }}>客服服务</span>
            {isConnected ? (
              <Tag icon={<CheckCircleOutlined />} color="success">已上线</Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error">未上线</Tag>
            )}
          </Space>
          <Space>
            <Button size="small" onClick={handleRefreshAll}>刷新</Button>
            {isConnected ? (
              <Button danger size="small" onClick={disconnect}>下线</Button>
            ) : (
              <Button type="primary" size="small" onClick={connect}>上线</Button>
            )}
          </Space>
        </Space>
      </Card>

      {/* Tabs 内容区域 */}
      <Card bodyStyle={{ padding: '16px' }}>
        <Tabs
          defaultActiveKey="waiting"
          items={[
            {
              key: 'waiting',
              label: (
                <Badge count={queueCount} offset={[10, 0]}>
                  <span>等待队列</span>
                </Badge>
              ),
              children: (
                <div className={isMobile ? styles.mobileTabContent : styles.tabContent}>
                  {/* 移动端：根据状态显示列表或聊天页面 */}
                  {isMobile ? (
                    <>
                      {/* 用户列表 */}
                      {!showMobileChatView && (
                        <div style={{ padding: '0 16px', height: 'calc(100vh - 340px)', overflow: 'auto' }}>
                          {waitingQueue.length === 0 ? (
                            <Empty description="暂无等待中的会话" style={{ marginTop: 50 }} />
                          ) : (
                            <List
                              dataSource={waitingQueue}
                              renderItem={(item) => renderConversationItem(item, 'waiting')}
                            />
                          )}
                        </div>
                      )}
                      {/* 聊天页面 */}
                      {showMobileChatView && (
                        <div style={{ width: '100%', height: '100%' }}>
                          {renderChatArea(false, false)}
                        </div>
                      )}
                    </>
                  ) : (
                    /* 桌面端：左右布局 */
                    <>
                      <div className={styles.sidebar}>
                        <div style={{ padding: '0 16px', height: 'calc(100vh - 340px)', overflow: 'auto' }}>
                          {waitingQueue.length === 0 ? (
                            <Empty description="暂无等待中的会话" style={{ marginTop: 50 }} />
                          ) : (
                            <List
                              dataSource={waitingQueue}
                              renderItem={(item) => renderConversationItem(item, 'waiting')}
                            />
                          )}
                        </div>
                      </div>
                      <div className={styles.chatArea}>
                        {renderChatArea(false, false)}
                      </div>
                    </>
                  )}
                </div>
              ),
            },
            {
              key: 'active',
              label: (
                <Badge count={activeConversations.length} offset={[10, 0]}>
                  <span>活跃会话</span>
                </Badge>
              ),
              children: (
                <div className={isMobile ? styles.mobileTabContent : styles.tabContent}>
                  {isMobile ? (
                    <>
                      {!showMobileChatView && (
                        <div style={{ padding: '0 16px', height: 'calc(100vh - 340px)', overflow: 'auto' }}>
                          {activeConversations.length === 0 ? (
                            <Empty description="暂无活跃会话" style={{ marginTop: 50 }} />
                          ) : (
                            <List
                              dataSource={activeConversations}
                              renderItem={(item) => renderConversationItem(item, 'active')}
                            />
                          )}
                        </div>
                      )}
                      {showMobileChatView && (
                        <div style={{ width: '100%', height: '100%' }}>
                          {renderChatArea(true, false)}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className={styles.sidebar}>
                        <div style={{ padding: '0 16px', height: 'calc(100vh - 340px)', overflow: 'auto' }}>
                          {activeConversations.length === 0 ? (
                            <Empty description="暂无活跃会话" style={{ marginTop: 50 }} />
                          ) : (
                            <List
                              dataSource={activeConversations}
                              renderItem={(item) => renderConversationItem(item, 'active')}
                            />
                          )}
                        </div>
                      </div>
                      <div className={styles.chatArea}>
                        {renderChatArea(true, false)}
                      </div>
                    </>
                  )}
                </div>
              ),
            },
            {
              key: 'closed',
              label: (
                <Badge count={closedConversations.length} offset={[10, 0]}>
                  <span>已结束</span>
                </Badge>
              ),
              children: (
                <div className={isMobile ? styles.mobileTabContent : styles.tabContent}>
                  {isMobile ? (
                    <>
                      {!showMobileChatView && (
                        <div style={{ padding: '0 16px', height: 'calc(100vh - 340px)', overflow: 'auto' }}>
                          {closedConversations.length === 0 ? (
                            <Empty description="暂无已结束会话" style={{ marginTop: 50 }} />
                          ) : (
                            <List
                              dataSource={closedConversations}
                              renderItem={(item) => renderConversationItem(item, 'closed')}
                            />
                          )}
                        </div>
                      )}
                      {showMobileChatView && (
                        <div style={{ width: '100%', height: '100%' }}>
                          {renderChatArea(false, true)}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className={styles.sidebar}>
                        <div style={{ padding: '0 16px', height: 'calc(100vh - 340px)', overflow: 'auto' }}>
                          {closedConversations.length === 0 ? (
                            <Empty description="暂无已结束会话" style={{ marginTop: 50 }} />
                          ) : (
                            <List
                              dataSource={closedConversations}
                              renderItem={(item) => renderConversationItem(item, 'closed')}
                            />
                          )}
                        </div>
                      </div>
                      <div className={styles.chatArea}>
                        {renderChatArea(false, true)}
                      </div>
                    </>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default CustomerServicePage;
