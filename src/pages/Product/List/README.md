# 商品列表管理页面

## 📋 功能概述

商品列表管理页面用于管理所有商品，支持发布、编辑、删除商品，以及完整的搜索筛选和批量操作功能。

## ✨ 核心功能

### 1. 商品发布（跳转新页面）

- ✅ 点击"发布商品"按钮
- ✅ 跳转到 `/product/publish` 页面
- ✅ 填写完整的商品信息表单
- ✅ 提交后返回列表页

### 2. 商品编辑（跳转新页面）

- ✅ 点击操作列的"编辑"按钮
- ✅ 跳转到 `/product/edit/:id` 页面
- ✅ 自动加载当前商品信息
- ✅ 修改后保存并返回列表页

### 3. 商品删除

- ✅ 点击操作列的"删除"按钮
- ✅ 二次确认（危险操作）
- ✅ 删除成功后自动刷新列表

### 4. 状态标签筛选

- ✅ **全部**：显示所有商品
- ✅ **销售中**：正在销售的商品
- ✅ **已售罄**：库存为 0 的商品
- ✅ **仓库中**：未上架的商品
- 每个标签显示对应数量

### 5. 搜索筛选（在 ProTable columns 中配置）

#### 5.1 基础搜索

- ✅ **创建时间范围**：日期范围选择（`dateRange`, `hideInTable`）
- ✅ **商品名称**：模糊搜索（输入商品名称或编号）
- ✅ **商品属性/编码**：下拉选择（商品名称/商品编码/商品条码）
- ✅ **商品属性值**：输入框
- ✅ **商品分组**：下拉选择（热销商品/新品推荐/限时特惠）
- ✅ **商品定位**：下拉选择（全部/热门/最新）

#### 5.2 高级筛选

- ✅ **销量范围**：最小值-最大值（自定义输入框）
- ✅ **价格范围**：最小值-最大值（自定义输入框）
- ✅ **商品图片**：下拉选择（全部/有图片/无图片）
- ✅ **商品详情页**：下拉选择（全部/有详情/无详情）
- ✅ **商品总计**：下拉选择（全部/按 SKU/按总量）
- ✅ **库存扣减方式**：下拉选择（全部/下单减库存/付款减库存）

#### 5.3 操作按钮

- ✅ **查询**：执行搜索
- ✅ **重置**：清空搜索条件
- ✅ **导出**：导出商品数据

### 6. 列表展示

#### 6.1 表格列

| 列名     | 宽度  | 功能                 | 排序 |
| -------- | ----- | -------------------- | ---- |
| 商品名   | 300px | 展示图片、名称、编号 | ❌   |
| 价格(元) | 120px | 红色高亮显示         | ✅   |
| 访问量   | 150px | 访客数/浏览量        | ❌   |
| 库存     | 100px | 库存预警（<10 红色） | ✅   |
| 销量     | 100px | 数字显示             | ✅   |
| 排序     | 100px | 数字显示             | ✅   |
| 创建时间 | 180px | YYYY-MM-DD HH:mm:ss  | ✅   |
| 商品状态 | 100px | 彩色标签             | ❌   |
| 操作     | 150px | 编辑、删除           | ❌   |

#### 6.2 商品信息展示

- **商品名**：

  - 商品图片（60x60）
  - 商品名称（粗体）
  - 商品编号（灰色小字）

- **价格**：

  - 红色高亮显示
  - 保留两位小数

- **访问量**：

  - 访客数（第一行）
  - 浏览量（第二行，灰色小字）

- **库存**：

  - 库存 < 10 时显示红色预警
  - 否则显示黑色

- **商品状态**：
  - 销售中（绿色）
  - 已售罄（灰色）
  - 仓库中（蓝色）
  - 草稿（灰色）

### 7. 操作列（仅编辑和删除）

- ✅ **编辑**：跳转到编辑页面
- ✅ **删除**：删除商品（二次确认）
- ❌ 其他操作已移除

### 8. 批量操作

#### 8.1 多选功能

- ✅ 表格支持多选（复选框）
- ✅ 显示已选择项数量
- ✅ 批量操作工具栏

#### 8.2 批量操作按钮

- ✅ **批量上架**：一次性上架多个商品
- ✅ **批量下架**：一次性下架多个商品
- ✅ **批量删除**：一次性删除多个商品
- ✅ **取消选择**：清空已选项

## 📊 数据结构

```typescript
interface ProductItem {
  id: string; // 商品ID
  name: string; // 商品名称
  code: string; // 商品编码
  image: string; // 商品主图
  price: number; // 销售价格
  stock: number; // 库存数量
  sales: number; // 销量
  sort: number; // 排序值
  visits: number; // 访客数
  pageViews: number; // 浏览量
  categoryId?: string; // 分类ID
  categoryName?: string; // 分类名称
  groupId?: string; // 分组ID
  groupName?: string; // 分组名称
  status: 'selling' | 'soldout' | 'warehouse' | 'draft'; // 商品状态
  description?: string; // 商品简介
  images?: string[]; // 商品图片数组
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}
```

## 🎯 页面路由

### 列表页

```
路径: /product/list
菜单: 商品管理 > 商品列表
```

### 发布页

```
路径: /product/publish
菜单: 隐藏（hideInMenu: true）
标题: 发布商品
```

### 编辑页

```
路径: /product/edit/:id
菜单: 隐藏（hideInMenu: true）
标题: 编辑商品
```

