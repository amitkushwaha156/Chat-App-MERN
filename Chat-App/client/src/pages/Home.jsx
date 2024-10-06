import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  removeOnlineUser, setOnlineUser, setSocketConnections, setUser } from "../redux/UserSlice";
import Sidebar from "../component/Sidebar";
import io from "socket.io-client";

const Home = () => {
 const navigation=useNavigate()
  const location = useLocation();
  const userDispatch = useDispatch();
 const user = useSelector((state) => state.user);
  
  //console.log(user)
 const LoginUserLocal= JSON.parse(localStorage.getItem("loginUser"));

 if(LoginUserLocal===null){
  navigation("/email")
 }
  
   //console.log(LoginUserLocal)

  const fetchUserDetails = async () => {

    try {
    
      userDispatch(setUser(LoginUserLocal));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);


  //socket connection 


  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
      auth:{
        token: localStorage.getItem("userToken"),
      }
    })
     // Online users
    socketConnection.on('onlineUsers',(data)=>{
      //console.log("onlineUsers=>", data)
      userDispatch(setOnlineUser(data))
    })
    
    socketConnection.on('offlineUser', (userId) => {
     console.log("User offline:", userId);
      userDispatch(removeOnlineUser(userId));
    });

    userDispatch(setSocketConnections(socketConnection))
    
    return ()=>{
      socketConnection.disconnect()
      socketConnection.off("offlineUser");
      socketConnection.off("messages");
    }
 

 
  },[])
  return (
    <div className="layout-wrapper d-lg-flex">
      <Sidebar></Sidebar>

      <Outlet></Outlet>
    </div>
  );
};

export default Home;
