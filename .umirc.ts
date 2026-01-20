import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '后台管理',
  },
  routes: [
    {
      path: '/login',
      component: './Login',
      layout: false,
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '鉴定单管理',
      path: '/appraisal',
      component: './Appraisal',
    },
    {
      name: '人工客服',
      path: '/customer-service',
      component: './CustomerService',
    },
    {
      name: '交易管理',
      path: '/trade',
      routes: [
        {
          name: '订单列表',
          path: '/trade/orders',
          component: './Trade/OrderList',
        },
        {
          name: '订单详情',
          path: '/trade/orders/:id',
          component: './Trade/OrderDetail',
          hideInMenu: true,
        },
        {
          name: '售后维权',
          path: '/trade/aftersale',
          component: './Trade/AfterSale',
        },
        {
          name: '售后详情',
          path: '/trade/aftersale/:id',
          component: './Trade/AfterSaleDetail',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '商品管理',
      path: '/product',
      routes: [
        {
          name: '商品列表',
          path: '/product/list',
          component: './Product/List',
        },
        {
          name: '发布商品',
          path: '/product/publish',
          component: './Product/Publish',
          hideInMenu: true,
        },
        {
          name: '编辑商品',
          path: '/product/edit/:id',
          component: './Product/Publish',
          hideInMenu: true,
        },
        {
          name: '商品类目',
          path: '/product/category',
          component: './Product/Category',
        },
      ],
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'yarn',
});

