/**
 * 订单列表业务逻辑 Hook
 */
import { useState, useRef } from 'react';
import { message, Modal } from 'antd';
import { history } from '@umijs/max';
import type { ActionType } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { ORDER_STATUS_TABS } from '@/constants/index';

export const useOrderList = () => {
  // ==================== 状态管理 ====================
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [starredOrders, setStarredOrders] = useState<Set<string>>(new Set());

  // ==================== 事件处理 ====================

  /**
   * 全文搜索
   */
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    actionRef.current?.reload();
  };

  /**
   * 重置筛选
   */
  const handleReset = () => {
    setSearchKeyword('');
    setSearchType('all');
    setDateRange([null, null]);
    setFilterValues({});
    actionRef.current?.reset?.();
  };

  /**
   * 导出订单
   */
  const handleExport = async () => {
    const count = ORDER_STATUS_TABS.find(t => t.key === activeTab)?.count || 0;
    
    Modal.confirm({
      title: '导出订单数据',
      content: `确定要导出当前筛选条件下的 ${count} 个订单吗？`,
      onOk: async () => {
        try {
          message.loading({ content: '正在导出...', key: 'export' });
          
          // TODO: 实现实际导出逻辑
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          message.success({ content: '导出成功', key: 'export' });
        } catch (error) {
          message.error({ content: '导出失败', key: 'export' });
        }
      },
    });
  };

  /**
   * 批量发货
   */
  const handleBatchShip = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择订单');
      return;
    }
    
    Modal.confirm({
      title: '批量发货',
      content: `确定要对选中的 ${selectedRowKeys.length} 个订单进行发货吗？`,
      onOk: () => {
        message.success('批量发货成功');
        setSelectedRowKeys([]);
        actionRef.current?.reload();
      },
    });
  };

  /**
   * 批量打印
   */
  const handleBatchPrint = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择订单');
      return;
    }
    message.info('打印功能开发中...');
  };

  /**
   * 查看订单详情
   */
  const handleViewDetail = (orderId: string) => {
    history.push(`/trade/orders/${orderId}`);
  };

  /**
   * 订单加星/取消加星
   */
  const handleToggleStar = (orderId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    const newStarred = new Set(starredOrders);
    if (newStarred.has(orderId)) {
      newStarred.delete(orderId);
      message.success('已取消标记');
    } else {
      newStarred.add(orderId);
      message.success('已标记为重点关注');
    }
    setStarredOrders(newStarred);
  };

  /**
   * 修改订单
   */
  const handleEdit = (orderId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    message.info('打开订单编辑弹窗');
    // TODO: 实现订单编辑功能
  };

  /**
   * 打印订单
   */
  const handlePrint = (orderId: string) => {
    message.info(`打印订单 ${orderId}`);
    // TODO: 实现打印功能
  };

  /**
   * 添加备注
   */
  const handleAddRemark = (orderId: string) => {
    message.info(`为订单 ${orderId} 添加备注`);
    // TODO: 实现添加备注功能
  };

  /**
   * 取消订单
   */
  const handleCancel = (orderId: string) => {
    Modal.confirm({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('订单已取消');
        actionRef.current?.reload();
      },
    });
  };

  /**
   * 复制订单号
   */
  const handleCopyOrderNo = async (orderNo: string) => {
    try {
      await navigator.clipboard.writeText(orderNo);
      message.success('订单号已复制');
    } catch (error) {
      message.error('复制失败');
    }
  };

  /**
   * 切换选中状态
   */
  const handleToggleSelect = (orderId: string, checked: boolean) => {
    const keys = checked
      ? [...selectedRowKeys, orderId]
      : selectedRowKeys.filter(k => k !== orderId);
    setSelectedRowKeys(keys);
  };

  /**
   * 取消所有选择
   */
  const handleClearSelection = () => {
    setSelectedRowKeys([]);
  };

  return {
    // 状态
    actionRef,
    selectedRowKeys,
    searchKeyword,
    searchType,
    activeTab,
    dateRange,
    filterValues,
    starredOrders,
    
    // 状态设置函数
    setSelectedRowKeys,
    setSearchKeyword,
    setSearchType,
    setActiveTab,
    setDateRange,
    setFilterValues,
    
    // 事件处理函数
    handleSearch,
    handleReset,
    handleExport,
    handleBatchShip,
    handleBatchPrint,
    handleViewDetail,
    handleToggleStar,
    handleEdit,
    handlePrint,
    handleAddRemark,
    handleCancel,
    handleCopyOrderNo,
    handleToggleSelect,
    handleClearSelection,
  };
};
