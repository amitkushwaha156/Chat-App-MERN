import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";

const CheckEmail = () => {
  const navigate = useNavigate();
  const EmailEle = useRef();

  const LoginUser = async (e) => {
    e.preventDefault();
    
    const email = EmailEle.current.value;

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const UserLogin = { email };

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;
    
    try {
     const response= await axios.post(URL, UserLogin);
     
     if (response.data.error) {
      toast.error(response.data.message);
      return; 
    }

    toast.success(response.data.message);
        navigate('/password',{
          state:response?.data
        });
      
    } catch (error) {
      // navigate('/password');
      toast.error("Email not registered");
    }
  };

  return (
    <div className="account-pages mb-5 pt-sm-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mb-4">
              <a href="index.html" className="auth-logo mb-5 d-block">
                <img
                  src="/ChatUI/assets/images/logo-dark.png"
                  alt=""
                  height={30}
                  className="logo logo-dark"
                />
                <img
                  src="/ChatUI/assets/images/logo-light.png"
                  alt=""
                  height={30}
                  className="logo logo-light"
                />
              </a>
              <h4>Sign in</h4>
              <p className="text-muted mb-4">Sign in to continue to Chatvia.</p>
            </div>
            <div className="card">
              <div className="card-body p-4">
                <div className="p-3">
                  <form onSubmit={LoginUser}>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <div className="input-group mb-3 bg-light-subtle rounded-3">
                        <span className="input-group-text text-muted" id="basic-addon3">
                          <i className="ri-user-2-line" />
                        </span>
                        <input
                          type="email" // Changed to email type
                          ref={EmailEle}
                          className="form-control form-control-lg border-light bg-light-subtle"
                          placeholder="Enter Email"
                          aria-label="Enter Email"
                          aria-describedby="basic-addon3"
                          required // Added required attribute
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                    
                      
                    </div>
                    <div className="form-check mb-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="remember-check"
                      />
                      <label className="form-check-label" htmlFor="remember-check">
                        Remember me
                      </label>
                    </div>
                    <div className="d-grid">
                      <button
                        className="btn btn-primary waves-effect waves-light"
                        type="submit"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="mt-5 text-center">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="fw-medium text-primary">
                  Signup now
                </Link>
              </p>
              <p>
                © 2024 Chatvia. Crafted with{" "}
                <i className="mdi mdi-heart text-danger" /> by Themesbrand
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
