
import { useLocation, Navigate } from "react-router-dom";

const LoggedinCheck = ({children}) =>{
    const location = useLocation();
    if(localStorage.getItem("access_token")){
        return children;
    }else{
        return <Navigate to ='/login' state={{from:location}} replace></Navigate>
    }
}

export default LoggedinCheck;