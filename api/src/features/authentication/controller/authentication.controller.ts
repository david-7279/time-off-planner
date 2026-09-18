import type { CookieOptions, NextFunction, Request, Response } from "express";
import { env } from "../../../core/config/env.config.js";
import { UnauthorizedError } from "../../../core/errors/unauthorized.error.js";
import type { LoginRequestDto } from "../dto/request/login.request.js";
import type { RegisterRequestDto } from "../dto/request/register.request.js";
import * as authenticationService from "../service/authentication.service.js";

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  path: "/api/v1/auth",
  maxAge: env.jwt.refreshExpiresInMs,
};

const _clearRefreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  path: "/api/v1/auth",
};

function _getRefreshTokenFromCookie(req: Request): string {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const refreshToken = cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  if (typeof refreshToken !== "string" || refreshToken.trim() === "") {
    throw new UnauthorizedError("Refresh token is required");
  }

  return refreshToken;
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body as RegisterRequestDto;

    const { response, refreshToken } = await authenticationService.register(
      { name, email, password },
      { ipAddress: req.ip, userAgent: req.get("user-agent") }
    );

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenCookieOptions);

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: { user: response.user, token: response.token },
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as LoginRequestDto;
    const { response, refreshToken } = await authenticationService.login(
      { email, password },
      { ipAddress: req.ip, userAgent: req.get("user-agent") }
    );

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { user: response.user, token: response.token },
    });
  } catch (error) {
    return next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authenticationService.me(req.user!.publicId);

    return res.status(200).json({
      success: true,
      message: "Authenticated user retrieved successfully",
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
};
