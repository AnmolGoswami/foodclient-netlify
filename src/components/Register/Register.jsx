import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { registerUser } from '../../services/authService';
import { StoreContext } from '../../context/StoreContext';

function Register() {
  const [focusField, setFocusField] = useState(null);
  const {setToken} = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const onChangeHandler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}));
  }

  const submitHandler = async(event)=>{
    event.preventDefault();
    console.log(data);

    
      
    try {
      const response = await registerUser(data);
    
      // Axios automatically unwraps the response, but let's be sure
      if (response.status === 201) {
        toast.success("Registered Successfully");
        setToken(response.data.jwt);
        localStorage.setItem('token',response.data.jwt);
        console.log(response.data.jwt);
        navigate('/');
      }else{
        toast.error("User Already Exists");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error || "User already exists");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
    
    

  }

  return (
    <div className="register-page d-flex align-items-center justify-content-center vh-100 bg-dark">
      <div className="register-container text-white p-4 rounded shadow-lg bg-gradient">

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

        <h3 className="text-center mb-4">Create an Account 🚀</h3>

        <form onSubmit={submitHandler}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Your Name"
              onFocus={() => setFocusField('name')}
              onBlur={() => setFocusField(null)}
              required
              name='fullName'
              onChange={onChangeHandler}
              value={data.fullName}
            />
            <label htmlFor="name">Full Name</label>
          </div>

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
              onChange={onChangeHandler}
              value={data.email}
            />
            <label htmlFor="email">Email address</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
              required
              name='password'
              onChange={onChangeHandler}
              value={data.password}
            />
            <label htmlFor="password">Password</label>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold">Register</button>

          <div className="text-center mt-3">
            <small>Already have an account? <Link to="/login" className="text-warning">Login</Link></small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
