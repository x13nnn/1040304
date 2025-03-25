import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function Profile() {
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!name || !account || !password) {
      setError('請填寫所有欄位！');
      return;
    }

    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('account')
      .eq('account', account)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      setError('檢查帳號時出錯，請稍後再試！');
      console.error('檢查錯誤:', checkError);
      return;
    }

    if (existingUser) {
      setError('此帳號已被使用！');
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, account, password }])
      .select();

    if (error) {
      setError('註冊失敗，請稍後再試！');
      console.error('註冊錯誤:', error);
    } else {
      setError('');
      setName('');
      setAccount('');
      setPassword('');
      alert('註冊成功，即將返回登入頁面！');
      window.location.href = '/'; // 重新導向到首頁
    }
  };

  return (
    <div className="App">
      <header>
        <h1>我的靜態網站 - 註冊</h1>
      </header>
      <main>
        <section>
          <h2>註冊新用戶</h2>
          <form onSubmit={handleRegisterSubmit}>
            <div>
              <label>姓名: </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <button type="submit">註冊</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </section>
      </main>
      <footer>
        <p>© 2023 我的靜態網站</p>
      </footer>
    </div>
  );
}

export default Profile;