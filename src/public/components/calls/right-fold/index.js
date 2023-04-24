import React from "react";
import { CallsContact } from "../../../data/calls";
import ContactCard from "./contact-card"
import './right-fold.css'
function RightFold() {
    const contacts = CallsContact;
    return (
        <div className="rightFold">
        <div className="rightFold-heading">
            <label className="heading-label">Contacts</label>
        </div>
        <div className="rightFold-options">
            <div className="contact-search">
                <input placeholder="Find a contact"></input>
                <div className="contact-search-icon">
                    <i class="bi bi-search"></i>
                </div>
            </div>
            <div className="add-button">
                <div className="add-icon">
                    <i class="bi bi-person-plus"></i>
                </div>
                <label className="add-label">Add Contact</label>
            </div>
        </div>
        <div className="contact-list">
            {contacts.map((item)=>{
                return <ContactCard item={item}/>
            })}
        </div>
        </div>
    )
}
export default RightFold