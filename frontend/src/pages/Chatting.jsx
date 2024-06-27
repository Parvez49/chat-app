import React,{ useState } from 'react';
import Chat from '../components/chat/Chat';
import Detail from '../components/detail/Detail';
import List from '../components/list/List';

const Chatting = () => {
    const [selectedFriend, setSelectedFriend] = useState(null)

    const handleSelectFriend = (id)=>{
      setSelectedFriend(id)
      console.log(id)
    }
    return (
      
        <div className="container" >
          <List 
            handleSelectFriend = {handleSelectFriend}
          />
          <Chat 
            selectedFriend = {selectedFriend}
          />
          <Detail />
        </div>
    );
};

export default Chatting;