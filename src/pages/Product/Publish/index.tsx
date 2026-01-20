/**
 * 商品发布/编辑页面
 * 功能：
 * 1. 新增商品
 * 2. 编辑商品
 * 3. 完整的商品信息表单
 */
import React, { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Space, message, Radio, Select, Upload } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

/**
 * 商品表单数据类型
 */
interface ProductFormData {
  name: string;
  code: string;
  categoryId: string;
  groupId?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sort: number;
  status: 'selling' | 'warehouse' | 'draft';
  images: string[];
  description?: string;
  detail?: string;
  stockDeduct: 'order' | 'pay';
}

const ProductPublishPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const isEdit = !!id;

  /**
   * 获取商品详情（编辑模式）
   */
  const fetchProductDetail = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // TODO: 调用获取商品详情 API
      // const result = await getProductDetail(id);
      
      // Mock 数据
      const mockData = {
        name: '传世大古钱链',
        code: 'PROD0001',
        categoryId: 'cat_1',
        groupId: 'group_1',
        price: 2188.0,
        originalPrice: 2688.0,
        stock: 100,
        sort: 1,
        status: 'selling',
        images: ['https://via.placeholder.com/200'],
        description: '这是一款高端奢侈品',
        detail: '<p>商品详细描述</p>',
        stockDeduct: 'pay',
      };

      form.setFieldsValue(mockData);
      
      // 设置图片列表
      if (mockData.images && mockData.images.length > 0) {
        setFileList(
          mockData.images.map((url, index) => ({
            uid: `${index}`,
            name: `image-${index}.jpg`,
            status: 'done',
            url,
          }))
        );
      }
    } catch (error) {
      message.error('获取商品详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchProductDetail();
    }
  }, [id]);

  /**
   * 提交表单
   */
  const handleSubmit = async (values: ProductFormData) => {
    setLoading(true);
    try {
      console.log('提交数据:', values);
      
      if (isEdit) {
        // TODO: 调用编辑商品 API
        message.success('保存成功');
      } else {
        // TODO: 调用新增商品 API
        message.success('发布成功');
      }
      
      // 返回列表页
      setTimeout(() => {
        history.back();
      }, 1000);
    } catch (error) {
      message.error(isEdit ? '保存失败' : '发布失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 返回列表
   */
  const handleBack = () => {
    history.back();
  };

  /**
   * 图片上传
   */
  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

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
          {isEdit ? '编辑商品' : '发布商品'}
        </div>
        <div />
      </div>

      {/* 表单内容 */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'selling',
          sort: 0,
          stock: 0,
          stockDeduct: 'pay',
        }}
      >
        {/* 基本信息 */}
        <ProCard title="基本信息" style={{ marginBottom: 16 }}>
          <Form.Item
            label="商品名称"
            name="name"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" maxLength={100} showCount />
          </Form.Item>

          <Form.Item
            label="商品编码"
            name="code"
            rules={[{ required: true, message: '请输入商品编码' }]}
          >
            <Input placeholder="请输入商品编码" />
          </Form.Item>

          <Form.Item
            label="商品分类"
            name="categoryId"
            rules={[{ required: true, message: '请选择商品分类' }]}
          >
            <Select placeholder="请选择商品分类">
              <Option value="cat_1">奢侈品包包</Option>
              <Option value="cat_2">名表配饰</Option>
              <Option value="cat_3">珠宝首饰</Option>
              <Option value="cat_4">服装鞋帽</Option>
              <Option value="cat_5">数码电器</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="商品分组"
            name="groupId"
          >
            <Select placeholder="请选择商品分组" allowClear>
              <Option value="group_1">热销商品</Option>
              <Option value="group_2">新品推荐</Option>
              <Option value="group_3">限时特惠</Option>
            </Select>
          </Form.Item>
        </ProCard>

        {/* 价格库存 */}
        <ProCard title="价格库存" style={{ marginBottom: 16 }}>
          <Form.Item
            label="销售价格"
            name="price"
            rules={[{ required: true, message: '请输入销售价格' }]}
          >
            <InputNumber
              placeholder="请输入销售价格"
              min={0}
              precision={2}
              style={{ width: '100%' }}
              addonBefore="¥"
            />
          </Form.Item>

          <Form.Item
            label="原价"
            name="originalPrice"
          >
            <InputNumber
              placeholder="请输入原价"
              min={0}
              precision={2}
              style={{ width: '100%' }}
              addonBefore="¥"
            />
          </Form.Item>

          <Form.Item
            label="商品库存"
            name="stock"
            rules={[{ required: true, message: '请输入商品库存' }]}
          >
            <InputNumber
              placeholder="请输入商品库存"
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="库存扣减方式"
            name="stockDeduct"
            rules={[{ required: true, message: '请选择库存扣减方式' }]}
          >
            <Radio.Group>
              <Radio value="order">下单减库存</Radio>
              <Radio value="pay">付款减库存</Radio>
            </Radio.Group>
          </Form.Item>
        </ProCard>

        {/* 商品图片 */}
        <ProCard title="商品图片" style={{ marginBottom: 16 }}>
          <Form.Item
            label="商品图片"
            name="images"
            extra="建议上传正方形图片，尺寸 800x800，最多上传 9 张"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              maxCount={9}
            >
              {fileList.length >= 9 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </ProCard>

        {/* 商品详情 */}
        <ProCard title="商品详情" style={{ marginBottom: 16 }}>
          <Form.Item
            label="商品简介"
            name="description"
          >
            <TextArea
              placeholder="请输入商品简介"
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="商品详情"
            name="detail"
            extra="支持富文本编辑（功能待完善）"
          >
            <TextArea
              placeholder="请输入商品详情"
              rows={8}
            />
          </Form.Item>
        </ProCard>

        {/* 其他设置 */}
        <ProCard title="其他设置" style={{ marginBottom: 16 }}>
          <Form.Item
            label="排序"
            name="sort"
            extra="数字越小越靠前"
          >
            <InputNumber
              placeholder="请输入排序值"
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="商品状态"
            name="status"
            rules={[{ required: true, message: '请选择商品状态' }]}
          >
            <Radio.Group>
              <Radio value="selling">销售中</Radio>
              <Radio value="warehouse">仓库中</Radio>
              <Radio value="draft">草稿</Radio>
            </Radio.Group>
          </Form.Item>
        </ProCard>

        {/* 提交按钮 */}
        <div className={styles.footer}>
          <Space>
            <Button onClick={handleBack}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? '保存' : '发布'}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default ProductPublishPage;