## 🔌 API 接口

### 获取商品列表

```typescript
GET /api/product/list
参数：
- page: 页码
- pageSize: 每页数量
- name?: 商品名称
- code?: 商品编码
- categoryId?: 分类ID
- groupId?: 分组ID
- status?: 商品状态
- minPrice?: 最低价格
- maxPrice?: 最高价格
- minSales?: 最低销量
- maxSales?: 最高销量
- startTime?: 开始时间
- endTime?: 结束时间
```

### 获取商品详情

```typescript
GET /api/product/:id
参数：
- id: 商品ID
```

### 发布商品

```typescript
POST /api/product/create
参数：
- name: 商品名称
- code: 商品编码
- categoryId: 分类ID
- groupId?: 分组ID
- price: 销售价格
- originalPrice?: 原价
- stock: 库存
- sort: 排序
- status: 商品状态
- images: 商品图片
- description?: 商品简介
- detail?: 商品详情
- stockDeduct: 库存扣减方式
```

### 编辑商品

```typescript
POST /api/product/update
参数：
- id: 商品ID
- 其他字段同发布商品
```

### 删除商品

```typescript
POST /api/product/delete
参数：
- id: 商品ID
```

### 批量删除

```typescript
POST /api/product/batch-delete
参数：
- ids: 商品ID数组
```

### 批量上架

```typescript
POST /api/product/batch-onsale
参数：
- ids: 商品ID数组
```

### 批量下架

```typescript
POST /api/product/batch-offsale
参数：
- ids: 商品ID数组
```

## 💻 技术实现

### 核心组件

- **ProTable**：专业表格组件
- **Form**：表单组件
- **Radio.Group**：状态标签组
- **Upload**：图片上传组件
- **InputNumber**：数字输入组件

### 关键功能实现

#### 发布商品（跳转）

```typescript
const handlePublish = () => {
  history.push('/product/publish');
};
```

#### 编辑商品（跳转）

```typescript
const handleEdit = (record: ProductItem) => {
  history.push(`/product/edit/${record.id}`);
};
```

#### 批量操作

```typescript
const handleBatchDelete = () => {
  Modal.confirm({
    title: '批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.length} 个商品吗？`,
    okButtonProps: { danger: true },
    onOk: async () => {
      // 调用批量删除 API
      await batchDeleteProduct(selectedRowKeys);
      message.success(`已删除 ${selectedRowKeys.length} 个商品`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    },
  });
};
```

## 🎨 界面特点

### 1. 状态标签筛选

- 顶部显示状态标签
- 每个标签显示对应数量
- 选中标签高亮显示
- 点击标签切换状态

### 2. 商品信息展示

- **图文并茂**：商品图片 + 名称 + 编号
- **价格高亮**：红色显示，醒目
- **库存预警**：库存不足红色提示
- **访问统计**：访客数 + 浏览量

### 3. 操作按钮

- **编辑**：蓝色链接按钮
- **删除**：红色链接按钮
- **跳转新页面**：编辑和发布都跳转到新页面

### 4. 批量操作

- 选中项数量实时显示
- 批量操作按钮动态显示
- 操作成功后自动清空选择
- 二次确认避免误操作

## 📱 响应式设计

- **桌面端**：完整展示所有列
- **平板端**：自动横向滚动
- **移动端**：简化显示，优先展示关键信息

## 🚀 使用示例

### 发布商品流程

1. 点击"发布商品"按钮
2. 跳转到发布页面
3. 填写商品信息
4. 上传商品图片
5. 选择商品状态
6. 点击"发布"按钮
7. 自动返回列表页

### 编辑商品流程

1. 点击操作列的"编辑"按钮
2. 跳转到编辑页面（自动加载商品信息）
3. 修改需要更改的字段
4. 点击"保存"按钮
5. 自动返回列表页

### 批量操作流程

1. 勾选要操作的商品
2. 顶部显示"已选择 X 项"
3. 工具栏显示批量操作按钮
4. 点击对应的批量操作按钮
5. 确认操作
6. 查看操作结果

## 🔮 扩展功能（待实现）

- [ ] 批量导入商品
- [ ] 商品复制功能
- [ ] 商品预览功能
- [ ] 富文本编辑器（商品详情）
- [ ] 商品规格（SKU）管理
- [ ] 商品标签管理
- [ ] 运费模板
- [ ] 商品评价管理
- [ ] 库存预警提醒
- [ ] 销量统计图表

## 📚 参考文档

- [ProTable 官方文档](https://procomponents.ant.design/components/table)
- [Form 表单文档](https://ant.design/components/form-cn)
- [Upload 上传文档](https://ant.design/components/upload-cn)

## 🎓 最佳实践

1. ✅ **页面跳转**：发布和编辑使用新页面
2. ✅ **操作简化**：操作列仅保留编辑和删除
3. ✅ **状态标签**：顶部显示，方便快速筛选
4. ✅ **搜索配置**：所有搜索项在 columns 中配置
5. ✅ **批量操作**：支持批量上架/下架/删除
6. ✅ **二次确认**：删除等危险操作需确认
7. ✅ **响应式**：适配各种屏幕尺寸
8. ✅ **库存预警**：库存不足红色提示

---

**创建时间**: 2026-01-20  
**页面路径**: `/product/list`  
**功能标签**: #商品管理 #商品列表 #发布商品 #编辑商品
