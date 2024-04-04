import { prisma } from '../utils/prisma';
import { RouteResponse } from "../interfaces/interfaces";
import { Request, Response } from "express";

// Function to perform user logout
const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies; // Get the request cookies

  // Create a default response of type RouteResponse with code 204 (No Content)
  const response: RouteResponse<null> = {
    code: 204,
    data: null,
    error: null,
    message: "No content.",
    success: true,
  };

  // Check if the 'jwt' cookie is not present
  if (!cookies?.jwt) {
    return res.status(response.code).json(response); // Return a response with status 204 (No Content)
  }

  const refreshToken = cookies.jwt; // Get the refresh token from the 'jwt' cookie

  // Update the user's refresh token to an empty string in the database
  await prisma.user.update({ where: { refreshToken: refreshToken }, data: { refreshToken: "" } });

  // Clear the 'jwt' cookie from the client
  res.clearCookie("jwt", {
    httpOnly: true, // Ensure that the cookie can only be accessed by the server
  });

  // Return a response with status 204 (No Content)
  res.status(response.code).json(response);
};

export { logout }; // Export the logout function to be used in other files
