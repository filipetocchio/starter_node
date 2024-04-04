import { prisma } from '../utils/prisma';
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ZodError } from "zod";
import { AuthRouteResponse, RouteResponse } from "../interfaces/interfaces";

dotenv.config();


const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

  if (!username) {
      return res.status(422).json({ msg: 'username is required!'});
  }

  if (!password) {
      return res.status(422).json({ msg: 'Password is required!'});
  }

    // find the user
    const foundUser = await prisma.user.findFirst({ where: { username: username } });
    console.log("findUsers:", foundUser);
    if (!foundUser) {
      const response: RouteResponse<null> = {
        code: 401,
        data: null,
        success: false,
        error: "No user found with this username.",
        message: "No user found with this username.",
      };
      return res.status(response.code).json(response);
    }
    // check 

    const match = await bcrypt.compare(password, await bcrypt.hash(foundUser.password, 10));
    console.log("match:", match);
    if (match) {
      // create a jwt to send to use with the other routes that we want to
      // be protected normal and refresh token.
      const accessToken = jwt.sign({ UserInfo: { username: foundUser.username } }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "6h",
      });
      const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      const currentUser = {
        ...foundUser,
        refreshToken,
      };

      // save the new refresh token to the database
      await prisma.user.update({ where: { id: foundUser.id }, data: { refreshToken: refreshToken } });

      // res.header("Access-Control-Allow-Credentials: true");
      // res.header("Access-Control-Allow-Origin", "*");
      // res.header("Access-Control-Allow-Headers", "*");

      // saving refresh token with current user
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        // sameSite: "lax",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      const response: RouteResponse<AuthRouteResponse> = {
        code: 200,
        success: true,
        error: null,
        message: `User ${username} successfully logged in`,
        data: {
          id: foundUser.id,
          username: foundUser.username,
          accessToken: accessToken,
        },
      };
      return res.status(response.code).json(response);
    } else {
      const response: RouteResponse<null> = {
        code: 401,
        data: null,
        success: false,
        error: "The password is incorrect.",
        message: "The password is incorrect.",
      };
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error(error);
    const response: RouteResponse<null> = {
      code: 400,
      data: null,
      success: false,
      error: "Internal server error.",
      message: "Internal server error.",
    };
    if (error instanceof ZodError) {
      response.error = error.errors[0].message;
      response.message = error.errors[0].message;
      return res.status(response.code).json(response);
    }
    res.status(response.code).json(response);
  }
};

export { login };
