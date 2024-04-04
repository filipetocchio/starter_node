import { prisma } from '../utils/prisma';
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config(); // Load the environment variables from the .env file
const secretKey = process.env.YOUR_SECRET_KEY; // Assign the secret key from the .env file to the secretKey variable

// Controller to generate a new access token using the refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id); // Extract the user ID from the request parameters

    const user = await prisma.user.findUnique({ // Find a user in the database by the provided ID
      where: {
        id: userId,
      },
    });

    // Check if the user was found
    if (!user) {
      return res.status(404).json({ 
        code: 404, 
        success: false, 
        error: "User not found.", 
        message: null, 
        data: null 
      });
    }

    // Check if the user has a refresh token
    if (!user.refreshToken) {
      return res.status(404).json({ 
        code: 404, 
        success: false, 
        error: "User does not have a refresh token.", 
        message: null, 
        data: null 
      });
    }

    // Function to generate the access token from the refresh token
    const generateAccessToken = () => {
      return jwt.sign({ userId: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: '6h' 
      });
    };

    const accessToken = generateAccessToken(); // Generate the access token using the above function

    return res.status(200).json({ 
      code: 200, 
      success: true, 
      error: null, 
      message: "Access token generated successfully.", 
      data: { 
        id: user.id, 
        username: user.username, 
        accessToken
      }});

  } catch (error) {
    console.error('Error generating the access token:', error); // Log errors to the console
    return res.status(500).json({ 
      code: 500, 
      success: false, 
      error: "Internal server error.", 
      message: null, 
      data: null 
    });
  }
};
