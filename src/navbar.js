import React from 'react';
import { Link } from 'react-router-dom';
// 移除這行：import './navbar.css';

function navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">登入頁面</Link>
        </li>
        <li>
          <Link to="/profile">註冊頁面</Link>
        </li>
      </ul>
    </nav>
  );
}

export default navbar;