/**
 * 商品类目管理页面
 * 功能：
 * 1. 类目列表展示
 * 2. 新增类目
 * 3. 编辑类目
 * 4. 删除类目
 * 5. 批量删除
 * 6. 搜索筛选
 */
import React, { useRef, useState } from 'react';
import { Button, Space, Tag, message, Modal, Image } from 'antd';
import { ProTable, ModalForm, ProFormText, ProFormSelect, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

/**
 * 商品类目数据类型
 */
interface CategoryItem {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  parentName?: string;
  level: number;
  sort: number;
  icon?: string;
  description?: string;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

const CategoryPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<CategoryItem | null>(null);

  /**
   * 状态枚举
   */
  const STATUS_ENUM = {
    active: { text: '启用', status: 'Success' },
    inactive: { text: '停用', status: 'Default' },
  };

  /**
   * Mock 数据
   */
  const mockData: CategoryItem[] = Array.from({ length: 30 }, (_, i) => ({
    id: `cat_${i + 1}`,
    name: ['奢侈品包包', '名表配饰', '珠宝首饰', '服装鞋帽', '数码电器'][i % 5],
    code: `CAT${String(i + 1).padStart(4, '0')}`,
    parentId: i % 3 === 0 ? undefined : 'cat_1',
    parentName: i % 3 === 0 ? undefined : '奢侈品包包',
    level: i % 3 === 0 ? 1 : 2,
    sort: i + 1,
    icon: 'https://via.placeholder.com/60',
    description: `这是${['奢侈品包包', '名表配饰', '珠宝首饰', '服装鞋帽', '数码电器'][i % 5]}类目`,
    status: i % 4 === 0 ? 'inactive' : 'active',
    createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  /**
   * 新增类目
   */
  const handleCreate = async (values: any) => {
    try {
      console.log('新增类目:', values);
      // TODO: 调用新增 API
      message.success('新增成功');
      setCreateModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('新增失败');
      return false;
    }
  };

  /**
   * 编辑类目
   */
  const handleEdit = async (values: any) => {
    try {
      console.log('编辑类目:', values);
      // TODO: 调用编辑 API
      message.success('编辑成功');
      setEditModalVisible(false);
      setCurrentRecord(null);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('编辑失败');
      return false;
    }
  };

  /**
   * 删除类目
   */
  const handleDelete = (record: CategoryItem) => {
    Modal.confirm({
      title: '删除类目',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除类目"${record.name}"吗？删除后不可恢复。`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // TODO: 调用删除 API
          console.log('删除类目:', record.id);
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
      message.warning('请先选择要删除的类目');
      return;
    }

    Modal.confirm({
      title: '批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 个类目吗？删除后不可恢复。`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // TODO: 调用批量删除 API
          console.log('批量删除:', selectedRowKeys);
          message.success(`已删除 ${selectedRowKeys.length} 个类目`);
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  /**
   * 批量启用
   */
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要启用的类目');
      return;
    }

    Modal.confirm({
      title: '批量启用',
      content: `确定要启用选中的 ${selectedRowKeys.length} 个类目吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // TODO: 调用批量启用 API
          console.log('批量启用:', selectedRowKeys);
          message.success(`已启用 ${selectedRowKeys.length} 个类目`);
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量启用失败');
        }
      },
    });
  };

  /**
   * 批量停用
   */
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要停用的类目');
      return;
    }

    Modal.confirm({
      title: '批量停用',
      content: `确定要停用选中的 ${selectedRowKeys.length} 个类目吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // TODO: 调用批量停用 API
          console.log('批量停用:', selectedRowKeys);
          message.success(`已停用 ${selectedRowKeys.length} 个类目`);
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量停用失败');
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
   * 打开编辑弹窗
   */
  const openEditModal = (record: CategoryItem) => {
    setCurrentRecord(record);
    setEditModalVisible(true);
  };

  /**
   * 表格列定义
   */
  const columns: ProColumns<CategoryItem>[] = [
    // ==================== 搜索字段 ====================
    {
      title: '类目名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入类目名称',
      },
      render: (_, record) => (
        <Space>
          {record.icon && (
            <Image
              src={record.icon}
              width={40}
              height={40}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={false}
            />
          )}
          <span style={{ fontWeight: 500 }}>{record.name}</span>
        </Space>
      ),
    },
    {
      title: '类目编码',
      dataIndex: 'code',
      width: 150,
      copyable: true,
      fieldProps: {
        placeholder: '请输入类目编码',
      },
    },
    {
      title: '父级类目',
      dataIndex: 'parentName',
      width: 150,
      hideInSearch: true,
      render: (_, record) => record.parentName || '-',
    },
    {
      title: '级别',
      dataIndex: 'level',
      width: 80,
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={record.level === 1 ? 'blue' : 'green'}>
          {record.level === 1 ? '一级' : '二级'}
        </Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: STATUS_ENUM,
      fieldProps: {
        placeholder: '全部',
        allowClear: true,
      },
      render: (_, record) => (
        <Tag color={record.status === 'active' ? 'success' : 'default'}>
          {STATUS_ENUM[record.status].text}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建时间范围',
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
      width: 180,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
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
      <ProTable<CategoryItem>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          // TODO: 替换为实际 API 调用
          const { current = 1, pageSize = 20, ...searchParams } = params;

          // Mock 数据过滤
          let filteredData = [...mockData];
          if (searchParams.name) {
            filteredData = filteredData.filter(item =>
              item.name.includes(searchParams.name as string)
            );
          }
          if (searchParams.code) {
            filteredData = filteredData.filter(item =>
              item.code.includes(searchParams.code as string)
            );
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
            <span>商品类目列表</span>
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
              <Button onClick={handleBatchEnable}>批量启用</Button>
              <Button onClick={handleBatchDisable}>批量停用</Button>
              <Button danger onClick={handleBatchDelete}>
                批量删除
              </Button>
              <Button onClick={handleClearSelection}>取消选择</Button>
            </Space>
          ) : (
            <Button
              key="create"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
            >
              新增类目
            </Button>
          ),
        ]}
        scroll={{ x: 1400 }}
      />

      {/* 新增类目弹窗 */}
      <ModalForm
        title="新增类目"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleCreate}
        modalProps={{
          destroyOnClose: true,
        }}
        width={600}
      >
        <ProFormText
          name="name"
          label="类目名称"
          placeholder="请输入类目名称"
          rules={[{ required: true, message: '请输入类目名称' }]}
        />
        <ProFormText
          name="code"
          label="类目编码"
          placeholder="请输入类目编码"
          rules={[{ required: true, message: '请输入类目编码' }]}
        />
        <ProFormSelect
          name="parentId"
          label="父级类目"
          placeholder="请选择父级类目（不选则为一级类目）"
          options={mockData
            .filter(item => item.level === 1)
            .map(item => ({ label: item.name, value: item.id }))}
          fieldProps={{
            allowClear: true,
          }}
        />
        <ProFormText
          name="sort"
          label="排序"
          placeholder="请输入排序值（数字越小越靠前）"
          rules={[
            { required: true, message: '请输入排序值' },
            { pattern: /^\d+$/, message: '排序值必须是数字' },
          ]}
          initialValue="0"
        />
        <ProFormSelect
          name="status"
          label="状态"
          placeholder="请选择状态"
          options={[
            { label: '启用', value: 'active' },
            { label: '停用', value: 'inactive' },
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
          initialValue="active"
        />
        <ProFormUploadButton
          name="icon"
          label="类目图标"
          max={1}
          fieldProps={{
            listType: 'picture-card',
          }}
          extra="建议上传正方形图片，尺寸 200x200"
        />
        <ProFormTextArea
          name="description"
          label="类目描述"
          placeholder="请输入类目描述"
          fieldProps={{
            rows: 4,
          }}
        />
      </ModalForm>

      {/* 编辑类目弹窗 */}
      <ModalForm
        title="编辑类目"
        open={editModalVisible}
        onOpenChange={(visible) => {
          setEditModalVisible(visible);
          if (!visible) setCurrentRecord(null);
        }}
        onFinish={handleEdit}
        initialValues={currentRecord || {}}
        modalProps={{
          destroyOnClose: true,
        }}
        width={600}
      >
        <ProFormText name="id" hidden />
        <ProFormText
          name="name"
          label="类目名称"
          placeholder="请输入类目名称"
          rules={[{ required: true, message: '请输入类目名称' }]}
        />
        <ProFormText
          name="code"
          label="类目编码"
          placeholder="请输入类目编码"
          rules={[{ required: true, message: '请输入类目编码' }]}
        />
        <ProFormSelect
          name="parentId"
          label="父级类目"
          placeholder="请选择父级类目（不选则为一级类目）"
          options={mockData
            .filter(item => item.level === 1 && item.id !== currentRecord?.id)
            .map(item => ({ label: item.name, value: item.id }))}
          fieldProps={{
            allowClear: true,
          }}
        />
        <ProFormText
          name="sort"
          label="排序"
          placeholder="请输入排序值（数字越小越靠前）"
          rules={[
            { required: true, message: '请输入排序值' },
            { pattern: /^\d+$/, message: '排序值必须是数字' },
          ]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          placeholder="请选择状态"
          options={[
            { label: '启用', value: 'active' },
            { label: '停用', value: 'inactive' },
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormUploadButton
          name="icon"
          label="类目图标"
          max={1}
          fieldProps={{
            listType: 'picture-card',
          }}
          extra="建议上传正方形图片，尺寸 200x200"
        />
        <ProFormTextArea
          name="description"
          label="类目描述"
          placeholder="请输入类目描述"
          fieldProps={{
            rows: 4,
          }}
        />
      </ModalForm>
    </div>
  );
};

export default CategoryPage;
