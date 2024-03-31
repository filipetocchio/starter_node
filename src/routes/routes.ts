import { Router } from "express";
import express from "express";
import { loginRouter } from "./LoginRouter";
import { logoutRouter } from "./LogoutRouter";
import { refreshRouter } from "./RefreshRouter";
import { registerRouter } from "./RegisterRouter";
import bodyParser from "body-parser"; // body-parser is an Express.js middleware that parses the body of HTTP requests.
import cors from "cors"; // cors is a Node.js module that provides middleware to enable Cross-Origin Resource Sharing (CORS).
import { corsOptions } from "../config/corsOptions"; // Importing CORS options from a configuration file.
import { logger } from "../middleware/logEvents"; // Custom middleware for logging events.
import { credentials } from "../middleware/credentials"; // Custom middleware for handling credentials.

const cookieParser = require("cookie-parser");

export const apiV1Router = Router();

// Applying middlewares to all routes
apiV1Router.use(bodyParser.json()); // Parsing JSON data from the request body.
apiV1Router.use(logger); // Applying the custom logger middleware.
apiV1Router.use(credentials); // Applying the custom credentials middleware.
apiV1Router.use(express.json()); // Parsing JSON data from the request body.
apiV1Router.use(bodyParser.urlencoded({ extended: false })); // Parsing URL-encoded form data from the request body.
apiV1Router.use(express.urlencoded({ extended: false })); // Parsing URL-encoded form data from the request body.
apiV1Router.use(cookieParser()); // Parsing cookies from the request.
apiV1Router.use(cors({ ...corsOptions, credentials: true })); // Enabling Cross-Origin Resource Sharing with the specified options.

// Mounting routers
apiV1Router.use("/api/v1", apiV1Router); // Mounting the API v1 router at the "/api/v1" endpoint.

apiV1Router.use("/login", loginRouter); // Mounting the login router at the "/login" endpoint.
apiV1Router.use("/logout", logoutRouter); // Mounting the logout router at the "/logout" endpoint.
apiV1Router.use("/refresh", refreshRouter); // Mounting the refresh router at the "/refresh" endpoint.
apiV1Router.use("/register", registerRouter); // Mounting the register router at the "/register" endpoint.
