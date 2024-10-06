import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

const AllUser = () => {
  const user = useSelector((state) => state.user);
  const LoginUserLocal = JSON.parse(localStorage.getItem("loginUser"));

  //console.log("user",user);
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [AllUser, setAllUser] = useState([]);
  const [online,setOnline]=useState([])
const Dispatch=useDispatch(state=>state.user.unseenCount)

  //console.log("online=>>", UpdatedOnlineUser);
  const onlineUsers = useSelector((state) => state?.user?.onlineUser);

  const UpdatedOnlineUser=onlineUsers.filter(item=>item!==LoginUserLocal._id)
  const Params = useParams();

  useEffect(() => {

    const onlineFiltered = filteredPeople.filter((item) => 
      UpdatedOnlineUser.includes(item.userDetails._id)
    );

    const onlineUsersArray = onlineFiltered.map(item => item.userDetails);

    // Set the online state
    setOnline(onlineUsersArray); 
  //  console.log("Filtered online users:", onlineUsersArray);

   
  }, [onlineUsers]); // Run effect when these dependencies change
  
  
     

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnections
  );
  const handleChange = (event) => {
    setSearchTerm(event.target.value); // Update the state with the search term
  };

//console.log("AllUser",AllUser)
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("latestUserSideBar", user?._id);

      socketConnection.on("ConversationMsg", (data) => {
      //   console.log("ConversationMsg", data);

        const conversationUserData = data?.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
        });
         setAllUser(conversationUserData);
    //    console.log("Conversation", conversationUserData)
        

        
      });
    }
  }, [socketConnection, user]);

  useEffect(() => {
    const filtered = AllUser.filter((item) => {
      return item.userDetails.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredPeople(filtered);
  //  console.log("Filtered People:", filtered);
  }, [searchTerm, AllUser]); 


//console.log("filteredPeople",filteredPeople)



  return (
    <>
      <div>
        <div className="px-4 pt-4">
          <h4 className="mb-4">Chats</h4>
          <div className="search-box chat-search-box">
            <div className="input-group mb-3 rounded-3">
              <span
                className="input-group-text text-muted bg-light pe-1 ps-3"
                id="basic-addon1"
              >
                <i className="ri-search-line search-icon font-size-18" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                className="form-control bg-light"
                placeholder="Search messages or users"
                aria-label="Search messages or users"
                aria-describedby="basic-addon1"
              />
            </div>
          </div>
          {error && <p className="text-danger">{error}</p>}
        </div>
        <div className="px-4 pb-4" dir="ltr">
          <div
            className="owl-carousel owl-theme owl-loaded owl-drag"
            id="user-status-carousel"
          >
            <div className="owl-stage-outer">
              <div
                className="owl-stage"
                style={{
                  transform: "translate3d(0px, 0px, 0px)",
                  transition: "all",
                  width: 435,
                }}
              >
                {online.map((user) => {
                  return (
                    <div
                      className="owl-item active"
                      style={{ width: 71, marginRight: 16 }}
                      key={user._id}
                    >
                      <div className="item">
                        <Link to={user._id} className="user-status-box">
                          <div className="avatar-xs mx-auto d-block chat-user-img online">
                            <img
                              src={user.profile_pic}
                              alt="user-img"
                              className="img-fluid rounded-circle"
                            />
                            <span className="user-status"></span>
                          </div>
                          <h5 className="font-size-13 text-truncate mt-3 mb-1">
                            {user.name || "Unnamed"}
                          </h5>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="owl-nav disabled">
              <button type="button" role="presentation" className="owl-prev">
                <span aria-label="Previous">‹</span>
              </button>
              <button type="button" role="presentation" className="owl-next">
                <span aria-label="Next">›</span>
              </button>
            </div>
            <div className="owl-dots disabled" />
          </div>
          {/* end user status carousel */}
        </div>

        <div className="">
          <h5 className="mb-3 px-3 font-size-16">Recent</h5>
          <div className="chat-message-list px-2" data-simplebar="init">
            <div className="simplebar-wrapper" style={{ margin: "0px -8px" }}>
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
                    style={{ height: "100%", overflow: "hidden" }}
                  >
                    <div
                      className="simplebar-content"
                      style={{ padding: "0px 8px" }}
                    >
                      <ul className="list-unstyled chat-list chat-user-list">
                        {filteredPeople.map((conv) => {
                          // Determine the relevant user details
                          const isSender = conv.sender._id === user._id; // Check if the current user is the sender
                          const otherUser = isSender
                            ? conv.receiver
                            : conv.sender; // Get the other user's details
                          const lastMsgText = conv.lastMsg
                            ? conv.lastMsg.text
                            : "No messages yet"; // Handle case with no last message
                          const unseenCount =
                            conv.unseenMsg && !conv.unseenMsg.seen ? 1 : 0; // Count unseen messages

                          // console.log("unseenCount",unseenCount)

                          return (
                            <li className="unread" key={otherUser._id}>
                              <Link to={otherUser._id}>
                                {" "}
                                {/* Adjust link path as necessary */}
                                <div className="d-flex">
                                  <div className="chat-user-img away align-self-center me-3 ms-0">
                                    <img
                                      src={otherUser.profile_pic} // Use the other user's profile picture
                                      className="rounded-circle avatar-xs"
                                      alt={otherUser.name} // Use the other user's name as alt text
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="text-truncate font-size-15 mb-1">
                                      {otherUser.name}
                                    </h5>
                                    <p
                                      className={`chat-user-message ${
                                        conv.unseenMsg > 0
                                          ? "text-success"
                                          : "text-truncate"
                                      } mb-0 font-size-12`}
                                    >
                                      {lastMsgText.length > 20
                                        ? `${lastMsgText.slice(0, 20)}...`
                                        : lastMsgText}
                                    </p>
                                  </div>
                                  <div className="font-size-11">
                                    {(() => {
                                      const messageDate = moment(
                                        conv.lastMsg?.createdAt
                                      );
                                      const isToday = messageDate.isSame(
                                        moment(),
                                        "day"
                                      );

                                      return isToday
                                        ? messageDate.format("hh:mm A") // Format for time with AM/PM
                                        : messageDate.format("DD:MM:yy");
                                    })()}
                                  </div>

                                  <div className="unread-message">
                                    { (Params.userId!==otherUser._id) ? (conv.unseenMsg > 0 ? (
                                      <span className="badge badge-soft-success rounded-pill">
                                        {conv.unseenMsg}
                                      </span>
                                    ) : (
                                      ""
                                    )): ""}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>

                      {error && <p className="text-danger">{error}</p>}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="simplebar-placeholder"
                style={{ width: "auto", height: 75 }}
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
                  height: 147,
                  transform: "translate3d(0px, 0px, 0px)",
                  display: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUser;
