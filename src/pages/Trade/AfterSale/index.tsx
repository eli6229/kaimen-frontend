/**
 * 售后维权页面
 * 功能：
 * 1. 展示售后订单列表
 * 2. 支持搜索、筛选
 * 3. 查看售后详情
 * 4. 处理售后申请
 */
import React from 'react';
import { Button, Space, Tag, Image, Modal, message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import dayjs from 'dayjs';
import styles from './index.less';

/**
 * 售后订单数据类型
 */
interface AfterSaleItem {
  id: string;
  aftersaleNo: string;
  orderNo: string;
  type: 'refund' | 'return_refund' | 'exchange';
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  reason: string;
  refundAmount: number;
  productName: string;
  productImage: string;
  userName: string;
  userPhone: string;
  createTime: string;
  updateTime: string;
  description?: string;
  images?: string[];
}

const AfterSalePage: React.FC = () => {
  const actionRef = React.useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  /**
   * 售后类型枚举
   */
  const AFTERSALE_TYPE = {
    refund: { text: '仅退款', color: 'blue' },
    return_refund: { text: '退货退款', color: 'orange' },
    exchange: { text: '换货', color: 'green' },
  };

  /**
   * 售后状态枚举
   */
  const AFTERSALE_STATUS = {
    pending: { text: '待审核', color: 'default' },
    processing: { text: '处理中', color: 'processing' },
    approved: { text: '已同意', color: 'success' },
    rejected: { text: '已拒绝', color: 'error' },
    completed: { text: '已完成', color: 'success' },
    cancelled: { text: '已取消', color: 'default' },
  };

  /**
   * 审核通过
   */
  const handleApprove = (record: AfterSaleItem) => {
    Modal.confirm({
      title: '审核通过',
      content: `确定要通过售后单 ${record.aftersaleNo} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // TODO: 调用审核通过 API
          message.success('审核通过成功');
          actionRef.current?.reload();
        } catch (error) {
          message.error('审核失败');
        }
      },
    });
  };

  /**
   * 审核拒绝
   */
  const handleReject = (record: AfterSaleItem) => {
    Modal.confirm({
      title: '审核拒绝',
      content: `确定要拒绝售后单 ${record.aftersaleNo} 吗？`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // TODO: 调用审核拒绝 API
          message.success('已拒绝');
          actionRef.current?.reload();
        } catch (error) {
          message.error('操作失败');
        }
      },
    });
  };

  /**
   * 查看详情（跳转到详情页面）
   */
  const handleViewDetail = (record: AfterSaleItem) => {
    history.push(`/trade/aftersale/${record.id}`);
  };

  /**
   * 批量审核通过
   */
  const handleBatchApprove = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要审核的售后单');
      return;
    }
    
    Modal.confirm({
      title: '批量审核通过',
      content: `确定要通过选中的 ${selectedRowKeys.length} 个售后单吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // TODO: 调用批量审核通过 API
          message.success(`已批量通过 ${selectedRowKeys.length} 个售后单`);
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量审核失败');
        }
      },
    });
  };

  /**
   * 批量审核拒绝
   */
  const handleBatchReject = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要拒绝的售后单');
      return;
    }
    
    Modal.confirm({
      title: '批量审核拒绝',
      content: `确定要拒绝选中的 ${selectedRowKeys.length} 个售后单吗？`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // TODO: 调用批量审核拒绝 API
          message.success(`已批量拒绝 ${selectedRowKeys.length} 个售后单`);
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量操作失败');
        }
      },
    });
  };

  /**
   * 清除选择
   */
  const handleClearSelection = () => {
    setSelectedRowKeys([]);
  };

  /**
   * 表格列定义
   */
  const columns: ProColumns<AfterSaleItem>[] = [
    {
      title: '售后单号',
      dataIndex: 'aftersaleNo',
      width: 180,
      fixed: 'left',
      copyable: true,
      fieldProps: {
        placeholder: '请输入售后单号',
      },
    },
    {
      title: '关联订单号',
      dataIndex: 'orderNo',
      width: 180,
      copyable: true,
      fieldProps: {
        placeholder: '请输入订单号',
      },
    },
    {
      title: '商品信息',
      dataIndex: 'productInfo',
      width: 300,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 12 }}>
          <Image
            src={record.productImage || 'https://via.placeholder.com/60'}
            alt={record.productName}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.productName}</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
              退款金额: <span style={{ color: '#ff4d4f' }}>¥{record.refundAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '售后类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        refund: { text: '仅退款', status: 'Default' },
        return_refund: { text: '退货退款', status: 'Processing' },
        exchange: { text: '换货', status: 'Success' },
      },
      render: (_, record) => {
        const type = AFTERSALE_TYPE[record.type];
        return <Tag color={type.color}>{type.text}</Tag>;
      },
    },
    {
      title: '售后状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        pending: { text: '待审核', status: 'Default' },
        processing: { text: '处理中', status: 'Processing' },
        approved: { text: '已同意', status: 'Success' },
        rejected: { text: '已拒绝', status: 'Error' },
        completed: { text: '已完成', status: 'Success' },
        cancelled: { text: '已取消', status: 'Default' },
      },
      render: (_, record) => {
        const status = AFTERSALE_STATUS[record.status];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '售后原因',
      dataIndex: 'reason',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '用户信息',
      dataIndex: 'userName',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div>
          <div>{record.userName}</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {record.userPhone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
          </div>
        </div>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      width: 180,
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '申请时间范围',
      dataIndex: 'createTimeRange',
      hideInTable: true,
      valueType: 'dateRange',
      fieldProps: {
        placeholder: ['开始日期', '结束日期'],
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record)}
                style={{ color: '#52c41a' }}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record)}
                danger
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  /**
   * Mock 数据（实际应该从 API 获取）
   */
  const mockData: AfterSaleItem[] = Array.from({ length: 20 }, (_, i) => ({
    id: `as_${i + 1}`,
    aftersaleNo: `AS${Date.now()}${String(i).padStart(4, '0')}`,
    orderNo: `ORD${Date.now()}${String(i).padStart(4, '0')}`,
    type: ['refund', 'return_refund', 'exchange'][Math.floor(Math.random() * 3)] as any,
    status: ['pending', 'processing', 'approved', 'rejected', 'completed'][Math.floor(Math.random() * 5)] as any,
    reason: ['商品质量问题', '不喜欢/不想要', '商品描述不符', '发错货', '其他'][Math.floor(Math.random() * 5)],
    refundAmount: Math.floor(Math.random() * 5000 + 100) / 10,
    productName: ['高端奢侈品手提包', '时尚休闲运动鞋', '精致女士手表'][Math.floor(Math.random() * 3)],
    productImage: 'https://via.placeholder.com/60',
    userName: `用户${i + 1}`,
    userPhone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: '商品与描述不符，申请退款',
    images: ['https://via.placeholder.com/200'],
  }));

  return (
    <div className={styles.container}>
      <ProTable<AfterSaleItem>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          // TODO: 替换为实际 API 调用
          const { current = 1, pageSize = 20, ...searchParams } = params;
          
          // Mock 数据过滤
          let filteredData = [...mockData];
          if (searchParams.aftersaleNo) {
            filteredData = filteredData.filter(item => 
              item.aftersaleNo.includes(searchParams.aftersaleNo as string)
            );
          }
          if (searchParams.type) {
            filteredData = filteredData.filter(item => item.type === searchParams.type);
          }
          if (searchParams.status) {
            filteredData = filteredData.filter(item => item.status === searchParams.status);
          }
          
          const start = (current - 1) * pageSize;
          const end = start + pageSize;
          
          return {
            data: filteredData.slice(start, end),
            success: true,
            total: filteredData.length,
          };
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          span: 6,
        }}
        options={{
          reload: true,
          density: true,
          setting: true,
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        headerTitle={
          <Space>
            <span>售后维权列表</span>
            {selectedRowKeys.length > 0 && (
              <span style={{ fontSize: 14, fontWeight: 'normal', color: '#666' }}>
                已选择 {selectedRowKeys.length} 项
              </span>
            )}
          </Space>
        }
        toolBarRender={() => [
          selectedRowKeys.length > 0 && (
            <Space key="batch">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleBatchApprove}
              >
                批量通过
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleBatchReject}
              >
                批量拒绝
              </Button>
              <Button onClick={handleClearSelection}>
                取消选择
              </Button>
            </Space>
          ),
        ]}
        scroll={{ x: 1500 }}
      />
    </div>
  );
};

export default AfterSalePage;
