import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import UploadFile from "../helper/UploadFile";
import toast from "react-hot-toast";
import moment from "moment";
import EmojiPicker from "emoji-picker-react"; //

const MessagePage = () => {
  const location = useLocation();
  const basePath = location.pathname === "/";
  const Params = useParams();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [typing, setTyping] = useState(false);

  const MessageEle = useRef();
  const VideoEle = useRef();
  const ImageEle = useRef();
  const LoginUserLocal = JSON.parse(localStorage.getItem("loginUser"));

  const onlineCurrent = useSelector((state) => state.user.onlineUser);
  //console.log("Params",Params.userId)
  //xconsole.log("onlineCurrent",onlineCurrent)

  const FilterOnline = onlineCurrent.includes(Params.userId);
  //console.log("FilterOnline",FilterOnline)
  const [currentUser, setCurrentUser] = useState({});

  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const onEmojiClick = (event, emojiObject) => {
    // console.log("Event:", event.emoji); // Log the entire event

    if (event.emoji) {
      MessageEle.current.value += event.emoji; // Append emoji to input
    }
    setShowEmojiPicker(false);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnections
  );
  //console.log(socketConnection)
  //console.log(Params.userId)

  //console.log("socketConnection1", socketConnection);

  //console.log(currentUser)

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const HandleMessage = async (e) => {
    e.preventDefault();

    const text = MessageEle.current.value.trim(); // Trim to avoid empty messages
    const videoUrl = VideoEle.current.files;
    const imageUrl = ImageEle.current.files;
    if (text === "" && videoUrl.length === 0 && imageUrl.length === 0) {
      toast.error("Please enter a message or upload a file."); // Notify the user
      return; // Early exit if all fields are blank
    }
    let fileUrlImage = ""; // Default image
    let fileUrlVideo = ""; // Default video

    try {
      // Handle image upload
      if (imageUrl.length > 0) {
        const file = imageUrl[0];
        fileUrlImage = await UploadFile(file);
        toast.success("Image loaded successfully");
      }

      // Handle video upload
      if (videoUrl.length > 0) {
        const file = videoUrl[0];
        fileUrlVideo = await UploadFile(file);
        toast.success("Video loaded successfully");
      }

      // Emit the new message to the server

      socketConnection.emit("new-message", {
        sender: LoginUserLocal._id, //sender login user get id from localhost
        receiver: currentUser?._id,
        text: text,
        imageUrl: fileUrlImage,
        videoUrl: fileUrlVideo,
        msgByUserId: LoginUserLocal._id,
      });
      socketConnection.emit("seenData", currentUser?._id);

      // Clear inputs
      MessageEle.current.value = "";
      VideoEle.current.value = ""; // Reset file input
      ImageEle.current.value = ""; // Reset file input
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to load files. Please try again.");
    }
  };
  useEffect(() => {
    if (socketConnection) {
      //  console.log("socketConnection2 is", socketConnection);
      socketConnection.emit("message-page", Params.userId);

      socketConnection.emit("seenData", Params.userId);

      socketConnection.on("message-page", (data) => {
        //  console.log("online",data);
        setCurrentUser(data);
      });

      socketConnection.on("message", (data) => {
     //   console.log("Received messages:", data?.messages);
        setMessages(data?.messages);
      });


      let typingTimeout;

      socketConnection.on("StartTyping", (data) => {
        const senderId = data;

        if (senderId !== LoginUserLocal._id) {
          // Only show typing for others
          setTyping(true);
          // console.log("Typing...");

          // Clear the previous timeout if it exists
          clearTimeout(typingTimeout);

          // Set a new timeout to set typing to false after 3 seconds
          typingTimeout = setTimeout(() => {
            setTyping(false);
          }, 3000);
        }
      });
      socketConnection.on("ConversationMsg", (data) => {
           console.log("ConversationMsg", data);
      })  
      // Cleanup function
      return () => {
        socketConnection.off("message-page");
        socketConnection.off("messages");
      };
    } else {
      console.log("Socket not connected");
    }
  }, [socketConnection, Params?.userId]);

  //console.log("locallogin",LoginUserLocal)
  //console.log("current",currentUser._id)

  const handleKeyPress = (event) => {
    //   console.log('userTyping', LoginUserLocal._id); // Log the key pressed

    socketConnection.emit("userTyping", LoginUserLocal._id);
  };

  const handleBlur = () => {
    // Clear the timeout when the input loses focus

    socketConnection.emit("StopTyping", LoginUserLocal._id);
  };

 

  return (
    <div
      className={`user-chat w-100 overflow-hidden user-chat-show ${
        basePath ? "d-none" : ""
      }`}
    >
      <div className="d-lg-flex">
        {/* start chat conversation section */}
        <div className="w-100 overflow-hidden position-relative">
          <div className="p-3 p-lg-4 border-bottom user-chat-topbar">
            <div className="row align-items-center">
              <div className="col-sm-4 col-8">
                <div className="d-flex align-items-center">
                  <div className="d-block d-lg-none me-2 ms-0">
                    <Link
                      to="/"
                      className="user-chat-remove text-muted font-size-16 p-2"
                    >
                      <i className="ri-arrow-left-s-line" />
                    </Link>
                  </div>
                  <div className="me-3 ms-0">
                    <img
                      src={currentUser.profile_pic}
                      className="rounded-circle avatar-xs"
                      alt=""
                    />
                  </div>
                  <div
                    className="flex-grow-1 overflow-hidden"
                    onClick={handleToggle}
                  >
                    <h5 className="font-size-16 mb-0 text-truncate">
                      <a href="#" className="text-reset user-profile-show">
                        {currentUser.name}
                      </a>{" "}
                      <i
                        className={`ri-record-circle-fill font-size-10 ${
                          FilterOnline ? "text-success" : "text-secondary"
                        }  d-inline-block ms-1`}
                      />
                    </h5>
                    <span className="text-xs">
                      {currentUser.online ? " online" : "offline"}{" "}
                      <span className="text-success">
                        {typing && "typing...."}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-sm-8 col-4">
                <ul className="list-inline user-chat-nav text-end mb-0">
                  <li className="list-inline-item">
                    <div className="dropdown">
                      <button
                        className="btn nav-btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="ri-search-line" />
                      </button>
                      <div className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-md">
                        <div className="search-box p-2">
                          <input
                            type="text"
                            className="form-control bg-light border-0"
                            placeholder="Search.."
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                    <button
                      type="button"
                      className="btn nav-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#audiocallModal"
                    >
                      <i className="ri-phone-line" />
                    </button>
                  </li>
                  <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                    <button
                      type="button"
                      className="btn nav-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#videocallModal"
                    >
                      <i className="ri-vidicon-line" />
                    </button>
                  </li>
                  <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                    <button
                      type="button"
                      className="btn nav-btn user-profile-show"
                    >
                      <i className="ri-user-2-line" />
                    </button>
                  </li>
                  <li className="list-inline-item">
                    <div className="dropdown">
                      <button
                        className="btn nav-btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="ri-more-fill" />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a
                          className="dropdown-item d-block d-lg-none user-profile-show"
                          href="#"
                        >
                          View profile{" "}
                          <i className="ri-user-2-line float-end text-muted" />
                        </a>
                        <a
                          className="dropdown-item d-block d-lg-none"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#audiocallModal"
                        >
                          Audio{" "}
                          <i className="ri-phone-line float-end text-muted" />
                        </a>
                        <a
                          className="dropdown-item d-block d-lg-none"
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#videocallModal"
                        >
                          Video{" "}
                          <i className="ri-vidicon-line float-end text-muted" />
                        </a>
                        <a className="dropdown-item" href="#">
                          Archive{" "}
                          <i className="ri-archive-line float-end text-muted" />
                        </a>
                        <a className="dropdown-item" href="#">
                          Muted{" "}
                          <i className="ri-volume-mute-line float-end text-muted" />
                        </a>
                        <a className="dropdown-item" href="#">
                          Delete{" "}
                          <i className="ri-delete-bin-line float-end text-muted" />
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* end chat user head */}
          {/* start chat conversation */}
          <div className="chat-conversation p-3 p-lg-4" data-simplebar="init">
            <div className="simplebar-wrapper" style={{ margin: "-24px" }}>
              <div className="simplebar-height-auto-observer-wrapper">
                <div className="simplebar-height-auto-observer" />
              </div>
              <div className="simplebar-mask">
                <div
                  className="simplebar-offset"
                  style={{ right: "-16.8px", bottom: 0 }}
                >
                  <div
                    className="simplebar-content-wrapper"
                    style={{ height: "100%", overflow: "hidden scroll" }}
                  >
                    <div className="simplebar-content" style={{ padding: 24 }}>
                      {messages && messages.length > 0 && (
                        <ul className="list-unstyled mb-0">
                          {messages.map((msg, index) => {
                            const isCurrentUser =
                              LoginUserLocal._id === msg.msgByUserId;
                            const userProfilePic = isCurrentUser
                              ? LoginUserLocal.profile_pic
                              : currentUser.profile_pic;
                            const userName = isCurrentUser
                              ? LoginUserLocal.name
                              : currentUser.name;
                            const alignmentClass = isCurrentUser
                              ? "right mb-5 pb-5"
                              : "";

                            return (
                              <li className={alignmentClass} key={index}>
                                <div className="conversation-list">
                                  <div className="chat-avatar">
                                    <img src={userProfilePic} alt="" />
                                  </div>
                                  <div className="user-chat-content">
                                    <div className="ctext-wrap">
                                      <div className="ctext-wrap-content">
                                        {msg.imageUrl && (
                                          <ul className="list-inline message-img mb-0">
                                            <li className="list-inline-item message-img-list me-2 ms-0">
                                              <div>
                                                <a
                                                  className="popup-img d-inline-block m-1"
                                                  href={msg.imageUrl} // Adjusted to use the actual image URL
                                                  title="Project 1"
                                                >
                                                  <img
                                                    src={msg.imageUrl}
                                                    alt=""
                                                    className="rounded border"
                                                  />
                                                </a>
                                              </div>
                                            </li>
                                          </ul>
                                        )}
                                        {msg.videoUrl && (
                                          <ul className="list-inline message-img mb-0">
                                            <li className="list-inline-item message-img-list me-2 ms-0">
                                              <div>
                                                <a
                                                  className="popup-img d-inline-block m-1"
                                                  href={msg.videoUrl} // Adjusted to use the actual video URL
                                                  title="Project 1"
                                                >
                                                  <video
                                                    src={msg.videoUrl}
                                                    controls
                                                    style={{ width: "250px" }}
                                                    className="rounded border"
                                                  />
                                                </a>
                                              </div>
                                            </li>
                                          </ul>
                                        )}

                                        <p className="mb-0">{msg.text}</p>
                                        <p className="chat-time mb-0">
                                          {isCurrentUser && (
                                            <>
                                              {msg.seen ? (
                                                <i className="ri-check-double-fill text-success align-middle" />
                                              ) : (
                                                <i className="ri-check-line align-middle" />
                                              )}
                                            </>
                                          )}
                                          &nbsp;{" "}
                                          <span className="align-middle">
                                            {moment(msg.createAt).format(
                                              "hh:mm"
                                            )}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="conversation-name">
                                      {userName}
                                    </div>
                                  </div>
                                </div>
                                <br></br>

                                <br></br>
                              </li>
                            );
                          })}
                          {typing && (
                            <li>
                              <div className="conversation-list">
                                <div className="chat-avatar">
                                  <img src={currentUser.profile_pic} alt="" />
                                </div>
                                <div className="user-chat-content">
                                  <div className="ctext-wrap">
                                    <div className="ctext-wrap-content">
                                      <p className="mb-0">
                                        typing
                                        <span className="animate-typing">
                                          {" "}
                                          &nbsp;
                                          <span className="dot" /> &nbsp;
                                          <span className="dot" /> &nbsp;
                                          <span className="dot" /> &nbsp;
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="conversation-name">
                                    {currentUser.name}
                                  </div>
                                </div>
                                <br></br>
                              </div>
                            </li>
                          )}
                          <div ref={messagesEndRef} />
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="simplebar-placeholder"
                style={{ width: "auto", height: 1152 }}
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
              style={{ visibility: "visible" }}
            >
              <div
                className="simplebar-scrollbar"
                style={{
                  height: 25,
                  transform: "translate3d(0px, 0px, 0px)",
                  display: "block",
                }}
              />
            </div>
          </div>
          {/* end chat conversation end */}
          {/* start chat input section */}
          <form onSubmit={HandleMessage}>
            <div className="chat-input-section p-3 p-lg-4 border-top mb-0">
              <div className="row g-0">
                <div className="col">
                  <input
                    type="text"
                    ref={MessageEle}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyPress}
                    className="form-control form-control-lg bg-light border-light"
                    placeholder="Enter Message..."
                  />
                </div>
                <div className="col-auto">
                  <div className="chat-input-links ms-md-2">
                    <ul className="list-inline mb-0 ms-0">
                      <li className="list-inline-item">
                        <div
                          className="emoji-dropdown btn-group dropup"
                          style={{ position: "relative" }}
                        >
                          {showEmojiPicker && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: "100%",
                                left: " -20rem",
                                zIndex: "1000",
                              }}
                            >
                              <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>
                          )}
                          <button
                            style={{ "margin-top": "-7px" }}
                            type="button"
                            aria-haspopup="true"
                            aria-expanded={showEmojiPicker}
                            onClick={toggleEmojiPicker}
                            className="text-decoration-none font-size-16 btn-lg waves-effect btn btn-link"
                          >
                            <i className="ri-emotion-happy-line" />
                          </button>
                        </div>
                      </li>
                      <li className="list-inline-item input-file">
                        <label
                          id="files"
                          className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect form-label"
                        >
                          <i className="ri-vidicon-line" />
                          <input
                            name="fileInput"
                            size={60}
                            type="file"
                            ref={VideoEle}
                            className="form-control d-none"
                          />
                        </label>
                      </li>
                      <li className="list-inline-item input-file">
                        <label
                          id="images"
                          className="me-1 btn btn-link text-decoration-none font-size-16 btn-lg waves-effect form-label"
                        >
                          <i className="ri-image-fill" />
                          <input
                            accept="image/*"
                            name="fileInput"
                            size={60}
                            type="file"
                            ref={ImageEle}
                            className="form-control d-none"
                          />
                        </label>
                      </li>
                      <li className="list-inline-item">
                        <button
                          type="submit"
                          className="font-size-16 btn-lg chat-send waves-effect waves-light btn btn-primary"
                        >
                          <i className="ri-send-plane-2-fill" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* end chat input section */}
        </div>
        {/* end chat conversation section */}
        {/* start User profile detail sidebar */}
        <div
          className="user-profile-sidebar"
          style={{ display: isSidebarVisible ? "block" : "none" }}
        >
          <div className="px-3 px-lg-4 pt-3 pt-lg-4">
            <div className="user-chat-nav text-end">
              <button
                type="button"
                className="btn nav-btn"
                id="user-profile-hide"
              >
                <i className="ri-close-line" />
              </button>
            </div>
          </div>
          <div className="text-center p-4 border-bottom">
            <div className="mb-4">
              <img
                src={currentUser.profile_pic}
                className="rounded-circle avatar-lg img-thumbnail"
                alt=""
              />
            </div>
            <h5 className="font-size-16 mb-1 text-truncate">
              {currentUser.name}
            </h5>
            <p className="text-muted text-truncate mb-1">
              <i
                className={`ri-record-circle-fill font-size-10 ${
                  currentUser.online ? "text-success" : "text-secondary"
                }  me-1 ms-0`}
              />{" "}
              {currentUser.online ? "Online" : "Offline"}
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
                <div
                  className="simplebar-offset"
                  style={{ right: 0, bottom: 0 }}
                >
                  <div
                    className="simplebar-content-wrapper"
                    style={{ height: "auto", overflow: "hidden" }}
                  >
                    <div className="simplebar-content" style={{ padding: 24 }}>
                      <div className="text-muted">
                        <p className="mb-4">
                          If several languages coalesce, the grammar of the
                        </p>
                      </div>
                      <div className="accordion" id="myprofile">
                        <div className="accordion-item card border mb-2">
                          <div className="accordion-header" id="about3">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#aboutprofile"
                              aria-expanded="true"
                              aria-controls="aboutprofile"
                            >
                              <h5 className="font-size-14 m-0">
                                <i className="ri-user-2-line me-2 ms-0 align-middle d-inline-block" />{" "}
                                About
                              </h5>
                            </button>
                          </div>
                          <div
                            id="aboutprofile"
                            className="accordion-collapse collapse show"
                            aria-labelledby="about3"
                            data-bs-parent="#myprofile"
                          >
                            <div className="accordion-body">
                              <div>
                                <p className="text-muted mb-1">Name</p>
                                <h5 className="font-size-14">
                                  {currentUser.name}
                                </h5>
                              </div>
                              <div className="mt-4">
                                <p className="text-muted mb-1">Email</p>
                                <h5 className="font-size-14">
                                  {currentUser.email}
                                </h5>
                              </div>
                              <div className="mt-4">
                                <p className="text-muted mb-1">Time</p>
                                <h5 className="font-size-14">11:40 AM</h5>
                              </div>
                              <div className="mt-4">
                                <p className="text-muted mb-1">Location</p>
                                <h5 className="font-size-14 mb-0">
                                  California, USA
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item card border">
                          <div className="accordion-header" id="attachfile3">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#attachprofile"
                              aria-expanded="false"
                              aria-controls="attachprofile"
                            >
                              <h5 className="font-size-14 m-0">
                                <i className="ri-attachment-line me-2 ms-0 align-middle d-inline-block" />{" "}
                                Attached Files
                              </h5>
                            </button>
                          </div>
                          <div
                            id="attachprofile"
                            className="accordion-collapse collapse"
                            aria-labelledby="attachfile3"
                            data-bs-parent="#myprofile"
                          >
                            <div className="accordion-body">
                              <div className="card p-2 border mb-2">
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm me-3 ms-0">
                                    <div className="avatar-title bg-primary-subtle text-primary rounded font-size-20">
                                      <i className="ri-file-text-fill" />
                                    </div>
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="text-start">
                                      <h5 className="font-size-14 mb-1">
                                        admin_v1.0.zip
                                      </h5>
                                      <p className="text-muted font-size-13 mb-0">
                                        12.5 MB
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* end profile-user-accordion */}
                      </div>
                      {/* end user-profile-desc */}
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
          {/* end User profile detail sidebar */}
        </div>
      </div>
      {/* End User chat */}
      {/* audiocall Modal */}
      <div
        className="modal fade"
        id="audiocallModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center p-4">
                <div className="avatar-lg mx-auto mb-4">
                  <img
                    src="/ChatUi/assets/images/users/avatar-4.jpg"
                    alt=""
                    className="img-thumbnail rounded-circle"
                  />
                </div>
                <h5 className="text-truncate">Doris Brown</h5>
                <p className="text-muted">Start Audio Call</p>
                <div className="mt-5">
                  <ul className="list-inline mb-1">
                    <li className="list-inline-item px-2 me-2 ms-0">
                      <button
                        type="button"
                        className="btn btn-danger avatar-sm rounded-circle"
                        data-bs-dismiss="modal"
                      >
                        <span className="avatar-title bg-transparent font-size-20">
                          <i className="ri-close-fill" />
                        </span>
                      </button>
                    </li>
                    <li className="list-inline-item px-2">
                      <button
                        type="button"
                        className="btn btn-success avatar-sm rounded-circle"
                      >
                        <span className="avatar-title bg-transparent font-size-20">
                          <i className="ri-phone-fill" />
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* audiocall Modal */}
      {/* videocall Modal */}
      <div
        className="modal fade"
        id="videocallModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center p-4">
                <div className="avatar-lg mx-auto mb-4">
                  <img
                    src="/ChatUi/assets/images/users/avatar-4.jpg"
                    alt=""
                    className="img-thumbnail rounded-circle"
                  />
                </div>
                <h5 className="text-truncate">Doris Brown</h5>
                <p className="text-muted mb-0">Start Video Call</p>
                <div className="mt-5">
                  <ul className="list-inline mb-1">
                    <li className="list-inline-item px-2 me-2 ms-0">
                      <button
                        type="button"
                        className="btn btn-danger avatar-sm rounded-circle"
                        data-bs-dismiss="modal"
                      >
                        <span className="avatar-title bg-transparent font-size-20">
                          <i className="ri-close-fill" />
                        </span>
                      </button>
                    </li>
                    <li className="list-inline-item px-2">
                      <button
                        type="button"
                        className="btn btn-success avatar-sm rounded-circle"
                      >
                        <span className="avatar-title bg-transparent font-size-20">
                          <i className="ri-vidicon-fill" />
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end modal */}
    </div>
  );
};

export default MessagePage;
