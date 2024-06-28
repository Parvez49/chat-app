import axios from 'axios'


const config = {
    headers: {
        "Content-type":"application/json",
        // "Authorization": `Bearer ${localStorage.getItem.}`
    }
}

const  BACKEND_DOMAIN = process.env.REACT_APP_BACKEND;

const LOGIN_URL = `${BACKEND_DOMAIN}/account/login`

const login = async (userData) =>{
    console.log("*************Login URL***********",BACKEND_DOMAIN)
    const response = await axios.post(LOGIN_URL,userData,config)
    if (response.data){
        localStorage.setItem("access_token",JSON.stringify(response.data.token.access))
        localStorage.setItem("profile_data",JSON.stringify(response.data.user_data))
        }
    return response.data
}


const authService ={login}
export default authService;