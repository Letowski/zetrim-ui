const openpgp = require('openpgp');
const textEncoding = require('text-encoding-utf-8');
global.TextEncoder = textEncoding.TextEncoder;
global.TextDecoder = textEncoding.TextDecoder;

async function generateKeyPair(): Promise<{ privateKey: string, publicKey: string }> {
    return await openpgp.generateKey({
        type: 'rsa', // Type of the key
        rsaBits: 4096, // RSA key size (defaults to 4096 bits)
        userIDs: [{name: 'Jon Smith', email: 'jon@example.com'}],
    });
}

async function encode(publicKeyArmored: string, privateKeyArmored: string, source: string): Promise<string> {
    const message = await openpgp.createMessage({text: source});
    const publicKey = await openpgp.readKey({armoredKey: publicKeyArmored});
    const privateKey = await openpgp.readPrivateKey({armoredKey: privateKeyArmored});
    return await openpgp.encrypt({
        message: message,
        encryptionKeys: publicKey,
        signingKeys: privateKey
    });
}

async function decode(publicKeyArmored: string, privateKeyArmored: string, source: string): Promise<{ decoded: string, verified: boolean }> {
    const message = await openpgp.readMessage({armoredMessage: source});
    const publicKey = await openpgp.readKey({armoredKey: publicKeyArmored});
    const privateKey = await openpgp.readPrivateKey({armoredKey: privateKeyArmored});
    const {data: decrypted, signatures} = await openpgp.decrypt({
        message,
        verificationKeys: publicKey,
        decryptionKeys: privateKey
    });
    let verified = false;
    try {
        await signatures[0].verified;
        verified = true;
    } catch (e) {
    }
    return {decoded: decrypted, verified: verified};
}

export {decode, encode, generateKeyPair};
