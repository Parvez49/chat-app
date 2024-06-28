import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {login, reset} from '../../app/features/auth/authSlice'
import {useNavigate} from 'react-router-dom'
import './login.scss'
import { useState, useEffect } from 'react';

const Login = () => {

    const [formData, setFormData] = useState({
        email:'',
        password:''
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const {userData, isLoading, isError, isSuccess, message} = useSelector((state)=>state.auth)
    
    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = (e)=>{
        console.log("******************************8")
        e.preventDefault()
        console.log("formData",formData)
        dispatch(login(formData))
    }

    useEffect(()=>{
        if (isSuccess){
            // alert("login Success")
            console.log(userData)
            navigate('/')
        }
        if (isError){
            alert(message)
        }
        dispatch(reset())
    },[isSuccess,dispatch,isError])

    return (
        <div className='login'>
            <div className='item'>
                <h2>Welcome back,</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Email" name="email" onChange={handleChange} />
                    <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
                    <button disabled={isLoading}>Sign in</button>
                </form>
            </div>
            <div className='separator'></div>
            <div className='item'>
                <h2>Create an Account</h2>
                <form 
                //</div>onSubmit={handleRegister}
                >
                <label htmlFor="file">
                    <img src="./avatar.png" alt="" />
                    Upload an image
                </label>
                <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    //onChange={handleAvatar}
                />
                <input type="text" placeholder="Username" name="username" />
                <input type="text" placeholder="Email" name="email" />
                <input type="password" placeholder="Password" name="password" />
                {/* <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button> */}
                <button>Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default Login;