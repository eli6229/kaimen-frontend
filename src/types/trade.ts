/**
 * 交易模块类型定义
 */

/**
 * 订单状态
 */
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled' | 'refunded';

/**
 * 支付方式
 */
export type PaymentMethod = 'wechat' | 'alipay' | 'balance';

/**
 * 订单列表项
 */
export interface OrderListItem {
  id: string;
  orderNo: string;
  userId: string;
  userName: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createTime: string;
  payTime?: string;
  
  // 商品信息
  productName?: string;
  productImage?: string;
  productSpec?: string;
  price?: number;
  quantity?: number;
  
  // 买家/收货人信息
  buyerNickname?: string;
  receiverName?: string;
  receiverPhone?: string;
  
  // 其他信息
  deliveryMethod?: string;
  orderSource?: string;
  isStarred?: boolean;
}

/**
 * 收货地址
 */
export interface Address {
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
}

/**
 * 商品信息
 */
export interface ProductItem {
  id: string;
  productId: string;
  productName: string;
  image: string;
  spec?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

/**
 * 物流轨迹
 */
export interface LogisticsTrace {
  time: string;
  status: string;
}

/**
 * 物流信息
 */
export interface Logistics {
  company?: string;
  trackingNo?: string;
  shipTime?: string;
  estimatedDelivery?: string;
  traces?: LogisticsTrace[];
}

/**
 * 订单详情
 */
export interface OrderDetail {
  id: string;
  orderNo: string;
  userId: string;
  userName: string;
  userPhone?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  transactionNo?: string;
  
  // 金额信息
  productAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  
  // 时间信息
  createTime: string;
  payTime?: string;
  shipTime?: string;
  completeTime?: string;
  cancelTime?: string;
  refundTime?: string;
  
  // 地址和备注
  address?: Address;
  remark?: string;
  
  // 物流信息
  logistics?: Logistics;
  
  // 商品列表
  products: ProductItem[];
}

/**
 * 订单列表查询参数
 */
export interface OrderListParams {
  page: number;
  pageSize: number;
  orderNo?: string;
  userId?: string;
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  startTime?: string;
  endTime?: string;
}
