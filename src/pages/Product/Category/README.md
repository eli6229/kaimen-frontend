# 商品类目管理页面

## 📋 功能概述

商品类目管理页面用于管理商品分类体系，支持多级类目结构，提供完整的增删改查和批量操作功能。

## ✨ 核心功能

### 1. 增（Create）- 新增类目

- ✅ 点击"新增类目"按钮打开弹窗
- ✅ 填写类目信息：
  - 类目名称（必填）
  - 类目编码（必填）
  - 父级类目（可选，不选则为一级类目）
  - 排序值（必填，数字）
  - 状态（必填，启用/停用）
  - 类目图标（可选，上传图片）
  - 类目描述（可选）
- ✅ 表单校验
- ✅ 提交成功后自动刷新列表

### 2. 删（Delete）- 删除类目

#### 2.1 单个删除

- ✅ 点击操作列的"删除"按钮
- ✅ 二次确认（危险操作）
- ✅ 删除成功后自动刷新列表

#### 2.2 批量删除

- ✅ 勾选多个类目
- ✅ 点击"批量删除"按钮
- ✅ 显示删除数量确认
- ✅ 二次确认（危险操作）
- ✅ 删除成功后清空选择并刷新列表

### 3. 改（Update）- 编辑类目

- ✅ 点击操作列的"编辑"按钮
- ✅ 弹窗自动填充当前类目信息
- ✅ 修改类目信息
- ✅ 表单校验
- ✅ 提交成功后自动刷新列表

### 4. 查（Read）- 查询类目

#### 4.1 列表展示

- ✅ 类目名称（带图标）
- ✅ 类目编码（可复制）
- ✅ 父级类目
- ✅ 级别标签（一级/二级）
- ✅ 排序值（支持排序）
- ✅ 状态标签（启用/停用）
- ✅ 类目描述
- ✅ 创建时间（支持排序）

#### 4.2 搜索筛选

- ✅ **类目名称**：模糊搜索
- ✅ **类目编码**：模糊搜索
- ✅ **状态筛选**：启用/停用
- ✅ **创建时间范围**：日期范围选择

### 5. 批量操作

#### 5.1 多选功能

- ✅ 表格支持多选（复选框）
- ✅ 显示已选择项数量
- ✅ 取消选择按钮

#### 5.2 批量操作按钮

- ✅ **批量启用**：一次性启用多个类目
- ✅ **批量停用**：一次性停用多个类目
- ✅ **批量删除**：一次性删除多个类目
- ✅ **取消选择**：清空已选项

#### 5.3 批量操作流程

1. 勾选要操作的类目
2. 点击对应的批量操作按钮
3. 确认操作（显示操作数量）
4. 执行操作
5. 显示成功提示
6. 自动刷新列表

## 📊 数据结构

```typescript
interface CategoryItem {
  id: string; // 类目ID
  name: string; // 类目名称
  code: string; // 类目编码
  parentId?: string; // 父级类目ID
  parentName?: string; // 父级类目名称
  level: number; // 级别（1=一级，2=二级）
  sort: number; // 排序值
  icon?: string; // 类目图标
  description?: string; // 类目描述
  status: 'active' | 'inactive'; // 状态（启用/停用）
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}
```

## 🎯 表格列配置

| 列名     | 宽度  | 功能             | 搜索        |
| -------- | ----- | ---------------- | ----------- |
| 类目名称 | 200px | 展示名称和图标   | ✅ 模糊搜索 |
| 类目编码 | 150px | 展示编码，可复制 | ✅ 模糊搜索 |
| 父级类目 | 150px | 展示父级名称     | ❌          |
| 级别     | 80px  | 彩色标签         | ❌          |
| 排序     | 80px  | 数字，可排序     | ❌          |
| 状态     | 100px | 彩色标签         | ✅ 下拉筛选 |
| 描述     | 200px | 文本，支持省略   | ❌          |
| 创建时间 | 180px | 日期时间，可排序 | ✅ 范围选择 |
| 操作     | 180px | 编辑、删除按钮   | ❌          |

## 🔌 API 接口

### 获取类目列表

```typescript
GET /api/product/category/list
参数：
- page: 页码
- pageSize: 每页数量
- name?: 类目名称
- code?: 类目编码
- status?: 状态
- startTime?: 开始时间
- endTime?: 结束时间
```

### 新增类目

```typescript
POST /api/product/category/create
参数：
- name: 类目名称
- code: 类目编码
- parentId?: 父级类目ID
- sort: 排序值
- status: 状态
- icon?: 类目图标
- description?: 类目描述
```

### 编辑类目

```typescript
POST /api/product/category/update
参数：
- id: 类目ID
- name: 类目名称
- code: 类目编码
- parentId?: 父级类目ID
- sort: 排序值
- status: 状态
- icon?: 类目图标
- description?: 类目描述
```

### 删除类目

```typescript
POST /api/product/category/delete
参数：
- id: 类目ID
```

### 批量删除

```typescript
POST /api/product/category/batch-delete
参数：
- ids: 类目ID数组
```

### 批量启用

```typescript
POST /api/product/category/batch-enable
参数：
- ids: 类目ID数组
```

### 批量停用

```typescript
POST /api/product/category/batch-disable
参数：
- ids: 类目ID数组
```

## 💻 技术实现

### 核心组件

