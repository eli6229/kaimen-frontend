/**
 * 订单列表页面
 * 功能完整的订单管理界面
 */
import React from 'react';
import { Button, Space, Tag, Card } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { getOrderList } from '@/services/trade';
import type { OrderListItem } from '@/types/trade';
import styles from './index.less';

// 导入拆分的模块
import { DATE_PRESETS } from '@/constants/index';
import { useOrderList } from './useOrderList';
import {
  ProductInfo,
  BuyerInfo,
  OrderActions,
  PriceInfo,
  TotalAmount,
  OrderStatus,
} from './components';

/**
 * 订单列表主页面
 */
const OrderListPage: React.FC = () => {
  // 使用业务逻辑 Hook
  const {
    actionRef,
    selectedRowKeys,
    starredOrders,
    setSelectedRowKeys,
    handleBatchShip,
    handleViewDetail,
    handleToggleStar,
    handleEdit,
    handlePrint,
    handleAddRemark,
    handleCancel,
    handleCopyOrderNo,
    handleToggleSelect,
    handleClearSelection,
  } = useOrderList();

  // ==================== 表格列定义 ====================
  
  const columns: ProColumns<OrderListItem>[] = [
    // ==================== 搜索表单字段（hideInTable） ====================
    {
      title: '搜索关键词',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入订单号、买家昵称/手机号、商品名称等关键词',
        size: 'large',
      },
    },
    {
      title: '订单属性',
      dataIndex: 'orderAttr',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        external: { text: '外部单号' },
        internal: { text: '内部单号' },
      },
      fieldProps: {
        placeholder: '请选择',
      },
    },
    {
      title: '订单属性值',
      dataIndex: 'orderAttrValue',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入',
      },
    },
    {
      title: '时间类型',
      dataIndex: 'timeType',
      hideInTable: true,
      valueType: 'select',
      initialValue: 'createTime',
      valueEnum: {
        createTime: { text: '下单时间' },
        payTime: { text: '支付时间' },
        shipTime: { text: '发货时间' },
      },
    },
    {
      title: '时间范围',
      dataIndex: 'dateRange',
      hideInTable: true,
      valueType: 'dateRange',
      fieldProps: {
        placeholder: ['开始日期', '结束日期'],
        presets: DATE_PRESETS,
      },
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入商品名称',
      },
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        normal: { text: '普通订单' },
        presale: { text: '预售订单' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
    },
    {
      title: '推广方式',
      dataIndex: 'promotion',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        direct: { text: '直接' },
        share: { text: '分享' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
    },
    {
      title: '售后状态',
      dataIndex: 'afterSaleStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        none: { text: '无售后' },
        refunding: { text: '退款中' },
        refunded: { text: '已退款' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
    },
    {
      title: '配送方式',
      dataIndex: 'deliveryMethod',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        express: { text: '快递' },
        pickup: { text: '自提' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
    },
    {
      title: '订单来源',
      dataIndex: 'orderSource',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        wechat: { text: '微信小程序' },
        h5: { text: 'H5' },
        app: { text: 'APP' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
    },
    {
      title: '付款方式',
      dataIndex: 'paymentMethod',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        wechat: { text: '微信支付' },
        alipay: { text: '支付宝' },
        balance: { text: '余额' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
    },
    
    // ==================== 表格展示字段 ====================
    {
      title: '商品信息',
      dataIndex: 'productInfo',
      key: 'productInfo',
      width: 450,
      fixed: 'left',
      hideInSearch: true,
      render: (_, record) => (
        <ProductInfo
          record={record}
          selectedRowKeys={selectedRowKeys}
          onCopyOrderNo={handleCopyOrderNo}
        />
      ),
    },
    {
      title: '单价[元]/数量',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <PriceInfo price={record.price} quantity={record.quantity} />
      ),
    },
    {
      title: '实收金额[元]',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <TotalAmount amount={record.totalAmount} />,
    },
    {
      title: '买家/收货人',
      dataIndex: 'buyer',
      key: 'buyer',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <BuyerInfo record={record} />,
    },
    {
      title: '配送方式',
      dataIndex: 'deliveryMethod',
      key: 'deliveryMethod',
      width: 100,
      hideInSearch: true,
      render: () => <Tag>快递</Tag>,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        pending: { text: '待付款', status: 'Default' },
        paid: { text: '待发货', status: 'Processing' },
        shipped: { text: '已发货', status: 'Processing' },
        completed: { text: '已完成', status: 'Success' },
        closed: { text: '已关闭', status: 'Default' },
        cancelled: { text: '已取消', status: 'Error' },
        refunded: { text: '已退款', status: 'Warning' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
      render: (_, record) => <OrderStatus status={record.status} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <OrderActions
          record={record}
          isStarred={starredOrders.has(record.id)}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          // onToggleStar={handleToggleStar}
          // onPrint={handlePrint}
          // onAddRemark={handleAddRemark}
          // onCancel={handleCancel}
        />
      ),
    },
  ];

  // ==================== 渲染 ====================

  return (
    <div className={styles.container}>
      {/* 订单列表 */}
      <Card className={styles.tableCard}>
        <ProTable<OrderListItem>
          columns={columns}
          actionRef={actionRef}
          request={async (params) => {
            try {
              // params 包含所有搜索表单的值和分页信息
              const { current, pageSize, ...searchParams } = params;
              const result: any = await getOrderList({
                page: current || 1,
                pageSize: pageSize || 20,
                ...searchParams,
              } as any);
              
              return {
                data: result.data?.list || [],
                success: true,
                total: result.data?.total || 0,
              };
            } catch (error) {
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
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
          scroll={{ x: 1500 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          headerTitle={
            <Space>
              <span>订单列表</span>
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
                <Button type="primary" onClick={handleBatchShip}>
                  批量发货
                </Button>
                <Button onClick={handleClearSelection}>
                  取消选择
                </Button>
              </Space>
            ),
          ]}
        />
      </Card>
    </div>
  );
};

export default OrderListPage;
