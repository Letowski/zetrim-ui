import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import KeysScreen from "./keysScreen/KeysScreen";
import MainScreen from './mainScreen/MainScreen';
import RootRouter from "./rootRouter/RootRouter";
import {Provider} from 'react-redux'
import {store, persistor} from './store'
import {PersistGate} from "redux-persist/integration/react";
import AddContactScreen from "./addContactScreen/AddContactScreen";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootRouter/>,
    },
    {
        path: "/chat",
        element: <MainScreen/>,
    },
    {
        path: "/chat/:key",
        element: <MainScreen/>,
    },
    {
        path: "/keys",
        element: <KeysScreen/>,
    },
    {
        path: "/add-contact",
        element: <AddContactScreen/>,
    },
]);

ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <RouterProvider router={router}/>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
);
