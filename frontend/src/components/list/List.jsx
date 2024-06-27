import React from 'react';
import ChatList from './ChatList/ChatList';

import './list.scss'
import UserInfo from './UserInfo/UserInfo';
const List = ({handleSelectFriend}) => {
    return (
        <div className='list'>
            <UserInfo />
            <ChatList handleSelectFriend={handleSelectFriend} />
        </div>
    );
};

export default List;