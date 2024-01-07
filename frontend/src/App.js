import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

import styles from './App.module.css';
import Navbar from "./components/Layout/Layout.js";
import Home from "./components/Home/Home.js";
import Login from "./components/Login/Login.js";
import Signup from "./components/Signup/Signup.js";

import { useDispatch, useSelector } from "react-redux";
import {fetchLoginStatus, selector} from './redux/reduxSlice.js';
import { useEffect } from "react";
import { Hourglass } from 'react-loader-spinner'


function App() {

  const {loading, user } = useSelector(selector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLoginStatus());
  } , [])

  const protect= (children) => (user ? children : <Login />);



  const routes = createRoutesFromElements(
    
    <Route path="/" element={<Navbar />}>
        <Route path="/" element={protect(<Home />)} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
    </Route>
  );

  const router = createBrowserRouter(routes);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Hourglass
          visible={true}
          height={80}
          width={80}
          ariaLabel="hourglass-loading"
          wrapperStyle={{}}
          wrapperClass=""
          colors={['#306cce', '#72a1ed']}
        />
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />;
    </>
  );
}

export default App;
