import { useState, useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Steps, 
  Table, 
  Image, 
  Button, 
  Space, 
  Tag,
  Spin,
  message,
  Timeline 
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history, useParams } from '@umijs/max';
import { getOrderDetail } from '@/services/trade';
import type { OrderDetail } from '@/types/trade';
import dayjs from 'dayjs';
import styles from './index.less';

/**
 * 订单详情页面
 * 包含四个部分：
 * 1. 交易状态
 * 2. 物流信息
 * 3. 订单明细
 * 4. 商品信息
 */
const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderDetail | null>(null);

  /**
   * 订单状态枚举
   */
  const ORDER_STATUS = {
    pending: { text: '待支付', color: 'default', step: 0 },
    paid: { text: '已支付', color: 'blue', step: 1 },
    shipped: { text: '已发货', color: 'cyan', step: 2 },
    completed: { text: '已完成', color: 'success', step: 3 },
    cancelled: { text: '已取消', color: 'error', step: -1 },
    refunded: { text: '已退款', color: 'warning', step: -1 },
  };

  /**
   * 加载订单详情
   */
  useEffect(() => {
    if (id) {
      loadOrderDetail(id);
    }
  }, [id]);

  const loadOrderDetail = async (orderId: string) => {
    setLoading(true);
    try {
      const { data } = await getOrderDetail(orderId);
      setOrderData(data);
    } catch (error) {
      message.error('加载订单详情失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 返回列表
   */
  const handleBack = () => {
    history.push('/trade/orders');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <p>订单不存在</p>
        <Button onClick={handleBack}>返回列表</Button>
      </div>
    );
  }

  const statusInfo = ORDER_STATUS[orderData.status as keyof typeof ORDER_STATUS];

  /**
   * 商品信息列定义
   */
  const productColumns = [
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: string) => (
        <Image
          src={image}
          alt="商品图片"
          width={60}
          height={60}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
      render: (spec: string) => spec || '-',
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => `¥${subtotal.toFixed(2)}`,
    },
  ];

  return (
    <PageContainer
      header={{
        title: (
          <Space>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            <span>订单详情</span>
          </Space>
        ),
        breadcrumb: {},
      }}
    >
      <div className={styles.container}>
        {/* 1. 交易状态部分 */}
        <Card 
          title="交易状态" 
          className={styles.card}
          bordered={false}
        >
          <div style={{ padding: '20px 0' }}>
            {statusInfo.step >= 0 ? (
              <Steps
                current={statusInfo.step}
                items={[
                  {
                    title: '待支付',
                    description: orderData.createTime ? dayjs(orderData.createTime).format('YYYY-MM-DD HH:mm:ss') : '',
                  },
                  {
                    title: '已支付',
                    description: orderData.payTime ? dayjs(orderData.payTime).format('YYYY-MM-DD HH:mm:ss') : '',
                  },
                  {
                    title: '已发货',
                    description: orderData.shipTime ? dayjs(orderData.shipTime).format('YYYY-MM-DD HH:mm:ss') : '',
                  },
                  {
                    title: '已完成',
                    description: orderData.completeTime ? dayjs(orderData.completeTime).format('YYYY-MM-DD HH:mm:ss') : '',
                  },
                ]}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Tag color={statusInfo.color} style={{ fontSize: '16px', padding: '8px 16px' }}>
                  {statusInfo.text}
                </Tag>
                <p style={{ marginTop: '12px', color: '#999' }}>
                  {orderData.cancelTime && `取消时间: ${dayjs(orderData.cancelTime).format('YYYY-MM-DD HH:mm:ss')}`}
                  {orderData.refundTime && `退款时间: ${dayjs(orderData.refundTime).format('YYYY-MM-DD HH:mm:ss')}`}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* 2. 物流信息 */}
        {orderData.logistics && (
          <Card 
            title="物流信息" 
            className={styles.card}
            bordered={false}
          >
            <Descriptions column={2}>
              <Descriptions.Item label="物流公司">
                {orderData.logistics.company || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="物流单号">
                {orderData.logistics.trackingNo || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="发货时间">
                {orderData.logistics.shipTime ? dayjs(orderData.logistics.shipTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="预计送达">
                {orderData.logistics.estimatedDelivery ? dayjs(orderData.logistics.estimatedDelivery).format('YYYY-MM-DD') : '-'}
              </Descriptions.Item>
            </Descriptions>
            
            {orderData.logistics.traces && orderData.logistics.traces.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ marginBottom: '16px' }}>物流轨迹</h4>
                <Timeline
                  items={orderData.logistics.traces.map((trace: any) => ({
                    children: (
                      <>
                        <p style={{ margin: 0, fontWeight: 500 }}>{trace.status}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#999' }}>
                          {dayjs(trace.time).format('YYYY-MM-DD HH:mm:ss')}
                        </p>
                      </>
                    ),
                  }))}
                />
              </div>
            )}
          </Card>
        )}

        {/* 3. 订单明细 */}
        <Card 
          title="订单明细" 
          className={styles.card}
          bordered={false}
        >
          <Descriptions column={2} labelStyle={{ fontWeight: 500 }}>
            <Descriptions.Item label="订单编号">{orderData.orderNo}</Descriptions.Item>
            <Descriptions.Item label="用户ID">{orderData.userId}</Descriptions.Item>
            <Descriptions.Item label="用户昵称">{orderData.userName}</Descriptions.Item>
            <Descriptions.Item label="用户手机">{orderData.userPhone || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(orderData.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="支付时间">
              {orderData.payTime ? dayjs(orderData.payTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="支付方式">
              {orderData.paymentMethod === 'wechat' && '微信支付'}
              {orderData.paymentMethod === 'alipay' && '支付宝'}
              {orderData.paymentMethod === 'balance' && '余额'}
            </Descriptions.Item>
            <Descriptions.Item label="支付流水号">
              {orderData.transactionNo || '-'}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions column={1} style={{ marginTop: '24px' }} labelStyle={{ fontWeight: 500 }}>
            <Descriptions.Item label="收货地址">
              {orderData.address ? 
                `${orderData.address.receiverName} ${orderData.address.phone} ${orderData.address.province}${orderData.address.city}${orderData.address.district}${orderData.address.detail}` 
                : '-'
              }
            </Descriptions.Item>
            <Descriptions.Item label="备注">
              {orderData.remark || '-'}
            </Descriptions.Item>
          </Descriptions>

          {/* 金额明细 */}
          <div style={{ marginTop: '24px', padding: '16px', background: '#fafafa', borderRadius: '4px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>商品总额：</span>
                <span>¥{orderData.productAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>运费：</span>
                <span>¥{orderData.shippingFee.toFixed(2)}</span>
              </div>
              {orderData.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4d4f' }}>
                  <span>优惠：</span>
                  <span>-¥{orderData.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '16px', 
                fontWeight: 'bold',
                paddingTop: '12px',
                borderTop: '1px solid #d9d9d9'
              }}>
                <span>实付金额：</span>
                <span style={{ color: '#ff4d4f' }}>¥{orderData.totalAmount.toFixed(2)}</span>
              </div>
            </Space>
          </div>
        </Card>

        {/* 4. 商品信息 */}
        <Card 
          title="商品信息" 
          className={styles.card}
          bordered={false}
        >
          <Table
            columns={productColumns}
            dataSource={orderData.products}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default OrderDetailPage;
