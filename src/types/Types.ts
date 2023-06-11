enum MessageDirection {
    From,
    To
}

type Message = {
    id: string,
    keyFrom: string,
    keyTo: string,
    createdAt: string,
    message: string,
    // metadata: string,
    decodedMessage: string,
    // decodedMetadata: string,
    verified: boolean,
    direction: MessageDirection,
}

type Chat = {
    key: string,
    messageList: Array<Message>
}

type Contact = {
    publicKey: string,
    name: string,
    verified: boolean,
}

export {MessageDirection};
export type {Message, Contact, Chat};
