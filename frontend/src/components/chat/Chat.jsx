import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import apiClient from '../../app/features/axiosSerivce';
import './chat.scss'
import { login } from '../../app/features/auth/authSlice';
import { io } from 'socket.io-client';

const Chat = ({selectedFriend}) => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [showEmoji, setShowEmoji] = useState(false);
    const [message, setMessage] =useState("");
    const [messageList,setMessageList] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)

    const endRef = useRef(null)

    const currentLoggedUser = JSON.parse(localStorage.getItem('profile_data'))

    useEffect(()=>{
        endRef.current?.scrollIntoView({behaiour:"smooth"})
    },[])




    useEffect(()=>{
        if (selectedFriend){
            apiClient.get(`${process.env.REACT_APP_BACKEND}/account/${selectedFriend}`)
            .then((res)=>{
                setCurrentUser(res.data)
            })
            .catch((error)=>{
                console.error("Error fetching friends:",error)
            })

            apiClient.get(`${process.env.REACT_APP_BACKEND}/chat/conversations/user2/${selectedFriend}`)
                .then((res) => {
                    console.log('friends', res.data);
                    setMessageList(res.data.results);
                })
                .catch((error) => {
                    console.error('Error fetching friends:', error);
                });

        }
    },[selectedFriend])

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (selectedFriend){
            const newSocket = new WebSocket(`ws://localhost:1337/ws/chat/${currentLoggedUser.id}/${selectedFriend}/`);
            setSocket(newSocket);

            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessageList((prv)=>[...prv,data])
                // setMessages((prevMessages) => [...prevMessages, data]);
            };
            return () => {
                newSocket.close();
            };
        }
        
    }, [selectedFriend]);

    const handleEmoji =(e) =>{
        setMessage((prv)=>prv+e.emoji);
        setShowEmoji(false)
    }

    const handleFile = (e) =>{
        const file = e.target.files[0]
        if (file){
            setSelectedFile(file)
            setMessage(file.name)
        }
    }

    const handleSendMessage = (e) =>{
        console.log("****************SEnd Data****************")
        // const data={
        //     user2:currentUser.id,
        //     message:message
        // }
        // console.log(data)
        // apiClient.post(`${process.env.REACT_APP_BACKEND}/chat/conversations`,data)
        // .then((res)=>{
        //     setMessageList((prv)=>[...prv,res.data])
        //     setMessage('')
            

        // })
        // .catch((error)=>{
        //     console.log("Error Insert Message",error)
        // })

        const data = {
            user1:currentLoggedUser.id,
            user2:selectedFriend,
            message: message,
        };
        
        socket.send(JSON.stringify(data));
        setMessage('');
    }
    return (
        <div className='chat'>
            <div className='top'>
                <div className='user'>
                    <img src={currentUser && currentUser.profile_photo} alt='' />
                    <div className="texts">
                        <span>{ currentUser && currentUser.name}</span>
                        <p>Lorem ipsum dolor, sit amet.</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className='center'>
                {messageList && (
                    messageList.map((e,i)=>(
                        <div className={`message ${currentLoggedUser.id === e.user1 && 'own'}`} >
                            <img src={currentLoggedUser.id === e.user1?`${process.env.REACT_APP_BACKEND}${currentLoggedUser.profile_photo}`:currentUser.profile_photo}alt='img' />
                            <div className='text'>
                                <p>{e.message}</p>
                                <span>1 min ago</span>
                            </div>
                        </div>
                    ))
                )}
    
                <div ref={endRef}></div>
            </div>
            <div className='bottom'>
                <div className='icons'>
                    <label htmlFor='file' >
                        <img src='/img.png' alt='' />
                    </label>
                    <input
                        type='file'
                        id='file'
                        style={{display:"none"}}
                        onChange={handleFile}
                    />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />                    
                </div>
                <input
                    type='text'
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <div className="emoji">
                    <img src="emoji.png" alt='' onClick={()=>setShowEmoji(!showEmoji)} />
                    <div className='picker'>
                        <EmojiPicker open={showEmoji} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className='sendButton' onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;