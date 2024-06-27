import React from 'react';

import './userInfo.scss'
import { useSelector } from 'react-redux';
const UserInfo = () => {

    let {userData} = useSelector((state)=>state.auth)
    if (userData === null){
        userData = JSON.parse(localStorage.getItem('profile_data'))
    }
    return (
        <div className='userInfo'>
            <div className='user'>
                <img src={`http://127.0.0.1:8000${userData.profile_photo}`} alt='Profile Photo' />
                <h2> {userData.name} </h2>
            </div>
            <div className='icons'>
                <img src='/more.png' alt='' />
                <img src='/video.png' alt='' />
                <img src='/edit.png' alt='' />
            </div>
        </div>
    );
};

export default UserInfo;