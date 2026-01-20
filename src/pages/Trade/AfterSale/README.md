# 售后维权页面

## 📋 功能概述

售后维权页面用于管理用户的售后申请，包括退款、退货退款、换货等售后服务。

## ✨ 核心功能

### 1. 售后列表展示

- ✅ 展示所有售后订单
- ✅ 支持分页显示
- ✅ 支持表格列设置
- ✅ 支持密度调整

### 2. 搜索筛选

- ✅ **售后单号**：精确搜索
- ✅ **关联订单号**：精确搜索
- ✅ **售后类型**：
  - 仅退款
  - 退货退款
  - 换货
- ✅ **售后状态**：
  - 待审核
  - 处理中
  - 已同意
  - 已拒绝
  - 已完成
  - 已取消
- ✅ **申请时间范围**：日期范围选择

### 3. 售后处理

- ✅ **查看详情**：查看完整的售后信息
- ✅ **审核通过**：同意用户的售后申请
- ✅ **审核拒绝**：拒绝用户的售后申请
- ✅ **二次确认**：重要操作需要确认

### 4. 信息展示

#### 4.1 商品信息

- 商品图片（60x60）
- 商品名称
- 退款金额（红色高亮）

#### 4.2 售后信息

- 售后单号（可复制）
- 关联订单号（可复制）
- 售后类型（彩色标签）
- 售后状态（彩色标签）
- 售后原因

#### 4.3 用户信息

- 用户昵称
- 用户手机号（脱敏显示）

#### 4.4 时间信息

- 申请时间
- 更新时间

## 🎯 售后类型

| 类型     | 说明               | 标签颜色 |
| -------- | ------------------ | -------- |
| 仅退款   | 不退货，只退款     | 蓝色     |
| 退货退款 | 需要退货，然后退款 | 橙色     |
| 换货     | 换成其他商品       | 绿色     |

## 📊 售后状态

| 状态   | 说明         | 标签颜色 | 可操作       |
| ------ | ------------ | -------- | ------------ |
| 待审核 | 等待客服审核 | 灰色     | ✅ 通过/拒绝 |
| 处理中 | 正在处理中   | 蓝色     | ❌           |
| 已同意 | 审核通过     | 绿色     | ❌           |
| 已拒绝 | 审核拒绝     | 红色     | ❌           |
| 已完成 | 售后完成     | 绿色     | ❌           |
| 已取消 | 用户取消     | 灰色     | ❌           |

## 🔧 操作说明

### 审核通过流程

1. 点击"通过"按钮
2. 确认操作
3. 系统调用审核通过 API
4. 刷新列表

### 审核拒绝流程

1. 点击"拒绝"按钮
2. 确认操作（危险操作，红色按钮）
3. 系统调用审核拒绝 API
4. 刷新列表

### 查看详情

点击"查看"按钮，弹窗显示：

- 售后单号
- 关联订单号
- 售后类型
- 退款金额
- 售后原因
- 详细说明
- 申请时间
- 凭证图片（如有）

## 📝 数据结构

```typescript
interface AfterSaleItem {
  id: string; // 售后ID
  aftersaleNo: string; // 售后单号
  orderNo: string; // 关联订单号
  type: 'refund' | 'return_refund' | 'exchange'; // 售后类型
  status:
    | 'pending'
    | 'processing'
    | 'approved'
    | 'rejected'
    | 'completed'
    | 'cancelled'; // 售后状态
  reason: string; // 售后原因
  refundAmount: number; // 退款金额
  productName: string; // 商品名称
  productImage: string; // 商品图片
  userName: string; // 用户昵称
  userPhone: string; // 用户手机号
  createTime: string; // 申请时间
  updateTime: string; // 更新时间
  description?: string; // 详细说明
  images?: string[]; // 凭证图片
}
```

## 🔌 API 接口

### 获取售后列表

```typescript
GET /api/aftersale/list
参数：
- page: 页码
- pageSize: 每页数量
- aftersaleNo?: 售后单号
- orderNo?: 订单号
- type?: 售后类型
- status?: 售后状态
- startTime?: 开始时间
- endTime?: 结束时间
```