- **ProTable**：专业表格组件
- **ModalForm**：弹窗表单组件
- **ProFormText**：文本输入组件
- **ProFormSelect**：下拉选择组件
- **ProFormTextArea**：多行文本组件
- **ProFormUploadButton**：上传组件

### 关键功能实现

#### 新增类目

```typescript
const handleCreate = async (values: any) => {
  try {
    // 调用新增 API
    await createCategory(values);
    message.success('新增成功');
    setCreateModalVisible(false);
    actionRef.current?.reload();
    return true;
  } catch (error) {
    message.error('新增失败');
    return false;
  }
};
```

#### 批量删除

```typescript
const handleBatchDelete = () => {
  Modal.confirm({
    title: '批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.length} 个类目吗？`,
    okButtonProps: { danger: true },
    onOk: async () => {
      // 调用批量删除 API
      await batchDeleteCategory(selectedRowKeys);
      message.success(`已删除 ${selectedRowKeys.length} 个类目`);
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    },
  });
};
```

#### 编辑类目

```typescript
const openEditModal = (record: CategoryItem) => {
  setCurrentRecord(record);
  setEditModalVisible(true);
};

const handleEdit = async (values: any) => {
  try {
    // 调用编辑 API
    await updateCategory(values);
    message.success('编辑成功');
    setEditModalVisible(false);
    actionRef.current?.reload();
    return true;
  } catch (error) {
    message.error('编辑失败');
    return false;
  }
};
```

## 🎨 界面特点

### 1. 信息展示清晰

- **图标展示**：类目名称旁显示类目图标
- **彩色标签**：状态和级别使用彩色标签区分
- **操作按钮**：编辑（蓝色）、删除（红色）

### 2. 视觉设计

- **蓝色系**：一级类目标签
- **绿色系**：二级类目标签
- **成功色**：启用状态
- **灰色系**：停用状态
- **红色系**：删除按钮

### 3. 交互反馈

- ✅ Hover 效果
- ✅ Loading 状态
- ✅ Toast 提示
- ✅ Modal 确认（危险操作）
- ✅ 表单校验提示

### 4. 批量操作体验

- ✅ 选中项数量实时显示
- ✅ 批量操作按钮动态显示
- ✅ 操作成功后自动清空选择
- ✅ 二次确认避免误操作

## 📱 响应式设计

- **桌面端**：完整展示所有列
- **平板端**：自动横向滚动
- **移动端**：简化显示，优先展示关键信息

## 🚀 使用示例

### 访问页面

```
http://localhost:8000/product/category
```

### 新增类目流程

1. 点击"新增类目"按钮
2. 填写类目信息
3. 可选择父级类目（创建二级类目）
4. 上传类目图标
5. 点击"确定"提交
6. 查看新增结果

### 批量操作流程

1. 勾选要操作的类目
2. 顶部显示"已选择 X 项"
3. 工具栏显示批量操作按钮
4. 点击对应的批量操作按钮
5. 确认操作
6. 查看操作结果

### 编辑类目流程

1. 点击操作列的"编辑"按钮
2. 弹窗自动填充当前信息
3. 修改需要更改的字段
4. 点击"确定"提交
5. 查看更新结果

### 删除类目流程

1. 点击操作列的"删除"按钮
2. 确认删除操作
3. 查看删除结果

## 🔒 权限控制

建议配置以下权限：

- **查看权限**：所有管理员
- **新增权限**：商品管理员及以上
- **编辑权限**：商品管理员及以上
- **删除权限**：高级管理员及以上
- **批量操作权限**：高级管理员及以上

## 🔮 扩展功能（待实现）

- [ ] 树形结构展示多级类目
- [ ] 拖拽调整类目顺序
- [ ] 类目启用/停用开关
- [ ] 导出类目数据
- [ ] 导入类目数据
- [ ] 类目使用统计
- [ ] 关联商品数量显示
- [ ] 类目图标批量上传
- [ ] 类目层级限制（最多 3 级）
- [ ] 类目移动（更换父级）

## 📚 参考文档

- [ProTable 官方文档](https://procomponents.ant.design/components/table)
- [ModalForm 官方文档](https://procomponents.ant.design/components/modal-form)
- [ProForm 表单组件](https://procomponents.ant.design/components/form)

## 🎓 最佳实践

1. ✅ **表单校验**：必填项、格式校验
2. ✅ **二次确认**：删除等危险操作
3. ✅ **即时反馈**：操作成功/失败提示
4. ✅ **自动刷新**：操作后自动更新列表
5. ✅ **状态管理**：React Hooks 管理状态
6. ✅ **代码复用**：新增和编辑共用表单组件
7. ✅ **Mock 数据**：开发阶段使用 Mock 数据
8. ✅ **响应式**：适配各种屏幕尺寸

## ⚠️ 注意事项

1. **删除限制**：

   - 有子类目的父类目不能删除
   - 有关联商品的类目不能删除
   - 删除操作不可恢复

2. **编码唯一性**：

   - 类目编码必须唯一
   - 编码创建后不建议修改

3. **父级选择**：

   - 编辑时不能选择自己作为父级
   - 避免循环引用

4. **排序规则**：
   - 数字越小越靠前
   - 相同排序值按创建时间排序

---

**创建时间**: 2026-01-20  
**页面路径**: `/product/category`  
**功能标签**: #商品管理 #类目管理 #CRUD #批量操作
