import { prisma } from '../utils/prisma';
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ZodError } from "zod";
import { AuthRouteResponse, RouteResponse } from "../interfaces/interfaces";

dotenv.config(); // Load environment variables from the .env file

// Function to perform user login
const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body; // Extract the username and password from the request

    // Check if the username was provided
    if (!username) {
      return res.status(422).json({ msg: 'username is required!' }); // Return an error response with status 422
    }

    // Check if the password was provided
    if (!password) {
      return res.status(422).json({ msg: 'Password is required!' }); // Return an error response with status 422
    }

    // Search for the user in the database by the provided username
    const foundUser = await prisma.user.findFirst({ where: { username: username } });

    // Check if the user was found
    if (!foundUser) {
      const response: RouteResponse<null> = {
        code: 401,
        data: null,
        success: false,
        error: "No user found with this username.",
        message: "No user found with this username.",
      };
      return res.status(response.code).json(response); // Return a response with status 401 (Unauthorized)
    }

    // Compare the provided password with the encrypted password stored in the database
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      // Generate a JWT access token with the username and set the expiration time
      const accessToken = jwt.sign({ UserInfo: { username: foundUser.username } }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "6h",
      });

      // Generate a JWT refresh token and set the expiration time
      const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      // Update the user's refresh token in the database
      await prisma.user.update({ where: { id: foundUser.id }, data: { refreshToken: refreshToken } });

      // Configure CORS headers
      res.header("Access-Control-Allow-Credentials: true");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");

      // Save the refresh token in the client's cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Return a success response with the access token and user information
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
      // Return an error response if the provided password is incorrect
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
    // Return an error response in case of internal server error
    const response: RouteResponse<null> = {
      code: 400,
      data: null,
      success: false,
      error: "Internal server error.",
      message: "Internal server error.",
    };
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      response.error = error.errors[0].message;
      response.message = error.errors[0].message;
      return res.status(response.code).json(response);
    }
    res.status(response.code).json(response);
  }
};

export { login }; // Export the login function to be used in other files
