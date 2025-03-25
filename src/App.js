import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  // 從 Supabase 獲取所有用戶資料
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('獲取用戶資料失敗:', error);
    } else {
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 登入表單提交
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('account', account)
      .eq('password', password)
      .single();

    if (error || !user) {
      setError('帳號或密碼錯誤！');
    } else {
      setIsLoggedIn(true);
      setCurrentAccount(account);
      setError('');
      setAccount('');
      setPassword('');
    }
  };

  // 修改表單狀態
  const [newAccount, setNewAccount] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editError, setEditError] = useState('');

  // 修改表單提交
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!newAccount || !newPassword) {
      setEditError('請填寫所有欄位！');
      return;
    }

    const accountExists = users.some(
      (u) => u.account === newAccount && u.account !== currentAccount
    );
    if (accountExists) {
      setEditError('此帳號已被使用！');
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({ account: newAccount, password: newPassword })
      .eq('account', currentAccount);

    if (error) {
      setEditError('修改失敗，請稍後再試！');
      console.error('修改錯誤:', error);
    } else {
      setUsers(
        users.map((u) =>
          u.account === currentAccount
            ? { ...u, account: newAccount, password: newPassword }
            : u
        )
      );
      setIsLoggedIn(false);
      setEditError('');
      setNewAccount('');
      setNewPassword('');
      setAccount('');
      setPassword('');
    }
  };

  // 刪除帳號功能
  const handleDeleteAccount = async () => {
    if (!window.confirm('確定要刪除此帳號嗎？此操作無法復原！')) {
      return;
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('account', currentAccount);

    if (error) {
      setEditError('刪除帳號失敗，請稍後再試！');
      console.error('刪除錯誤:', error);
    } else {
      // 更新前端用戶列表
      setUsers(users.filter((u) => u.account !== currentAccount));
      // 登出用戶
      setIsLoggedIn(false);
      setCurrentAccount('');
      setEditError('');
      setNewAccount('');
      setNewPassword('');
      setAccount('');
      setPassword('');
      alert('帳號已成功刪除！');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>我的靜態網站</h1>
      </header>
      <main>
        <section>
          <h3>所有用戶資訊</h3>
          <button onClick={fetchUsers}>重新整理用戶列表</button>
          <table className="user-table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>帳號</th>
                <th>密碼</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.account}</td>
                  <td>{user.password}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {isLoggedIn ? (
            <>
              <h2>歡迎</h2>
              <p>您已登入，帳號：{currentAccount}</p>
              <h3>修改帳戶資訊</h3>
              <form onSubmit={handleEditSubmit}>
                <div>
                  <label>新帳號: </label>
                  <input
                    type="text"
                    value={newAccount}
                    onChange={(e) => setNewAccount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>新密碼: </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">保存修改</button>
              </form>
              {editError && <p style={{ color: 'red' }}>{editError}</p>}
              <button
                onClick={handleDeleteAccount}
                style={{ backgroundColor: 'red', color: 'white', marginTop: '10px' }}
              >
                刪除帳號
              </button>
            </>
          ) : (
            <>
              <h2>登入</h2>
              <form onSubmit={handleLoginSubmit}>
                <div>
                  <label>帳號: </label>
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>密碼: </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">登入</button>
              </form>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <p>提示：嘗試使用您在 Supabase 中註冊的帳號和密碼</p>
            </>
          )}
        </section>
      </main>
      <footer>
        <p>© 2023 我的靜態網站</p>
      </footer>
    </div>
  );
}

export default App;