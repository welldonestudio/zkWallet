import { hash } from 'argon2-browser';
import { JWE, JWK, util } from 'node-jose';

export const getPrivateKey = async (
  pass: string,
  encrypt: string,
): Promise<string> => {
  const { hashHex } = await hash({
    pass: pass,
    salt: 'zkWallet',
  });
  const key = await JWK.asKey({
    kty: 'oct',
    k: util.base64url.encode(hashHex),
  });

  const privateKey = await JWE.createDecrypt(key).decrypt(encrypt);

  return privateKey.plaintext.toString();
};
