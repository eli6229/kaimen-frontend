import { userLogin } from '@/services/user';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { history, useModel } from '@umijs/max';
import styles from './index.less';

type LoginForm = {
  username: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setUserInfo } = useModel('global');

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const {data: response} = await userLogin(values.username, values.password);
      console.log(response,'response')
      if(response) {
        setUserInfo(response);
        localStorage.setItem('userInfo', JSON.stringify(response));
        localStorage.setItem('token', response.token || '');
        message.success('登录成功！');
        history.push('/home');
      }
    } catch (error: any) {
      message.error(error?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <span className={styles.title}>用户登录</span>
          </div>
          <div className={styles.desc}>欢迎登录系统</div>
        </div>

        <div className={styles.main}>
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
