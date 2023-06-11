import './AddContactScreen.css';
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {getBooleanFromStore} from "../utils/StorageUtils";
import React, {LegacyRef, useRef} from "react";
import {useDispatch} from "react-redux";
import {Contact} from "../types/Types";
import {addNewContact} from "../store/contact";


export default function AddContactScreen() {
    const dispatch = useDispatch()

    let navigate = useNavigate();
    let location = useLocation();


    const inputRef: LegacyRef<HTMLInputElement> = useRef(null);
    const textareaRef: LegacyRef<HTMLTextAreaElement> = useRef(null);


    let isKeySet = getBooleanFromStore('isKeySet');
    if (!isKeySet) {
        return <Navigate to="/" state={{from: location}} replace/>;
    }

    const addContactToStore = (contact: Contact) => {
        return dispatch(addNewContact(contact));
    }

    const addContact = () => {
        let name = inputRef.current?.value;
        let publicKey = textareaRef.current?.value;

        addContactToStore({
            name,
            publicKey,
            verified: true
        } as Contact)

        navigate('/');
    }

    const cancel = () => {
        navigate('/');
    }

    return (
        <div className="AddContactScreen">
            <span className="textInAdd">Add contact</span>
            <input className="nameInputAdd" type="text" placeholder="Enter name" ref={inputRef}/>
            <textarea className="keyTextAreaAdd" placeholder="Enter key" ref={textareaRef}></textarea>
            <div className="btnBlockAdd">
                <button className="addBtnStyle" onClick={addContact}>Add</button>
                <button className="cancelBtnStyle" onClick={cancel}>Cancel</button>
            </div>
        </div>
    );
}