### 审核通过

```typescript
POST /api/aftersale/approve
参数：
- aftersaleId: 售后ID
- remark?: 备注
```

### 审核拒绝

```typescript
POST /api/aftersale/reject
参数：
- aftersaleId: 售后ID
- reason: 拒绝原因
```

### 获取售后详情

```typescript
GET /api/aftersale/:id
参数：
- id: 售后ID
```

## 💻 技术实现

### 核心组件

- **ProTable**：专业表格组件
- **Modal**：弹窗组件
- **Image**：图片预览组件
- **Tag**：标签组件

### 关键功能

```typescript
// 审核通过
const handleApprove = (record: AfterSaleItem) => {
  Modal.confirm({
    title: '审核通过',
    content: `确定要通过售后单 ${record.aftersaleNo} 吗？`,
    onOk: async () => {
      // 调用 API
      await approveAfterSale(record.id);
      message.success('审核通过成功');
      actionRef.current?.reload();
    },
  });
};

// 审核拒绝
const handleReject = (record: AfterSaleItem) => {
  Modal.confirm({
    title: '审核拒绝',
    content: `确定要拒绝售后单 ${record.aftersaleNo} 吗？`,
    okButtonProps: { danger: true },
    onOk: async () => {
      // 调用 API
      await rejectAfterSale(record.id);
      message.success('已拒绝');
      actionRef.current?.reload();
    },
  });
};
```

### 表格配置

```typescript
<ProTable
  columns={columns}
  request={async (params) => {
    const result = await getAfterSaleList(params);
    return {
      data: result.data?.list || [],
      success: true,
      total: result.data?.total || 0,
    };
  }}
  search={{
    labelWidth: 'auto',
    defaultCollapsed: false,
    span: 6,
  }}
  pagination={{
    defaultPageSize: 20,
    showSizeChanger: true,
  }}
/>
```

## 📱 响应式设计

- 桌面端：完整展示所有列
- 平板端：自动横向滚动
- 移动端：简化显示，优先展示关键信息

## 🎨 界面特点

### 1. 信息层级清晰

- 商品信息：图文并茂
- 售后信息：彩色标签
- 操作按钮：图标+文字

### 2. 视觉设计

- **蓝色系**：售后类型（仅退款）
- **橙色系**：售后类型（退货退款）
- **绿色系**：成功状态、换货
- **红色系**：拒绝状态、金额
- **灰色系**：中性状态

### 3. 交互反馈

- Hover 效果
- Loading 状态
- Toast 提示
- Modal 确认

## 🚀 使用示例

### 访问页面

```
http://localhost:8000/trade/aftersale
```

### 审核流程

1. 进入售后维权页面
2. 查看待审核的售后申请
3. 点击"查看"按钮了解详情
4. 点击"通过"或"拒绝"按钮
5. 确认操作
6. 完成审核

## 🔮 扩展功能（待实现）

- [ ] 批量审核
- [ ] 导出售后数据
- [ ] 售后统计图表
- [ ] 物流信息追踪
- [ ] 退款进度查询
- [ ] 自动审核规则
- [ ] 售后评价系统
- [ ] 消息通知

## 📚 参考文档

- [ProTable 官方文档](https://procomponents.ant.design/components/table)
- [Modal 组件文档](https://ant.design/components/modal-cn)
- [Image 组件文档](https://ant.design/components/image-cn)

## 🎓 最佳实践

1. ✅ **状态管理**：使用 ProTable 的 actionRef 刷新数据
2. ✅ **用户体验**：重要操作需要二次确认
3. ✅ **数据脱敏**：手机号自动脱敏显示
4. ✅ **视觉反馈**：使用彩色标签区分不同状态
5. ✅ **响应式**：表格自动适配不同屏幕
6. ✅ **性能优化**：分页加载，避免一次性加载大量数据

---

**创建时间**: 2026-01-20  
**页面路径**: `/trade/aftersale`
