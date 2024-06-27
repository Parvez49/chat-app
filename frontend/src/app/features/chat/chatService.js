import axios from 'axios'
import apiClient from '../axiosSerivce';


const config = {
    headers: {
        "Content-type":"application/json",
    }
}


const  BACKEND_DOMAIN = "http://127.0.0.1:8000";

const FRIEND_LIST = `${BACKEND_DOMAIN}/chat/friends`

const friends = async () =>{

    const response = await apiClient.get(FRIEND_LIST,config)
    return response.data
}


const chatService = {friends}
export default chatService;