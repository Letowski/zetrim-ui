import 'reset-css';
import './MainScreen.css'
import {getBooleanFromStore, getFromStore, getStringFromStore} from "../utils/StorageUtils";
import {Navigate, NavLink, useLocation, useParams} from "react-router-dom";
import {
    chatListToContactList,
    enrichMessageFromServer, filterNewChatList, filterNewContactList,
    loadNewMessages,
    messageListToChatList,
    sendMessage
} from "../utils/MessageUtils";
import {addMessages, addNewMessage, MessageListState} from "../store/message";
import {useDispatch, useSelector} from "react-redux";
import {Chat, Contact, Message, MessageDirection} from "../types/Types";
import React, {LegacyRef, useEffect, useRef} from "react";
import {addContacts, ContactListState} from "../store/contact";

export default function MainScreen() {
    const dispatch = useDispatch()
    const {
        chatList,
        contactList
    }: { chatList: Array<Chat>, contactList: Array<Contact> }
        = useSelector((state: { messageList: MessageListState, contactList: ContactListState }) => {
        const chatList = state.messageList.chatList
        const contactList = state.contactList.contactList
        return {chatList, contactList};
    })


    let location = useLocation();
    const {key} = useParams();
    const chatContainer: LegacyRef<HTMLDivElement> = useRef(null);
    let publicKey = getStringFromStore('publicKey');
    let privateKey = getStringFromStore('privateKey');
    let isKeySet = getBooleanFromStore('isKeySet');
    let lastLoadedMessageTimeString = getFromStore('lastLoadedMessageTime');
    let lastLoadedMessageTime = lastLoadedMessageTimeString ?
        new Date(lastLoadedMessageTimeString) :
        new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30); //30 days ago

    const addMessagesToStore = (newChatList: Array<Chat>) => {
        return dispatch(addMessages(newChatList));
    }
    const addNewMessageToStore = (message: Message) => {
        return dispatch(addNewMessage(message));
    }

    const addContactsToStore = (contactList: Array<Contact>) => {
        return dispatch(addContacts(contactList));
    }

    const initialMessageLoading = () => {
        loadNewMessages(publicKey, privateKey, lastLoadedMessageTime)
            .then(async newMessageList => {
                newMessageList = await Promise.all(newMessageList.map(async message => {
                    return await enrichMessageFromServer(publicKey, privateKey, message);
                }))
                console.log(newMessageList);

                let newChatList = messageListToChatList(newMessageList);
                newChatList = filterNewChatList(newChatList, chatList);
                addMessagesToStore(newChatList);

                let newContactList = chatListToContactList(newChatList);
                newContactList = filterNewContactList(newContactList, contactList);

                addContactsToStore(newContactList);
            });
    }

    useEffect(() => {
        // initialMessageLoading()
        scrollChatToBottom()
    }, [key, chatList]);

    if (!isKeySet) {
        return <Navigate to="/" state={{from: location}} replace/>;
    }

    const textAreaKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            let target = event.target as HTMLTextAreaElement;
            let messageText = target.value;
            target.value = '';
            sendMessage({
                keyFrom: publicKey,
                keyTo: key,
                decodedMessage: messageText,
            } as Message, privateKey).then(message => {
                addNewMessageToStore(message);
            })
        }
    }

    const scrollChatToBottom = () => {
        let chatContainerEl: HTMLElement | null = chatContainer.current;
        if (chatContainerEl) {
            chatContainerEl.scrollTo(0, chatContainerEl.scrollHeight);
        }
    }

    return (
        <div className="mainScreen">
            <div className="menuBar">
                <NavLink to={`/add-contact`}>
                    <button className="addContact mainBtnStyle">add</button>
                </NavLink>
                <NavLink to={`/keys`}>
                    <button className="buttonKey mainBtnStyle">key</button>
                </NavLink>
                <button className="buttonSetting mainBtnStyle">setting</button>
            </div>
            <ul className="contactList">
                {contactList.map(contact =>
                    <li className="" key={contact.publicKey}>
                        <span className="textInLi">
                            <NavLink to={`/chat/${encodeURIComponent(contact.publicKey)}`}>
                            {contact.name}
                            {/*    <input type="text" className=""/>*/}
                            </NavLink>
                        </span>
                        <div className="btnInLi">
                            <button className="btnEdit">

                            </button>
                        </div>
                    </li>
                )}
            </ul>
            {key &&
                <div className="conversation">
                    <div className="contactInfo"></div>
                    <div className="chat" ref={chatContainer}>
                        {chatList?.filter(chat => chat.key === key)[0]?.messageList.map(message =>
                            <div className={"message " + (message.direction === MessageDirection.To ? "to" : "from")}
                                 key={message.id}>
                                <div className="messageText">{message.decodedMessage}</div>

                                <div className="messageDate">{JSON.parse(message.createdAt)}</div>

                            </div>
                        )}
                    </div>
                    <div className="newMessageControl">
                        {<textarea placeholder="Enter text" onKeyUp={textAreaKeyUp}/>}
                    </div>
                </div>
            }
        </div>
    );
}
