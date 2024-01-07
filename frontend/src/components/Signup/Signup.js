import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {signup, selector} from '../../redux/reduxSlice';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setname] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const {user} = useSelector(selector);

    useEffect(()=>{
        if(user){
            navigate('/');
        }
    },[user])

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, password, email);
        dispatch(signup({name, password, email}));
    }

  return (
    <div className={styles.container}>
      <form className={styles.authForm} onSubmit={(e)=>handleSubmit(e)}>
        <h2>Signup</h2>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)} placeholder="Name" className={styles.inputField} required />
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="example@example.com" className={styles.inputField} required />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className={styles.inputField} required />
        <button type="submit" className={styles.btn}>Signup</button>
        <div className={styles.divider}>
          <span></span>
          <span className={styles.dividerText}>or</span>
          <span></span>
        </div>
        <button type="submit" onClick={()=>navigate('/login')} className={styles.btn}>Login</button>
      </form>
     
    </div>
  );
};
export default Signup
