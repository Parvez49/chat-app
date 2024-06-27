import React, { useState, useEffect , useRef } from 'react';
import chatService from '../../../app/features/chat/chatService';
import apiClient from '../../../app/features/axiosSerivce';

import './chatList.scss'
import { useSelector } from 'react-redux';


const ChatList = ({handleSelectFriend}) => {
    const [newFriendSerach, setNewFriendSearch] = useState('')
    const [newFriends,setNewFriends] = useState(null)
    const [friendSearch,setFriendSearch] = useState('');
    const [filterFriends,setFilterFriends] = useState(null);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const imgRef = useRef(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const addFriendRef = useRef(null);
    const {userData} = useSelector((state)=>state.auth)
    
    const [friends, setFriends] = useState(null)


    useEffect(() => {
        apiClient.get(`${process.env.REACT_APP_BACKEND}/chat/friends`)
            .then((res) => {
                setFriends(res.data.results);
                setFilterFriends(res.data.results);
                if (res.data.results.length>0){
                    handleSelectFriend(res.data.results[0].user2.id)
                }
            })
            .catch((error) => {
                console.error('Error fetching friends:', error);
            });
    }, []);

    useEffect(()=>{
        if (friends){
            if (friendSearch === ''){
                setFilterFriends(friends)
            }
            else{
                const filtered = friends.filter((friend)=>friend.user2.name.toLowerCase().includes(friendSearch.toLowerCase()))
                setFilterFriends(filtered)
            }
        }
    },[friendSearch,friends])


    const handleClickOutside = (event) => {
        if (
            addFriendRef.current &&
            !addFriendRef.current.contains(event.target) &&
            imgRef.current &&
            !imgRef.current.contains(event.target)
        ) {
            setShowAddFriend(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(()=>{
        if (newFriendSerach){
            apiClient.get(`${process.env.REACT_APP_BACKEND}/account/list?search=${newFriendSerach}`)
            .then((res)=>{
                setNewFriends(res.data.results)
                console.log("res",res.data.results)
            })
            .catch((error)=>{
                console.log("Error Fetch Data",error)
            })
        }
    },[newFriendSerach])

    const checkFriend = (name) =>{
        const user = friends.filter((frnd)=>frnd.user2.name.toLowerCase().includes(name.toLowerCase()))
        if (user.length===0){
            return false 
        }else{
            return true
        }
    }

    const handleAddFriend = (id) =>{
        // const currentUser = JSON.parse(localStorage.getItem('profile_data')).id
        const data ={
            user2:id
        }
        apiClient.post(`${process.env.REACT_APP_BACKEND}/chat/friends`,data)
        .then((res)=>{
            setFriends((prv)=>[...prv,res.data])
            handleSelectFriend(res.data.user2.id)
            setShowAddFriend(false)
        })

    }
    return (
        <>
            <div className='friends'>
                <div className='searchBar'>
                    <div className='search'>
                        <img src='/search.png' alt='' />
                        <input type='text' placeholder='Search' value={friendSearch} onChange={(e)=>{setFriendSearch(e.target.value)}} />
                    </div>
                    <img src={showAddFriend?'/minus.png':'/plus.png'} onClick={()=>setShowAddFriend(!showAddFriend)} ref={imgRef} alt='' className='add'/>
                </div>
                {showAddFriend && (     
                    <div className='addUser' ref={addFriendRef}>
                        <form>
                            <input type='text' placeholder='username' name='username' value={newFriendSerach} onChange={(e)=>setNewFriendSearch(e.target.value)} />
                            <button>Search</button>
                        </form>
                        {newFriends && newFriends.map((e,i)=>(
                            <div className='user' key={i}>
                                <div className='detail'>
                                    <img src='/avatar.png' alt='' />
                                    <span>{e.name}</span>
                                </div>
                                {
                                    checkFriend(e.name)?<button onClick={()=>{handleSelectFriend(e.id);setShowAddFriend(false)}}>Message</button>:<button onClick={()=>handleAddFriend(e.id)}>Add User</button>
                                }
                            </div>
                        ))}
                        
                    </div>)}

                </div>
                <div className='friendlist'>
                    <div className='items'>
                        {filterFriends && filterFriends.map((e,i)=>(
                            <div className='item' key={i}>
                                <img src={`http://127.0.0.1:8000${e.user2.profile_photo}`} alt='' />
                                <div className='texts'>
                                    <span onClick={()=>handleSelectFriend(e.user2.id)}>{e.user2.name}</span>
                                    <p>Hello</p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
        </>
        
    );
};

export default ChatList;