import type { JWTPayload } from 'jose';
import type {
  IRsaJwtAuthenticator,
  RefreshTokenPayload,
  TokenPair,
} from './RsaJwtAuthenticator';
import type { IRsaJwtCipher } from './RsaJwtCipher';

export class RsaJwtProtector<PayloadT extends JWTPayload>
  implements IRsaJwtAuthenticator<PayloadT>
{
  constructor(
    private readonly _authenticator: IRsaJwtAuthenticator<PayloadT>,
    private readonly _cipher: IRsaJwtCipher<{ token: string }>
  ) {}

  async createTokensAsync(payload: PayloadT): Promise<TokenPair> {
    const tokenPair = await this._authenticator.createTokensAsync(payload);
    return {
      accessToken: await this._cipher.encryptAsync({
        token: tokenPair.accessToken,
      }),
      refreshToken: await this._cipher.encryptAsync({
        token: tokenPair.refreshToken,
      }),
    };
  }

  async verifyAccessTokenAsync(
    token: TokenPair['accessToken']
  ): Promise<PayloadT> {
    const decryptedAccessToken = (await this._cipher.decryptAsync(token)).token;
    return this._authenticator.verifyAccessTokenAsync(decryptedAccessToken);
  }

  async verifyRefreshTokenAsync(
    token: TokenPair['refreshToken']
  ): Promise<RefreshTokenPayload> {
    const decryptedRefreshToken = (await this._cipher.decryptAsync(token))
      .token;
    return this._authenticator.verifyRefreshTokenAsync(decryptedRefreshToken);
  }

  async refreshAccessTokenAsync(
    refreshToken: TokenPair['refreshToken'],
    accessPayload: PayloadT
  ): Promise<TokenPair> {
    const decryptedRefreshToken = (
      await this._cipher.decryptAsync(refreshToken)
    ).token;

    return this._authenticator.refreshAccessTokenAsync(
      decryptedRefreshToken,
      accessPayload
    );
  }
}
