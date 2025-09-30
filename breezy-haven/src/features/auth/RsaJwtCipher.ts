import { EncryptJWT, jwtDecrypt, type JWTPayload } from 'jose';
import type z from 'zod';

export interface IRsaJwtCipher<PayloadT> {
  encryptAsync(data: PayloadT): Promise<string>;
  decryptAsync(encryptedData: string): Promise<PayloadT>;
}

export class RsaJwtCipher<PayloadT extends JWTPayload>
  implements IRsaJwtCipher<PayloadT>
{
  constructor(
    private readonly _keyPair: CryptoKeyPair,
    private readonly _options: {
      readonly algorithm:
        | 'RSA-OAEP'
        | 'RSA-OAEP-256'
        | 'RSA-OAEP-384'
        | 'RSA-OAEP-512';
      readonly enc:
        | 'A128CBC-HS256'
        | 'A192CBC-HS384'
        | 'A256-HS512'
        | 'A128GCM'
        | 'A192GCM'
        | 'A256GCM';
      readonly issuer: string;
      readonly audience: string[];
      readonly accessExpiresIn: string;
      readonly refreshExpireIn: string;
    },
    private readonly _payloadSchema: z.ZodType<PayloadT>
  ) {}

  encryptAsync(data: PayloadT): Promise<string> {
    return new EncryptJWT(data)
      .setProtectedHeader({
        alg: this._options.algorithm,
        enc: this._options.enc,
      })
      .setIssuedAt()
      .setIssuer(this._options.issuer)
      .setAudience(this._options.audience)
      .encrypt(this._keyPair.publicKey);
  }

  async decryptAsync(encryptedData: string): Promise<PayloadT> {
    const { payload } = await jwtDecrypt(
      encryptedData,
      this._keyPair.privateKey,
      {
        issuer: this._options.issuer,
        audience: this._options.audience,
      }
    );

    return this._payloadSchema.parse(payload);
  }
}
