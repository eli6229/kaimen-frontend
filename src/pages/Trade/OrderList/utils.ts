/**
 * 订单列表工具函数
 */

/**
 * 手机号脱敏处理
 * @param phone 手机号
 * @returns 脱敏后的手机号
 */
export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @param successMsg 成功提示消息
 */
export const copyToClipboard = (text: string, successMsg: string = '复制成功'): Promise<void> => {
  return navigator.clipboard.writeText(text).then(() => {
    // 成功回调在调用处处理
  });
};

/**
 * 格式化金额
 * @param amount 金额
 * @param decimals 小数位数
 * @returns 格式化后的金额字符串
 */
export const formatAmount = (amount: number, decimals: number = 2): string => {
  return `¥${amount.toFixed(decimals)}`;
};

/**
 * 获取订单状态文本颜色
 * @param status 订单状态
 * @returns 颜色值
 */
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: '#fa8c16',
    paid: '#1890ff',
    shipped: '#13c2c2',
    completed: '#52c41a',
    closed: '#d9d9d9',
    cancelled: '#ff4d4f',
    refunded: '#faad14',
  };
  return colorMap[status] || '#d9d9d9';
};

/**
 * 导出数据为 CSV
 * @param data 数据数组
 * @param filename 文件名
 */
export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;

  // 获取表头
  const headers = Object.keys(data[0]);
  
  // 构建 CSV 内容
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // 处理包含逗号或换行的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // 创建 Blob 并下载
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
