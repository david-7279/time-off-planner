export type TokenResponseDto = {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
};

export function toTokenResponse(accessToken: string, expiresInSeconds: number): TokenResponseDto {
  return {
    accessToken,
    tokenType: "Bearer",
    expiresIn: expiresInSeconds,
  };
}
