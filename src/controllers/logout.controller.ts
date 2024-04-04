import { prisma } from '../utils/prisma';
import { RouteResponse } from "../interfaces/interfaces";
import { Request, Response } from "express";

const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  const response: RouteResponse<null> = {
    code: 204,
    data: null,
    error: null,
    message: "No content.",
    success: true,
  };

  if (!cookies?.jwt) {
    return res.status(response.code).json(response);
  }

  const refreshToken = cookies.jwt;
  await prisma.user.update({ where: { refreshToken: refreshToken }, data: { refreshToken: "" } });
  res.clearCookie("jwt", {
    httpOnly: true,
  });
  res.status(response.code).json(response);
};

export { logout };
