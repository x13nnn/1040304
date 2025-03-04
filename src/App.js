import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 登入狀態
  const [currentAccount, setCurrentAccount] = useState(''); // 儲存當前登入的帳號
  const [account, setAccount] = useState(''); // 帳號輸入（登入用）
  const [password, setPassword] = useState(''); // 密碼輸入（登入用）
  const [error, setError] = useState(''); // 登入錯誤訊息
  const [users, setUsers] = useState([ // 靜態 JSON 資料
    { Account: "alice123", Password: "password1" },
    { Account: "bob456", Password: "password2" },
    { Account: "charlie789", Password: "password3" }
  ]);

  // 登入表單提交
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.Account === account && u.Password === password);
    if (user) {
      setIsLoggedIn(true);
      setCurrentAccount(account); // 儲存當前登入的帳號
      setError('');
      setAccount(''); // 清空輸入框
      setPassword('');
    } else {
      setError('帳號或密碼錯誤！');
    }
  };

  // 修改表單狀態
  const [newAccount, setNewAccount] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editError, setEditError] = useState('');

  // 修改表單提交
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!newAccount || !newPassword) {
      setEditError('請填寫所有欄位！');
      return;
    }
    const accountExists = users.some(u => u.Account === newAccount && u.Account !== currentAccount);
    if (accountExists) {
      setEditError('此帳號已被使用！');
      return;
    }

    // 直接覆蓋當前登入用戶的資料
    setUsers(users.map(u => 
      u.Account === currentAccount 
        ? { Account: newAccount, Password: newPassword }
        : u
    ));
    setIsLoggedIn(false); // 修改完成後跳回登入畫面
    setEditError('');
    setNewAccount('');
    setNewPassword('');
    setAccount(''); // 確保回到登入畫面時輸入框清空
    setPassword('');
  };

  return (
    <div className="App">
      <header>
        <h1>我的靜態網站</h1>
      </header>
      <main>
        <section>
          {/* 無論是否登入，都顯示表格 */}
          <h3>所有用戶資訊</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>帳號</th>
                <th>密碼</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.Account}</td>
                  <td>{user.Password}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 登入或修改畫面 */}
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
              <p>提示：嘗試使用帳號 "alice123" 和密碼 "password1"</p>
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