import {
  refreshTokenRepository,
  type IRefreshTokenRepository,
} from '@/repositories';
import { isPast } from 'date-fns';
import { importJWK, jwtVerify, SignJWT, type JWTPayload } from 'jose';

interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface IRsaJwtManager<AccessT, RefreshT> {
  createTokensAsync(payload: AccessT): Promise<TokenPair>;
  verifyAccessTokenAsync(
    token: TokenPair['accessToken']
  ): Promise<AccessT | null>;
  verifyRefreshTokenAsync(
    token: TokenPair['refreshToken']
  ): Promise<RefreshT | null>;
  refreshAccessTokenAsync(
    tokens: TokenPair,
    accessPayload: AccessT
  ): Promise<TokenPair | null>;
}

type TokenPayload = Readonly<JWTPayload & { tokenId: string }>;
type TokenPayloadWithoutTokenId = Omit<TokenPayload, 'tokenId'>;

export class RsaJwtManager<
  AccessT extends TokenPayloadWithoutTokenId,
  RefreshT extends TokenPayload = TokenPayload,
> implements IRsaJwtManager<AccessT, RefreshT>
{
  constructor(
    private readonly _keyPair: CryptoKeyPair,
    private readonly _algorithm: 'RS256' | 'RS384' | 'RS512',
    private readonly _issuer: string,
    private readonly _audience: string[],
    private readonly _refreshTokenRepo: IRefreshTokenRepository,
    private readonly _accessExpiresIn: string = '1 hour',
    private readonly _refreshExpiresIn: string = '1 weeks'
  ) {}

  async createTokensAsync(payload: AccessT): Promise<TokenPair> {
    const tokenId = crypto.randomUUID();

    await this._refreshTokenRepo.addAsync(tokenId);

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessTokenAsync(payload),
      this.createRefreshTokenAsync(tokenId),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessTokenAsync(
    token: TokenPair['accessToken']
  ): Promise<AccessT | null> {
    try {
      const { payload } = await jwtVerify(token, this._keyPair.publicKey, {
        issuer: [this._issuer],
        audience: this._audience,
      });

      return payload as AccessT;
    } catch {
      return null;
    }
  }

  async verifyRefreshTokenAsync(
    token: TokenPair['refreshToken']
  ): Promise<RefreshT | null> {
    try {
      const { payload } = await jwtVerify(token, this._keyPair.publicKey, {
        issuer: [this._issuer],
        audience: this._audience,
      });

      return payload as RefreshT;
    } catch {
      return null;
    }
  }

  async refreshAccessTokenAsync(
    tokens: TokenPair,
    accessPayload: AccessT
  ): Promise<TokenPair | null> {
    const refreshPayload = await this.verifyRefreshTokenAsync(
      tokens.refreshToken
    );
    if (
      !refreshPayload?.exp ||
      isPast(refreshPayload.exp * 1000) ||
      !(await this._refreshTokenRepo.getIsExistAsync(refreshPayload.tokenId))
    )
      return null;

    await this._refreshTokenRepo.revokeAsync(refreshPayload.tokenId);
    const tokenId = crypto.randomUUID();
    await this._refreshTokenRepo.addAsync(tokenId);

    return {
      accessToken: await this.createAccessTokenAsync(accessPayload),
      refreshToken: await this.createRefreshTokenAsync(tokenId),
    };
  }

  private createAccessTokenAsync(payload: AccessT): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({
        alg: this._algorithm,
      })
      .setIssuedAt()
      .setIssuer(this._issuer)
      .setAudience(this._audience)
      .setExpirationTime(this._accessExpiresIn)
      .sign(this._keyPair.privateKey);
  }

  private createRefreshTokenAsync(tokenId: string): Promise<string> {
    return new SignJWT({ tokenId })
      .setProtectedHeader({
        alg: this._algorithm,
      })
      .setIssuedAt()
      .setIssuer(this._issuer)
      .setAudience(this._audience)
      .setExpirationTime(this._refreshExpiresIn)
      .sign(this._keyPair.privateKey);
  }
}

interface UserPayload extends JWTPayload {
  readonly email: string;
  readonly avatarUrl: string;
}

interface RefreshPayload extends JWTPayload {
  readonly tokenId: string;
  readonly userEmail: string;
}

const BASE64_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!;
const BASE64_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!;

const PRIVATE_KEY = (await importJWK(
  JSON.parse(Buffer.from(BASE64_PRIVATE_KEY, 'base64').toString('utf-8')),
  'RS256'
)) as CryptoKey;

const PUBLIC_KEY = (await importJWK(
  JSON.parse(Buffer.from(BASE64_PUBLIC_KEY, 'base64').toString('utf-8')),
  'RS256'
)) as CryptoKey;

export const jwtManager = new RsaJwtManager<UserPayload, RefreshPayload>(
  { privateKey: PRIVATE_KEY, publicKey: PUBLIC_KEY },
  'RS256',
  'The Breezy Haven',
  ['staff'],
  refreshTokenRepository
);
