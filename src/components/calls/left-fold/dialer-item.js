import React from 'react';
import './dialer-item.css';
function DialerItem({item}){
    
    return (
    <div className="dialer-item">
        <img src={item.avatar} className="item-avatar"></img>
        <div className="item-info">
            <label className="item-title">{item.name}</label>
            <label className="item-subtitle">{item.type}</label>
        </div>
        <div className='item-icons'>
            <div className='item-icon'>
                <i class="bi bi-mic"></i>
            </div>
            <div className='item-icon'>
                <i class="bi bi-camera-video"></i>
            </div>
        </div>
    </div>
    );
}

export default DialerItem;