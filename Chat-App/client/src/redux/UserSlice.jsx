import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  city:"",
  profile_pic: "",
  token: "",
  onlineUser: [],

  socketConnections: null,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, name, email,city, profile_pic } = action.payload;
      state._id = _id || ""; // default to empty string if undefined
      state.name = name || "";
      state.email = email || "";
      state.city = city|| ""; // default to empty string if undefined
      state.profile_pic = profile_pic || "";
    },
    setToken: (state, action) => {
      state.token = action.payload || ""; // default to empty string if undefined
    },
    logout: (state) => {
      if (state.socketConnections) {
        state.socketConnections.emit("logout", state._id);
      }
      return initialState; // Reset to initial state
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload || []; 
    },
 
    removeOnlineUser: (state, action) => {
      const userId = action.payload; 
       console.log("Removing user ID:", userId);
      state.onlineUser = state.onlineUser.filter(id => id !== userId); 
    },
    setSocketConnections: (state, action) => {
      state.socketConnections = action.payload || null; 
    },
    setLocation:(state,action)=>{
      console.log("Setting location:", action.payload)  // default to empty string if undefined
      state.city = action.payload || "";  // default to empty string if undefined
      
    }
  },
});

// Action creators are generated for each case reducer function
export const { 
  setUser, 
  setToken, 
  logout, 
  setOnlineUser, 
  removeOnlineUser, // Export the new action
  setSocketConnections ,
  setLocation
} = UserSlice.actions;

const UserSlices = UserSlice.reducer;

export default UserSlices;
