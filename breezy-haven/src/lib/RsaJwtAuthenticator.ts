import { type IRefreshTokenRepository } from '@/repositories';
import { isPast } from 'date-fns';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import z from 'zod';

export interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface AccessTokenPayload extends JWTPayload {
  readonly userId: string;
}

export interface RefreshTokenPayload extends JWTPayload {
  readonly userId: string;
  readonly refreshTokenId: string;
  readonly absoluteExp: number;
}

export interface IRsaJwtAuthenticator<AccessT> {
  createTokensAsync(payload: AccessT): Promise<TokenPair>;
  verifyAccessTokenAsync(token: TokenPair['accessToken']): Promise<AccessT>;
  verifyRefreshTokenAsync(
    token: TokenPair['refreshToken']
  ): Promise<RefreshTokenPayload>;
  refreshAccessTokenAsync(
    refreshToken: TokenPair['refreshToken'],
    accessPayload: AccessT
  ): Promise<TokenPair>;
}

export class RsaJwtAuthenticator<AccessT extends AccessTokenPayload>
  implements IRsaJwtAuthenticator<AccessT>
{
  private readonly _refreshPayloadSchema = z.looseObject({
    userId: z.string().readonly(),
    refreshTokenId: z.string().readonly(),
    absoluteExp: z.coerce.number().readonly(),
  });

  constructor(
    private readonly _keyPair: CryptoKeyPair,
    private readonly _options: {
      readonly algorithm: 'RS256' | 'RS384' | 'RS512';
      readonly issuer: string;
      readonly audience: string[];
      readonly accessExpiresIn: string;
      readonly refreshExpireIn: string;
    },
    private readonly _refreshTokenRepo: IRefreshTokenRepository,
    private readonly _accessSchema: z.ZodType<AccessT>
  ) {}

  async createTokensAsync(payload: AccessT): Promise<TokenPair> {
    const tokenId = crypto.randomUUID();

    await this._refreshTokenRepo.addAsync(tokenId);

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessTokenAsync(payload),
      this.createRefreshTokenAsync({
        userId: payload.userId,
        refreshTokenId: tokenId,
        absoluteExp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessTokenAsync(
    token: TokenPair['accessToken']
  ): Promise<AccessT> {
    const { payload } = await jwtVerify(token, this._keyPair.publicKey, {
      issuer: [this._options.issuer],
      audience: this._options.audience,
    });

    const result = this._accessSchema.safeParse(payload);
    if (!result.success) throw new Error('Invalid access token payload');

    return result.data;
  }

  async verifyRefreshTokenAsync(
    token: TokenPair['refreshToken']
  ): Promise<RefreshTokenPayload> {
    const { payload } = await jwtVerify(token, this._keyPair.publicKey, {
      issuer: [this._options.issuer],
      audience: this._options.audience,
    });

    const result = this._refreshPayloadSchema.safeParse(payload);
    if (!result.success) throw new Error('Invalid refresh token payload');

    return result.data;
  }

  async refreshAccessTokenAsync(
    refreshToken: TokenPair['refreshToken'],
    accessPayload: AccessT
  ): Promise<TokenPair> {
    const refreshPayload = await this.verifyRefreshTokenAsync(refreshToken);

    if (
      !refreshPayload?.exp ||
      isPast(refreshPayload.exp * 1000) ||
      isPast(refreshPayload.absoluteExp * 1000) ||
      !(await this._refreshTokenRepo.getIsExistAsync(
        refreshPayload.refreshTokenId
      ))
    )
      throw new Error('Invalid, expired or revoked refresh token');

    await this._refreshTokenRepo.revokeAsync(refreshPayload.refreshTokenId);
    const newRefreshTokenId = crypto.randomUUID();
    await this._refreshTokenRepo.addAsync(newRefreshTokenId);

    return {
      accessToken: await this.createAccessTokenAsync(accessPayload),
      refreshToken: await this.createRefreshTokenAsync({
        ...refreshPayload,
        refreshTokenId: newRefreshTokenId,
      }),
    };
  }

  private createAccessTokenAsync(payload: AccessT): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({
        alg: this._options.algorithm,
      })
      .setIssuedAt()
      .setIssuer(this._options.issuer)
      .setAudience(this._options.audience)
      .setExpirationTime(this._options.accessExpiresIn)
      .sign(this._keyPair.privateKey);
  }

  private createRefreshTokenAsync(
    payload: RefreshTokenPayload
  ): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({
        alg: this._options.algorithm,
      })
      .setIssuedAt()
      .setIssuer(this._options.issuer)
      .setAudience(this._options.audience)
      .setExpirationTime(this._options.refreshExpireIn)
      .sign(this._keyPair.privateKey);
  }
}
