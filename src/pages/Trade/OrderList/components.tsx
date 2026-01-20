/**
 * 订单列表渲染组件
 */
import React from 'react';
import { Space, Tag, Button, Checkbox, Image, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined,
  StarOutlined,
  StarFilled,
  MoreOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { OrderListItem } from '@/types/trade';
import { ORDER_STATUS, PAYMENT_ICONS } from '@/constants/index';
import { maskPhone } from './utils';
import styles from './index.less';

/**
 * 订单商品信息组件
 */
interface ProductInfoProps {
  record: OrderListItem;
  selectedRowKeys: React.Key[];
  onCopyOrderNo: (orderNo: string) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ 
  record, 
  selectedRowKeys,
  onCopyOrderNo
}) => {
  return (
    <div className={styles.productInfo}>
      <div className={styles.orderHeader}>
        <Space size={8}>
          <span className={styles.orderNo}>
            订单号: {record.orderNo}
            <Button 
              type="link" 
              size="small" 
              style={{ padding: '0 4px' }}
              onClick={() => onCopyOrderNo(record.orderNo)}
            >
              复制
            </Button>
          </span>
          <span className={styles.orderTime}>
            下单时间: {dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>
          {record.paymentMethod === 'wechat' && (
            <Tag icon={(PAYMENT_ICONS as any)['wechat']} color="success">微信支付</Tag>
          )}
          {record.paymentMethod === 'alipay' && (
            <Tag icon={(PAYMENT_ICONS as any)['alipay']} color="blue">支付宝</Tag>
          )}
        </Space>
      </div>
      
      <div className={styles.productDetail}>
        <Image
          src={record.productImage || 'https://via.placeholder.com/60'}
          alt={record.productName}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
        <div className={styles.productText}>
          <div className={styles.productName}>{record.productName}</div>
          <div className={styles.productSpec}>规格: {record.productSpec || '标准款'}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * 买家信息组件
 */
interface BuyerInfoProps {
  record: OrderListItem;
}

export const BuyerInfo: React.FC<BuyerInfoProps> = ({ record }) => {
  return (
    <div className={styles.buyerInfo}>
      <div>买家: {record.buyerNickname || record.userName}</div>
      <div>收货人: {record.receiverName || '***'} {maskPhone(record.receiverPhone || '')}</div>
    </div>
  );
};

/**
 * 订单操作按钮组件
 */
interface OrderActionsProps {
  record: OrderListItem;
  isStarred: boolean;
  onViewDetail: (orderId: string) => void;
  onEdit?: (orderId: string, e?: React.MouseEvent) => void;
  onToggleStar?: (orderId: string, e?: React.MouseEvent) => void;
  onPrint?: (orderId: string) => void;
  onAddRemark?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  record,
  isStarred,
  onViewDetail,
//   onEdit,
//   onToggleStar,
//   onPrint,
//   onAddRemark,
//   onCancel,
}) => {
//   const menuItems: MenuProps['items'] = [
//     {
//       key: 'print',
//       label: '打印订单',
//       onClick: () => onPrint(record.id),
//     },
//     {
//       key: 'remark',
//       label: '添加备注',
//       onClick: () => onAddRemark(record.id),
//     },
//     {
//       key: 'cancel',
//       label: '取消订单',
//       danger: true,
//       onClick: () => onCancel(record.id),
//     },
//   ];

  return (
    <Space>
      <Button
        type="link"
        size="small"
        icon={<EyeOutlined />}
        onClick={() => onViewDetail(record.id)}
      >
        查看详情
      </Button>
      {/* <Button
        type="link"
        size="small"
        icon={<EditOutlined />}
        onClick={(e) => onEdit(record.id, e)}
      >
        备注
      </Button> */}
      {/* <Button
        type="link"
        size="small"
        icon={isStarred ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
        onClick={(e) => onToggleStar(record.id, e)}
      >
        {isStarred ? '已加星' : '加星'}
      </Button>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Button type="link" size="small" icon={<MoreOutlined />} />
      </Dropdown> */}
    </Space>
  );
};

/**
 * 价格信息组件
 */
interface PriceInfoProps {
  price?: number;
  quantity?: number;
}

export const PriceInfo: React.FC<PriceInfoProps> = ({ price = 0, quantity = 1 }) => {
  return (
    <div>
      <div>¥{price.toFixed(2)}</div>
      <div style={{ color: '#999', fontSize: 12 }}>x{quantity}</div>
    </div>
  );
};

/**
 * 总金额组件
 */
interface TotalAmountProps {
  amount: number;
}

export const TotalAmount: React.FC<TotalAmountProps> = ({ amount }) => {
  return (
    <div style={{ color: '#ff4d4f', fontWeight: 500 }}>
      ¥{amount.toFixed(2)}
    </div>
  );
};

/**
 * 订单状态组件
 */
interface OrderStatusProps {
  status: string;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  const statusInfo = ORDER_STATUS[status as keyof typeof ORDER_STATUS];
  return <Tag color={statusInfo?.color}>{statusInfo?.text || status}</Tag>;
};
