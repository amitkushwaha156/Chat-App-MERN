import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/UserSlice";

const CheckPassword = () => {
  const TokenDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userData = location?.state?.data;

  //console.log(userData)

  localStorage.setItem("loginUser", JSON.stringify(userData));

  const userId = location.state.data._id;

  const PasswordEle = useRef();
  const LoginUser = async (e) => {
    e.preventDefault();

    const password = PasswordEle.current.value;

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

    const UserLogin = { userId, password }; // Create the UserLogin object

    try {
      // await axios.post(URL, UserLogin);
      const response = await axios.post(URL, UserLogin);
      //    console.log(response.data)

      TokenDispatch(setToken(response?.data?.token));
      localStorage.setItem("userToken", response?.data?.token);

      toast.success("Login successful!");
      navigate("/", {
        state: userData,
      });
    } catch (error) {
      // console.error("Error:", error);
      toast.error(error?.response?.data?.message || error.message);
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

              <div className="text-center border-bottom">
                <div className="mb-1">
                  {userData.profile_pic ? (
                    <img
                      src={userData.profile_pic}
                      className="rounded-circle avatar-lg img-thumbnail"
                      alt=""
                    />
                  ) : (
                    <img
                      src="/ChatUI/assets/images/users/avatar-1.jpg"
                      className="rounded-circle avatar-lg img-thumbnail"
                      alt=""
                    />
                  )}

                  {/* <img src="/ChatUi/assets/images/users/avatar-1.jpg" className="rounded-circle avatar-lg img-thumbnail" alt=""/> */}
                </div>

                <h5 className="font-size-16 mb-1 text-truncate">
                  Welcome {location.state.data.name}
                </h5>
                <p className="text-muted text-truncate ">
                  <i className="ri-record-circle-fill font-size-10 text-success me-1 ms-0 d-inline-block"></i>{" "}
                  Active
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body p-4">
                <div className="p-3">
                  <form onSubmit={LoginUser}>
                    <div className="mb-4">
                      <div className="float-end">
                        {/* <Link to="ForgotPassword" className="text-muted font-size-13">
                          Forgot password?
                        </Link> */}
                      </div>
                      <label className="form-label">Password</label>
                      <div className="input-group mb-3 bg-light-subtle rounded-3">
                        <span
                          className="input-group-text text-muted"
                          id="basic-addon4"
                        >
                          <i className="ri-lock-2-line" />
                        </span>
                        <input
                          type="password"
                          ref={PasswordEle}
                          className="form-control form-control-lg border-light bg-light-subtle"
                          placeholder="Enter Password"
                          aria-label="Enter Password"
                          aria-describedby="basic-addon4"
                        />
                      </div>
                    </div>
                    <div className="form-check mb-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="remember-check"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="remember-check"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="d-grid">
                      <button
                        className="btn btn-primary waves-effect waves-light"
                        type="submit"
                      >
                        Let's go {location.state.data.name}
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

export default CheckPassword;
