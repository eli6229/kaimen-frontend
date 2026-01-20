
/**
 * 订单列表常量定义
 */
import React from 'react';
import { WechatOutlined, AlipayCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
/**
 * 订单状态标签配置
 */
export const ORDER_STATUS_TABS = [
  { key: 'all', label: '全部', count: 48 },
  { key: 'pending', label: '待付款', count: 5 },
  { key: 'to_ship', label: '待发货', count: 12 },
  { key: 'shipped', label: '已发货', count: 15 },
  { key: 'after_sale', label: '售后中', count: 3 },
  { key: 'closed', label: '已关闭', count: 8 },
  { key: 'completed', label: '已完成', count: 5 },
];

/**
 * 订单状态映射
 */
export const ORDER_STATUS = {
  pending: { text: '待付款', color: 'orange' },
  paid: { text: '待发货', color: 'blue' },
  shipped: { text: '已发货', color: 'cyan' },
  completed: { text: '交易成功', color: 'success' },
  closed: { text: '交易关闭', color: 'default' },
  cancelled: { text: '已取消', color: 'error' },
  refunded: { text: '已退款', color: 'warning' },
};

/**
 * 支付方式图标
 */
export const PAYMENT_ICONS = {
  wechat: <WechatOutlined style={{ color: '#09BB07', fontSize: 16 }} />,
  alipay: <AlipayCircleOutlined style={{ color: '#1677FF', fontSize: 16 }} />,
} as const;

/**
 * 时间快捷选项
 */
export const DATE_PRESETS = [
  { label: '今天', value: [dayjs().startOf('day'), dayjs().endOf('day')] as [dayjs.Dayjs, dayjs.Dayjs] },
  { label: '昨天', value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')] as [dayjs.Dayjs, dayjs.Dayjs] },
  { label: '近7天', value: [dayjs().subtract(7, 'day'), dayjs()] as [dayjs.Dayjs, dayjs.Dayjs] },
  { label: '近30天', value: [dayjs().subtract(30, 'day'), dayjs()] as [dayjs.Dayjs, dayjs.Dayjs] },
  { label: '最近1年', value: [dayjs().subtract(1, 'year'), dayjs()] as [dayjs.Dayjs, dayjs.Dayjs] },
];

/**
 * 搜索类型选项
 */
export const SEARCH_TYPE_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '订单号', value: 'orderNo' },
  { label: '商品', value: 'product' },
  { label: '买家', value: 'buyer' },
];

/**
 * 订单属性选项
 */
export const ORDER_ATTR_OPTIONS = [
  { label: '外部单号', value: 'external' },
  { label: '内部单号', value: 'internal' },
];

/**
 * 时间类型选项
 */
export const TIME_TYPE_OPTIONS = [
  { label: '下单时间', value: 'createTime' },
  { label: '支付时间', value: 'payTime' },
  { label: '发货时间', value: 'shipTime' },
];

/**
 * 订单状态选项
 */
export const ORDER_STATUS_OPTIONS = [
  { label: '待付款', value: 'pending' },
  { label: '待发货', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
];

/**
 * 订单类型选项
 */
export const ORDER_TYPE_OPTIONS = [
  { label: '普通订单', value: 'normal' },
  { label: '预售订单', value: 'presale' },
];

/**
 * 推广方式选项
 */
export const PROMOTION_OPTIONS = [
  { label: '直接', value: 'direct' },
  { label: '分享', value: 'share' },
];

/**
 * 售后状态选项
 */
export const AFTER_SALE_OPTIONS = [
  { label: '无售后', value: 'none' },
  { label: '退款中', value: 'refunding' },
  { label: '已退款', value: 'refunded' },
];

/**
 * 配送方式选项
 */
export const DELIVERY_OPTIONS = [
  { label: '快递', value: 'express' },
  { label: '自提', value: 'pickup' },
];

/**
 * 订单来源选项
 */
export const ORDER_SOURCE_OPTIONS = [
  { label: '微信小程序', value: 'wechat' },
  { label: 'H5', value: 'h5' },
  { label: 'APP', value: 'app' },
];

/**
 * 付款方式选项
 */
export const PAYMENT_METHOD_OPTIONS = [
  { label: '微信支付', value: 'wechat' },
  { label: '支付宝', value: 'alipay' },
  { label: '余额', value: 'balance' },
];
