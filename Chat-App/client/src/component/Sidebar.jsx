import React, { useEffect, useState } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, } from "react-router-dom";
import AllUser from "./AllUser";
import { logout } from "../redux/UserSlice";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";



const Sidebar = () => {
 const navigation=useNavigate()

  const dispatch = useDispatch();

  const handleLogout = async() => {

    try {
      await axios.get('http://localhost:8080/api/logout'); // Make the API call
      dispatch(logout()); // Dispatch the logout action
      localStorage.removeItem("loginUser");
      localStorage.removeItem("userToken");
      
      toast.success('Logged out successfully'); // Show a success message
      navigation("/email"); // Navigate to the email page
    } catch (error) {
      toast.error('Logout failed:', error); // Handle any errors
    }
  };
  

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };




  //search set
  const user = useSelector((state) => state.user);
  
  //console.log("user",user);
  
    const [searchUser, setSearchUser] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const onlineUsers = useSelector((state) => state?.user?.onlineUser);
  
    //console.log("online=>>", onlineUsers)
    const LoginUserLocal= JSON.parse(localStorage.getItem("loginUser"));
  
  
    const handleSearch = async () => {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search`;
  
      try {
        setLoading(true);
        const response = await axios.post(URL, {
          search: searchUser,
        });
  
        setUsers(response.data.data);
  
        setError(null);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      handleSearch();
  
      setUsers([]);
    }, [searchUser]);
    const SkipLoginUser= users.filter((user) =>{
      return user?._id!== LoginUserLocal?._id;  // Skip the current logged in user
    })
  return (
    <>
      <div className="side-menu flex-lg-column me-lg-1 ms-lg-0">
        {/* LOGO */}
        <div className="navbar-brand-box">
          <a href="#" className="logo logo-dark">
            <span className="logo-sm">
              <img src="/ChatUi/assets/images/logo.svg" alt="" height={30} />
            </span>
          </a>
          <a href="#" className="logo logo-light">
            <span className="logo-sm">
              <img src="/ChatUi/assets/images/logo.svg" alt="" height={30} />
            </span>
          </a>
        </div>
        {/* end navbar-brand-box */}
        {/* Start side-menu nav */}
        <div className="flex-lg-column my-auto">
          <ul
            className="nav nav-pills side-menu-nav justify-content-center"
            role="tablist"
          >
            <li
              className="nav-item"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              aria-label="Profile"
              data-bs-original-title="Profile"
              role="presentation"
            >
              <a
                className="nav-link"
                id="pills-user-tab"
                data-bs-toggle="pill"
                href="#pills-user"
                role="tab"
                aria-selected="false"
                tabIndex={-1}
              >
                <i className="ri-user-2-line" />
              </a>
            </li>
            <li
              className="nav-item"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              aria-label="Chats"
              data-bs-original-title="Chats"
              role="presentation"
            >
              <a
                className="nav-link active"
                id="pills-chat-tab"
                data-bs-toggle="pill"
                href="#pills-chat"
                role="tab"
                aria-selected="true"
              >
                <i className="ri-message-3-line" />
              </a>
            </li>
            
            <li
              className="nav-item"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              aria-label="Contacts"
              data-bs-original-title="Contacts"
              role="presentation"
            >
              <a
                className="nav-link"
                id="pills-contacts-tab"
                data-bs-toggle="pill"
                href="#pills-contacts"
                role="tab"
                aria-selected="false"
                tabIndex={-1}
              >
                <i className="ri-contacts-line" />
              </a>
            </li>
            <li
              className="nav-item"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              aria-label="Settings"
              data-bs-original-title="Settings"
              role="presentation"
            >
              <a
                className="nav-link"
                id="pills-setting-tab"
                data-bs-toggle="pill"
                href="#pills-setting"
                role="tab"
                aria-selected="false"
                tabIndex={-1}
              >
                <i className="ri-settings-2-line" />
              </a>
            </li>
            <li className="nav-item dropdown profile-user-dropdown d-inline-block d-lg-none">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  src={user.profile_pic}
                  alt=""
                  className="profile-user rounded-circle"
                />
              </a>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="/">
                  Profile <i className="ri-profile-line float-end text-muted" />
                </a>
                <a className="dropdown-item" href="/">
                  Setting{" "}
                  <i className="ri-settings-3-line float-end text-muted" />
                </a>
                <div className="dropdown-divider" />
                <Link className="dropdown-item"  onClick={handleLogout}>
                  Log out{" "}
                  <i className="ri-logout-circle-r-line float-end text-muted" />
                </Link>
              </div>
            </li>
          </ul>
        </div>
        {/* end side-menu nav */}
        <div className="flex-lg-column d-none d-lg-block">
          <ul className="nav side-menu-nav justify-content-center">
            <li className="nav-item">
              <Link
                className="nav-link light-dark-mode"
                to="/"  onClick={toggleTheme}
                data-bs-toggle="tooltip"
                data-bs-trigger="hover"
                data-bs-placement="right"
                aria-label="Dark / Light Mode"
                data-bs-original-title="Dark / Light Mode"
              >
                <i className={`ri-${theme === 'dark' ? 'moon' : 'sun'}-line theme-mode-icon`} />
              </Link>
            </li>
            <li className="nav-item btn-group dropup profile-user-dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {user.profile_pic ? (
                  <img
                    src={user.profile_pic}
                    className="profile-user rounded-circle"
                    alt=""
                  />
                ) : (
                  <img
                    src={user.profile_pic}
                    className="profile-user rounded-circle"
                    alt=""
                  />
                )}
              </a>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="/">
                  Profile <i className="ri-profile-line float-end text-muted" />
                </a>
                <a className="dropdown-item" href="/">
                  Setting{" "}
                  <i className="ri-settings-3-line float-end text-muted" />
                </a>
                <div className="dropdown-divider" />
                <Link className="dropdown-item" onClick={handleLogout}>
                  Log out{" "}
                  <i className="ri-logout-circle-r-line float-end text-muted" />
                </Link>
              </div>
            </li>
          </ul>
        </div>
        {/* Side menu user */}
      </div>
      <div className="chat-leftsidebar me-lg-1 ms-lg-0">
        <div className="tab-content">
          {/* Start Profile tab-pane */}
          <div
            className="tab-pane"
            id="pills-user"
            role="tabpanel"
            aria-labelledby="pills-user-tab"
          >
            {/* Start profile content */}
            <div>
              <div className="px-4 pt-4">
            
                <h4 className="mb-0">My Profile</h4>
              </div>
              <div className="text-center p-4 border-bottom">
                <div className="mb-4">
                  <img
                    src={user.profile_pic}
                    className="rounded-circle avatar-lg img-thumbnail"
                    alt=""
                  />
                </div>
                <h5 className="font-size-16 mb-1 text-truncate">{user.name}</h5>
                <p className="text-muted text-truncate mb-1">
                  <i className="ri-record-circle-fill font-size-10 text-success me-1 ms-0 d-inline-block" />{" "}
                  Active
                </p>
              </div>
              {/* End profile user */}
              {/* Start user-profile-desc */}
              <div className="p-4 user-profile-desc" data-simplebar="init">
  <div className="simplebar-wrapper" style={{ margin: "-24px" }}>
    <div className="simplebar-height-auto-observer-wrapper">
      <div className="simplebar-height-auto-observer" />
    </div>
    <div className="simplebar-mask">
      <div className="simplebar-offset" style={{ right: "-16.8px", bottom: 0 }}>
        <div
          className="simplebar-content-wrapper"
          style={{ height: "100%", overflow: "hidden scroll" }}
        >
          <div className="simplebar-content" style={{ padding: 24 }}>
            <div className="text-muted">
              <p className="mb-4">
           
              </p>
            </div>
            <div id="tabprofile" className="accordion">
              <div className="accordion-item card border mb-2">
                <div className="accordion-header" id="about2">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#about"
                    aria-expanded="true"
                    aria-controls="about"
                  >
                    <h5 className="font-size-14 m-0">
                      <i className="ri-user-2-line me-2 ms-0 ms-0 align-middle d-inline-block" />{" "}
                      About
                    </h5>
                  </button>
                </div>
                <div
                  id="about"
                  className="accordion-collapse collapse show"
                  aria-labelledby="about2"
                  data-bs-parent="#tabprofile"
                  style={{}}
                >
                  <div className="accordion-body">
                    <div>
                      <p className="text-muted mb-1">Name</p>
                      <h5 className="font-size-14">{user.name}</h5>
                    </div>
                    <div className="mt-4">
                      <p className="text-muted mb-1">Email</p>
                      <h5 className="font-size-14">{user.email}</h5>
                    </div>
                    <div className="mt-4">
                      <p className="text-muted mb-1">Joined BY</p>
                      <h5 className="font-size-14">   {moment(user.createAt).format("MMMM Do YYYY")}</h5>
                    </div>
                    <div className="mt-4">
                      <p className="text-muted mb-1">Location</p>
                      <h5 className="font-size-14 mb-0">{user.city}</h5>
                    </div>
                  </div>
                </div>
              </div>
              {/* End About card */}
           
              {/* End Attached Files card */}
            </div>
            {/* end profile-user-accordion */}
          </div>
        </div>
      </div>
    </div>
    <div
      className="simplebar-placeholder"
      style={{ width: "auto", height: 545 }}
    />
  </div>
  <div
    className="simplebar-track simplebar-horizontal"
    style={{ visibility: "hidden" }}
  >
    <div
      className="simplebar-scrollbar"
      style={{ transform: "translate3d(0px, 0px, 0px)", display: "none" }}
    />
  </div>
  <div
    className="simplebar-track simplebar-vertical"
    style={{ visibility: "visible" }}
  >
    <div
      className="simplebar-scrollbar"
      style={{
        transform: "translate3d(0px, 0px, 0px)",
        display: "block",
        height: 25
      }}
    />
  </div>
</div>

              {/* end user-profile-desc */}
            </div>
            {/* End profile content */}
          </div>
          {/* End Profile tab-pane */}
          {/* Start chats tab-pane */}
          <div
            className="tab-pane fade active show"
            id="pills-chat"
            role="tabpanel"
            aria-labelledby="pills-chat-tab"
          >
            {/* Start chats content */}
           <AllUser></AllUser>
            {/* Start chats content */}
          </div>
  
          <div
            className="tab-pane"
            id="pills-contacts"
            role="tabpanel"
            aria-labelledby="pills-contacts-tab"
          >
            {/* Start Contact content */}
            <div>
              <div className="p-4">
               
                <h4 className="mb-4">Contacts</h4>
                {/* Start Add contact Modal */}
                <div
                  className="modal fade"
                  id="addContact-exampleModal"
                  tabIndex={-1}
                  role="dialog"
                  aria-labelledby="addContact-exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5
                          className="modal-title font-size-16"
                          id="addContact-exampleModalLabel"
                        >
                          Add Contact
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body p-4">
                        <form>
                          <div className="mb-3">
                            <label
                              htmlFor="addcontactemail-input"
                              className="form-label"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="addcontactemail-input"
                              placeholder="Enter Email"
                            />
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor="addcontact-invitemessage-input"
                              className="form-label"
                            >
                              Invatation Message
                            </label>
                            <textarea
                              className="form-control"
                              id="addcontact-invitemessage-input"
                              rows={3}
                              placeholder="Enter Message"
                              defaultValue={""}
                            />
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-link"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="button" className="btn btn-primary">
                          Invite Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Add contact Modal */}
                <div className="search-box chat-search-box">
                  <div className="input-group bg-light  input-group-lg rounded-3">
                    <div className="input-group-prepend">
                      <button
                        className="btn btn-link text-decoration-none text-muted pe-1 ps-3"
                        type="button"
                      >
                        <i className="ri-search-line search-icon font-size-18" />
                      </button>
                    </div>
                    <input
                      type="text"    onChange={(e) => setSearchUser(e.target.value)}
                      value={searchUser}
                      className="form-control bg-light"
                      placeholder="Search users.."
                    />
                  </div>
                </div>
                {/* End search-box */}
              </div>
              {/* end p-4 */}
              {/* Start contact lists */}
              <div
                className="p-4 chat-message-list chat-group-list"
                data-simplebar="init"
              >
                <div className="simplebar-wrapper" style={{ margin: "-24px" }}>
                  <div className="simplebar-height-auto-observer-wrapper">
                    <div className="simplebar-height-auto-observer" />
                  </div>
                  <div className="simplebar-mask">
                    <div
                      className="simplebar-offset"
                      style={{ right: 0, bottom: 0 }}
                    >
                      <div
                        className="simplebar-content-wrapper"
                        style={{ height: "auto", overflow: "hidden" }}
                      >
                        <div className="chat-message-list px-2" data-simplebar="init">
            {loading ? (
              <div className="text-center">
                <p>Loading...</p>{" "}
            
              </div>
            ) : (
              <ul className="list-unstyled chat-list chat-user-list">
                {SkipLoginUser.length > 0 ? (
                  SkipLoginUser.map((user) => {
                    const isOnline = onlineUsers.includes(user._id);

               

                    // console.log(isOnline)
                    return (
                      <li key={user._id}>
                        <Link to={"/" + user?._id}>
                          <div className="d-flex">
                            <div
                              className={`chat-user-img ${
                                isOnline ? "online" : ""
                              } align-self-center me-3 ms-0`}
                            >
                              <img
                                src={user.profile_pic} // Assume each user object has an avatar property
                                className="rounded-circle avatar-xs"
                                alt={user.name}
                              />
                              <span className="user-status" />
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <h5 className="text-truncate font-size-15 mb-1">
                                {user.name} {/* Assume each user has a name */}
                              </h5>
                              <p className="chat-user-message text-truncate mb-0">
                                {user.message} {/* Displaying a last message */}
                              </p>
                            </div>
                            <div className="font-size-11">
                              {user.time} {/* Displaying time */}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-center">No users found</li>
                )}
              </ul>
            )}
          </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="simplebar-placeholder"
                    style={{ width: 0, height: 0 }}
                  />
                </div>
                <div
                  className="simplebar-track simplebar-horizontal"
                  style={{ visibility: "hidden" }}
                >
                  <div
                    className="simplebar-scrollbar"
                    style={{
                      transform: "translate3d(0px, 0px, 0px)",
                      display: "none",
                    }}
                  />
                </div>
                <div
                  className="simplebar-track simplebar-vertical"
                  style={{ visibility: "hidden" }}
                >
                  <div
                    className="simplebar-scrollbar"
                    style={{
                      transform: "translate3d(0px, 0px, 0px)",
                      display: "none",
                      height: 180,
                    }}
                  />
                </div>
              </div>
              {/* end contact lists */}
            </div>
            {/* Start Contact content */}
          </div>
          {/* End contacts tab-pane */}
          {/* Start settings tab-pane */}
          <div
            className="tab-pane"
            id="pills-setting"
            role="tabpanel"
            aria-labelledby="pills-setting-tab"
          >
            {/* Start Settings content */}
            <div>
              <div className="px-4 pt-4">
                <h4 className="mb-0">Settings</h4>
              </div>
              <div className="text-center border-bottom p-4">
                <div className="mb-4 profile-user">
                  <img
                    src={user.profile_pic}
                    className="rounded-circle avatar-lg img-thumbnail"
                    alt=""
                  />
                  <button
                    type="button"
                    className="btn btn-light bg-light avatar-xs p-0 rounded-circle profile-photo-edit"
                  >
                    <i className="ri-pencil-fill" />
                  </button>
                </div>
                <h5 className="font-size-16 mb-1 text-truncate">
                  {user.name}
                </h5>
                <div className="dropdown d-inline-block mb-1">
                  <a
                    className="text-muted dropdown-toggle pb-1 d-block"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Available <i className="mdi mdi-chevron-down" />
                  </a>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="/">
                      Available
                    </a>
                    <a className="dropdown-item" href="/">
                      Busy
                    </a>
                  </div>
                </div>
              </div>
              {/* End profile user */}
              {/* Start User profile description */}
              <div className="p-4 user-profile-desc" data-simplebar="init">
                <div className="simplebar-wrapper" style={{ margin: "-24px" }}>
                  <div className="simplebar-height-auto-observer-wrapper">
                    <div className="simplebar-height-auto-observer" />
                  </div>
                  <div className="simplebar-mask">
                    <div
                      className="simplebar-offset"
                      style={{ right: 0, bottom: 0 }}
                    >
                      <div
                        className="simplebar-content-wrapper"
                        style={{ height: "auto", overflow: "hidden" }}
                      >
                        <div
                          className="simplebar-content"
                          style={{ padding: 24 }}
                        >
                          <div id="settingprofile" className="accordion">
                            <div className="accordion-item card border mb-2">
                              <div
                                className="accordion-header"
                                id="personalinfo1"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#personalinfo"
                                  aria-expanded="true"
                                  aria-controls="personalinfo"
                                >
                                  <h5 className="font-size-14 m-0">
                                    Personal Info
                                  </h5>
                                </button>
                              </div>
                              <div
                                id="personalinfo"
                                className="accordion-collapse collapse show"
                                aria-labelledby="personalinfo1"
                                data-bs-parent="#settingprofile"
                              >
                                <div className="accordion-body">
                                  <div className="float-end">
                                    <button
                                      type="button"
                                      className="btn btn-light btn-sm"
                                    >
                                      <i className="ri-edit-fill me-1 ms-0 align-middle" />{" "}
                                      Edit
                                    </button>
                                  </div>
                                  <div>
                                    <p className="text-muted mb-1">Name</p>
                                    <h5 className="font-size-14">
                                      {user.name}
                                    </h5>
                                  </div>
                                  <div className="float-end">
                                    <button
                                      type="button"
                                      className="btn btn-light btn-sm"
                                    >
                                      <i className="ri-edit-fill me-1 ms-0 align-middle" />{" "}
                                      Edit
                                    </button>
                                  </div>
                                  <div className="mt-4">
                                    <p className="text-muted mb-1">Email</p>
                                    <h5 className="font-size-14">
                                   {user.email}
                                    </h5>
                                  </div>
                                  <div className="mt-4">
                                    <p className="text-muted mb-1">Joined By</p>
                                    <h5 className="font-size-14">{moment(user.createAt).format("MMMM Do YYYY")}</h5>
                                  </div>
                                  <div className="mt-4">
                                    <p className="text-muted mb-1">Location</p>
                                    <h5 className="font-size-14 mb-0">
                                    {user.city}  
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* end personal info card */}
                            <div className="accordion-item card border mb-2">
                              <div className="accordion-header" id="privacy1">
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#privacy"
                                  aria-expanded="false"
                                  aria-controls="privacy"
                                >
                                  <h5 className="font-size-14 m-0">Privacy</h5>
                                </button>
                              </div>
                              <div
                                id="privacy"
                                className="accordion-collapse collapse"
                                aria-labelledby="privacy1"
                                data-bs-parent="#settingprofile"
                              >
                                <div className="accordion-body">
                                  <div className="py-3">
                                    <div className="d-flex align-items-center">
                                      <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="font-size-13 mb-0 text-truncate">
                                          Profile photo
                                        </h5>
                                      </div>
                                      <div className="dropdown ms-2 me-0">
                                        <button
                                          className="btn btn-light btn-sm dropdown-toggle w-sm"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-haspopup="true"
                                          aria-expanded="false"
                                        >
                                          Everyone{" "}
                                          <i className="mdi mdi-chevron-down" />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-end">
                                          <a className="dropdown-item" href="/">
                                            Everyone
                                          </a>
                                          <a className="dropdown-item" href="/">
                                            selected
                                          </a>
                                          <a className="dropdown-item" href="/">
                                            Nobody
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                      <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="font-size-13 mb-0 text-truncate">
                                          Last seen
                                        </h5>
                                      </div>
                                      <div className="ms-2 me-0">
                                        <div className="form-check form-switch">
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="privacy-lastseenSwitch"
                                            defaultChecked=""
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor="privacy-lastseenSwitch"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                      <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="font-size-13 mb-0 text-truncate">
                                          Status
                                        </h5>
                                      </div>
                                      <div className="dropdown ms-2 me-0">
                                        <button
                                          className="btn btn-light btn-sm dropdown-toggle w-sm"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-haspopup="true"
                                          aria-expanded="false"
                                        >
                                          Everyone{" "}
                                          <i className="mdi mdi-chevron-down" />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-end">
                                          <a className="dropdown-item" href="/">
                                            Everyone
                                          </a>
                                          <a className="dropdown-item" href="/">
                                            selected
                                          </a>
                                          <a className="dropdown-item" href="/">
                                            Nobody
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                      <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="font-size-13 mb-0 text-truncate">
                                          Read receipts
                                        </h5>
                                      </div>
                                      <div className="ms-2 me-0">
                                        <div className="form-check form-switch">
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="privacy-readreceiptSwitch"
                                            defaultChecked=""
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor="privacy-readreceiptSwitch"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                      <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="font-size-13 mb-0 text-truncate">
                                          Groups
                                        </h5>
                                      </div>
                                      <div className="dropdown ms-2 me-0">
                                        <button
                                          className="btn btn-light btn-sm dropdown-toggle w-sm"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-haspopup="true"
                                          aria-expanded="false"
                                        >
                                          Everyone{" "}
                                          <i className="mdi mdi-chevron-down" />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-end">
                                          <a className="dropdown-item" href="/">
                                            Everyone
                                          </a>
                                          <a className="dropdown-item" href="/">
                                            selected
                                          </a>
                                          <a className="dropdown-item" href="/">
                                            Nobody
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* end privacy card */}
                            <div className="accordion-item card border mb-2">
                              <div className="accordion-header" id="security1">
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#security"
                                  aria-expanded="false"
                                  aria-controls="security"
                                >
                                  <h5 className="font-size-14 m-0">
                                    {" "}
                                    Security
                                  </h5>
                                </button>
                              </div>
                              <div
                                id="security"
                                className="accordion-collapse collapse"
                                aria-labelledby="security1"
                                data-bs-parent="#settingprofile"
                              >
                                <div className="accordion-body">
                                  <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                      <h5 className="font-size-13 mb-0 text-truncate">
                                        Show security notification
                                      </h5>
                                    </div>
                                    <div className="ms-2 me-0">
                                      <div className="form-check form-switch">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          id="security-notificationswitch"
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="security-notificationswitch"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* end security card */}
                            <div className="accordion-item card border mb-2">
                              <div className="accordion-header" id="help1">
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapseFour"
                                  aria-expanded="false"
                                  aria-controls="collapseFour"
                                >
                                  <h5 className="font-size-14 m-0"> Help</h5>
                                </button>
                              </div>
                              <div
                                id="collapseFour"
                                className="accordion-collapse collapse"
                                aria-labelledby="help1"
                                data-bs-parent="#settingprofile"
                              >
                                <div className="accordion-body">
                                  <div className="py-3">
                                    <h5 className="font-size-13 mb-0">
                                      <a href="/" className="text-body d-block">
                                        FAQs
                                      </a>
                                    </h5>
                                  </div>
                                  <div className="py-3 border-top">
                                    <h5 className="font-size-13 mb-0">
                                      <a href="/" className="text-body d-block">
                                        Contact
                                      </a>
                                    </h5>
                                  </div>
                                  <div className="py-3 border-top">
                                    <h5 className="font-size-13 mb-0">
                                      <a href="/" className="text-body d-block">
                                        Terms &amp; Privacy policy
                                      </a>
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* end profile-setting-accordion */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="simplebar-placeholder"
                    style={{ width: 0, height: 0 }}
                  />
                </div>
                <div
                  className="simplebar-track simplebar-horizontal"
                  style={{ visibility: "hidden" }}
                >
                  <div
                    className="simplebar-scrollbar"
                    style={{
                      transform: "translate3d(0px, 0px, 0px)",
                      display: "none",
                    }}
                  />
                </div>
                <div
                  className="simplebar-track simplebar-vertical"
                  style={{ visibility: "hidden" }}
                >
                  <div
                    className="simplebar-scrollbar"
                    style={{
                      transform: "translate3d(0px, 0px, 0px)",
                      display: "none",
                    }}
                  />
                </div>
              </div>
              {/* End User profile description */}
            </div>
            {/* Start Settings content */}
          </div>
          {/* End settings tab-pane */}
        </div>
        {/* end tab content */}
      </div>
    </>
  );
};

export default Sidebar;
