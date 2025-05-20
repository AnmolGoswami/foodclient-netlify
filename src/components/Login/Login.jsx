import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

function Login() {
  const [focusField, setFocusField] = useState(null);
  const [data,setData] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate();

  const {setToken,loadCartData} = useContext(StoreContext);

  const onChangeHandler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}));
  }

  const submitHandler = async(event)=>{
    event.preventDefault();

    try {

      const response = await loginUser(data);
      console.log(response);
      if(response.status === 202){
        toast.success("Logged In Successfully");
        setToken(response.data.jwt);
        localStorage.setItem('token',response.data.jwt);
        loadCartData(response.data.jwt);
        
        navigate('/');

      }
      else{
        toast.error("Invalid Credentials");
      }
      
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error || "Invalid Credentials");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      
    }

    
  }

  return (
    <div className="login-page d-flex align-items-center justify-content-center vh-100 bg-dark">
      <div className="login-container text-white p-4 rounded shadow-lg bg-gradient">
        
        <div className="face-wrapper text-center mb-3">
          <video
            src={focusField === 'password' ? '/peek-hide.mp4' : '/peek-look.mp4'}
            className="face-video"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        <h3 className="text-center mb-4">Welcome Back 👋</h3>

        <form onSubmit={submitHandler}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              onFocus={() => setFocusField('email')}
              onBlur={() => setFocusField(null)}
              required
              name='email'
              value={data.email}
              onChange={onChangeHandler}
              
            />
            <label htmlFor="email">Email address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
              required
              name='password'
              value={data.password}
              onChange={onChangeHandler}
            />
            <label htmlFor="password">Password</label>
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-bold mt-2">Login</button>

          <div className="text-center mt-3">
            <small>Don't have an account? <Link to="/register" className="text-warning">Register</Link></small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
