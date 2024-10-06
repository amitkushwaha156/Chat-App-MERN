import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadFile } from "../helper/UploadFile";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners"; // Import the spinner

const RegisterPage = () => {
  const [loading, setLoading] = useState(false); // Update initial state
  const navigate = useNavigate();
  const NameEle = useRef();
  const EmailEle = useRef();
  const PasswordEle = useRef();
  const PhotoEle = useRef();

  const RegisterUser = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const name = NameEle.current.value;
    const email = EmailEle.current.value;
    const password = PasswordEle.current.value;
    const profilePicFile = PhotoEle.current.files;
    //console.log(profilePicFile)

    let fileUrl ="https://res.cloudinary.com/dchrsxv9e/image/upload/v1727755488/chatimage/x5rmnb5kjpzgp5rwnc5j.jpg"; // Default image
    if (profilePicFile.length > 0) {
      const file = profilePicFile[0];
      fileUrl = await UploadFile(file);
    }

    const newRegister = {
      name,
      email,
      password,
      profile_pic: fileUrl,
    };

    // Clear the input fields
    NameEle.current.value = "";
    EmailEle.current.value = "";
    PasswordEle.current.value = "";
    PhotoEle.current.value = "";

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try {
      await axios.post(URL, newRegister);
      navigate("/email");
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Stop loading
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
                  src="/ChatUi/assets/images/logo-dark.png"
                  alt=""
                  height={30}
                  className="logo logo-dark"
                />
                <img
                  src="/ChatUi/assets/images/logo-light.png"
                  alt=""
                  height={30}
                  className="logo logo-light"
                />
              </a>
              <h4>Sign up</h4>
              <p className="text-muted mb-4">Get your Chatvia account now.</p>
            </div>
            <div className="card">
              <div className="card-body p-4">
                <div className="p-3">
                  <form onSubmit={RegisterUser}>
                    {/* Name Input */}
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <div className="input-group bg-light-subtle mb-3 rounded-3">
                        <span className="input-group-text border-light text-muted">
                          <i className="ri-user-2-line" />
                        </span>
                        <input
                          type="text"
                          ref={NameEle}
                          required
                          className="form-control form-control-lg bg-light-subtle border-light"
                          placeholder="Enter Name"
                          aria-label="Enter Name"
                        />
                      </div>
                    </div>
                    {/* Email Input */}
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <div className="input-group bg-light-subtle rounded-3 mb-3">
                        <span className="input-group-text text-muted">
                          <i className="ri-mail-line" />
                        </span>
                        <input
                          type="email"
                          ref={EmailEle}
                          required
                          className="form-control form-control-lg bg-light-subtle border-light"
                          placeholder="Enter Email"
                          aria-label="Enter Email"
                        />
                      </div>
                    </div>
                    {/* Password Input */}
                    <div className="mb-4">
                      <label className="form-label">Password</label>
                      <div className="input-group bg-light-subtle mb-3 rounded-3">
                        <span className="input-group-text border-light text-muted">
                          <i className="ri-lock-2-line" />
                        </span>
                        <input
                          type="password"
                          ref={PasswordEle}
                          required
                          className="form-control form-control-lg bg-light-subtle border-light"
                          placeholder="Enter Password"
                          aria-label="Enter Password"
                        />
                      </div>
                    </div>
                    {/* Photo Input */}
                    <div className="mb-4">
                      <label className="form-label">Photo</label>
                      <div className="input-group bg-light-subtle mb-3 rounded-3">
                        <span className="input-group-text border-light text-muted">
                          <i className="ri-image-fill" />
                        </span>
                        <input
                          type="file"
                          ref={PhotoEle}
                          className="form-control form-control-lg bg-light-subtle border-light"
                          aria-label="Upload Photo"
                        />
                      </div>
                    </div>
                    {/* Submit Button */}
                    <div className="d-grid">
                      <button
                        className="btn btn-primary waves-effect waves-light"
                        type="submit"
                        disabled={loading} // Disable button when loading
                      >
                        {loading ? <ClipLoader size={20} color="#fff" /> : "Sign up"}
                      </button>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-muted mb-0">
                        By registering you agree to the Chatvia{" "}
                        <a href="#" className="text-primary">
                          Terms of Use
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="mt-5 text-center">
              <p>
                Already have an account?{" "}
                <Link to="/email" className="fw-medium text-primary">
                  Sign in
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

export default RegisterPage;
