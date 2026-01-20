/**
 * 商品列表页面
 * 功能：
 * 1. 商品列表展示
 * 2. 发布商品（跳转到新页面）
 * 3. 编辑商品（跳转到新页面）
 * 4. 删除商品
 * 5. 批量删除
 * 6. 完整的搜索筛选
 */
import React, { useRef, useState } from 'react';
import { Button, Space, Tag, Image, Modal, message, Radio } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import dayjs from 'dayjs';
import styles from './index.less';

/**
 * 商品数据类型
 */
interface ProductItem {
  id: string;
  name: string;
  code: string;
  image: string;
  price: number;
  stock: number;
  sales: number;
  sort: number;
  visits: number;
  pageViews: number;
  categoryId?: string;
  categoryName?: string;
  groupId?: string;
  groupName?: string;
  status: 'selling' | 'soldout' | 'warehouse' | 'draft';
  description?: string;
  images?: string[];
  createTime: string;
  updateTime: string;
}

/**
 * 商品状态标签配置
 */
const STATUS_TABS = [
  { key: 'all', label: '全部', count: 126 },
  { key: 'selling', label: '销售中', count: 89 },
  { key: 'soldout', label: '已售罄', count: 12 },
  { key: 'warehouse', label: '仓库中', count: 25 },
];

const ProductListPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  /**
   * 商品状态枚举
   */
  const PRODUCT_STATUS = {
    selling: { text: '销售中', color: 'success' },
    soldout: { text: '已售罄', color: 'default' },
    warehouse: { text: '仓库中', color: 'processing' },
    draft: { text: '草稿', color: 'default' },
  };

  /**
   * Mock 数据
   */
  const mockData: ProductItem[] = Array.from({ length: 30 }, (_, i) => ({
    id: `prod_${i + 1}`,
    name: ['传世大古钱链', '【将来是树】绕脑型喊叫', '名将多种长度传奇刀枪', '传世"钱制教"（编录款）', '传世古钱链（编录款）', '【将至替换色系】玉出色色系·荆宋手形'][i % 6],
    code: `PROD${String(i + 1).padStart(4, '0')}`,
    image: 'https://via.placeholder.com/60',
    price: Math.floor(Math.random() * 5000 + 100) / 10,
    stock: Math.floor(Math.random() * 100),
    sales: Math.floor(Math.random() * 1000),
    sort: i + 1,
    visits: Math.floor(Math.random() * 1000),
    pageViews: Math.floor(Math.random() * 2000),
    categoryId: `cat_${(i % 5) + 1}`,
    categoryName: ['奢侈品包包', '名表配饰', '珠宝首饰', '服装鞋帽', '数码电器'][i % 5],
    groupId: `group_${(i % 3) + 1}`,
    groupName: ['热销商品', '新品推荐', '限时特惠'][i % 3],
    status: ['selling', 'soldout', 'warehouse', 'draft'][Math.floor(Math.random() * 4)] as any,
    description: '商品详细描述',
    images: ['https://via.placeholder.com/200'],
    createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  /**
   * 发布商品（跳转到新页面）
   */
  const handlePublish = () => {
    history.push('/product/publish');
  };

  /**
   * 编辑商品（跳转到新页面）
   */
  const handleEdit = (record: ProductItem) => {
    history.push(`/product/edit/${record.id}`);
  };

  /**
   * 删除商品
   */
  const handleDelete = (record: ProductItem) => {
    Modal.confirm({
      title: '删除商品',
      content: `确定要删除商品"${record.name}"吗？删除后不可恢复。`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // TODO: 调用删除 API
          console.log('删除商品:', record.id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  /**
   * 批量删除
   */
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的商品');
      return;
    }

    Modal.confirm({
      title: '批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个商品吗？删除后不可恢复。`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // TODO: 调用批量删除 API
          console.log('批量删除:', selectedRowKeys);
          message.success(`已删除 ${selectedRowKeys.length} 个商品`);
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  /**
   * 批量上架
   */
  const handleBatchOnSale = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要上架的商品');
      return;
    }

    Modal.confirm({
      title: '批量上架',
      content: `确定要上架选中的 ${selectedRowKeys.length} 个商品吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // TODO: 调用批量上架 API
          console.log('批量上架:', selectedRowKeys);
          message.success(`已上架 ${selectedRowKeys.length} 个商品`);
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量上架失败');
        }
      },
    });
  };

  /**
   * 批量下架
   */
  const handleBatchOffSale = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要下架的商品');
      return;
    }

    Modal.confirm({
      title: '批量下架',
      content: `确定要下架选中的 ${selectedRowKeys.length} 个商品吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // TODO: 调用批量下架 API
          console.log('批量下架:', selectedRowKeys);
          message.success(`已下架 ${selectedRowKeys.length} 个商品`);
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量下架失败');
        }
      },
    });
  };

  /**
   * 导出商品
   */
  const handleExport = () => {
    message.info('导出功能开发中...');
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
  const columns: ProColumns<ProductItem>[] = [
    // ==================== 搜索字段 ====================
    {
      title: '创建时间',
      dataIndex: 'createTimeRange',
      hideInTable: true,
      valueType: 'dateRange',
      fieldProps: {
        placeholder: ['开始日期', '结束日期'],
      },
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      hideInTable: true,
      fieldProps: {
        placeholder: '输入商品名称、编号等',
      },
    },
    {
      title: '商品属性/编码',
      dataIndex: 'attrType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        name: { text: '商品名称' },
        code: { text: '商品编码' },
        barcode: { text: '商品条码' },
      },
      fieldProps: {
        placeholder: '商品编码',
      },
    },
    {
      title: '商品属性值',
      dataIndex: 'attrValue',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入商品/编号',
      },
    },
    {
      title: '商品分组',
      dataIndex: 'groupId',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        group_1: { text: '热销商品' },
        group_2: { text: '新品推荐' },
        group_3: { text: '限时特惠' },
      },
      fieldProps: {
        placeholder: '自选择商品分组',
        allowClear: true,
      },
    },
    {
      title: '商品定位',
      dataIndex: 'position',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部' },
        hot: { text: '热门' },
        new: { text: '最新' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
      initialValue: 'all',
    },
    {
      title: '销量',
      dataIndex: 'salesRange',
      hideInTable: true,
      renderFormItem: () => (
        <Space.Compact style={{ width: '100%' }}>
          <input type="number" placeholder="最小值" style={{ width: '50%', padding: '4px 11px', border: '1px solid #d9d9d9', borderRadius: '6px 0 0 6px' }} />
          <input type="number" placeholder="最大值" style={{ width: '50%', padding: '4px 11px', border: '1px solid #d9d9d9', borderLeft: 0, borderRadius: '0 6px 6px 0' }} />
        </Space.Compact>
      ),
    },
    {
      title: '价格',
      dataIndex: 'priceRange',
      hideInTable: true,
      renderFormItem: () => (
        <Space.Compact style={{ width: '100%' }}>
          <input type="number" placeholder="元" style={{ width: '50%', padding: '4px 11px', border: '1px solid #d9d9d9', borderRadius: '6px 0 0 6px' }} />
          <input type="number" placeholder="元" style={{ width: '50%', padding: '4px 11px', border: '1px solid #d9d9d9', borderLeft: 0, borderRadius: '0 6px 6px 0' }} />
        </Space.Compact>
      ),
    },
    {
      title: '商品图片',
      dataIndex: 'hasImage',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部' },
        yes: { text: '有图片' },
        no: { text: '无图片' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
      initialValue: 'all',
    },
    {
      title: '商品详情页',
      dataIndex: 'hasDetail',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部' },
        yes: { text: '有详情' },
        no: { text: '无详情' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
      initialValue: 'all',
    },
    {
      title: '商品总计',
      dataIndex: 'stockType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部' },
        sku: { text: '按SKU' },
        total: { text: '按总量' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
      initialValue: 'all',
    },
    {
      title: '库存扣减方式',
      dataIndex: 'stockDeduct',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部' },
        order: { text: '下单减库存' },
        pay: { text: '付款减库存' },
      },
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
      initialValue: 'all',
    },

    // ==================== 表格展示字段 ====================
    {
      title: '商品名',
      dataIndex: 'productInfo',
      width: 300,
      fixed: 'left',
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 12 }}>
          <Image
            src={record.image}
            alt={record.name}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={false}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              编号: {record.code}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '价格(元)',
      dataIndex: 'price',
      width: 120,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <span style={{ color: '#ff4d4f', fontWeight: 500 }}>
          ¥{record.price.toFixed(2)}
        </span>
      ),
    },
    {
      title: '访问量',
      dataIndex: 'visits',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <div>
          <div>访客数: {record.visits}</div>
          <div style={{ fontSize: 12, color: '#999' }}>浏览量: {record.pageViews}</div>
        </div>
      ),
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 100,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <span style={{ color: record.stock < 10 ? '#ff4d4f' : '#000' }}>
          {record.stock}
        </span>
      ),
    },
    {
      title: '销量',
      dataIndex: 'sales',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '商品状态',
      dataIndex: 'status',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        const status = PRODUCT_STATUS[record.status];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* 状态标签筛选 */}
      <div className={styles.statusTabs}>
        <Radio.Group
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          buttonStyle="solid"
        >
          {STATUS_TABS.map((tab) => (
            <Radio.Button key={tab.key} value={tab.key}>
              {tab.label}
              {tab.count > 0 && (
                <span style={{ marginLeft: 4, color: '#999' }}>({tab.count})</span>
              )}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      {/* 商品列表 */}
      <ProTable<ProductItem>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          // TODO: 替换为实际 API 调用
          const { current = 1, pageSize = 20, ...searchParams } = params;

          // Mock 数据过滤
          let filteredData = [...mockData];
          
          // 根据状态标签过滤
          if (activeTab !== 'all') {
            filteredData = filteredData.filter(item => item.status === activeTab);
          }
          
          // 根据商品名称过滤
          if (searchParams.name) {
            filteredData = filteredData.filter(item =>
              item.name.includes(searchParams.name as string) ||
              item.code.includes(searchParams.name as string)
            );
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
          optionRender: (searchConfig, formProps, dom) => [
            ...dom,
            <Button key="export" icon={<ExportOutlined />} onClick={handleExport}>
              导出
            </Button>,
          ],
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
            <span>商品列表</span>
            {selectedRowKeys.length > 0 && (
              <span style={{ fontSize: 14, fontWeight: 'normal', color: '#666' }}>
                已选择 {selectedRowKeys.length} 项
              </span>
            )}
          </Space>
        }
        toolBarRender={() => [
          selectedRowKeys.length > 0 ? (
            <Space key="batch">
              <Button onClick={handleBatchOnSale}>批量上架</Button>
              <Button onClick={handleBatchOffSale}>批量下架</Button>
              <Button danger onClick={handleBatchDelete}>
                批量删除
              </Button>
              <Button onClick={handleClearSelection}>取消选择</Button>
            </Space>
          ) : (
            <Button
              key="publish"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handlePublish}
            >
              发布商品
            </Button>
          ),
        ]}
        scroll={{ x: 1800 }}
      />
    </div>
  );
};

export default ProductListPage;
