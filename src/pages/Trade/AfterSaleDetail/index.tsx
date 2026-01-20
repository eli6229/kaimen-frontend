/**
 * 售后详情页面
 * 展示完整的售后信息
 */
import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Image, Space, Button, Tag, Timeline, Steps, message, Modal } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './index.less';

/**
 * 售后详情数据类型
 */
interface AfterSaleDetail {
  id: string;
  aftersaleNo: string;
  orderNo: string;
  type: 'refund' | 'return_refund' | 'exchange';
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  reason: string;
  refundAmount: number;
  productName: string;
  productImage: string;
  productSpec?: string;
  quantity: number;
  userName: string;
  userPhone: string;
  createTime: string;
  updateTime: string;
  description?: string;
  images?: string[];
  // 审核信息
  auditRemark?: string;
  auditTime?: string;
  auditor?: string;
  // 物流信息（退货退款）
  expressCompany?: string;
  expressNo?: string;
  // 处理记录
  timeline?: Array<{
    time: string;
    status: string;
    operator?: string;
    remark?: string;
  }>;
}

const AfterSaleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<AfterSaleDetail | null>(null);

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
   * 获取售后详情
   */
  const fetchDetail = async () => {
    setLoading(true);
    try {
      // TODO: 调用实际 API
      // const result = await getAfterSaleDetail(id);
      
      // Mock 数据
      const mockDetail: AfterSaleDetail = {
        id: id || '',
        aftersaleNo: `AS${Date.now()}0001`,
        orderNo: `ORD${Date.now()}0001`,
        type: 'return_refund',
        status: 'pending',
        reason: '商品质量问题',
        refundAmount: 299.0,
        productName: '古特奢侈品羊皮长款女士手提包',
        productImage: 'https://via.placeholder.com/200',
        productSpec: '颜色: 黑色; 尺寸: 大号',
        quantity: 1,
        userName: '张三',
        userPhone: '13800138000',
        createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: '收到商品后发现包包有明显的划痕和磨损，与商品描述不符，申请退货退款。',
        images: [
          'https://via.placeholder.com/200',
          'https://via.placeholder.com/200',
          'https://via.placeholder.com/200',
        ],
        timeline: [
          {
            time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: '用户发起售后申请',
          },
          {
            time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: '等待商家审核',
          },
        ],
      };
      
      setDetail(mockDetail);
    } catch (error) {
      message.error('获取售后详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  /**
   * 审核通过
   */
  const handleApprove = () => {
    Modal.confirm({
      title: '审核通过',
      content: `确定要通过售后单 ${detail?.aftersaleNo} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // TODO: 调用审核通过 API
          message.success('审核通过成功');
          fetchDetail(); // 重新加载数据
        } catch (error) {
          message.error('审核失败');
        }
      },
    });
  };

  /**
   * 审核拒绝
   */
  const handleReject = () => {
    Modal.confirm({
      title: '审核拒绝',
      content: `确定要拒绝售后单 ${detail?.aftersaleNo} 吗？`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // TODO: 调用审核拒绝 API
          message.success('已拒绝');
          fetchDetail(); // 重新加载数据
        } catch (error) {
          message.error('操作失败');
        }
      },
    });
  };

  /**
   * 返回列表
   */
  const handleBack = () => {
    history.back();
  };

  if (!detail) {
    return <div className={styles.container}>加载中...</div>;
  }

  const statusInfo = AFTERSALE_STATUS[detail.status];
  const typeInfo = AFTERSALE_TYPE[detail.type];

  return (
    <div className={styles.container}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
        >
          返回列表
        </Button>
        <div className={styles.headerTitle}>
          <span>售后详情</span>
          <Tag color={statusInfo.color} style={{ marginLeft: 12 }}>
            {statusInfo.text}
          </Tag>
        </div>
        <Space>
          {detail.status === 'pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApprove}
              >
                审核通过
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={handleReject}
              >
                审核拒绝
              </Button>
            </>
          )}
        </Space>
      </div>

      {/* 售后进度 */}
      <ProCard title="售后进度" style={{ marginBottom: 16 }}>
        <Steps
          current={
            detail.status === 'pending' ? 0 :
            detail.status === 'processing' ? 1 :
            detail.status === 'approved' ? 2 :
            detail.status === 'completed' ? 3 : 0
          }
          items={[
            { title: '发起申请', description: dayjs(detail.createTime).format('YYYY-MM-DD HH:mm') },
            { title: '商家审核', description: detail.auditTime ? dayjs(detail.auditTime).format('YYYY-MM-DD HH:mm') : '待审核' },
            { title: '处理中', description: '待处理' },
            { title: '完成', description: '待完成' },
          ]}
        />
      </ProCard>

      {/* 基本信息 */}
      <ProCard title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="售后单号">{detail.aftersaleNo}</Descriptions.Item>
          <Descriptions.Item label="关联订单">{detail.orderNo}</Descriptions.Item>
          <Descriptions.Item label="售后类型">
            <Tag color={typeInfo.color}>{typeInfo.text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="售后状态">
            <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="退款金额">
            <span style={{ color: '#ff4d4f', fontSize: 16, fontWeight: 500 }}>
              ¥{detail.refundAmount.toFixed(2)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="申请时间">
            {dayjs(detail.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      </ProCard>

      {/* 商品信息 */}
      <ProCard title="商品信息" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Image
            src={detail.productImage}
            alt={detail.productName}
            width={120}
            height={120}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              {detail.productName}
            </div>
            {detail.productSpec && (
              <div style={{ color: '#999', marginBottom: 8 }}>
                规格: {detail.productSpec}
              </div>
            )}
            <div style={{ color: '#999' }}>
              数量: {detail.quantity}
            </div>
          </div>
        </div>
      </ProCard>

      {/* 售后原因 */}
      <ProCard title="售后原因" style={{ marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="原因类型">{detail.reason}</Descriptions.Item>
          <Descriptions.Item label="详细说明">
            {detail.description || '无'}
          </Descriptions.Item>
        </Descriptions>
        
        {detail.images && detail.images.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>凭证图片:</div>
            <Space>
              {detail.images.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  width={120}
                  height={120}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              ))}
            </Space>
          </div>
        )}
      </ProCard>

      {/* 用户信息 */}
      <ProCard title="用户信息" style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="用户昵称">{detail.userName}</Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {detail.userPhone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
          </Descriptions.Item>
        </Descriptions>
      </ProCard>

      {/* 物流信息（仅退货退款） */}
      {detail.type === 'return_refund' && detail.expressNo && (
        <ProCard title="物流信息" style={{ marginBottom: 16 }}>
          <Descriptions column={2}>
            <Descriptions.Item label="物流公司">{detail.expressCompany || '-'}</Descriptions.Item>
            <Descriptions.Item label="物流单号">{detail.expressNo || '-'}</Descriptions.Item>
          </Descriptions>
        </ProCard>
      )}

      {/* 审核信息 */}
      {detail.auditTime && (
        <ProCard title="审核信息" style={{ marginBottom: 16 }}>
          <Descriptions column={2}>
            <Descriptions.Item label="审核人">{detail.auditor || '-'}</Descriptions.Item>
            <Descriptions.Item label="审核时间">
              {dayjs(detail.auditTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="审核备注" span={2}>
              {detail.auditRemark || '-'}
            </Descriptions.Item>
          </Descriptions>
        </ProCard>
      )}

      {/* 处理记录 */}
      {detail.timeline && detail.timeline.length > 0 && (
        <ProCard title="处理记录">
          <Timeline
            items={detail.timeline.map((item) => ({
              children: (
                <div>
                  <div style={{ fontWeight: 500 }}>{item.status}</div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                    {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                    {item.operator && ` · ${item.operator}`}
                  </div>
                  {item.remark && (
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      {item.remark}
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        </ProCard>
      )}
    </div>
  );
};

export default AfterSaleDetailPage;
