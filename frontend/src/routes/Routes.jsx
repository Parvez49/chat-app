import { createBrowserRouter } from "react-router-dom";
import Login from "../components/login/Login";
import Chatting from '../pages/Chatting';
import LoggedinCheck from './LoginCheck';



export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/",
        element:(<LoggedinCheck><Chatting  /></LoggedinCheck>)
    }
])