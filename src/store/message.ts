import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit'
import {Chat, Message} from "../types/Types";
import {mergeNewChatList} from "../utils/MessageUtils";

export interface MessageListState {
    chatList: Array<Chat>
}

const initialState: MessageListState = {
    chatList: []
}

const slice = createSlice({
    name: 'messageList',
    initialState,
    reducers: {
        addMessages: (state:Draft<MessageListState>, action: PayloadAction<Array<Chat>>) => {
            mergeNewChatList(action.payload, state?.chatList)
        },
        addNewMessage: (state:Draft<MessageListState>, action: PayloadAction<Message>) => {
            let chat: Chat = state.chatList.filter(chat => chat.key === action.payload.keyTo)[0];
            if(!chat) {
                chat = {key: action.payload.keyTo, messageList: []} as Chat
                state.chatList.push(chat);
            }
            chat.messageList.push(action.payload);
        }
    },
});
export default slice.reducer
export const {addMessages, addNewMessage} = slice.actions


