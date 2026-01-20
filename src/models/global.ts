// 全局共享数据示例
import { useState, useEffect } from 'react';

const useUser = () => {
  // 从 localStorage 初始化 userInfo
  const getUserInfoFromStorage = () => {
    const userInfoStr = localStorage.getItem('userInfo');
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  };

  const [name, setName] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(getUserInfoFromStorage());

  // 监听 userInfo 变化，同步到 localStorage
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  return {
    name,
    setName,
    userInfo,
    setUserInfo,
  };
};

export default useUser;
