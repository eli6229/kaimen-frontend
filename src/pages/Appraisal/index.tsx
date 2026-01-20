import { ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message } from 'antd';
import { useState } from 'react';
import { 
  getAppraisalList, 
  addAppraisalEvaluate, 
  cancelAppraisalEvaluate 
} from '@/services/appraisal';

type AppraisalRecord = {
  id: string;
  orderNo: string;
  userName: string;
  productName: string;
  status: string;
  createTime: string;
  evaluatePrice?: number;
};

const AppraisalPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // 估价操作
  const handleEvaluate = async (record: AppraisalRecord) => {
    Modal.confirm({
      title: '估价',
      content: '确认对该鉴定单进行估价？',
      onOk: async () => {
        try {
          await addAppraisalEvaluate({ id: record.id });
          message.success('估价成功');
          // 刷新列表
          window.location.reload();
        } catch (error) {
          message.error('估价失败');
        }
      },
    });
  };

  // 取消估价
  const handleCancelEvaluate = async (record: AppraisalRecord) => {
    Modal.confirm({
      title: '取消估价',
      content: '确认取消该鉴定单的估价？',
      onOk: async () => {
        try {
          await cancelAppraisalEvaluate({ id: record.id });
          message.success('取消成功');
          // 刷新列表
          window.location.reload();
        } catch (error) {
          message.error('取消失败');
        }
      },
    });
  };

  const columns: ProColumns<AppraisalRecord>[] = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      copyable: true,
      ellipsis: true,
      width: 180,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
      width: 200,
    },
    {
      title: '估价金额',
      dataIndex: 'evaluatePrice',
      key: 'evaluatePrice',
      valueType: 'money',
      width: 120,
      render: (_, record) => {
        return record.evaluatePrice ? `¥${record.evaluatePrice}` : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: 'default', text: '待处理' },
          processing: { color: 'processing', text: '处理中' },
          evaluated: { color: 'success', text: '已估价' },
          completed: { color: 'success', text: '已完成' },
          cancelled: { color: 'error', text: '已取消' },
        };
        const status = statusMap[record.status] || { color: 'default', text: record.status };
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleEvaluate(record)}
            disabled={record.status === 'evaluated' || record.status === 'completed'}
          >
            估价
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleCancelEvaluate(record)}
            disabled={record.status === 'cancelled'}
          >
            取消
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ProTable<AppraisalRecord>
      columns={columns}
      request={async (params, sort, filter) => {
        try {
          const response = await getAppraisalList({
            current: params.current,
            pageSize: params.pageSize,
            ...params,
          });
          
          return {
            data: response.data?.list || [],
            success: true,
            total: response.data?.total || 0,
          };
        } catch (error) {
          message.error('获取数据失败');
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
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
      dateFormatter="string"
      headerTitle="鉴定单列表"
      toolBarRender={() => [
        <Button key="refresh" type="primary">
          刷新
        </Button>,
      ]}
    />
  );
};

export default AppraisalPage;
