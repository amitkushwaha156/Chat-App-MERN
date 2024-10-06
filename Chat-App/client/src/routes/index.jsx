import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmail from "../pages/CheckEmail";
import CheckPassword from "../pages/CheckPassword";
import Home from "../pages/Home";
import MessagePage from "../component/MessagePage";
import AuthLayout from "../Layout";




const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element:<AuthLayout><RegisterPage /></AuthLayout> ,
      },
      {
        path: "email",
        element:<AuthLayout><CheckEmail /></AuthLayout> ,
      },
      {
        path: "password",
        element:<AuthLayout> <CheckPassword /></AuthLayout>,
      },
   

      {
        path: "",
        element:  <Home />,
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
