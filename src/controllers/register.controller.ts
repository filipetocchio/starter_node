import { prisma } from '../utils/prisma';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthRouteResponse, RouteResponse } from "../interfaces/interfaces";
import { ZodError } from "zod";

// Function to register a new user
const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body; // Extract the username, password, and email from the request

    // Check if there is a user with the same username or email in the database
    const duplicate = await prisma.user.findFirst({
      where: { OR: [{ username: username }, { email: email }] },
    });
    if (duplicate) {
      const response: RouteResponse<null> = {
        code: 409,
        data: null,
        success: false,
        error: "This username is already in use.",
        message: "This username is already in use.",
      };
      if (duplicate?.email === email) {
        response.error = "This email is already in use";
        response.message = "This email is already in use";
        res.status(response.code).json(response);
        return;
      }
      res.status(response.code).json(response);
      return;
    }
    
    // Username validation
    if (username.length < 1) {
      const response: RouteResponse<null> = {
      code: 400,
      data: null,
      success: false,
      error: "Username is a required field.",
      message: "Username is a required field.",
      };
      res.status(response.code).json(response);
      return;
    }
    if (username.length > 20) {
      const response: RouteResponse<null> = {
      code: 400,
      data: null,
      success: false,
      error: "Username cannot exceed 20 characters.",
      message: "Username cannot exceed 20 characters.",
      };
      res.status(response.code).json(response);
      return;
    }

    // Password validation
    if (password.length < 6) {
      const response: RouteResponse<null> = {
      code: 400,
      data: null,
      success: false,
      error: "Password must be at least 6 characters.",
      message: "Password must be at least 6 characters.",
      };
      res.status(response.code).json(response);
      return;
    }

    // Encrypt the password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create access and refresh tokens
    const accessToken = jwt.sign({ UserInfo: { username: username } }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "6h",
    });
    const refreshToken = jwt.sign({ username: username }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Store the new user in the database
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        refreshToken: refreshToken,
      },
    });

    // Set the cookie with the refresh token for the specified domain and path
    res.cookie("jwt", refreshToken, {
      domain: "http://localhost:4200",
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return a success response with the access token and user information
    const response: RouteResponse<AuthRouteResponse> = {
      success: true,
      message: `New user ${username} created.`,
      code: 201,
      error: null,
      data: {
        accessToken: accessToken,
        username: user.username,
        id: user.id,
      },
    };
    
    // Send the refresh token back to the client
    res
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(response.code)
      .json(response);
  } catch (error) {

    const response: RouteResponse<null> = {
      code: 500,
      data: null,
      success: false,
      error: "Internal server error.",
      message: "Internal server error.",
    };
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      response.code = 400;
      response.error = error.errors[0].message;
      response.message = error.errors[0].message;
      res.status(response.code).json(response);
      return;
    }
    res.status(response.code).json(response);
  }
};

export { register }; // Export the register function to be used in other files
