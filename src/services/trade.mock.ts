/**
 * 订单模块 Mock 数据
 * 用于开发测试
 */
import type { OrderDetail, OrderListItem } from '@/types/trade';

/**
 * 生成模拟订单列表
 */
export function generateMockOrderList(count: number = 20): OrderListItem[] {
  const statuses = ['pending', 'paid', 'shipped', 'completed', 'closed', 'cancelled', 'refunded'] as const;
  const paymentMethods = ['wechat', 'alipay', 'balance'] as const;
  const products = [
    { name: '各种各样的衣衫，宽松的和收缩的', spec: '一般了，随机发货' },
    { name: '高端奢侈品手提包', spec: '黑色/标准款' },
    { name: '时尚休闲运动鞋', spec: '白色/42码' },
    { name: '精致女士手表', spec: '金色/皮革表带' },
    { name: '商务男士皮鞋', spec: '黑色/40码' },
    { name: '韩版修身外套', spec: '蓝色/L码' },
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const price = Math.floor(Math.random() * 5000 + 500) / 10;
    
    return {
      id: `order_${i + 1}`,
      orderNo: `E2026${String(Date.now()).slice(-10)}${String(i).padStart(4, '0')}`,
      userId: `user_${Math.floor(Math.random() * 100)}`,
      userName: `用户${Math.floor(Math.random() * 100)}`,
      totalAmount: price * quantity,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      payTime: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      
      // 商品信息
      productName: product.name,
      productImage: 'https://via.placeholder.com/60',
      productSpec: product.spec,
      price: price,
      quantity: quantity,
      
      // 买家/收货人信息
      buyerNickname: `YY*g ${String.fromCharCode(97 + Math.floor(Math.random() * 26))}${String.fromCharCode(97 + Math.floor(Math.random() * 26))}`,
      receiverName: `李***`,
      receiverPhone: `158****${String(Math.floor(Math.random() * 9000) + 1000)}`,
      
      // 其他信息
      deliveryMethod: 'express',
      orderSource: Math.random() > 0.5 ? 'wechat' : 'h5',
      isStarred: Math.random() > 0.8,
    };
  });
}

/**
 * 生成模拟订单详情
 */
export function generateMockOrderDetail(orderId: string): OrderDetail {
  const now = Date.now();
  const createTime = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const payTime = new Date(now - 6 * 24 * 60 * 60 * 1000);
  const shipTime = new Date(now - 5 * 24 * 60 * 60 * 1000);
  
  return {
    id: orderId,
    orderNo: `ORD${Date.now()}0001`,
    userId: 'user_123',
    userName: '张三',
    userPhone: '13800138000',
    status: 'shipped',
    paymentMethod: 'wechat',
    transactionNo: `TXN${Date.now()}`,
    
    // 金额信息
    productAmount: 299.00,
    shippingFee: 10.00,
    discountAmount: 9.00,
    totalAmount: 300.00,
    
    // 时间信息
    createTime: createTime.toISOString(),
    payTime: payTime.toISOString(),
    shipTime: shipTime.toISOString(),
    
    // 地址信息
    address: {
      receiverName: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园中区科苑路XX号XX大厦XX层',
    },
    
    remark: '请在工作日送货，谢谢',
    
    // 物流信息
    logistics: {
      company: '顺丰速运',
      trackingNo: 'SF1234567890',
      shipTime: shipTime.toISOString(),
      estimatedDelivery: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
      traces: [
        {
          time: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
          status: '快件已到达【深圳南山中心】',
        },
        {
          time: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
          status: '快件已发出【深圳转运中心】',
        },
        {
          time: shipTime.toISOString(),
          status: '商家已发货',
        },
      ],
    },
    
    // 商品列表
    products: [
      {
        id: 'prod_1',
        productId: 'p_001',
        productName: '高端奢侈品手提包',
        image: 'https://via.placeholder.com/100',
        spec: '黑色/标准款',
        price: 299.00,
        quantity: 1,
        subtotal: 299.00,
      },
    ],
  };
}
