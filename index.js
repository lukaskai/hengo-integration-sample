import secp256k1 from 'secp256k1';
import got from 'got';

const privateKey = '';
const apiKey = '';

(async () => {
  // 1. CREATE TRANSACTION
  const body = await got.post('https://apidev.hengo.io/v1/token/USDC/transaction', {
    headers: {
      'x-api-key': apiKey,
    },
    json: {
      addressFrom: '',
      addressTo: '',
      amount: 2,
      speed: 'fast',
    },
  }).json();

  // 2. SIGN IT
  const signature = sign(privateKey, body.toSign);

  // 3. BROADCAST
  await got.post('https://apidev.hengo.io/v1/general/transaction/broadcast', {
    headers: {
      'x-api-key': apiKey,
    },
    json: {
      ...body,
      signature,
    },
  }).json();
})();

function sign(pK, payload) {
  const hexMsgHash = Uint8Array.from(Buffer.from(payload, 'hex'));
  const privateKeyUint8 = Uint8Array.from(Buffer.from(privateKey.substring(2), 'hex'));
  const ecdsaSignature = secp256k1.ecdsaSign(hexMsgHash, privateKeyUint8);
  const signature = (Buffer.from(ecdsaSignature.signature).toString('hex')) + ecdsaSignature.recid;
  return signature;
}
