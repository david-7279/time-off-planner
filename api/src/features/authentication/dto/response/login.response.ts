import {
  type AuthResponseDto,
  type AuthUserDto,
  toAuthResponse,
} from "./authentication.response.js";

export type LoginResponseDto = AuthResponseDto;

export type LoginResult = {
  response: LoginResponseDto;
  refreshToken: string;
};

export function toLoginResponse(
  user: AuthUserDto,
  accessToken: string,
  expiresInSeconds: number
): LoginResponseDto {
  return toAuthResponse(user, accessToken, expiresInSeconds);
}
