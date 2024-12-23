import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../features/HomePage";
import Login from "../features/login/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element:<App/>, 
    children: [
      {
        path: "/",
        element: <HomePage /> 
      },
      {
        path: "/login",
        element: <Login /> 

      }
    ]
  }
]);
