import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit'
import {Contact} from "../types/Types";

export interface ContactListState {
    contactList: Array<Contact>
}

const initialState: ContactListState = {
    contactList: []
}

const slice = createSlice({
    name: 'contactList',
    initialState,
    reducers: {
        addContacts: (state:Draft<ContactListState>, action: PayloadAction<Array<Contact>>) => {
            let existedContactList = state?.contactList;
            let newContactList = action.payload.filter(contact => {
                return existedContactList?.filter(existedContact => {
                    return existedContact.publicKey === contact.publicKey
                }).length === 0;
            })
            state?.contactList.push(...newContactList);
        },
        addNewContact: (state:Draft<ContactListState>, action: PayloadAction<Contact>) => {
            state?.contactList.push(action.payload);
        }
    },
});
export default slice.reducer
export const {addContacts, addNewContact} = slice.actions
