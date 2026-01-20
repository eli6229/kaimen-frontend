import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useModel, history } from '@umijs/max';

const RightContent: React.FC = () => {
  console.log('RightContent rendered!!!');
  const { userInfo } = useModel('global');
  console.log('userInfo in RightContent:', userInfo);

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    history.push('/login');
  };

  // 下拉菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  // 如果未登录，显示登录按钮
  if (!userInfo) {
    return (
      <div style={{ 
        padding: '8px 16px', 
        // background: '#',
        color: '#000000',
        cursor: 'pointer',
        fontSize: '14px',
        borderRadius: '4px'
      }}>
        <span onClick={() => history.push('/login')}>
          登录
        </span>
      </div>
    );
  }

  return (
    <div style={{ 
    //   padding: '4px 16px',
    //   background: '#f0f0f0',
    //   borderRadius: '4px'
    }}>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar
            size="small"
            src={userInfo.avatar || userInfo.avatarUrl}
            icon={!userInfo.avatar && !userInfo.avatarUrl && <UserOutlined />}
          />
          <span style={{ color: '#000', fontSize: '14px' }}>
            {userInfo.nickname || userInfo.name || userInfo.username || '用户'}
          </span>
        </Space>
      </Dropdown>
    </div>
  );
};

export default RightContent;
