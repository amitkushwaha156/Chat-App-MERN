import { Outlet } from "react-router-dom";
import  toast, { Toaster } from 'react-hot-toast';
import { NotificationContainer } from "react-notifications";
import { useEffect } from "react";

function App() {


  return (
    <>
    <Toaster position="top-center" />
    <NotificationContainer />
     <Outlet></Outlet>
    </>
  );
}

export default App;
