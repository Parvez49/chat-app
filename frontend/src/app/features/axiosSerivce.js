import axios from "axios";

export const api = "http://127.0.0.1:8000";
const apiClient = axios.create({
    baseURL: api,
});

apiClient.interceptors.request.use((request)=>{
    const token = JSON.parse(localStorage.getItem("access_token"))
    request.headers.Authorization = "Bearer " + token
    return request
});

apiClient.interceptors.response.use(
    (res)=>res,
    (err)=>{
        console.log(err)

    })

export default apiClient;