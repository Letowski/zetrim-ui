import {Chat, Contact, Message, MessageDirection} from "../types/Types";
import {decode, encode} from "./CryptoUtils";
import {loadNewMessagesMock, sendMessageMock} from "./MockUtils";
import {loadNewMessagesRest, sendMessageRest} from "./RestUtils";

const randomEmoji = require('random-unicode-emoji');

const USE_MOCK = true;

async function enrichMessageFromServer(publicKey: string, privateKey: string, message: Message): Promise<Message> {
    if (publicKey === message.keyFrom) {
        message.direction = MessageDirection.From;
    }
    if (publicKey === message.keyTo) {
        message.direction = MessageDirection.To;
        let decodeResult = await decode(message.keyFrom, privateKey, message.message);
        message.decodedMessage = decodeResult.decoded;
        message.verified = decodeResult.verified;
    }
    return message;
}

function messageListToChatList(messageList: Array<Message>): Array<Chat> {
    let chatList: Array<Chat> = [];
    messageList.forEach(message => {
        let key = message.direction === MessageDirection.From ? message.keyTo : message.keyFrom;
        let chat = chatList.filter(chat => chat.key === key)[0];
        if (!chat) {
            chat = {key, messageList: []} as Chat;
            chatList.push(chat);
        }
        chat.messageList.push(message);
    })
    return chatList;
}

function chatListToContactList(chatList: Array<Chat>): Array<Contact> {
    return chatList.map(chat => chat.key)
        .map(key => {
            return {publicKey: key, name: randomEmoji.random({count: 4}), verified: false} as Contact
        });
}

async function sendMessage(message: Message, privateKey: string) {
    message.verified = true;
    message.createdAt = JSON.stringify(new Date());
    message.direction = MessageDirection.From;
    message.message = await encode(message.keyTo, privateKey, message.decodedMessage);
    return USE_MOCK ? sendMessageMock(message) : sendMessageRest(message);
}

async function loadNewMessages(publicKey: string, privateKey: string, lastLoadedMessageTime: Date): Promise<Array<Message>> {
    return USE_MOCK ? loadNewMessagesMock(publicKey, lastLoadedMessageTime) : loadNewMessagesRest(publicKey, lastLoadedMessageTime);
}

function filterNewChatList(newChatList: Array<Chat>, oldChatList: Array<Chat>): Array<Chat> {
    return newChatList.map(newChat => {
        let oldChat = oldChatList.filter(oldChat => oldChat.key === newChat.key)[0];
        if (!oldChat) {
            return newChat;
        }
        newChat.messageList = newChat.messageList.filter(newMessage => {
            return oldChat.messageList.filter(oldMessage => oldMessage.id === newMessage.id).length === 0
        })
        return newChat;
    })
}

function mergeNewChatList(newChatList: Array<Chat>, oldChatList: Array<Chat>): void {
    newChatList.forEach(newChat => {
        let oldChat = oldChatList.filter(oldChat => oldChat.key === newChat.key)[0];
        if (!oldChat) {
            oldChat = {key: newChat.key, messageList: []} as Chat;
            oldChatList.push(oldChat);
        }
        oldChat.messageList.push(...newChat.messageList)
    })
}

function filterNewContactList(newContactList: Array<Contact>, oldContactList: Array<Contact>): Array<Contact> {
    return newContactList.filter(newContact => {
        return oldContactList.filter(oldContact => {
            return oldContact.publicKey === newContact.publicKey
        }).length === 0
    })
}

export {
    sendMessage, loadNewMessages, enrichMessageFromServer,
    messageListToChatList,
    chatListToContactList, filterNewChatList, filterNewContactList, mergeNewChatList
}
