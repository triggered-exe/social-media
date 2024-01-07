import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import styles from './Layout.module.css';

const Layout = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.layout}>
        <div className={styles.navbar}>
                <span onClick={()=>navigate('/')}>Twipper</span>
        </div>
        <Outlet />
    </div>
  )
}

export default Layout