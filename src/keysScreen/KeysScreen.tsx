import React, {useState} from 'react';
import {getStringFromStore, setToStore} from "../utils/StorageUtils";
import './KeysScreen.css';
import {useNavigate} from "react-router-dom";
import {generateKeyPair} from "../utils/CryptoUtils";

export default function KeysScreen() {

    let navigate = useNavigate();

    const [publicKey, setPublicKey] = useState(getStringFromStore('publicKey'));
    const [privateKey, setPrivateKey] = useState(getStringFromStore('privateKey'));

    const handleChangePublicKey = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPublicKey(event.target.value);
    };

    const handleChangePrivateKey = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrivateKey(event.target.value);
    };

    async function generatePair() {
        let keyPair = await generateKeyPair();
        setPublicKey(keyPair.publicKey);
        setPrivateKey(keyPair.privateKey);
    }

    function saveKeys() {
        setToStore('publicKey', publicKey);
        setToStore('privateKey', privateKey);
        setToStore('isKeySet', 'true');
        navigate('/');
    }

    return (
        <div className="KeysScreen">
            <div className="keysAreaStyle">
                <textarea onChange={handleChangePublicKey} value={publicKey}/>
                <div className="blockPrivateKey">
                <textarea onChange={handleChangePrivateKey} value={privateKey}/>
                </div>
            </div>
            <div className="keysBtnStyle">
                <button onClick={generatePair}>Generate pair</button>
                <button onClick={saveKeys}>Save keys</button>
            </div>
        </div>
    );
}
