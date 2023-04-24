import React from "react";
import './home.css';

function MemberCard({item}){
    return (
        <div className="member-card">
            <img src={item.avatar} className="item-avatar"></img>
            <div className="contact-info">
                <label className="contact-title">{item.name}</label>
                <label className="contact-subtitle">{item.type}</label>
            </div>
            
            

        </div>
    )
}

export default MemberCard