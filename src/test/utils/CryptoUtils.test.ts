import {
    generateKeyPair,
    encode,
    decode
} from "../../utils/CryptoUtils";

test('openpgp success', async () => {
    let keyPair1 = await generateKeyPair();
    let keyPair2 = await generateKeyPair();
    let message = 'unsecured text';
    let encoded = await encode(keyPair2.publicKey, keyPair1.privateKey, message);
    let {decoded, verified} = await decode(keyPair1.publicKey, keyPair2.privateKey, encoded);
    expect(decoded).toBe(message);
    expect(verified).toBe(true);
})

jest.setTimeout(50000);
test('openpgp fail', async () => {
    let keyPair1 = await generateKeyPair();
    let keyPair2 = await generateKeyPair();
    let keyPair3 = await generateKeyPair();
    let message = 'unsecured text';
    let encoded = await encode(keyPair2.publicKey, keyPair3.privateKey, message);
    let {decoded, verified} = await decode(keyPair1.publicKey, keyPair2.privateKey, encoded);
    expect(decoded).toBe(message);
    expect(verified).toBe(false);
})

export {}
