import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {login, selector} from '../../redux/reduxSlice';

const Login = () => {
  const navigate = useNavigate();
  // const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();

  const {user} = useSelector(selector);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({email, password}));
  }

  useEffect(()=>{
    if(user){
      navigate('/');
    }
  },[user])

  return (
    <div className={styles.container}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Username" className={styles.inputField} />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className={styles.inputField} />
        <button type="submit"  className={styles.btn}>Login</button>
        <div className={styles.divider}>
          <span></span>
          <span className={styles.dividerText}>or</span>
          <span></span>
        </div>
        <button type="submit" onClick={()=>navigate('/signup')} className={styles.btn}>Create Account</button>
      </form>
     
    </div>
  );
};
export default Login
