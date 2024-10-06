import { Outlet } from "react-router-dom";
import  { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
    <Toaster position="top-center" />
     <Outlet></Outlet>
    </>
  );
}

export default App;