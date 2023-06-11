import {Message} from "../types/Types";

import axios from "axios";

const client = axios.create({
    baseURL: "http://127.0.0.1/api"
});

async function sendMessageRest(message: Message): Promise<Message> {
    return client.post('/message', {
        fromKey: message.keyFrom,
        toKey: message.keyTo,
        message: message.message
    }).then((response) => {
        message.id = response.data.data.id;
        return message;
    });
}

async function loadNewMessagesRest(publicKey: string, lastLoadedMessageTime: Date): Promise<Array<Message>> {

    client.get('/message').then((response) => {
        //todo implement
    });

    return [];
}

export {sendMessageRest, loadNewMessagesRest}
